/* Local Vietnamese staffing intake. The existing workforce form owns review and continuation. */
(function (root) {
  'use strict';
  if (root.MDAIBusinessBrief) return;
  const fields = ['count', 'area', 'industry', 'shift', 'start'];
  const options = {
    area: ['bn', 'bg', 'hn'],
    industry: ['electronic', 'mechanical', 'warehouse', 'other'],
    shift: ['day', 'night', 'rotating'],
    start: ['two-weeks', 'month', 'later'],
  };
  const signals = {
    area: {bn:/\bbac ninh\b/, bg:/\bbac giang\b/, hn:/\bha noi\b/},
    industry: {
      electronic:/\b(?:dien tu|lap rap linh kien|lap rap)\b/,
      mechanical:/\b(?:co khi|che tao|gia cong kim loai)\b/,
      warehouse:/\b(?:kho van|logistics|kho hang|nhan vien kho)\b/,
      other:/\b(?:nganh khac|det may|may mac|che bien thuc pham|xay dung)\b/,
    },
    shift: {
      day:/\b(?:ca ngay|ca sang|ca hanh chinh|gio hanh chinh)\b/,
      night:/\b(?:ca dem|ca toi)\b/,
      rotating:/\b(?:luan phien|xoay ca|ca xoay|nhieu ca|[2-3] ca)\b/,
    },
    start: {
      'two-weeks':/\b(?:ngay mai|tuan (?:nay|toi|sau)|(?:trong(?: vong)? )?(?:2|hai) tuan(?: toi)?|trong(?: vong)? (?:[1-9]|1[0-4]) ngay)\b/,
      month:/\b(?:thang (?:toi|sau)|trong(?: vong)? (?:1|mot) thang|trong(?: vong)? (?:30|31) ngay)\b/,
      later:/\b(?:quy (?:toi|sau)|sau (?:hon )?(?:[2-9]|hai|ba|bon) thang|sau hon (?:1|mot) thang|dang len ke hoach)\b/,
    },
  };
  const samples = [
    'Cần 120 công nhân điện tử ở Bắc Ninh, làm ca luân phiên, bắt đầu trong 2 tuần tới.',
    'Cần 35 nhân viên kho tại Hà Nội, làm ca đêm, dự kiến bắt đầu trong tháng tới.',
  ];
  const copy = {
    title:['Trợ lý phác thảo nhu cầu · AI demo','Staffing brief assistant · AI demo','用工需求助手 · AI 演示','인력 계획 작성 도우미 · AI 데모'],
    intro:['Mô tả ngắn bằng tiếng Việt. Công cụ dùng quy tắc có sẵn để gợi ý các trường ngay trên trang. Vui lòng chỉ nhập dữ liệu mẫu.','Write a short description in Vietnamese. This demo uses rules to suggest fields on this page. Please use sample data only.','请用越南语简要描述。演示会按规则在此页面建议可填写的字段。请仅使用示例数据。','베트남어로 짧게 적어 주세요. 이 데모는 규칙을 적용해 이 페이지에서 항목을 제안합니다. 예시 데이터만 사용해 주세요.'],
    description:['Mô tả nhu cầu bằng tiếng Việt','Staffing need in Vietnamese','越南语用工需求描述','베트남어 인력 수요 설명'],
    placeholder:['Ví dụ: Cần 120 công nhân điện tử ở Bắc Ninh, ca luân phiên, trong 2 tuần tới.','Example: Cần 120 công nhân điện tử ở Bắc Ninh, ca luân phiên, trong 2 tuần tới.','示例：Cần 120 công nhân điện tử ở Bắc Ninh, ca luân phiên, trong 2 tuần tới.','예: Cần 120 công nhân điện tử ở Bắc Ninh, ca luân phiên, trong 2 tuần tới.'],
    sample1:['Ví dụ giả định · Điện tử','Fictional example · Electronics','虚构示例 · 电子','가상 예시 · 전자'],
    sample2:['Ví dụ giả định · Kho vận','Fictional example · Logistics','虚构示例 · 物流','가상 예시 · 물류'],
    generate:['Tạo bản nháp','Create draft','生成草稿','초안 만들기'],
    preview:['Kiểm tra và sửa bản nháp','Review and edit the draft','检查并编辑草稿','초안 검토 및 수정'],
    unknown:['Chưa xác định','Unknown','尚未确定','미정'],
    missing:['Cần xác nhận','Still to confirm','待确认','확인이 필요한 항목'],
    ready:['Đã xác định đủ 5 trường.','All five fields have a value.','五个字段均已填写。','다섯 항목이 모두 채워졌습니다.'],
    hint:['Chỉ chép trường đã xác định. Bạn vẫn có thể sửa biểu mẫu trước khi tiếp tục.','Only confirmed draft fields are copied. You can edit the form before continuing.','仅复制已明确的草稿字段。继续前仍可编辑表单。','값이 있는 초안 항목만 복사됩니다. 계속하기 전에 양식을 수정할 수 있습니다.'],
    countError:['Nhập tổng số người từ 1 đến 999999 hoặc để trống.','Enter a whole total from 1 to 999999 or leave it blank.','请输入 1 至 999999 的整数总人数，或留空。','총 인원을 1~999999 사이의 정수로 입력하거나 비워 두세요.'],
    transfer:['Chép vào biểu mẫu','Copy to form','复制到表单','양식에 복사'],
    transferred:['Đã chép vào biểu mẫu. Hãy kiểm tra các trường trước khi tiếp tục.','Copied to the form. Review the fields before continuing.','已复制到表单。请检查字段后继续。','양식에 복사했습니다. 계속하기 전에 항목을 확인하세요.'],
    empty:['Nhập mô tả hoặc chọn một ví dụ giả định.','Enter a description or choose a fictional example.','请输入描述或选择一个虚构示例。','설명을 입력하거나 가상 예시를 선택하세요.'],
    stale:['Mô tả đã đổi. Tạo lại bản nháp để chép vào biểu mẫu.','The description changed. Create a new draft before copying it.','描述已更改。请先重新生成草稿再复制。','설명이 바뀌었습니다. 복사하기 전에 새 초안을 만드세요.'],
    unavailable:['Chưa chép được. Hãy kiểm tra hoặc nhập trực tiếp vào biểu mẫu.','Copy is unavailable. Check the fields or enter them directly in the form.','暂时无法复制。请检查字段或直接填写表单。','복사할 수 없습니다. 항목을 확인하거나 양식에 직접 입력해 주세요.'],
  };
  const languages = ['vi', 'en', 'zh', 'ko'];
  const limit = 500;
  const countValue = value => /^\d{1,6}$/.test(value) && Number(value) > 0 ? String(Number(value)) : '';
  const clauseBoundary = /[,;!?]|(?<!\d)\.|\.(?!\d)|\b(?:nhung|tuy nhien|thay vao do|ma lai)\b|\bma (?=(?:can|tuyen|lam|bat dau|o|tai)\b)/;
  function negated(before, after) {
    const prefix = before.split(clauseBoundary).at(-1);
    const suffix = after.split(clauseBoundary)[0];
    return /\b(?:khong(?! chi\b)|chua|chang|loai tru|ngoai tru)\b/.test(prefix) ||
      /^\s*(?:la\s+)?(?:khong|chua)\s+(?:can|duoc|phu hop|kha thi|xac dinh|chot)\b/.test(suffix);
  }
  function countFrom(text) {
    const candidates = [];
    const people = /(?<![\w.,+\-])([1-9]\d{0,2}(?:\.\d{3}){1,2}|[1-9]\d{0,5})\s*(?:nguoi|cong nhan|lao dong|nhan su|nhan vien|ky thuat vien|ung vien|tho)\b/g;
    for (const match of text.matchAll(people)) {
      const before = text.slice(0, match.index), after = text.slice(match.index + match[0].length);
      if (negated(before, after)) continue;
      if (/(?:\b(?:khoang|tam|gan|xap xi|hon|duoi|tren|toi da|toi thieu|it nhat|toi|den|hoac)|\b(?:moi ca|tung ca|ca ngay|ca dem)(?: can)?|[\d~+/\-])\s*:?\s*$/.test(before)) continue;
      if (/^\s*(?:\/\s*ca\b|(?:moi|tung|mot) ca\b|tro len\b|tro xuong\b)/.test(after)) continue;
      const value = countValue(match[1].replace(/\./g, ''));
      if (value) candidates.push({value, total:/\btong(?: cong| so(?: luong)?| can| la)?\s*:?\s*$/.test(before)});
    }
    const totals = candidates.filter(candidate => candidate.total);
    if (totals.length === 1) return totals[0].value;
    return candidates.length === 1 ? candidates[0].value : '';
  }
  function recognized(text, patterns, key) {
    const values = Object.entries(patterns).filter(([, pattern]) =>
      [...text.matchAll(new RegExp(pattern, 'g'))].some(match => {
        const before = text.slice(0, match.index), after = text.slice(match.index + match[0].length);
        return !negated(before, after) && !(key === 'start' && /\bsau\s+$/.test(before));
      }));
    return values.length === 1 ? values[0][0] : '';
  }
  function parse(description) {
    const text = String(description ?? '').slice(0, limit).toLowerCase().normalize('NFD')
      .replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/[–—−]/g, '-').replace(/[\r\n]+/g, ';').replace(/\s+/g, ' ').trim();
    const draft = {count:countFrom(text)};
    for (const key of fields.slice(1)) draft[key] = recognized(text, signals[key], key);
    return draft;
  }

  root.MDAIBusinessBrief = {parse};
  const doc = root.document;
  const workforce = root.MDWorkforceBrief;
  if (!doc?.querySelector || !root.MutationObserver || !workforce) return;
  const formSelector = '#staffingCalculator,#contactForm';
  const mountSelector = formSelector + ',[data-wb-extension]';
  const marker = '[data-ai-business-brief]';
  const idPrefix = 'md-ai-business-brief-';
  const homeFields = {industry:'#staffIndustry', area:'#staffArea'};
  const nativeAreas = {bn:'Bắc Ninh', bg:'Bắc Giang', hn:'Hà Nội'};
  let mounted;

  const locale = () => {
    const language = doc.documentElement.lang.toLowerCase().split('-')[0];
    return languages.includes(language) ? language : 'vi';
  };
  function node(tag, className, content) {
    const element = doc.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }
  function button(label, primary = false) {
    const element = node('button', primary ? 'md-ai-brief-button md-ai-brief-primary' : 'md-ai-brief-button', label);
    element.type = 'button';
    return element;
  }
  function labeledControl(key, label, control) {
    const wrapper = node('div', 'md-ai-brief-field');
    const caption = node('label', '', label);
    control.id = idPrefix + key;
    caption.htmlFor = control.id;
    // The assistant is displayed inside the planner but its controls do not participate in submission.
    control.setAttribute('form', idPrefix + 'unassociated');
    wrapper.append(caption, control);
    return wrapper;
  }
  function addOption(select, value, label) {
    const option = node('option', '', label);
    option.value = value;
    select.append(option);
  }
  function announce(element, message) {
    if (element.textContent !== message) element.textContent = message;
  }
  function dispatch(control) {
    for (const type of ['input', 'change']) control.dispatchEvent(new root.Event(type, {bubbles:true}));
  }
  function transfer(form, values) {
    const home = form.id === 'staffingCalculator';
    const clean = workforce.normalize(values);
    const moves = [];
    for (const key of fields) {
      if (!clean[key]) continue;
      const native = home && homeFields[key];
      const control = form.querySelector(native || '[data-wb-key="' + key + '"]');
      const value = native && key === 'area' ? nativeAreas[clean[key]] : clean[key];
      if (!control || control.disabled || (control.options && !Array.from(control.options).some(option => option.value === value))) return false;
      moves.push({control, value});
    }
    if (!moves.length) return false;
    for (const {control, value} of moves) control.value = value;
    for (const {control} of moves) dispatch(control);
    const details = form.querySelector('.wb-details');
    if (details) details.open = true;
    if (!home) workforce.seedContactMessage?.(form);
    return true;
  }

  function panel(form, language, previous) {
    const t = key => copy[key][languages.indexOf(language)];
    const rows = workforce.summary({}, language);
    const label = key => rows.find(row => row.key === key).label;
    const details = node('details', 'md-ai-brief');
    details.dataset.aiBusinessBrief = language;
    details.setAttribute('translate', 'no');
    const intro = node('p', 'md-ai-brief-note', t('intro'));
    intro.id = idPrefix + 'intro';
    const description = node('textarea');
    description.lang = 'vi';
    description.rows = 3;
    description.maxLength = limit;
    description.autocomplete = 'off';
    description.placeholder = t('placeholder');
    description.setAttribute('aria-describedby', intro.id);
    const actions = node('div', 'md-ai-brief-actions');
    const generate = button(t('generate'), true);
    actions.append(generate);
    const status = node('p', 'md-ai-brief-status');
    status.setAttribute('role', 'status');
    let statusKey = '', generatedFor = null;

    const preview = node('fieldset', 'md-ai-brief-preview');
    preview.hidden = true;
    preview.append(node('legend', '', t('preview')));
    const controls = {};
    const grid = node('div', 'md-ai-brief-grid');
    for (const key of fields) {
      const control = node(key === 'count' ? 'input' : 'select');
      if (key === 'count') {
        control.type = 'text';
        control.inputMode = 'numeric';
        control.maxLength = 6;
        control.autocomplete = 'off';
        control.placeholder = t('unknown');
      } else {
        addOption(control, '', t('unknown'));
        for (const value of options[key]) {
          const row = workforce.summary({[key]:value}, language).find(entry => entry.key === key);
          addOption(control, value, row.value);
        }
      }
      controls[key] = control;
      grid.append(labeledControl(key, label(key), control));
    }
    const countError = node('p', 'md-ai-brief-error', t('countError'));
    countError.id = idPrefix + 'count-error';
    countError.hidden = true;
    controls.count.setAttribute('aria-describedby', countError.id);
    const missing = node('p', 'md-ai-brief-note');
    missing.setAttribute('role', 'status');
    const apply = button(t('transfer'), true);
    apply.disabled = true;
    preview.append(grid, countError, missing, node('p', 'md-ai-brief-note', t('hint')), apply);

    function readDraft() {
      return Object.fromEntries(fields.map(key => [key, controls[key].value]));
    }
    function showStatus(key = '') {
      statusKey = key;
      announce(status, key ? t(key) : '');
    }
    function refreshPreview() {
      const values = readDraft();
      const invalidCount = !!values.count && !countValue(values.count);
      countError.hidden = !invalidCount;
      if (invalidCount) controls.count.setAttribute('aria-invalid', 'true');
      else controls.count.removeAttribute('aria-invalid');
      const unknown = fields.filter(key => !values[key] || (key === 'count' && invalidCount));
      announce(missing, unknown.length ? t('missing') + ' · ' + unknown.map(label).join(' · ') : t('ready'));
      apply.disabled = invalidCount || unknown.length === fields.length;
    }
    function showDraft(values) {
      generatedFor = description.value;
      for (const key of fields) controls[key].value = values[key];
      preview.hidden = false;
      refreshPreview();
    }
    function createDraft() {
      if (!description.value.trim()) {
        showStatus('empty');
        description.focus();
        return;
      }
      showDraft(parse(description.value));
      showStatus();
      controls.count.focus();
    }
    function invalidateDraft() {
      if (preview.hidden) return;
      generatedFor = null;
      preview.hidden = true;
      apply.disabled = true;
      showStatus('stale');
    }
    for (const [index, sample] of samples.entries()) {
      const useSample = button(t('sample' + (index + 1)));
      useSample.addEventListener('click', () => { description.value = sample; createDraft(); });
      actions.append(useSample);
    }
    generate.addEventListener('click', createDraft);
    description.addEventListener('input', invalidateDraft);
    for (const event of ['input', 'change']) {
      preview.addEventListener(event, () => { showStatus(); refreshPreview(); });
      details.addEventListener(event, update => update.stopPropagation());
    }
    apply.addEventListener('click', () => {
      if (generatedFor !== description.value) invalidateDraft();
      if (preview.hidden || apply.disabled) return;
      showStatus(transfer(form, readDraft()) ? 'transferred' : 'unavailable');
    });
    const content = node('div', 'md-ai-brief-content');
    content.append(intro, labeledControl('description', t('description'), description), actions, preview, status);
    details.append(node('summary', '', t('title')), content);
    if (previous) {
      details.open = previous.open;
      description.value = previous.description;
      if (previous.draft) showDraft(previous.draft);
      showStatus(previous.status);
    }
    return {element:details, snapshot() {
      const stale = !preview.hidden && generatedFor !== description.value;
      return {
        open:details.open, description:description.value,
        draft:preview.hidden || stale ? null : readDraft(),
        status:stale ? 'stale' : statusKey,
      };
    }};
  }

  function mount() {
    const form = doc.querySelector(formSelector);
    if (!form) { mounted = undefined; return; }
    const extension = form.querySelector('[data-wb-extension]');
    if (!extension) return;
    const current = extension.querySelector(marker);
    const language = locale();
    if (current?.dataset.aiBusinessBrief === language) return;
    // Keep the unfinished draft in this page's memory across a header language change.
    const previous = mounted?.formId === form.id ? mounted.snapshot() : undefined;
    mounted = {...panel(form, language, previous), formId:form.id};
    if (current) current.replaceWith(mounted.element);
    else extension.prepend(mounted.element);
  }
  const observer = new root.MutationObserver(records => {
    const changed = records.some(record => record.type === 'attributes' ? record.target === doc.documentElement :
      [...record.addedNodes, ...record.removedNodes].some(element => element.matches?.(mountSelector) || element.querySelector?.(mountSelector)));
    if (changed) mount();
  });
  observer.observe(doc.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['lang']});
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount, {once:true});
  mount();
})(typeof window === 'undefined' ? globalThis : window);
