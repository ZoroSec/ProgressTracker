// node test.mjs -- checks the date, streak and summary logic in index.html.
// Everything above the `/* ---------- state` marker is DOM-free, so it runs here
// directly: no build step, and no second copy of the logic to drift out of sync.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const pure = html.split('<script>')[1].split('/* ---------- state')[0];
const { summarize, bestStreak, currentStreak, monthDays, shiftMonth, key, wedge, pct } =
  new Function(pure + '\nreturn {summarize, bestStreak, currentStreak, monthDays, shiftMonth, key, wedge, pct};')();

// calendar
assert.equal(monthDays('2026-02'), 28);
assert.equal(monthDays('2028-02'), 29, 'leap year');
assert.equal(monthDays('2026-09'), 30);
assert.equal(shiftMonth('2026-01', -1), '2025-12', 'wraps backward across new year');
assert.equal(shiftMonth('2026-12', 1), '2027-01', 'wraps forward across new year');

// current streak
const has = list => ds => new Set(list).has(ds);
assert.equal(currentStreak(has(['2026-09-01', '2026-09-02', '2026-09-03']), '2026-09-03'), 3);
assert.equal(currentStreak(has(['2026-09-01', '2026-09-03']), '2026-09-03'), 1, 'a gap breaks it');
assert.equal(currentStreak(has(['2026-09-01', '2026-09-02']), '2026-09-03'), 2,
  'an unticked today does not break the run yet');
assert.equal(currentStreak(has(['2026-09-01']), '2026-09-03'), 0, 'the grace is one day, not two');
assert.equal(currentStreak(has([]), '2026-09-03'), 0);

// best streak, including the boundaries a naive per-month scan gets wrong
assert.equal(bestStreak(['2026-08-30', '2026-08-31', '2026-09-01']), 3, 'crosses a month end');
assert.equal(bestStreak(['2026-12-31', '2027-01-01']), 2, 'crosses a year end');
assert.equal(bestStreak(['2026-10-24', '2026-10-25', '2026-10-26']), 3, 'crosses a DST shift');
assert.equal(bestStreak(['2026-02-28', '2026-03-01']), 2, 'non-leap February');
assert.equal(bestStreak(['2028-02-28', '2028-02-29', '2028-03-01']), 3, 'leap February');
assert.equal(bestStreak(['2026-09-05', '2026-09-05', '2026-09-06']), 2, 'duplicate dates');
assert.equal(bestStreak([]), 0);

// a full month summary
const state = {
  habits: [{id: 'a', name: 'Read', points: 2}, {id: 'b', name: 'Walk', points: 1}],
  ticks: {}
};
for (const d of [1, 2, 3]) state.ticks[key('a', '2026-09-0' + d)] = 1;
for (const d of [2, 3]) state.ticks[key('b', '2026-09-0' + d)] = 1;
state.ticks[key('a', '2026-08-31')] = 1;        // previous month: feeds runs, not September

const s = summarize(state, '2026-09', '2026-09-03');
assert.equal(s.days, 30);
assert.equal(s.slots, 60, '2 habits x 30 days');
assert.equal(s.total, 5, 'counts ticks inside September only');
assert.equal(s.points, 3 * 2 + 2 * 1, 'points are per habit, not per tick');
assert.equal(s.perDay.slice(0, 4).join(), '1,2,2,0');
assert.equal(s.bestDay, 2);
assert.equal(s.today, 2, 'D3 is column index 2');
assert.equal(s.doneToday, 2, 'both habits ticked on the 3rd');
assert.equal(s.streak, 4, 'day streak runs Aug 31 - Sep 3');
assert.equal(s.habits[0].streak, 4, 'Aug 31 counts toward the current run');
assert.equal(s.habits[0].best, 4);
assert.equal(s.habits[1].streak, 2);
assert.equal(s.pct.toFixed(2), (5 / 60 * 100).toFixed(2));

// per-day progress: the share of that day's habits that got done
assert.deepEqual(s.dayPct.slice(0, 4).map(Math.round), [50, 100, 100, 0]);

// weekly blocks: fixed 7-day chunks from the 1st, remainder last -- the way the
// source spreadsheet counts them, so the segments line up with the grid columns
assert.deepEqual(s.weeks.map(w => w.len), [7, 7, 7, 7, 2], '30-day month');
assert.deepEqual(summarize(state, '2026-08', '2026-09-03').weeks.map(w => w.len),
  [7, 7, 7, 7, 3], '31-day month');
assert.deepEqual(summarize(state, '2026-02', '2026-09-03').weeks.map(w => w.len),
  [7, 7, 7, 7], '28-day month divides evenly');
assert.equal(s.weeks.reduce((n, w) => n + w.len, 0), s.days, 'weeks cover the month exactly');

const w1 = s.weeks[0];
assert.equal(w1.done, 5, 'all five September ticks fall in week 1');
assert.equal(w1.slots, 14, '2 habits x 7 days');
assert.equal(w1.pct.toFixed(2), (5 / 14 * 100).toFixed(2));
assert.equal(s.weeks[1].done, 0);
assert.equal(s.weeks[1].pct, 0);
assert.equal(s.weeks.reduce((n, w) => n + w.done, 0), s.total, 'weeks account for every tick');

// monthly progress is the same ratio at month scale
assert.equal(s.pct.toFixed(2), '8.33');

// the monthly pie's wedge geometry
assert.equal(pct(100), '100%', 'no trailing .0');
assert.equal(pct(37.5), '37.5%');
assert.equal(pct(0), '0%');
assert.equal(pct(20.79), '20.8%', 'one decimal');

assert.equal(wedge(50, 50, 46, 0), '', 'nothing done draws no wedge');
assert.match(wedge(50, 50, 46, 0.25), /L 50 4 A 46 46 0 0 1 96\.00 50\.00 Z$/,
  'a quarter turn ends at 3 oclock, small-arc flag');
assert.match(wedge(50, 50, 46, 0.75), /A 46 46 0 1 1 4\.00 50\.00 Z$/,
  'past halfway flips the large-arc flag');
assert.ok(!wedge(50, 50, 46, 1).includes('L 50 50'),
  'a full circle is an arc, not a wedge from the centre');
assert.ok(wedge(50, 50, 46, 1).includes('49.99'), 'and it closes just short of its start');

// browsing another month changes the grid but not "today" or the live run
const past = summarize(state, '2026-08', '2026-09-03');
assert.equal(past.days, 31);
assert.equal(past.total, 1, 'only the Aug 31 tick');
assert.equal(past.today, -1, 'no today marker outside the current month');
assert.equal(past.streak, 4, 'the run is anchored on today, not on the month shown');
assert.equal(past.doneToday, 2, 'today is today regardless of the month being viewed');

// an empty tracker must not divide by zero
const zero = summarize({habits: [], ticks: {}}, '2026-09', '2026-09-03');
assert.equal(zero.pct, 0);
assert.equal(zero.bestDay, 0);
assert.equal(zero.streak, 0);
assert.deepEqual(zero.dayPct.slice(0, 3), [0, 0, 0], 'no habits: no division by zero');
assert.equal(zero.weeks[0].pct, 0);

console.log('ok — calendar, streaks, per-day/weekly/monthly progress, empty state');
