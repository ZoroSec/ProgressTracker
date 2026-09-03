// node test-review.mjs -- checks the spaced-repetition scheduling in review.html.
// Same trick as test.mjs: everything above the `/* ---------- state` marker is
// DOM-free, so it runs here directly with no build step and no second copy.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./review.html', import.meta.url), 'utf8');
const pure = html.split('<script>')[1].split('/* ---------- state')[0];
const {
  nextInterval, applyReview, newTopic, isDue, dueList, reviewStreak, summarize,
  addDays, daysBetween, relDue, MAX_INTERVAL
} = new Function(pure + `
  return {nextInterval, applyReview, newTopic, isDue, dueList, reviewStreak,
          summarize, addDays, daysBetween, relDue, MAX_INTERVAL};`)();

// dates
assert.equal(addDays('2026-09-01', 1), '2026-09-02');
assert.equal(addDays('2026-08-31', 1), '2026-09-01', 'crosses a month end');
assert.equal(addDays('2026-12-31', 1), '2027-01-01', 'crosses a year end');
assert.equal(addDays('2028-02-28', 1), '2028-02-29', 'leap day');
assert.equal(addDays('2026-10-24', 3), '2026-10-27', 'spans a DST shift');
assert.equal(daysBetween('2026-09-01', '2026-09-08'), 7);

// a new topic comes back tomorrow, not today
const t0 = newTopic('TCP handshake', 'three-way SYN/SYN-ACK/ACK', '2026-09-01', 'r1');
assert.equal(t0.interval, 1);
assert.equal(t0.nextDue, '2026-09-02');
assert.deepEqual(t0.reviews, []);
assert.equal(isDue(t0, '2026-09-01'), false, 'not due on the day it was added');
assert.equal(isDue(t0, '2026-09-02'), true);
assert.equal(isDue(t0, '2026-09-05'), true, 'still due when overdue');

// the three outcomes
assert.equal(nextInterval(1, 'easy'), 3);
assert.equal(nextInterval(1, 'struggled'), 1, 'a struggle on a new topic repeats tomorrow');
assert.equal(nextInterval(1, 'blanked'), 1);
assert.equal(nextInterval(20, 'blanked'), 1, 'blanking resets however long the interval was');
assert.equal(nextInterval(8, 'struggled'), 10);
assert.equal(nextInterval(20, 'struggled'), 26);

// the easy curve, and the cap
const curve = [];
let iv = 1;
for (let i = 0; i < 7; i++){ curve.push(iv); iv = nextInterval(iv, 'easy'); }
assert.deepEqual(curve, [1, 3, 8, 20, 50, 125, 180], 'documented easy curve');
assert.equal(nextInterval(180, 'easy'), MAX_INTERVAL, 'cap holds at the ceiling');
assert.equal(nextInterval(MAX_INTERVAL, 'easy'), 180, 'and does not creep past it');
assert.equal(nextInterval(5, 'nonsense'), 5, 'an unknown rating changes nothing');

// a review reschedules and appends history without mutating the original
const reviewed = applyReview(t0, 'easy', '2026-09-02');
assert.equal(reviewed.interval, 3);
assert.equal(reviewed.nextDue, '2026-09-05', 'due date counts from the review, not the old due date');
assert.deepEqual(reviewed.reviews, [{date: '2026-09-02', rating: 'easy'}]);
assert.deepEqual(t0.reviews, [], 'the original object is untouched');
assert.equal(t0.interval, 1);

// reviewing late still schedules from today, so the pipeline self-heals
const late = applyReview(t0, 'easy', '2026-09-20');
assert.equal(late.nextDue, '2026-09-23', 'a week overdue does not push the next date into the past');

// history accumulates across reviews
const twice = applyReview(reviewed, 'blanked', '2026-09-05');
assert.equal(twice.interval, 1);
assert.equal(twice.reviews.length, 2);
assert.equal(twice.reviews[1].rating, 'blanked');

// due list: overdue first
{
  const mk = (id, due) => ({id, topic: id, interval: 1, nextDue: due, reviews: []});
  const all = [mk('c', '2026-09-05'), mk('a', '2026-09-01'), mk('b', '2026-09-03')];
  const due = dueList(all, '2026-09-04');
  assert.deepEqual(due.map(t => t.id), ['a', 'b'], 'only what is due, most overdue first');
}

// streak over review history, with the same one-day grace as the habit tracker
{
  const withReviews = dates => [{id: 'x', topic: 'x', interval: 1, nextDue: '2026-09-09',
    reviews: dates.map(d => ({date: d, rating: 'easy'}))}];
  assert.equal(reviewStreak(withReviews(['2026-09-01', '2026-09-02', '2026-09-03']), '2026-09-03'), 3);
  assert.equal(reviewStreak(withReviews(['2026-09-01', '2026-09-02']), '2026-09-03'), 2,
    'today not reviewed yet does not break the run');
  assert.equal(reviewStreak(withReviews(['2026-09-01']), '2026-09-03'), 0, 'the grace is one day');
  assert.equal(reviewStreak(withReviews(['2026-08-31', '2026-09-01']), '2026-09-01'), 2,
    'runs across a month boundary');
  assert.equal(reviewStreak([], '2026-09-03'), 0, 'no topics, no streak');
}

// summary drives the header line and the empty state
{
  const a = newTopic('a', '', '2026-09-01', 'r1');            // due 09-02
  const b = applyReview(newTopic('b', '', '2026-09-01', 'r2'), 'easy', '2026-09-02'); // due 09-05
  const s = summarize([a, b], '2026-09-02');
  assert.equal(s.total, 2);
  assert.equal(s.dueCount, 1, 'only a is due');
  assert.equal(s.due[0].id, 'r1');
  assert.equal(s.nextUp.id, 'r2', 'the soonest not-yet-due topic');
  assert.equal(s.reviewsToday, 1);
  assert.equal(s.streak, 1);

  const empty = summarize([], '2026-09-02');
  assert.equal(empty.total, 0);
  assert.equal(empty.dueCount, 0);
  assert.equal(empty.nextUp, null, 'nothing to point at when there are no topics');
  assert.equal(empty.streak, 0);
}

// wording of due dates
assert.equal(relDue('2026-09-02', '2026-09-02'), 'today');
assert.equal(relDue('2026-09-03', '2026-09-02'), 'tomorrow');
assert.equal(relDue('2026-09-09', '2026-09-02'), 'in 7 days');
assert.equal(relDue('2026-09-01', '2026-09-02'), '1 day overdue');
assert.equal(relDue('2026-08-30', '2026-09-02'), '3 days overdue');

console.log('ok — SM-2 intervals, cap, due list, streak, summary, date wording');
