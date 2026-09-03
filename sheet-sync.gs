/**
 * Habits & Review — Google Sheets sync endpoint.
 *
 * Paste this into an Apps Script project bound to your spreadsheet
 * (Extensions ▸ Apps Script), set SECRET below, then deploy it as a Web App.
 * Full instructions: SETUP.md in the project folder.
 *
 * The whole protocol is one call: an app POSTs its state, this script merges it
 * with what is already in the sheet, writes the result back, and returns the
 * merged state. The app adopts whatever comes back. One code path for "first
 * sync on a new device", "push my changes" and "pull theirs".
 *
 * Two apps, one deployment: the Habits page sends { habits, ticks, ... } and the
 * Review page sends { review, removedTopics }. Each request touches only the
 * tabs for the keys it carries, so the two never clobber each other.
 */

// Any string you like. It must match the secret you paste into the app.
// This is what stops a stranger who guesses the URL from writing to your sheet.
var SECRET = 'CHANGE_ME';

function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  try {
    if (!e || !e.parameter || e.parameter.secret !== SECRET) {
      return json({ error: 'bad or missing secret' });
    }

    var incoming = null;
    if (e.postData && e.postData.contents) incoming = JSON.parse(e.postData.contents);

    // Two devices syncing at once would otherwise interleave read and write.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var ss = SpreadsheetApp.getActive();
      var state = readState(ss);
      if (incoming) {
        state = mergeState(state, incoming);
        writeState(ss, state);
      }
      return json(state);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ error: String(err && err.message || err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------------------------------------------------- storage */

function tab(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Dates are stored as TEXT. If Sheets parses "2026-09-01" into a real date, the
// spreadsheet's timezone can shift it a day either way on the round trip, which
// silently moves ticks. Keeping the column as text sidesteps that entirely.
function asDate(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

var REVIEW_COLS = ['id', 'topic', 'notes', 'created', 'interval', 'nextDue', 'reviews'];

function readState(ss) {
  var hRows = tab(ss, 'habits', ['id', 'name', 'points']).getDataRange().getValues();
  var tRows = tab(ss, 'ticks', ['habit_id', 'date']).getDataRange().getValues();
  var rRows = tab(ss, 'review', REVIEW_COLS).getDataRange().getValues();

  var habits = [];
  for (var i = 1; i < hRows.length; i++) {
    if (!hRows[i][0]) continue;
    habits.push({
      id: String(hRows[i][0]).trim(),
      name: String(hRows[i][1]),
      points: Number(hRows[i][2]) || 0
    });
  }

  var ticks = {};
  for (var j = 1; j < tRows.length; j++) {
    if (!tRows[j][0] || !tRows[j][1]) continue;
    ticks[String(tRows[j][0]).trim() + '|' + asDate(tRows[j][1])] = 1;
  }

  // The reviews[] history is a JSON blob in its own column -- a flat sheet can't
  // hold the nested array, and keeping it as text sidesteps date reinterpretation.
  var review = [];
  for (var m = 1; m < rRows.length; m++) {
    if (!rRows[m][0]) continue;
    var reviews = [];
    try { reviews = JSON.parse(rRows[m][6] || '[]'); } catch (e) { reviews = []; }
    review.push({
      id: String(rRows[m][0]).trim(),
      topic: String(rRows[m][1]),
      notes: String(rRows[m][2]),
      created: asDate(rRows[m][3]),
      interval: Number(rRows[m][4]) || 1,
      nextDue: asDate(rRows[m][5]),
      reviews: reviews
    });
  }

  return { habits: habits, ticks: ticks, review: review };
}

function writeState(ss, state) {
  var h = tab(ss, 'habits', ['id', 'name', 'points']);
  h.clear();
  var hRows = [['id', 'name', 'points']];
  state.habits.forEach(function (x) { hRows.push([x.id, x.name, x.points]); });
  h.getRange(1, 1, hRows.length, 3).setValues(hRows);
  h.getRange(1, 1, 1, 3).setFontWeight('bold');
  h.setFrozenRows(1);

  var t = tab(ss, 'ticks', ['habit_id', 'date']);
  t.clear();
  var keys = Object.keys(state.ticks).sort();
  var tRows = [['habit_id', 'date']];
  keys.forEach(function (k) {
    var i = k.indexOf('|');
    tRows.push([k.slice(0, i), k.slice(i + 1)]);
  });
  var range = t.getRange(1, 1, tRows.length, 2);
  range.setNumberFormat('@');           // plain text — see asDate() above
  range.setValues(tRows);
  t.getRange(1, 1, 1, 2).setFontWeight('bold');
  t.setFrozenRows(1);

  var rv = tab(ss, 'review', REVIEW_COLS);
  rv.clear();
  var rRows = [REVIEW_COLS.slice()];
  (state.review || []).forEach(function (x) {
    rRows.push([x.id, x.topic, x.notes || '', x.created || '', x.interval || 1,
                x.nextDue || '', JSON.stringify(x.reviews || [])]);
  });
  var rRange = rv.getRange(1, 1, rRows.length, REVIEW_COLS.length);
  rRange.setNumberFormat('@');           // text — dates and the JSON blob must survive verbatim
  rRange.setValues(rRows);
  rv.getRange(1, 1, 1, REVIEW_COLS.length).setFontWeight('bold');
  rv.setFrozenRows(1);

  tab(ss, 'meta', ['key', 'value']).getRange(1, 1, 2, 2).setValues([
    ['key', 'value'],
    ['updated', Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm:ss')]
  ]);
}

/* ------------------------------------------------------------------ merge */

/**
 * Ticks merge by UNION, which is the right default: two devices that were both
 * offline almost always have additions to contribute, and a union loses nothing.
 * The exception is an un-tick — deleting a key can't be told apart from never
 * having had it — so the app sends the keys it deliberately removed since its
 * last successful sync, and those win over the union.
 *
 * This mirrors mergeState() in index.html. Two runtimes, so two copies; if you
 * change the rule, change it in both.
 */
function mergeState(current, incoming) {
  var ticks = {}, k;
  for (k in current.ticks) ticks[k] = 1;
  for (k in (incoming.ticks || {})) ticks[k] = 1;

  (incoming.removed || []).forEach(function (key) { delete ticks[key]; });

  // An empty incoming habit list means "new device, nothing local yet" — never
  // a request to wipe the sheet. Real deletions arrive named, in removedHabits.
  var habits = (incoming.habits && incoming.habits.length) ? incoming.habits : current.habits;

  var gone = {};
  (incoming.removedHabits || []).forEach(function (id) { gone[id] = 1; });
  habits = habits.filter(function (h) { return !gone[h.id]; });
  Object.keys(ticks).forEach(function (key) {
    if (gone[key.slice(0, key.indexOf('|'))]) delete ticks[key];
  });

  return { habits: habits, ticks: ticks, review: mergeReview(current.review || [], incoming) };
}

/**
 * Review topics merge by UNION on id, the same spirit as ticks. A Habits-only
 * sync omits the review keys entirely, so the tab is preserved untouched; a
 * Review sync carries { review, removedTopics }.
 *
 * For a topic present on both sides the richer record wins: more entries in
 * reviews[] means a later point in the schedule, so its interval/nextDue are the
 * ones to keep. Deletions travel named in removedTopics — an empty review list
 * means "new device", never "wipe the tab", mirroring the habits rule.
 *
 * The Review page adopts the server's result directly, so this rule lives only
 * here and in the copy embedded in index.html; keep the two identical.
 */
function mergeReview(current, incoming) {
  if (!incoming.review && !incoming.removedTopics) return current;   // not part of this request

  var merged = {};
  current.forEach(function (t) { merged[t.id] = t; });
  (incoming.review || []).forEach(function (t) {
    var cur = merged[t.id];
    merged[t.id] = cur ? pickTopic(cur, t) : t;
  });

  var gone = {};
  (incoming.removedTopics || []).forEach(function (id) { gone[id] = 1; });

  var out = [];
  Object.keys(merged).forEach(function (id) { if (!gone[id]) out.push(merged[id]); });
  return out;
}

function pickTopic(a, b) {
  var ar = (a.reviews || []).length, br = (b.reviews || []).length;
  if (br !== ar) return br > ar ? b : a;
  return String(b.nextDue) >= String(a.nextDue) ? b : a;   // tie -> the later schedule
}
