import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_EVENTS, buildReport, filterEvents, toCsv
} from '../public/conversion-reports-demo.js';

test('includes both boundaries and filters by the whole same-day session', () => {
  const first = filterEvents(DEMO_EVENTS, '2026-11-01', '2026-11-01');
  assert.equal(first.error, null);
  assert.equal(first.records.length, 41);
  assert.ok(first.records.every(event => event.date === '2026-11-01'));
  assert.deepEqual(buildReport(first.records).totals, { viewers: 25, opens: 11, completions: 5, rate: .2 });

  const full = filterEvents(DEMO_EVENTS, '2026-11-01', '2026-11-06');
  assert.deepEqual(full.records, DEMO_EVENTS);
  assert.equal(full.records.at(-1).date, '2026-11-06');
  const report = buildReport(full.records);
  assert.equal(report.channels.length, 4);
  for (const channel of report.channels) {
    assert.ok(channel.viewers >= channel.opens && channel.opens >= channel.completions);
    assert.equal(channel.rate, channel.completions / channel.viewers);
  }
  assert.equal(report.totals.rate, report.totals.completions / report.totals.viewers);
});

test('rejects missing, impossible, and reversed dates and accepts leap days', () => {
  assert.deepEqual(filterEvents(DEMO_EVENTS, '', '2026-11-06'), { error: 'start', records: [] });
  assert.equal(filterEvents(DEMO_EVENTS, '2026-11-01', '2026-11-31').error, 'end');
  assert.equal(filterEvents(DEMO_EVENTS, '2026-11-01', '2026-02-29').error, 'end');
  assert.equal(filterEvents(DEMO_EVENTS, '2026-11-06', '2026-11-01').error, 'order');
  assert.equal(filterEvents(DEMO_EVENTS, '2028-02-29', '2028-02-29').error, null);
});

test('deduplicates repeated events and counts completions only within the viewed and opened cohort', () => {
  const record = (session, stage) => ({ session, stage, channel: 'search' });
  const records = [
    record('full', 'view'), record('full', 'view'), record('full', 'open'), record('full', 'complete'),
    record('skip', 'view'), record('skip', 'complete'), record('orphan', 'open'), record('orphan', 'complete')
  ];
  const metrics = { viewers: 2, opens: 1, completions: 1, rate: .5 };
  assert.deepEqual(buildReport(records), { totals: metrics, channels: [{ channel: 'search', ...metrics }] });
});

test('returns a missing rate for no viewers and zero percent for no completions', () => {
  const { error, records } = filterEvents(DEMO_EVENTS, '2026-11-07', '2026-11-08');
  assert.equal(error, null);
  assert.deepEqual(buildReport(records), {
    totals: { viewers: 0, opens: 0, completions: 0, rate: null },
    channels: []
  });
  assert.equal(buildReport([{ channel: 'search', session: 'demo-only', stage: 'view' }]).totals.rate, 0);
});

test('exports exactly the filtered records with UTF-8 BOM and CRLF line endings', () => {
  const { records } = filterEvents(DEMO_EVENTS, '2026-11-06', '2026-11-06');
  const csv = toCsv(records);
  assert.ok(csv.startsWith('\uFEFF"date","demo_session","channel","stage"\r\n'));
  const lines = csv.trimEnd().split('\r\n');
  assert.deepEqual(lines.slice(1), records.map(({ date, session, channel, stage }) =>
    `"${date}","${session}","${channel}","${stage}"`
  ));
  assert.ok(!csv.includes('2026-11-05'));
});

test('neutralizes formulas and escapes quotes, commas, and line breaks within cells', () => {
  const csv = toCsv([
    { date: '=1+1', session: ' @SUM(1,2)', channel: 'a"b,c', stage: 'view\nopen' },
    { date: '+1', session: '-1', channel: '\tvalue', stage: '＝1' }
  ]);
  assert.ok(csv.includes(`"'=1+1","' @SUM(1,2)","a""b,c","view\nopen"\r\n`));
  assert.ok(csv.includes(`"'+1","'-1","'\tvalue","'＝1"\r\n`));
});
