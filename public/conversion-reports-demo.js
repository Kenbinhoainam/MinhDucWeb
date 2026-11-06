const CHANNELS = Object.freeze({
  search: 'Tìm kiếm',
  social: 'Mạng xã hội',
  direct: 'Trực tiếp',
  qr: 'Mã QR'
});

const STAGES = ['view', 'open', 'complete'];

// Each tuple holds the number of same-day demo sessions reaching each stage.
const DAILY_COHORTS = [
  { date: '2026-11-01', search: [12, 6, 3], social: [8, 3, 1], direct: [5, 2, 1] },
  { date: '2026-11-02', search: [11, 5, 2], social: [10, 4, 2], direct: [6, 4, 2], qr: [3, 1, 1] },
  { date: '2026-11-03', search: [13, 7, 4], social: [7, 4, 1], direct: [7, 3, 1], qr: [4, 2, 1] },
  { date: '2026-11-04', search: [10, 4, 2], social: [9, 5, 3], direct: [8, 4, 3], qr: [5, 3, 2] },
  { date: '2026-11-05', search: [14, 7, 5], social: [11, 6, 2], direct: [7, 4, 2], qr: [6, 3, 2] },
  { date: '2026-11-06', search: [15, 8, 4], social: [12, 7, 4], direct: [9, 5, 3], qr: [7, 4, 2] }
];

export const DEMO_EVENTS = Object.freeze(DAILY_COHORTS.flatMap(({ date, ...counts }) =>
  Object.entries(counts).flatMap(([channel, thresholds]) =>
    Array.from({ length: thresholds[0] }, (_, index) => {
      const session = `demo-${date}-${channel}-${index + 1}`;
      return STAGES.filter((_, step) => index < thresholds[step])
        .map(stage => Object.freeze({ date, session, channel, stage }));
    }).flat()
  )
));

function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function filterEvents(events, start, end) {
  if (!isCalendarDate(start)) return { error: 'start', records: [] };
  if (!isCalendarDate(end)) return { error: 'end', records: [] };
  if (start > end) return { error: 'order', records: [] };
  return { error: null, records: events.filter(({ date }) => date >= start && date <= end) };
}

function summarize(cohort) {
  let viewers = 0;
  let opens = 0;
  let completions = 0;
  for (const stages of cohort.values()) {
    if (!stages.has('view')) continue;
    viewers += 1;
    if (!stages.has('open')) continue;
    opens += 1;
    if (stages.has('complete')) completions += 1;
  }
  return { viewers, opens, completions, rate: viewers ? completions / viewers : null };
}

export function buildReport(records) {
  const byChannel = new Map();
  for (const { session, channel, stage } of records) {
    if (!byChannel.has(channel)) byChannel.set(channel, new Map());
    const sessions = byChannel.get(channel);
    if (!sessions.has(session)) sessions.set(session, new Set());
    sessions.get(session).add(stage);
  }

  const channels = [];
  const totals = { viewers: 0, opens: 0, completions: 0, rate: null };
  for (const [channel, sessions] of byChannel) {
    const metrics = summarize(sessions);
    if (!metrics.viewers) continue;
    channels.push({ channel, ...metrics });
    totals.viewers += metrics.viewers;
    totals.opens += metrics.opens;
    totals.completions += metrics.completions;
  }
  if (totals.viewers) totals.rate = totals.completions / totals.viewers;
  return { totals, channels };
}

function csvCell(value) {
  const text = String(value);
  const safe = /^(?:[\t\r\n]|\s*[=+\-@\uFF1D\uFF0B\uFF0D\uFF20])/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function toCsv(records) {
  const rows = records.map(({ date, session, channel, stage }) => [date, session, channel, stage]);
  return '\uFEFF' + [['date', 'demo_session', 'channel', 'stage'], ...rows]
    .map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

const numberFormat = new Intl.NumberFormat('vi-VN');
const percentFormat = new Intl.NumberFormat('vi-VN', { style: 'percent', maximumFractionDigits: 1 });

function formatRate(value) {
  return value === null ? '—' : percentFormat.format(value);
}

function displayDate(value) {
  return value.split('-').reverse().join('/');
}

function initializeReport(document) {
  const get = id => document.getElementById(`report-${id}`);
  const form = get('filters');
  const start = get('start');
  const end = get('end');
  const error = get('error');
  const status = get('status');
  const results = get('results');
  const channelRegion = get('channel-region');
  const tableBody = get('channels');
  const download = get('download');
  let filtered = [];
  let exportName = '';

  function renderReport() {
    const range = filterEvents(DEMO_EVENTS, start.value, end.value);
    start.removeAttribute('aria-invalid');
    end.removeAttribute('aria-invalid');
    error.textContent = '';
    if (range.error) {
      const invalid = range.error === 'start' ? start : end;
      invalid.setAttribute('aria-invalid', 'true');
      error.textContent = {
        start: 'Hãy nhập ngày bắt đầu hợp lệ.',
        end: 'Hãy nhập ngày kết thúc hợp lệ.',
        order: 'Ngày kết thúc phải từ ngày bắt đầu trở đi.'
      }[range.error];
      filtered = [];
      download.disabled = true;
      results.hidden = true;
      status.textContent = '';
      invalid.focus();
      return;
    }

    filtered = range.records;
    exportName = `chuyen-doi-demo-${start.value}-den-${end.value}.csv`;
    const { totals, channels } = buildReport(filtered);
    for (const key of ['viewers', 'opens', 'completions']) {
      get(key).textContent = numberFormat.format(totals[key]);
    }
    get('rate').textContent = formatRate(totals.rate);
    status.textContent = `${displayDate(start.value)} – ${displayDate(end.value)} · ${numberFormat.format(totals.viewers)} phiên mẫu · ${numberFormat.format(filtered.length)} sự kiện`;
    tableBody.replaceChildren();
    for (const { channel, viewers, opens, completions, rate } of channels) {
      const row = tableBody.insertRow();
      const label = document.createElement('th');
      label.scope = 'row';
      label.textContent = CHANNELS[channel];
      row.append(label);
      for (const value of [viewers, opens, completions].map(count => numberFormat.format(count))) {
        row.insertCell().textContent = value;
      }
      row.insertCell().textContent = formatRate(rate);
    }
    get('empty').hidden = filtered.length > 0;
    channelRegion.hidden = !channels.length;
    download.disabled = !filtered.length;
    results.hidden = false;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    renderReport();
  });
  download.addEventListener('click', () => {
    if (!filtered.length) return;
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  form.querySelector('fieldset').disabled = false;
  renderReport();
}

if (typeof document !== 'undefined') initializeReport(document);
