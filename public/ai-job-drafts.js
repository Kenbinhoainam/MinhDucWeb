/* Vietnamese job drafts for the local CMS demo. */
(() => {
  'use strict';
  if (window.location.pathname.split('/').pop() !== 'cms-demo.html' || window.MDJobDrafts) return;

  const sections = {
    description: ['Mô tả công việc', 'nhiệm vụ chính và ca làm'],
    requirements: ['Yêu cầu ứng viên', 'yêu cầu đã xác nhận về kỹ năng, kinh nghiệm hoặc hồ sơ'],
    benefits: ['Quyền lợi', 'quyền lợi đã xác nhận'],
    apply: ['Cách ứng tuyển', 'kênh ứng tuyển, hồ sơ cần nộp và thời hạn nếu có']
  };
  const sectionKeys = Object.keys(sections);
  const sourceKeys = ['title', 'location', 'company', 'min', 'max', 'openings', ...sectionKeys];
  const optional = { company: 'Đơn vị tuyển dụng', salary: 'Mức lương', openings: 'Số lượng tuyển' };
  const groupedFacts = { core: ['title', 'location', 'type'], salary: ['min', 'max'] };
  const typeLabels = new Map([['worker', 'Lao động phổ thông'], ['internal', 'Tuyển dụng nội bộ']]);
  const textLimit = 12000;
  const placeholderPrefix = '[Bổ sung: ';
  const staleDraft = 'Thông tin nguồn hoặc lựa chọn đã đổi. Kiểm tra dữ liệu và tạo lại bản nháp trước khi chèn.';
  const panelSelector = '[data-md-job-draft]';
  const formSelector = '#adminContent #jobEditForm';
  const text = value => String(value ?? '').trim();
  const readyText = value => Boolean(value && !value.includes(placeholderPrefix) && value.length <= textLimit);

  function summarize(values) {
    const title = text(values.title);
    const location = text(values.location);
    const type = typeLabels.get(values.type);
    const company = text(values.company);
    const min = text(values.min);
    const max = text(values.max);
    const openings = Number(values.openings);
    const hasSalary = min && max && Number.isFinite(Number(min)) && Number.isFinite(Number(max)) &&
      Number(min) > 0 && Number(max) >= Number(min);
    const missingCore = [];
    if (!title || title.toLowerCase() === 'tin tuyển dụng mới') missingCore.push('vị trí tuyển dụng');
    if (!location) missingCore.push('địa điểm');
    if (!type) missingCore.push('loại hình tuyển dụng');
    return {
      core: missingCore.length ? '' : [title, location, type].join(' · '),
      missingCore,
      company: /\((?:minh họa|thông tin mẫu)\)/iu.test(company) ? '' : company,
      salary: hasSalary ? `${min}–${max} triệu đồng/tháng` : '',
      openings: Number.isSafeInteger(openings) && openings > 0 ? `${openings} vị trí` : '',
      ...Object.fromEntries(sectionKeys.map(key => [key, text(values[key])]))
    };
  }

  function createDraft(values, confirmed) {
    const facts = summarize(values);
    if (!confirmed.has('core') || !facts.core) return null;

    const include = key => confirmed.has(key) ? facts[key] : '';
    const body = key => include(key) || `${placeholderPrefix}${sections[key][1]}]`;
    const employer = include('company');
    const count = include('openings');
    const salary = include('salary');
    return {
      description: [
        `Vị trí tuyển dụng: ${text(values.title)}`,
        `Địa điểm làm việc: ${text(values.location)}`,
        `Loại hình tuyển dụng: ${typeLabels.get(values.type)}`,
        employer && `Đơn vị tuyển dụng: ${employer}`,
        count && `Số lượng tuyển: ${count}`,
        body('description')
      ].filter(Boolean).join('\n'),
      requirements: body('requirements'),
      benefits: [salary && `Mức lương: ${salary}`, body('benefits')].filter(Boolean).join('\n'),
      apply: body('apply')
    };
  }

  function recordId(form) {
    // The image editor also carries the record key in existing demo versions.
    const media = form.querySelector('#edit-general [data-inline-media]')?.dataset.inlineMedia;
    return form.dataset.jobId || (media?.startsWith('job:') ? media.slice(4) : '');
  }

  function capture(form) {
    const id = recordId(form);
    if (!form.isConnected || !id) return null;
    const controls = Object.fromEntries(sourceKeys.map(key => [key, form.elements.namedItem(key)]));
    if (sourceKeys.some(key => controls[key]?.form !== form ||
      controls[key].tagName !== (sectionKeys.includes(key) ? 'TEXTAREA' : 'INPUT'))) return null;

    const type = form.querySelector('input[type="radio"][name="type"]:checked')?.value || '';
    const values = Object.fromEntries(sourceKeys.map(key => [key, controls[key].value]));
    values.type = type;
    return { form, id, controls, values, fingerprint: JSON.stringify(values) };
  }

  function sameSource(before, after) {
    return Boolean(before && after && before.form === after.form && before.id === after.id &&
      before.fingerprint === after.fingerprint && sectionKeys.every(key => before.controls[key] === after.controls[key]));
  }

  function writeDraft(form, snapshot, values) {
    const current = capture(form);
    if (!sameSource(snapshot, current)) return false;

    const updates = sectionKeys.filter(key => Object.hasOwn(values, key))
      .map(key => [current.controls[key], text(values[key])]);
    if (!updates.length || updates.some(([input, value]) => input.readOnly || input.matches(':disabled') || !readyText(value) ||
      (input.maxLength >= 0 && value.length > input.maxLength))) return false;

    for (const [input, value] of updates) input.value = value;
    for (const [input] of updates) input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  function factOption(key, label) {
    return `<label class="md-job-draft-option">
      <input type="checkbox" data-job-fact="${key}" aria-describedby="md-job-fact-${key}">
      <span><strong>${label}</strong><span id="md-job-fact-${key}" data-job-fact-value></span></span>
    </label>`;
  }

  function mount(form, general) {
    const panel = document.createElement('details');
    panel.className = 'md-job-draft';
    panel.dataset.mdJobDraft = '';
    panel.lang = 'vi';
    panel.innerHTML = `<summary><span class="md-job-draft-badge">DEMO</span> Trợ lý soạn tin tuyển dụng</summary>
      <div class="md-job-draft-body">
        <p>Tạo bản nháp tiếng Việt theo mẫu ngay trong trình duyệt. Chỉ dùng thông tin bạn chọn xác nhận.</p>
        <fieldset>
          <legend>1. Kiểm tra dữ liệu nguồn</legend>
          <p class="md-job-draft-note">Đối chiếu từng mục với thông tin tuyển dụng thực tế, kể cả dữ liệu có sẵn trong CMS. Sửa dữ liệu nguồn ở biểu mẫu bên dưới.</p>
          ${factOption('core', 'Xác nhận vị trí, địa điểm và loại hình tuyển dụng')}
          <details class="md-job-draft-facts">
            <summary>Thông tin bổ sung và nội dung đang có</summary>
            ${Object.entries(optional).map(([key, label]) => factOption(key, label)).join('')}
            ${sectionKeys.map(key => factOption(key, `Dùng nội dung ${sections[key][0].toLowerCase()} đã kiểm tra`)).join('')}
          </details>
          <p class="md-job-draft-note" data-job-missing></p>
        </fieldset>
        <div class="md-job-draft-actions">
          <button type="button" class="btn blue" data-job-generate>Tạo bản nháp</button>
          <label class="md-job-draft-replace" hidden><input type="checkbox" data-job-replace> Cho phép thay bản nháp tôi đang sửa</label>
        </div>
        <fieldset data-job-preview hidden>
          <legend tabindex="-1">2. Xem và sửa bản nháp</legend>
          <p class="md-job-draft-note">Hoàn thiện hoặc bỏ các ghi chú trong ngoặc vuông. Nút bên dưới sẽ thay các mục tiếng Việt đã hoàn thiện trong biểu mẫu. Sau khi kiểm tra, chọn <strong>Lưu thay đổi</strong> ở đầu trang.</p>
          ${sectionKeys.map(key => `<label class="md-job-draft-field">${sections[key][0]}<textarea rows="4" maxlength="${textLimit}" data-job-draft-field="${key}"></textarea></label>`).join('')}
          <div class="md-job-draft-actions"><button type="button" class="btn blue" data-job-apply>Chèn các mục đã hoàn thiện</button></div>
        </fieldset>
        <p class="md-job-draft-status" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>`;

    const factBoxes = [...panel.querySelectorAll('[data-job-fact]')];
    const missing = panel.querySelector('[data-job-missing]');
    const preview = panel.querySelector('[data-job-preview]');
    const draftFields = Object.fromEntries(sectionKeys.map(key => [key, preview.querySelector(`[data-job-draft-field="${key}"]`)]));
    const generate = panel.querySelector('[data-job-generate]');
    const apply = panel.querySelector('[data-job-apply]');
    const replace = panel.querySelector('[data-job-replace]');
    const status = panel.querySelector('[role="status"]');
    const selected = () => new Set(factBoxes.filter(box => box.checked && !box.disabled).map(box => box.dataset.jobFact));
    const isActive = () => panel.isConnected && document.querySelector(formSelector) === form;
    const say = message => { if (status.textContent !== message) status.textContent = message; };
    const selectionKey = () => [...selected()].join(',');
    let source;
    let draft;

    function syncSource() {
      const current = isActive() ? capture(form) : null;
      if (source !== current && !sameSource(source, current)) {
        const facts = summarize(current?.values || {});
        for (const box of factBoxes) {
          const key = box.dataset.jobFact;
          const value = facts[key];
          const factKeys = groupedFacts[key] || [key];
          if (!value || !source || !current || source.id !== current.id ||
            factKeys.some(field => source.values[field] !== current.values[field])) box.checked = false;
          box.disabled = !value;
          const display = box.parentElement.querySelector('[data-job-fact-value]');
          const sampleCompany = key === 'company' && !value && text(current?.values.company);
          display.textContent = value || (key === 'core' ? `Cần bổ sung ${facts.missingCore.join(', ')}.` :
            sampleCompany ? `${sampleCompany} · Dữ liệu mẫu` : 'Chưa có thông tin phù hợp để dùng.');
          if (display.textContent.length > 300) display.tabIndex = 0;
          else display.removeAttribute('tabindex');
        }
      }
      source = current;
      const confirmed = selected();
      const missingLabels = Object.entries(optional).filter(([key]) => !confirmed.has(key)).map(([, label]) => label.toLowerCase());
      const note = missingLabels.length ? `Chưa xác nhận ${missingLabels.join(', ')}. Bạn có thể bỏ qua các mục này.` : '';
      if (missing.textContent !== note) missing.textContent = note;
      generate.disabled = !confirmed.has('core');
    }

    function syncDraft() {
      if (!draft) return;
      const edited = sectionKeys.some(key => draftFields[key].value !== draft.generated[key]);
      replace.parentElement.hidden = !edited;
      if (!edited) replace.checked = false;
      apply.disabled = !sameSource(draft.source, source) || draft.selection !== selectionKey();
    }

    function refresh() {
      syncSource();
      syncDraft();
      if (draft && apply.disabled) say(staleDraft);
      else if (status.textContent === staleDraft) say('');
    }

    panel.addEventListener('toggle', () => { if (panel.open) refresh(); });
    for (const name of ['input', 'change']) form.addEventListener(name, event => {
      if (sourceKeys.includes(event.target.name) || event.target.name === 'type') refresh();
    });
    panel.addEventListener('change', event => {
      if (event.target.matches('[data-job-fact]')) refresh();
    });
    preview.addEventListener('input', syncDraft);

    generate.addEventListener('click', () => {
      refresh();
      if (draft && !replace.parentElement.hidden && !replace.checked) {
        say('Bản nháp đã được chỉnh sửa. Hãy chọn cho phép thay bản nháp nếu muốn tạo lại.');
        replace.focus();
        return;
      }
      const generated = source && createDraft(source.values, selected());
      if (!generated) return;

      draft = { source, selection: selectionKey(), generated };
      for (const key of sectionKeys) draftFields[key].value = generated[key];
      preview.hidden = false;
      generate.textContent = 'Tạo lại bản nháp';
      syncDraft();
      say('Đã tạo bản nháp. Kiểm tra và bổ sung các mục còn thiếu trước khi chèn.');
      preview.querySelector('legend').focus();
    });

    apply.addEventListener('click', () => {
      refresh();
      if (!draft || apply.disabled) return;
      const values = Object.fromEntries(sectionKeys.map(key => [key, text(draftFields[key].value)]));
      const completed = sectionKeys.filter(key => readyText(values[key]));
      const changed = completed.filter(key => values[key] !== draft.source.values[key]);
      if (!changed.length) {
        say('Chưa có nội dung mới để chèn. Hãy hoàn thiện các mục đang sửa.');
        return;
      }
      const updates = Object.fromEntries(changed.map(key => [key, values[key]]));
      const expected = { ...draft.source, fingerprint: JSON.stringify({ ...draft.source.values, ...updates }) };
      if (!writeDraft(form, draft.source, updates)) {
        say('Chưa chèn bản nháp. Hãy kiểm tra lại biểu mẫu và độ dài từng mục.');
        return;
      }
      const inserted = `Đã chèn ${changed.length} mục tiếng Việt.`;
      if (completed.length < sectionKeys.length) {
        syncSource();
        if (sameSource(expected, source)) {
          draft.source = source;
          draft.selection = selectionKey();
          syncDraft();
          say(`${inserted} Bạn có thể tiếp tục sửa các mục còn lại.`);
        }
        return;
      }
      draft = null;
      preview.hidden = true;
      replace.checked = false;
      replace.parentElement.hidden = true;
      generate.textContent = 'Tạo bản nháp';
      refresh();
      say(`${inserted} Kiểm tra biểu mẫu rồi chọn Lưu thay đổi.`);
      panel.querySelector('summary').focus();
    });

    general.before(panel);
    syncSource();
    return panel;
  }

  function boot() {
    if (document.body?.dataset.page !== 'admin') return;
    let panel;
    const sync = () => {
      if (panel?.isConnected) return;
      const form = document.querySelector(formSelector);
      const general = form?.querySelector('#edit-general');
      if (general && capture(form)) panel = mount(form, general);
    };
    sync();
    new MutationObserver(records => {
      if (panel?.isConnected) return;
      if (records.some(record => !record.target.closest?.(panelSelector) &&
        [...record.addedNodes].some(node => node.nodeType === 1 && !node.matches(panelSelector) &&
          (node.matches('#adminContent, #jobEditForm, #edit-general') || node.querySelector(formSelector))))) sync();
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.MDJobDrafts = Object.freeze({ createDraft, summarize, capture, sameSource, writeDraft });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
