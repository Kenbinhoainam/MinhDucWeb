/* Compare only shifts explicitly recorded on the selected listings. */
(() => {
  'use strict';

  const dialog = '.v14-compare-dialog';
  const rowSelector = '[data-comparison-shift]';
  const shifts = ['day', 'night', 'rotating', 'flexible'];
  const copy = {
    vi: ['Ca làm', 'Chưa công bố · cần xác nhận', 'Ca ngày', 'Ca đêm', 'Ca luân phiên', 'Ca linh hoạt'],
    en: ['Shift', 'Unpublished · confirm with recruiter', 'Day shift', 'Night shift', 'Rotating shifts', 'Flexible shifts'],
    zh: ['班次', '尚未公布 · 请确认', '白班', '夜班', '轮班', '灵活班次'],
    ko: ['근무조', '미공개 · 확인 필요', '주간 근무', '야간 근무', '순환 근무', '유연한 근무조']
  };

  function jobId(href) {
    try {
      const detail = new URL('chi-tiet-viec-lam.html', window.location.href);
      const link = new URL(href, window.location.href);
      if (link.origin === detail.origin && link.pathname === detail.pathname && !link.username && !link.password) {
        return link.searchParams.get('id');
      }
    } catch { /* An unrecognized link cannot identify a listing. */ }
    return null;
  }

  function refresh() {
    const columns = document.querySelectorAll(`${dialog} .v14-compare-column`);
    if (!columns.length) return;

    let data;
    try { data = window.MDPrototypeBridge?.snapshot(); } catch { /* Show the confirmation prompt until data is available. */ }
    const lang = data?.lang || document.documentElement.lang;
    const labels = Object.hasOwn(copy, lang) ? copy[lang] : copy.vi;
    const jobs = Array.isArray(data?.jobs) ? data.jobs : [];

    for (const column of columns) {
      const list = column.querySelector(':scope > dl');
      if (!list) continue;
      const id = jobId(column.querySelector(':scope > a[href]')?.getAttribute('href'));
      const job = id && jobs.find(item => item?.id === id);
      const shift = shifts.indexOf(job?.shift);
      let row = list.querySelector(rowSelector);
      if (!row) {
        row = document.createElement('div');
        row.setAttribute('data-comparison-shift', '');
        row.append(document.createElement('dt'), document.createElement('dd'));
        list.insertBefore(row, list.children[2] || null);
      }
      const label = row.firstElementChild;
      const value = row.lastElementChild;
      const shiftText = labels[shift + 2];
      if (label.textContent !== labels[0]) label.textContent = labels[0];
      if (value.textContent !== shiftText) value.textContent = shiftText;
      value.classList.toggle('md-compare-shift-unknown', shift < 0);
    }
  }

  function start() {
    refresh();
    const observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'attributes' || [...record.addedNodes].some(node =>
        node.matches?.(dialog) || node.querySelector?.(dialog)
      ))) refresh();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
