/* Worker detail enhancement. Reads published facts and native preferences only. */
(() => {
  'use strict';
  if (window.MDWorkerJourney) return;
  const locales = ['vi', 'en', 'zh', 'ko'];
  const copy = {
    facts: ['Thông tin cần biết trước khi ứng tuyển', 'Before you apply', '申请前须知', '지원 전 확인하세요'],
    location: ['Nơi làm việc', 'Workplace', '工作地点', '근무지'],
    income: ['Thu nhập theo tin đăng', 'Advertised income', '招聘广告收入', '공고에 표시된 소득'],
    month: ['triệu VND/tháng', 'million VND/month', '百万越南盾/月', '백만 VND/월'],
    payUnknown: ['Chưa có chi tiết lương cơ bản, tăng ca và khấu trừ; chưa xác định thực nhận.', 'Base pay, overtime and deductions are not itemized; take-home pay is unconfirmed.', '未列明基本工资、加班及扣款，实发金额尚未确认。', '기본급, 초과 근무 수당과 공제 내역이 없어 실수령액은 미확인입니다.'],
    shift: ['Ca làm của việc này', 'Job schedule', '该职位班次', '이 공고의 근무 시간대'],
    shiftUnknown: ['Chưa có giờ ca cụ thể hoặc lịch xoay ca. Cần hỏi lại người tuyển dụng.', 'Shift hours and rotation are unspecified. Ask the recruiter.', '未提供具体班次时间及轮班安排，请向招聘人员确认。', '구체적인 근무 시간과 교대 일정이 없습니다. 채용 담당자에게 확인하세요.'],
    transport: ['Đường đi / xe đưa đón', 'Commute / shuttle', '通勤／班车', '통근 / 통근버스'],
    transportUnknown: ['Chưa có tuyến xe, điểm đón hoặc thời gian đi lại.', 'Shuttle routes, pickup stops and travel time are unspecified.', '未提供班车路线、上车点或通勤时间。', '통근버스 노선, 승차 장소와 통근 시간이 없습니다.'],
    shuttleMention: ['Tin có ghi xe đưa đón; tuyến và điểm đón chưa được nêu.', 'The listing mentions a shuttle; routes and pickup stops are unspecified.', '广告提及班车，但未列明路线和上车点。', '공고에 통근버스가 언급되어 있으나 노선과 승차 장소는 없습니다.'],
    unknown: ['Chưa có thông tin', 'Not specified', '暂无信息', '정보 없음'],
    uncertain: ['Chưa rõ / cần tư vấn', 'Not sure / need advice', '尚不清楚／需要咨询', '잘 모르겠음 / 상담 필요'],
    help: ['Cần hỏi rõ trước khi đăng ký?', 'Questions before applying?', '申请前还有疑问？', '지원 전에 궁금한 점이 있나요?'],
    noHelp: ['Chưa có kênh liên hệ trực tiếp được cấu hình.', 'No direct contact channel is configured yet.', '尚未配置直接联系渠道。', '직접 연락할 채널이 아직 설정되지 않았습니다.'],
    hotline: ['Gọi số liên hệ', 'Call contact number', '拨打联系电话', '연락처로 전화'],
    zalo: ['Nhắn Zalo', 'Message on Zalo', '通过 Zalo 咨询', 'Zalo로 문의'],
    messenger: ['Nhắn Messenger', 'Message on Messenger', '通过 Messenger 咨询', 'Messenger로 문의'],
    review: ['Kiểm tra việc và nguyện vọng của bạn', 'Review your job and preferences', '核对职位及您的意愿', '지원할 공고와 희망 조건 확인'],
    selected: ['Việc đang đăng ký', 'Selected job', '申请职位', '선택한 공고'],
    preferredShift: ['Ca bạn mong muốn', 'Your preferred shift', '您期望的班次', '희망 근무 시간대'],
    preferredTransport: ['Nhu cầu xe đưa đón của bạn', 'Your shuttle preference', '您的班车需求', '통근버스 희망 여부'],
    area: ['Khu vực bạn mong muốn', 'Your preferred area', '您期望的地区', '희망 지역'],
    preferenceNote: ['Đây là nguyện vọng của bạn, chưa phải điều kiện được nhà tuyển dụng xác nhận.', 'These are your preferences, not conditions confirmed by the employer.', '以上为您的意愿，并非雇主已确认的工作条件。', '위 내용은 지원자의 희망 조건이며 고용주가 확인한 근무 조건이 아닙니다.'],
    edit: ['Sửa nguyện vọng ở bước 1', 'Edit preferences in step 1', '返回第1步修改意愿', '1단계에서 희망 조건 수정'],
    day: ['Ca ngày', 'Day shift', '白班', '주간'],
    night: ['Ca đêm', 'Night shift', '夜班', '야간'],
    flexible: ['Linh hoạt', 'Flexible', '灵活', '유연 근무'],
    yes: ['Cần xe đưa đón', 'Shuttle needed', '需要班车', '통근버스 필요'],
    no: ['Không cần xe đưa đón', 'No shuttle needed', '不需要班车', '통근버스 불필요'],
  };
  const locale = lang => locales.includes(String(lang || '').split('-')[0]) ? String(lang).split('-')[0] : 'vi';
  const t = (key, lang) => copy[key][locales.indexOf(locale(lang))];
  const text = value => typeof value === 'string' ? value.trim() : '';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalize = value => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/đ/g, 'd');
  function chosenWorker(data, id) {
    return (Array.isArray(data?.jobs) ? data.jobs : []).find(job => job && job.id === id && job.open === true && job.type === 'worker') || null;
  }
  function facts(job, lang = 'vi') {
    const pay = Number.isFinite(job.min) && Number.isFinite(job.max) && job.min >= 0 && job.max >= job.min
      ? `${job.min}–${job.max} ${t('month', lang)}. ` : '';
    // General shift requirements and benefit tags cannot establish hours or routes.
    const shuttle = (Array.isArray(job.tags) ? job.tags : []).some(tag => /^(?:xe dua don|shuttle(?: bus)?|班车|통근버스)$/.test(normalize(tag)));
    return [
      ['location', [text(job.park), text(job.location)].filter(Boolean).join(' · ') || t('unknown', lang)],
      ['income', pay + t('payUnknown', lang)],
      ['shift', t('shiftUnknown', lang)],
      ['transport', t(shuttle ? 'shuttleMention' : 'transportUnknown', lang)],
    ].map(([key, value]) => ({ key, label: t(key, lang), value }));
  }
  function reviewRows(job, preferences, lang = 'vi') {
    const shifts = { 'Ca ngày': 'day', 'Ca đêm': 'night', 'Linh hoạt': 'flexible', 'Chưa rõ': 'uncertain' };
    const shuttle = { 'Có': 'yes', 'Không': 'no', 'Chưa rõ': 'uncertain' };
    return [
      { key: 'selected', label: t('selected', lang), value: text(job.title) || t('unknown', lang) },
      { key: 'preferredShift', label: t('preferredShift', lang), value: t(shifts[preferences.shift] || 'unknown', lang) },
      { key: 'preferredTransport', label: t('preferredTransport', lang), value: t(shuttle[preferences.shuttle] || 'unknown', lang) },
      { key: 'area', label: t('area', lang), value: preferences.area === 'Chưa rõ' ? t('uncertain', lang) : text(preferences.area) || t('unknown', lang) },
    ];
  }
  function supportLinks(links) {
    // Reuse only actual configured channel anchors; never turn demo placeholders into actions.
    return links.flatMap(item => {
      const href = text(item.href);
      if (/^tel:(?:0\d{9,10}|\+84\d{9,10}|1800\d{4,6}|1900\d{4,6})$/.test(href)) return [{ kind: 'hotline', href }];
      try {
        const url = new URL(href);
        if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname === '/' || /[<>"']/.test(url.href)) return [];
        const kind = url.hostname === 'zalo.me' ? 'zalo' : url.hostname === 'm.me' || ['messenger.com', 'www.messenger.com'].includes(url.hostname) && /^\/t\/[^/]+\/?$/.test(url.pathname) ? 'messenger' : '';
        return kind ? [{ kind, href: url.href }] : [];
      } catch { return []; }
    }).filter((item, index, all) => all.findIndex(other => other.href === item.href) === index);
  }
  const rowsHTML = rows => `<dl>${rows.map(row => `<div><dt>${escape(row.label)}</dt><dd>${escape(row.value)}</dd></div>`).join('')}</dl>`;
  function factsHTML(job, links, lang) {
    return `<h2 id="md-worker-facts-title">${t('facts', lang)}</h2>${rowsHTML(facts(job, lang))}<div class="wj-help"><h3>${t('help', lang)}</h3>${links.length ? `<div class="wj-help-actions">${links.map(link => `<a href="${escape(link.href)}" ${link.kind === 'hotline' ? '' : 'target="_blank" rel="noopener noreferrer"'}>${t(link.kind, lang)}</a>`).join('')}</div>` : `<p>${t('noHelp', lang)}</p>`}</div>`;
  }
  function reviewHTML(job, preferences, lang) {
    return `<h3 id="md-worker-review-title">${t('review', lang)}</h3>${rowsHTML(reviewRows(job, preferences, lang))}<p>${t('preferenceNote', lang)}</p><button type="button" data-wj-edit>${t('edit', lang)}</button>`;
  }
  function nativePreferences(form) {
    return Object.fromEntries(['shift', 'shuttle', 'area'].map(key => [key, form.elements.namedItem(key)?.value || '']));
  }
  const restoredForms = new WeakSet();
  function enhanceUncertain(form, lang) {
    for (const key of ['shift', 'shuttle']) {
      let label = form.querySelector(`[data-wj-uncertain="${key}"]`);
      if (!label) {
        const first = form.querySelector(`input[name="${key}"]`);
        const group = first?.closest('.chip-row'); if (!group) continue;
        label = document.createElement('label'); label.className = 'choice-chip';
        label.dataset.wjUncertain = key; label.dataset.wjOwned = '';
        const radio = document.createElement('input'); radio.type = 'radio'; radio.name = key; radio.value = 'Chưa rõ';
        radio.id = key === 'shift' ? 'applyShiftUncertain' : 'applyShuttleUncertain';
        label.append(radio, document.createElement('span')); group.append(label);
      }
      const caption = label.querySelector('span');
      if (caption.textContent !== t('uncertain', lang)) caption.textContent = t('uncertain', lang);
    }
    const area = form.elements.namedItem('area');
    if (area?.options) {
      let option = [...area.options].find(item => item.value === 'Chưa rõ');
      if (!option) { option = document.createElement('option'); option.value = 'Chưa rõ'; option.dataset.wjOwned = ''; area.append(option); }
      if (option.textContent !== t('uncertain', lang)) option.textContent = t('uncertain', lang);
    }
    if (!restoredForms.has(form)) {
      restoredForms.add(form);
      const pending=form.__mdPendingWorkerPreferences;
      for(const key of ['shift','shuttle','area']){const control=form.elements.namedItem(key);if(control&&!control.value&&pending?.[key]==='Chưa rõ')control.value='Chưa rõ';}
      delete form.__mdPendingWorkerPreferences;
      // Native restore runs before these options exist. Restore only an explicit
      // saved uncertain choice, in the same per-job preference key; never a default.
      try {
        const saved = form.dataset.formKey ? JSON.parse(window.sessionStorage?.getItem('md_preferences_' + form.dataset.formKey) || '{}') : {};
        for (const key of ['shift', 'shuttle', 'area']) {
          const control = form.elements.namedItem(key);
          if (control && !control.value && saved[key] === 'Chưa rõ') control.value = 'Chưa rõ';
        }
      } catch { /* Unavailable or malformed preference storage leaves choices blank. */ }
    }
  }
  const signatures = new WeakMap();
  function update(node, html, lang) {
    if (signatures.get(node) === html && node.lang === lang) return;
    node.lang = lang; node.innerHTML = html; signatures.set(node, html);
  }
  function refresh() {
    const app = document.getElementById('app'); if (!app) return;
    let data = {};
    try { data = window.MDPrototypeBridge?.snapshot() || {}; } catch { /* Retry on the next native render. */ }
    const id = new URLSearchParams(location.search).get('id');
    const job = document.body.dataset.page === 'detail' ? chosenWorker(data, id) : null;
    const info = app.querySelector('.detail-info');
    if (!job || !info) { app.querySelectorAll('[data-wj-owned]').forEach(node => node.remove()); return; }
    const lang = locale(data.lang || document.documentElement.lang);
    let summary = info.querySelector('#md-worker-facts');
    if (!summary) {
      summary = document.createElement('section'); summary.id = 'md-worker-facts'; summary.className = 'wj-facts';
      summary.dataset.wjOwned = ''; summary.setAttribute('aria-labelledby', 'md-worker-facts-title'); info.append(summary);
    }
    const links = supportLinks([...document.querySelectorAll('.md-social-channel[href]')].map(node => ({ href: node.getAttribute('href') })));
    update(summary, factsHTML(job, links, lang), lang);
    const form = app.querySelector('#applyForm.apply-micro');
    if (form) enhanceUncertain(form, lang);
    const step = form?.querySelector('[data-step="2"]'); if (!step) return;
    let review = step.querySelector('#md-worker-review');
    if (!review) {
      review = document.createElement('section'); review.id = 'md-worker-review'; review.className = 'wj-review';
      review.dataset.wjOwned = ''; review.setAttribute('aria-labelledby', 'md-worker-review-title');
      const legend = step.querySelector('legend'); if (legend) legend.after(review); else step.prepend(review);
      review.addEventListener('click', event => { if (event.target.closest('[data-wj-edit]')) form.querySelector('#applyBack')?.click(); });
    }
    update(review, reviewHTML(job, nativePreferences(form), lang), lang);
  }
  let queued = false, observer;
  function schedule() {
    if (queued) return; queued = true;
    queueMicrotask(() => { queued = false; refresh(); });
  }
  function start() {
    refresh();
    const app = document.getElementById('app');
    if (app && !observer) {
      observer = new MutationObserver(records => {
        if (records.some(record => !record.target.closest?.('[data-wj-owned]'))) schedule();
      });
      observer.observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
      for (const name of ['change', 'input', 'click']) app.addEventListener(name, event => {
        if (event.target.closest('#applyForm.apply-micro')) schedule();
      });
      new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }
  window.MDWorkerJourney = Object.freeze({ chosenWorker, facts, reviewRows, supportLinks, factsHTML, reviewHTML, nativePreferences, enhanceUncertain, copy, refresh, start });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
