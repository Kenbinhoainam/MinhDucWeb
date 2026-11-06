/* Standalone V26 enhancement. Load after site-runtime.js; no requests or stored contact data. */
(function (root) {
  'use strict';
  if (root.MDWorkforceBrief) return;
  const languages = ['vi', 'en', 'zh', 'ko'];
  const keys = ['industry', 'size', 'area', 'start', 'shift', 'count'];
  const params = {industry:'wb_i', size:'wb_s', area:'wb_a', start:'wb_t', shift:'wb_h', count:'wb_n'};
  const choices = {
    industry: ['electronic', 'mechanical', 'warehouse', 'other'],
    size: ['small', 'medium', 'large', 'xlarge'],
    area: ['bn', 'bg', 'hn'],
    start: ['two-weeks', 'month', 'later'],
    shift: ['day', 'night', 'rotating'],
  };
  const areas = {bn:'Bắc Ninh', bg:'Bắc Giang', hn:'Hà Nội'};
  const services = ['supply', 'recruitment', 'factory', 'consulting'];
  const copy = {
    draftPreview:['Xem nội dung trao đổi đã phác thảo','View the drafted message','查看自动草拟的沟通内容','작성된 문의 내용 보기'],
    reviewHint:['Số người là tổng cộng. Thời điểm là mong muốn, chưa phải cam kết cung ứng.','Headcount is a total. The start is requested, not a delivery commitment.','人数为总数。开始时间为期望，并非供工承诺。','인원은 총원입니다. 시작 시점은 희망 일정이며 공급 약속이 아닙니다.'],
    optional: ['Thêm chi tiết kế hoạch (không bắt buộc)', 'Add planning details (optional)', '补充计划信息（选填）', '계획 정보 추가 (선택)'],
    edit: ['Sửa chi tiết kế hoạch (không bắt buộc)', 'Edit planning details (optional)', '编辑计划信息（选填）', '계획 정보 수정 (선택)'],
    unknown: ['Chưa xác định', 'Undecided', '尚未确定', '미정'],
    industry: ['Ngành hoạt động', 'Industry', '所属行业', '업종'],
    size: ['Quy mô dự kiến', 'Planned headcount band', '预计人数范围', '예상 인원 범위'],
    area: ['Khu vực', 'Region', '地区', '지역'],
    start: ['Thời điểm mong muốn bắt đầu', 'Requested start', '期望开始时间', '희망 시작 시점'],
    shift: ['Ca làm dự kiến', 'Planned shift', '预计班次', '예상 교대'],
    count: ['Số người chính xác · tổng cộng', 'Exact headcount · total', '准确人数 · 总计', '정확한 인원 · 총원'],
    countHint: ['Không bắt buộc. Tổng số người cần cho tất cả cơ sở và ca làm, không phải số người mỗi ca. Số chính xác tự cập nhật nhóm quy mô. Để trống nếu chưa rõ.', 'Optional. Total people requested across all sites and shifts, not people per shift. An exact count updates the headcount band. Leave blank if undecided.', '选填。为所有工作地点和班次所需的总人数，并非每班人数。准确人数会自动更新人数范围。不确定可留空。', '선택 사항입니다. 교대별 인원이 아닌 모든 사업장과 교대의 총 필요 인원입니다. 정확한 인원을 입력하면 인원 범위가 자동으로 갱신됩니다. 미정이면 비워 두세요.'],
    startHint: ['Đây là thời điểm bạn mong muốn, không phải cam kết thời gian cung ứng.', 'This is your requested start, not a promised delivery lead time.', '这是您的期望开始时间，并非承诺的供给周期。', '희망 시작 시점이며 인력 공급 기간에 대한 약속이 아닙니다.'],
    note: ['Có thể để các chi tiết ở trạng thái chưa xác định. Chỉ chọn thông tin mẫu, không nhập dữ liệu riêng tư.', 'Details can remain undecided. Use sample planning details only; do not enter private data.', '信息可以暂不确定。请仅使用示例计划信息，不要输入隐私数据。', '정보를 미정으로 남겨도 됩니다. 예시 계획 정보만 사용하고 개인정보는 입력하지 마세요.'],
    seeded: ['Nội dung nháp theo kế hoạch sẽ tự cập nhật cho đến khi bạn tự sửa lời nhắn.', 'The draft follows your plan until you edit the message yourself.', '在您自行修改沟通内容之前，草稿会随计划更新。', '문의 내용을 직접 수정하기 전까지 초안은 계획에 따라 업데이트됩니다.'],
    error: ['Nhập tổng số người nguyên từ 1 đến 999999, hoặc để trống nếu chưa xác định.', 'Enter a whole total from 1 to 999999, or leave blank if undecided.', '请输入 1 至 999999 的整数总人数，不确定可留空。', '총원을 1~999999 사이의 정수로 입력하거나 미정이면 비워 두세요.'],
    invalid: ['Một số chi tiết từ liên kết không hợp lệ đã được bỏ qua. Kiểm tra lại hoặc để chưa xác định.', 'Some invalid link details were ignored. Review the brief or leave them undecided.', '已忽略链接中的部分无效信息。请核对或保留为尚未确定。', '링크의 일부 유효하지 않은 정보를 제외했습니다. 확인하거나 미정으로 남겨 두세요.'],
    review: ['Tóm tắt kế hoạch nhân lực', 'Workforce planning summary', '用工计划概要', '인력 계획 요약'],
    revise: ['Sửa kế hoạch', 'Edit brief', '修改计划', '계획 수정'],
    next: ['Bước tiếp theo: kiểm tra điều kiện công việc, cơ sở/ca làm và người duyệt với đầu mối được doanh nghiệp xác nhận. Bản thử chưa gửi yêu cầu và không cam kết lịch cung ứng.', 'Next: confirm job conditions, sites/shifts and the approver with a company-verified contact. This prototype has not sent a request and promises no delivery date.', '下一步：与经企业确认的联系人核对工作条件、地点/班次及审批人。本演示未发送请求，也不承诺供给日期。', '다음 단계: 기업이 확인한 담당자와 근무 조건, 사업장·교대 및 승인자를 확인하세요. 이 시제품은 요청을 전송하지 않았으며 공급 날짜를 약속하지 않습니다.'],
    electronic: ['Điện tử / lắp ráp', 'Electronics / assembly', '电子 / 装配', '전자 / 조립'],
    mechanical: ['Cơ khí / chế tạo', 'Engineering / manufacturing', '机械 / 制造', '기계 / 제조'],
    warehouse: ['Kho vận / logistics', 'Warehousing / logistics', '仓储 / 物流', '창고 / 물류'],
    other: ['Ngành khác', 'Other industry', '其他行业', '기타 업종'],
    small: ['Dưới 50 người', 'Under 50 people', '少于50人', '50명 미만'],
    medium: ['50–150 người', '50–150 people', '50–150人', '50~150명'],
    large: ['151–350 người', '151–350 people', '151–350人', '151~350명'],
    xlarge: ['Trên 350 người', 'Over 350 people', '超过350人', '350명 초과'],
    'two-weeks': ['Trong 2 tuần tới', 'Within the next 2 weeks', '未来两周内', '향후 2주 이내'],
    month: ['Trong tháng tới', 'Within the next month', '未来一个月内', '향후 한 달 이내'],
    later: ['Muộn hơn / đang lên kế hoạch', 'Later / planning ahead', '更晚 / 规划中', '그 이후 / 계획 중'],
    day: ['Ca ngày', 'Day shift', '白班', '주간'],
    night: ['Ca đêm', 'Night shift', '夜班', '야간'],
    rotating: ['Luân phiên / nhiều ca', 'Rotating / multiple shifts', '轮班 / 多班次', '순환 / 여러 교대'],
  };
  const locale = value => {const short=String(value||'').split('-')[0];return languages.includes(short)?short:'vi';};
  const text = (key, lang) => copy[key]?.[languages.indexOf(locale(lang))] || areas[key] || key;
  const countValid = value => typeof value === 'string' && (value === '' || (/^\d{1,6}$/.test(value) && Number(value) > 0));
  function normalize(source = {}) {
    const result = {};
    for (const key of keys) {
      const value = typeof source?.[key] === 'string' ? source[key] : '';
      result[key] = key === 'count' ? (countValid(value) && value ? String(Number(value)) : '') : (choices[key].includes(value) ? value : '');
    }
    if (result.count) { const total = Number(result.count); result.size = total < 50 ? 'small' : total <= 150 ? 'medium' : total <= 350 ? 'large' : 'xlarge'; }
    return result;
  }
  function readContext(href) {
    let url;
    try { url = new URL(href, 'https://minh-duc.invalid/'); } catch { return {values:normalize(), present:false, invalid:true, service:''}; }
    const query = url.searchParams, present = query.has('wb'), raw = {};
    const envelopeValid = present && query.getAll('wb').length === 1 && query.get('wb') === '1';
    let invalid = present && !envelopeValid;
    for (const key of keys) {
      const values = query.getAll(params[key]);
      const value = values.length === 1 && values[0].length <= 32 ? values[0] : '';
      raw[key] = envelopeValid ? value : '';
      if (present && (values.length > 1 || (values.length === 1 && (values[0].length > 32 || (key === 'count' ? !countValid(value) : value !== '' && !choices[key].includes(value)))))) invalid = true;
    }
    // A malformed individual field does not discard other, valid planning fields.
    if (query.getAll('wb').length !== 1 || query.get('wb') !== '1') for (const key of keys) raw[key] = '';
    const service = query.getAll('service').length === 1 && services.includes(query.get('service')) ? query.get('service') : '';
    return {values:normalize(raw), present, invalid, service};
  }
  function contactHref(values, lang = 'vi', service = '') {
    const query = new URLSearchParams({wb:'1', lang:locale(lang)}), clean = normalize(values);
    for (const key of keys) if (clean[key]) query.set(params[key], clean[key]);
    if (services.includes(service)) query.set('service', service);
    return 'lien-he.html?' + query.toString();
  }
  function summary(values, lang = 'vi') {
    const clean = normalize(values);
    return keys.map(key => ({key, label:text(key, lang), value:clean[key] ? (key === 'count' ? clean[key] : text(clean[key], lang)) : text('unknown', lang)}));
  }
  const api = {normalize, readContext, contactHref, summary};
  root.MDWorkforceBrief = api;
  const doc = root.document;
  if (!doc?.querySelector || !root.MutationObserver) return;
  let memory = null, invalidCount = false, contactSeen = false, contactInitialized = false, messageSeeded = false, seededMessage = '', messageEdited = false;
  const lang = () => locale(doc.documentElement.lang);
  const node = (tag, className, content) => { const el = doc.createElement(tag); if (className) el.className = className; if (content !== undefined) el.textContent = content; return el; };
  function option(value, label) { const el = node('option', '', label); el.value = value; return el; }
  function field(key) {
    const wrapper = node('div', 'field wb-field'), id = 'wb-' + key;
    const label = node('label', '', text(key, lang())); label.htmlFor = id;
    const control = node(key === 'count' ? 'input' : 'select');
    control.id = id; control.name = 'wb_' + key; control.dataset.wbKey = key;
    if (key === 'count') {
      // Text + inputmode preserves invalid input for an explicit, accessible error instead of coercing it to empty.
      control.type = 'text'; control.inputMode = 'numeric'; control.maxLength = 6; control.autocomplete = 'off'; control.placeholder = text('unknown', lang());
    } else {
      control.append(option('', text('unknown', lang())));
      for (const value of choices[key]) control.append(option(value, text(value, lang())));
    }
    control.value = memory[key]; wrapper.append(label, control);
    if (key === 'count' || key === 'start') {
      const hint = node('small', 'wb-hint', text(key + 'Hint', lang())); hint.id = id + '-hint';
      control.setAttribute('aria-describedby', hint.id); wrapper.append(hint);
    }
    if (key === 'count') { const error = node('p', 'wb-error', text('error', lang())); error.id = 'wb-count-error'; error.hidden = true; error.setAttribute('role', 'alert'); wrapper.append(error); }
    return wrapper;
  }
  function nativeValues(form) {
    return {
      industry:form.querySelector('#staffIndustry')?.value || '', size:form.querySelector('#staffSize')?.value || '',
      area:Object.keys(areas).find(key => areas[key] === form.querySelector('#staffArea')?.value) || '',
    };
  }
  function restoreNative(form) {
    for (const [key, id] of [['industry','staffIndustry'], ['size','staffSize'], ['area','staffArea']]) {
      const select = form.querySelector('#' + id); if (!select) continue;
      if (!Array.from(select.options).some(item => item.value === '')) select.prepend(option('', text('unknown', lang())));
      if (key === 'size') { const large = Array.from(select.options).find(item => item.value === 'large'); if (large && large.textContent !== text('large', lang())) large.textContent = text('large', lang()); }
      select.value = key === 'area' ? areas[memory.area] || '' : memory[key];
    }
  }
  function collect(form) {
    const next = {...memory, ...(form.id === 'staffingCalculator' ? nativeValues(form) : {})};
    for (const control of form.querySelectorAll('[data-wb-key]')) {
      const key = control.dataset.wbKey;
      if (key === 'count') invalidCount = !countValid(control.value);
      next[key] = control.value;
    }
    // Only allowlisted enums and canonical numeric counts survive a locale rerender.
    memory = normalize(next);
    if (form.id === 'staffingCalculator') restoreNative(form);
    else { const size = form.querySelector('[data-wb-key="size"]'); if (size) size.value = memory.size;
      const message=form.querySelector('[name="message"]');
      if(messageSeeded&&!messageEdited&&message?.value===seededMessage){const generated=summary(memory,lang()).map(row=>row.label+': '+row.value).join('\n').slice(0,1500);if(message.value!==generated){message.value=generated;seededMessage=generated;const count=form.querySelector('#briefCharCount');if(count)count.textContent=String(generated.length);}}
    }
  }
  function validate(form, focus = false) {
    const control = form.querySelector('[data-wb-key="count"]');
    if (!control) return true;
    const valid = countValid(control.value) && !invalidCount, error = form.querySelector('#wb-count-error');
    if (error) error.hidden = valid;
    if (valid) control.removeAttribute('aria-invalid'); else control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', 'wb-count-hint' + (valid ? '' : ' wb-count-error'));
    if (!valid && focus) { const details = control.closest('details'); if (details) details.open = true; control.focus(); }
    return valid;
  }
  function updateHome(form) {
    const link = form.querySelector('#staffingCta'), heading = form.querySelector('#staffingSummary');
    if (link) link.setAttribute('href', contactHref(memory, lang(), readContext(root.location?.href).service));
    const content = summary(memory, lang()).map(row => row.label + ': ' + row.value).join(' · ');
    if (heading && heading.textContent !== content) heading.textContent = content;
  }
  function reviewNode(editable) {
    const section = node('section', 'wb-review'); section.dataset.wbReview = '';
    section.append(node('h3', '', text('review', lang())));
    const list = node('dl', 'wb-summary');
    for (const row of summary(memory, lang())) { const pair = node('div'); pair.append(node('dt', '', row.label), node('dd', '', row.value)); list.append(pair); }
    section.append(list, node('p', 'wb-hint', text('reviewHint', lang())));
    if (editable) { const edit = node('button', 'btn light wb-edit', text('revise', lang())); edit.type = 'button'; edit.dataset.wbEdit = ''; section.append(edit); }
    return section;
  }
  function updateReview(form) {
    const review = form.querySelector('#contactReview'); if (!review) return;
    const signature = JSON.stringify([lang(), memory]);
    const old = review.querySelector('[data-wb-review]');
    if (old?.dataset.wbSignature === signature) return;
    const section = reviewNode(true); section.dataset.wbSignature = signature;
    // Keep the visitor's message intact; only the untouched generated draft is collapsed.
    if (old) old.replaceWith(section); else {
      const content=review.textContent.trim();review.textContent='';review.append(section);
      if(content){const message=node('p','wb-message',content);if(messageSeeded&&!messageEdited&&content===seededMessage.trim()){const details=node('details','wb-draft-preview');details.append(node('summary','',text('draftPreview',lang())),message);review.append(details);}else review.append(message);}
    }
  }
  function mountForm(form) {
    const home = form.id === 'staffingCalculator';
    if (!memory) { const context = readContext(root.location?.href); memory = context.present ? context.values : normalize(home ? nativeValues(form) : {}); }
    if (!form.querySelector('[data-wb-extension]')) {
      if (home) restoreNative(form); else contactSeen = true;
      if (!home && !contactInitialized) {
        contactInitialized = true;
        const message = form.querySelector('[name="message"]');
        if (message && !message.value.trim() && readContext(root.location?.href).present && keys.some(key => memory[key])) {
          message.value = summary(memory, lang()).map(row => row.label + ': ' + row.value).join('\n').slice(0, 1500);
          const count = form.querySelector('#briefCharCount'); if (count) count.textContent = String(message.value.length);
          const review = form.querySelector('#contactReview'); if (review) review.textContent = message.value;
          messageSeeded = true;
          seededMessage = message.value;
        }
      }
      const extension = node('div', 'wb-extension wide'); extension.dataset.wbExtension = '';
      const details = node('details', 'wb-details'), heading = node('summary', '', text(home ? 'optional' : 'edit', lang()));
      const fields = node('fieldset', 'wb-fields'); fields.append(node('legend', 'wb-sr-only', text('optional', lang())));
      for (const key of home ? ['start','shift','count'] : keys) fields.append(field(key));
      details.append(heading, fields); extension.append(details, node('p', 'wb-hint', text('note', lang())));
      if (!home && messageSeeded) extension.append(node('p', 'wb-hint', text('seeded', lang())));
      if (readContext(root.location?.href).invalid) extension.append(node('p', 'wb-link-warning', text('invalid', lang())));
      // All new inputs follow every legacy input, even on contact. MDExperience restores by input index.
      form.append(extension);
      if (!home) { const next = form.querySelector('#contactNext'); if (next) extension.append(next); }
      else { const result = form.querySelector('.md-brief-result'); if (result) form.insertBefore(extension, result); }
      if (invalidCount) validate(form);
    }
    if (home) updateHome(form);
    else {
      const extension = form.querySelector('[data-wb-extension]');
      const hidden = !!form.querySelector('[data-contact-step="2"]') && !form.querySelector('[data-contact-step="2"]').hidden;
      if (extension.hidden !== hidden) extension.hidden = hidden;
      updateReview(form);
    }
  }
  function mount() {
    for (const form of doc.querySelectorAll('#staffingCalculator,#contactForm')) mountForm(form);
    if (contactSeen && !doc.querySelector('#contactForm')) {
      const complete = doc.querySelector('.prototype-success');
      if (complete && !complete.querySelector('[data-wb-review]')) complete.append(reviewNode(false), node('p', 'wb-next', text('next', lang())));
    }
  }
  api.mount = mount;
  api.seedContactMessage = form => {
    if (!form?.isConnected || form.id !== 'contactForm' || messageEdited) return false;
    const message = form.querySelector('[name="message"]');
    if (!message || (message.value && (!messageSeeded || message.value !== seededMessage))) return false;
    collect(form);
    if (!keys.some(key => memory[key])) return false;
    messageSeeded = true;
    seededMessage = summary(memory, lang()).map(row => row.label + ': ' + row.value).join('\n').slice(0,1500);
    message.value = seededMessage;
    const count = form.querySelector('#briefCharCount');
    if (count) count.textContent = String(seededMessage.length);
    updateReview(form);
    return true;
  };
  const update = event => {
    const form = event.target.closest?.('#staffingCalculator,#contactForm'); if (!form) return;
    if(form.id==='contactForm'&&event.target.name==='message'){messageEdited=true;return;}
    if (event.target.hasAttribute('data-wb-key') || ['staffIndustry','staffSize','staffArea'].includes(event.target.id)) {
      collect(form); validate(form); if (form.id === 'staffingCalculator') updateHome(form); else updateReview(form);
    }
  };
  // Runtime handlers run first; this refreshes a CTA after the legacy select-summary handler.
  doc.addEventListener('input', update);
  doc.addEventListener('change', update);
  doc.addEventListener('click', event => {
    const trigger = event.target.closest?.('#staffingCta,#contactNext,[data-wb-edit]'); if (!trigger) return;
    const form = trigger.closest('form'); if (!form) return;
    collect(form);
    if (!validate(form, true)) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (trigger.id === 'staffingCta') updateHome(form);
    if (trigger.hasAttribute('data-wb-edit')) {
      form.querySelector('#contactBack')?.click();
      const details = form.querySelector('.wb-details'); if (details) details.open = true;
      // Back changes the legacy fieldsets synchronously; reveal before focusing.
      const extension = form.querySelector('[data-wb-extension]'); if (extension) extension.hidden = false;
      form.querySelector('[data-wb-key]')?.focus();
    }
  }, true);
  // Window capture precedes the runtime's document-capture demo submit. Valid contact submissions
  // remain entirely owned by that adapter; only invalid optional data is blocked here.
  root.addEventListener('submit', event => {
    const form = event.target;
    if (!['staffingCalculator','contactForm'].includes(form.id)) return;
    collect(form);
    const valid = validate(form, true);
    if (form.id === 'staffingCalculator' || !valid) { event.preventDefault(); event.stopImmediatePropagation(); }
    if (form.id === 'staffingCalculator' && valid) { updateHome(form); form.querySelector('#staffingCta')?.focus(); }
  }, true);
  const observer = new root.MutationObserver(mount);
  observer.observe(doc.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['lang','hidden']});
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount, {once:true});
  mount();
})(typeof window === 'undefined' ? globalThis : window);
