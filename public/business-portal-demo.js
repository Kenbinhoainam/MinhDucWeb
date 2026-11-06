(function (root) {
  'use strict';

  const STORAGE_KEY = 'md-business-portal-demo:v1';
  const MAX_REQUESTS = 25;
  const MAX_COUNT = 500;
  const ORGS = Object.freeze({ lotus: 'Lotus Works', bamboo: 'Bamboo Hub' });
  const OPTIONS = Object.freeze({
    sector: Object.freeze(['manufacturing', 'logistics', 'services']),
    location: Object.freeze(['north', 'central', 'south']),
    shift: Object.freeze(['day', 'night', 'rotating'])
  });
  const ID = /^MD-[0-9A-F]{16}$/;
  const DAY = 86400000;

  function validDate(value) {
    if (typeof value !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
  }

  function normalizeDemand(value, today) {
    if (!value || typeof value !== 'object') return null;
    const { sector, location, shift, count, startWindow } = value;
    if (!OPTIONS.sector.includes(sector) || !OPTIONS.location.includes(location) || !OPTIONS.shift.includes(shift)) return null;
    const headcount = typeof count === 'string' && /^\d{1,3}$/.test(count) ? Number(count) : count;
    if (!Number.isInteger(headcount) || headcount < 1 || headcount > MAX_COUNT) return null;
    const { from, to } = startWindow || {};
    if (!validDate(from) || !validDate(to) || from > to || Date.parse(to) - Date.parse(from) > 90 * DAY) return null;
    if (today !== undefined && (!validDate(today) || from < today || Date.parse(to) - Date.parse(today) > 365 * DAY)) return null;
    return { sector, location, shift, count: headcount, startWindow: { from, to } };
  }

  function normalizeRequest(value) {
    if (!value || typeof value.org !== 'string' || !Object.hasOwn(ORGS, value.org) ||
        typeof value.id !== 'string' || !ID.test(value.id) || !validDate(value.createdOn)) return null;
    const demand = normalizeDemand(value, value.createdOn);
    return demand && { id: value.id, org: value.org, ...demand, createdOn: value.createdOn };
  }

  function cleanRows(rows) {
    const seen = new Set();
    const counts = { lotus: 0, bamboo: 0 };
    return rows.flatMap(value => {
      const row = normalizeRequest(value);
      if (!row || seen.has(row.id) || counts[row.org] >= MAX_REQUESTS) return [];
      seen.add(row.id);
      counts[row.org]++;
      return [row];
    });
  }

  function decode(raw) {
    if (raw === null) return { rows: [], issue: null };
    try {
      const data = typeof raw === 'string' && raw.length <= 100000 && JSON.parse(raw);
      if (data?.version === 1 && Array.isArray(data.requests)) {
        const rows = cleanRows(data.requests);
        const issue = rows.length === data.requests.length ? null : 'corrupt';
        return { rows, issue };
      }
    } catch { /* An invalid demo payload is safe to replace. */ }
    return { rows: [], issue: 'corrupt' };
  }

  function createStore(getStorage) {
    let lastRead = [];
    let pending = [];
    const resetIds = new Set();

    function read() {
      let storage;
      let issue;
      try {
        storage = getStorage();
        ({ rows: lastRead, issue } = decode(storage.getItem(STORAGE_KEY)));
      } catch {
        storage = null;
        issue = 'unavailable';
      }
      const rows = cleanRows([...pending, ...lastRead.filter(row => !resetIds.has(row.id))]);
      return { rows, storage, issue };
    }

    function write(storage, rows) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, requests: rows }));
        lastRead = rows;
        pending = [];
        resetIds.clear();
        return true;
      } catch {
        return false;
      }
    }

    return {
      list(org) {
        const { rows, issue } = read();
        return { requests: rows.filter(row => row.org === org), issue: pending.length || resetIds.size ? 'unavailable' : issue };
      },
      submit(org, id, value, today) {
        const row = normalizeRequest({ ...value, id, org, createdOn: today });
        if (!row) return { error: 'invalid' };
        const { rows, storage } = read();
        const existing = rows.find(request => request.id === id);
        if (existing) {
          if (existing.org !== org) return { error: 'invalid' };
          const persisted = !pending.some(request => request.id === id) || write(storage, rows);
          return { request: existing, persisted };
        }
        if (rows.filter(request => request.org === org).length >= MAX_REQUESTS) return { error: 'full' };
        rows.unshift(row);
        const persisted = write(storage, rows);
        if (!persisted) pending.unshift(row);
        return { request: row, persisted };
      },
      reset(org) {
        if (typeof org !== 'string' || !Object.hasOwn(ORGS, org)) return false;
        const { rows, storage } = read();
        pending = pending.filter(row => row.org !== org);
        const persisted = write(storage, rows.filter(row => row.org !== org));
        if (!persisted) {
          for (const row of rows) if (row.org === org) resetIds.add(row.id);
        }
        return persisted;
      }
    };
  }

  const api = { createStore, normalizeDemand, storageKey: STORAGE_KEY };
  root.MDBusinessPortal = api;
  const doc = root.document;
  if (doc?.body?.dataset.page !== 'services') return;

  const SAMPLES = Object.freeze({
    lotus: {
      id: 'MD-SAMPLE-01', sector: 'manufacturing', location: 'north', shift: 'rotating', count: 48,
      startWindow: { from: '2026-12-07', to: '2026-12-14' },
      history: [['received', '2026-11-02'], ['reviewing', '2026-11-03'], ['planning', '2026-11-05']]
    },
    bamboo: {
      id: 'MD-SAMPLE-02', sector: 'logistics', location: 'south', shift: 'night', count: 24,
      startWindow: { from: '2026-12-01', to: '2026-12-10' },
      history: [['received', '2026-11-04'], ['reviewing', '2026-11-06']]
    }
  });

  const COPY = {
    vi: {
      title: 'Cổng doanh nghiệp thử nghiệm', badge: 'Mô phỏng',
      intro: 'Thử tạo và theo dõi nhu cầu nhân lực bằng công ty giả định. Dữ liệu chỉ dùng trong trình duyệt này.',
      chooseCompany: 'Chọn công ty mẫu', enter: 'Vào cổng thử nghiệm', company: 'Công ty mẫu',
      signOut: 'Thoát phiên mẫu', reset: 'Xóa yêu cầu đã tạo', resetPrompt: 'Xóa tất cả yêu cầu đã tạo của công ty mẫu này trên trình duyệt? Yêu cầu mẫu vẫn được giữ lại.',
      confirmReset: 'Xác nhận xóa', cancel: 'Hủy', cleared: 'Đã xóa các yêu cầu thử nghiệm của công ty này.',
      requests: 'Yêu cầu của công ty', newRequest: 'Tạo nhu cầu nhân lực', sample: 'Yêu cầu mẫu',
      sector: 'Ngành', location: 'Khu vực', shift: 'Ca làm', count: 'Số người', from: 'Ngày bắt đầu sớm nhất', to: 'Ngày bắt đầu muộn nhất',
      manufacturing: 'Sản xuất', logistics: 'Kho vận', services: 'Dịch vụ', north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam',
      day: 'Ca ngày', night: 'Ca đêm', rotating: 'Ca luân phiên', choose: 'Chọn một mục',
      dateHint: 'Chọn khoảng ngày tối đa 90 ngày trong vòng một năm tới.', review: 'Kiểm tra yêu cầu', reviewTitle: 'Kiểm tra trước khi gửi mô phỏng',
      reviewHint: 'Thao tác này lưu một yêu cầu thử nghiệm trong trình duyệt.', edit: 'Sửa yêu cầu', submit: 'Gửi mô phỏng',
      saved: 'Đã lưu yêu cầu thử nghiệm.', temporary: 'Trình duyệt không lưu được thay đổi. Thay đổi chỉ có hiệu lực trong tab này.',
      corrupt: 'Một số dữ liệu lưu trước đó không đọc được. Bạn vẫn có thể tạo yêu cầu thử nghiệm mới.',
      invalid: 'Chọn đủ các mục, nhập từ 1 đến 500 người và kiểm tra khoảng ngày bắt đầu.',
      full: 'Công ty này đã đạt giới hạn 25 yêu cầu thử nghiệm. Xóa yêu cầu đã tạo để tiếp tục.',
      details: 'Chi tiết yêu cầu', back: 'Về danh sách', history: 'Tiến trình mô phỏng',
      received: 'Đã ghi nhận', reviewing: 'Đang rà soát', planning: 'Đang lập phương án'
    },
    en: {
      title: 'Business portal demo', badge: 'Simulation',
      intro: 'Create and track staffing requests with a fictional company. The demo uses this browser only.',
      chooseCompany: 'Choose a sample company', enter: 'Enter the demo portal', company: 'Sample company',
      signOut: 'End demo session', reset: 'Clear created requests', resetPrompt: 'Clear all requests created for this sample company in this browser? The sample request will stay.',
      confirmReset: 'Confirm clear', cancel: 'Cancel', cleared: 'This company’s demo requests were cleared.',
      requests: 'Company requests', newRequest: 'Create staffing request', sample: 'Sample request',
      sector: 'Sector', location: 'Region', shift: 'Shift', count: 'Headcount', from: 'Earliest start date', to: 'Latest start date',
      manufacturing: 'Manufacturing', logistics: 'Logistics', services: 'Services', north: 'Northern Vietnam', central: 'Central Vietnam', south: 'Southern Vietnam',
      day: 'Day shift', night: 'Night shift', rotating: 'Rotating shifts', choose: 'Select an option',
      dateHint: 'Choose a start window of up to 90 days within the next year.', review: 'Review request', reviewTitle: 'Review before simulated submission',
      reviewHint: 'Submitting saves a demo request in this browser.', edit: 'Edit request', submit: 'Simulate submission',
      saved: 'Demo request saved.', temporary: 'The browser could not save your changes. Changes apply only in this tab.',
      corrupt: 'Some saved data could not be read. You can still create new demo requests.',
      invalid: 'Select all options, enter a headcount from 1 to 500, and check the start window.',
      full: 'This company has reached its limit of 25 demo requests. Clear created requests to continue.',
      details: 'Request details', back: 'Back to requests', history: 'Simulated status timeline',
      received: 'Received', reviewing: 'Under review', planning: 'Planning'
    },
    zh: {
      title: '企业门户演示', badge: '模拟',
      intro: '以虚构企业的身份创建和跟踪用工需求。演示数据仅在此浏览器中使用。',
      chooseCompany: '选择示例企业', enter: '进入演示门户', company: '示例企业',
      signOut: '结束演示会话', reset: '清除已创建的需求', resetPrompt: '清除此浏览器中为该示例企业创建的所有需求？示例需求将保留。',
      confirmReset: '确认清除', cancel: '取消', cleared: '该企业的演示需求已清除。',
      requests: '企业需求', newRequest: '创建用工需求', sample: '示例需求',
      sector: '行业', location: '地区', shift: '班次', count: '人数', from: '最早开始日期', to: '最晚开始日期',
      manufacturing: '制造业', logistics: '物流', services: '服务业', north: '越南北部', central: '越南中部', south: '越南南部',
      day: '白班', night: '夜班', rotating: '轮班', choose: '请选择',
      dateHint: '请选择未来一年内不超过 90 天的开始日期范围。', review: '核对需求', reviewTitle: '模拟提交前核对',
      reviewHint: '提交后，演示需求将保存在此浏览器中。', edit: '编辑需求', submit: '模拟提交',
      saved: '演示需求已保存。', temporary: '浏览器无法保存更改。更改仅在此标签页中有效。',
      corrupt: '部分已保存的数据无法读取。您仍可创建新的演示需求。',
      invalid: '请选择所有选项，填写 1 至 500 人，并检查开始日期范围。',
      full: '该企业已达到 25 条演示需求的上限。请清除已创建的需求后继续。',
      details: '需求详情', back: '返回需求列表', history: '模拟状态时间线',
      received: '已收到', reviewing: '审核中', planning: '方案规划中'
    },
    ko: {
      title: '기업 포털 데모', badge: '시뮬레이션',
      intro: '가상 기업으로 인력 요청을 만들고 진행 상태를 확인할 수 있습니다. 데모 데이터는 이 브라우저에서만 사용됩니다.',
      chooseCompany: '예시 기업 선택', enter: '데모 포털 입장', company: '예시 기업',
      signOut: '데모 세션 종료', reset: '생성한 요청 삭제', resetPrompt: '이 브라우저에서 해당 예시 기업이 생성한 요청을 모두 삭제할까요? 예시 요청은 유지됩니다.',
      confirmReset: '삭제 확인', cancel: '취소', cleared: '이 기업의 데모 요청을 삭제했습니다.',
      requests: '기업 요청', newRequest: '인력 요청 만들기', sample: '예시 요청',
      sector: '업종', location: '지역', shift: '근무조', count: '필요 인원', from: '가장 이른 시작일', to: '가장 늦은 시작일',
      manufacturing: '제조', logistics: '물류', services: '서비스', north: '베트남 북부', central: '베트남 중부', south: '베트남 남부',
      day: '주간 근무', night: '야간 근무', rotating: '순환 근무', choose: '항목을 선택하세요',
      dateHint: '앞으로 1년 안에서 최대 90일 이내의 시작 기간을 선택하세요.', review: '요청 검토', reviewTitle: '모의 제출 전 검토',
      reviewHint: '제출하면 데모 요청이 이 브라우저에 저장됩니다.', edit: '요청 수정', submit: '모의 제출',
      saved: '데모 요청을 저장했습니다.', temporary: '브라우저가 변경사항을 저장하지 못했습니다. 변경사항은 이 탭에서만 적용됩니다.',
      corrupt: '저장된 데이터 일부를 읽을 수 없습니다. 새 데모 요청은 만들 수 있습니다.',
      invalid: '모든 항목을 선택하고, 1~500명의 인원을 입력한 뒤 시작 기간을 확인하세요.',
      full: '이 기업의 데모 요청이 25건에 도달했습니다. 생성한 요청을 삭제한 뒤 계속하세요.',
      details: '요청 세부 정보', back: '요청 목록으로', history: '모의 상태 타임라인',
      received: '접수 완료', reviewing: '검토 중', planning: '계획 수립 중'
    }
  };

  const store = createStore(() => root.localStorage);
  const fields = ['sector', 'location', 'shift', 'count', 'from', 'to'];
  let panel;
  let summary;
  let content;
  let language;
  let company = '';
  let selection = '';
  let screen = 'list';
  let draft = {};
  let reviewed;
  let activeId;
  let confirmingReset = false;
  let message = '';
  let error = '';

  function t(key) { return COPY[language][key]; }

  function dateKey(value) { return new Date(value).toISOString().slice(0, 10); }

  function today() {
    const now = new Date();
    return dateKey(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  function displayDate(value) {
    return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : language, {
      dateStyle: 'medium', timeZone: 'UTC'
    }).format(new Date(value));
  }

  function newId() {
    const bytes = root.crypto.getRandomValues(new Uint8Array(8));
    return 'MD-' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function node(tag, text, className) {
    const element = doc.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function action(label, activate, primary = false) {
    const element = node('button', label, primary ? 'md-bp-primary' : '');
    element.type = activate ? 'button' : 'submit';
    if (activate) element.addEventListener('click', activate);
    return element;
  }

  function actions(...buttons) {
    const row = node('div', undefined, 'md-bp-actions');
    row.append(...buttons);
    return row;
  }

  function heading(label) {
    const element = node('h3', label);
    element.tabIndex = -1;
    return element;
  }

  function field(label, control) {
    const wrapper = node('label', undefined, 'md-bp-field');
    wrapper.append(node('span', label), control);
    control.required = true;
    return wrapper;
  }

  function select(options, value) {
    const control = node('select');
    for (const [key, label] of [['', t('choose')], ...options]) {
      const option = node('option', label);
      option.value = key;
      control.append(option);
    }
    control.value = value || '';
    return control;
  }

  function status(text, urgent = false) {
    const element = node('p', text, urgent ? 'md-bp-warning' : 'md-bp-note');
    element.setAttribute('role', urgent ? 'alert' : 'status');
    return element;
  }

  function form(submit) {
    const element = node('form');
    element.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      submit();
    });
    return element;
  }

  function resetScreen() {
    screen = 'list';
    draft = {};
    reviewed = null;
    activeId = null;
    confirmingReset = false;
    message = '';
    error = '';
  }

  function signIn() {
    const control = select(Object.entries(ORGS), selection);
    control.addEventListener('change', () => { selection = control.value; });
    const login = form(() => {
      if (company || !Object.hasOwn(ORGS, control.value)) return;
      selection = company = control.value;
      render('heading');
    });
    login.append(field(t('chooseCompany'), control), actions(action(t('enter'), null, true)));
    content.append(login);
  }

  function list(requests) {
    content.append(heading(t('requests')));
    const items = node('ul', undefined, 'md-bp-list');
    for (const request of requests) {
      const item = node('li');
      const info = node('div');
      info.append(node('strong', request.id), node('p', `${t(request.sector)} · ${t(request.history.at(-1)[0])}`));
      if (request.id === SAMPLES[company].id) info.append(node('p', t('sample'), 'md-bp-note'));
      const details = action(t('details'), () => {
        message = '';
        activeId = request.id;
        screen = 'details';
        render('heading');
      });
      details.setAttribute('aria-label', `${t('details')} · ${request.id}`);
      item.append(info, details);
      items.append(item);
    }
    content.append(items, actions(action(t('newRequest'), () => {
      resetScreen();
      screen = 'edit';
      render('heading');
    }, true)));
    if (!confirmingReset) {
      if (requests.length > 1) content.append(actions(action(t('reset'), () => {
        confirmingReset = true;
        message = '';
        render('reset');
      })));
      return;
    }

    const confirmation = node('div', undefined, 'md-bp-confirm');
    const prompt = node('p', t('resetPrompt'));
    prompt.tabIndex = -1;
    confirmation.append(prompt, actions(action(t('cancel'), () => {
      confirmingReset = false;
      render('lastButton');
    }), action(t('confirmReset'), () => {
      if (!confirmingReset || !company) return;
      const persisted = store.reset(company);
      resetScreen();
      message = persisted ? 'cleared' : 'temporary';
      render('heading');
    })));
    content.append(confirmation);
  }

  function demandSummary(request) {
    const values = {
      sector: t(request.sector), location: t(request.location), shift: t(request.shift), count: request.count,
      from: displayDate(request.startWindow.from), to: displayDate(request.startWindow.to)
    };
    const list = node('dl', undefined, 'md-bp-grid');
    for (const key of fields) {
      const item = node('div');
      item.append(node('dt', t(key)), node('dd', String(values[key])));
      list.append(item);
    }
    return list;
  }

  function toList() {
    resetScreen();
    render('heading');
  }

  function edit() {
    content.append(heading(t('newRequest')));
    const dateHint = node('p', t('dateHint'), 'md-bp-note');
    dateHint.id = 'md-bp-date-hint';
    const grid = node('div', undefined, 'md-bp-grid');
    const controls = {};
    const minimum = today();
    const maximum = dateKey(Math.min(Date.parse(minimum) + 365 * DAY, Date.parse('2099-12-31')));
    for (const key of fields) {
      const control = Object.hasOwn(OPTIONS, key)
        ? select(OPTIONS[key].map(value => [value, t(value)]), draft[key]) : node('input');
      if (key === 'count') {
        control.type = 'number';
        control.inputMode = 'numeric';
        control.min = '1';
        control.max = String(MAX_COUNT);
        control.step = '1';
      }
      if (key === 'from' || key === 'to') {
        control.type = 'date';
        control.min = minimum;
        control.max = maximum;
        control.setAttribute('aria-describedby', dateHint.id);
      }
      if (control.tagName === 'INPUT') control.value = draft[key] || '';
      control.autocomplete = 'off';
      for (const event of ['input', 'change']) control.addEventListener(event, () => { draft[key] = control.value; });
      controls[key] = control;
      grid.append(field(t(key), control));
    }
    const editor = form(() => {
      if (screen !== 'edit' || !company) return;
      draft = Object.fromEntries(fields.map(key => [key, controls[key].value]));
      const normalized = normalizeDemand({ ...draft, startWindow: { from: draft.from, to: draft.to } }, today());
      if (!normalized) {
        error = 'invalid';
        render('error');
        return;
      }
      reviewed = { ...normalized, id: newId() };
      error = '';
      screen = 'review';
      render('heading');
    });
    editor.noValidate = true;
    editor.append(grid, dateHint, actions(action(t('back'), toList), action(t('review'), null, true)));
    content.append(editor);
  }

  function review() {
    const request = reviewed;
    const submit = action(t('submit'), () => {
      if (screen !== 'review' || reviewed !== request || !company) return;
      const result = store.submit(company, request.id, request, today());
      if (result.error) {
        error = result.error;
        render('error');
        return;
      }
      resetScreen();
      activeId = result.request.id;
      screen = 'details';
      message = result.persisted ? 'saved' : 'temporary';
      render('heading');
    }, true);
    content.append(heading(t('reviewTitle')), demandSummary(request), node('p', t('reviewHint'), 'md-bp-note'), actions(
      action(t('edit'), () => {
        reviewed = null;
        screen = 'edit';
        error = '';
        render('heading');
      }), submit
    ));
  }

  function details(request) {
    const timeline = node('ol', undefined, 'md-bp-timeline');
    for (const [stage, date] of request.history) {
      const item = node('li');
      const time = node('time', displayDate(date));
      time.dateTime = date;
      item.append(node('strong', t(stage)), time);
      timeline.append(item);
    }
    content.append(heading(t('details')), node('p', request.id, 'md-bp-id'), demandSummary(request),
      node('h4', t('history')), timeline, actions(action(t('back'), toList)));
  }

  function render(focus) {
    language = doc.documentElement.lang.split('-')[0];
    if (!Object.hasOwn(COPY, language)) language = 'vi';
    summary.replaceChildren(node('span', t('title')), node('span', t('badge'), 'md-bp-badge'));
    content.replaceChildren(node('p', t('intro'), 'md-bp-intro'));
    if (!company) {
      signIn();
      if (focus) content.querySelector('select').focus();
      return;
    }

    const session = node('div', undefined, 'md-bp-session');
    const name = node('p', `${t('company')} · ${ORGS[company]}`);
    session.append(name, action(t('signOut'), () => {
      company = selection = '';
      resetScreen();
      render('select');
    }));
    content.append(session);
    const { requests, issue } = store.list(company);
    const rows = [...requests.map(row => ({ ...row, history: [['received', row.createdOn]] })), SAMPLES[company]];
    if (message) content.append(status(t(message)));
    if (issue && message !== 'temporary') content.append(status(t(issue === 'unavailable' ? 'temporary' : issue)));
    let errorNote;
    if (error) {
      errorNote = status(t(error), true);
      errorNote.tabIndex = -1;
      content.append(errorNote);
    }
    if (screen === 'details') {
      const request = rows.find(row => row.id === activeId);
      if (request) details(request);
      else { screen = 'list'; list(rows); }
    } else if (screen === 'edit') edit();
    else if (screen === 'review') review();
    else list(rows);
    if (focus === 'heading') content.querySelector('h3')?.focus();
    if (focus === 'error') errorNote?.focus();
    if (focus === 'reset') content.querySelector('.md-bp-confirm p')?.focus();
    if (focus === 'lastButton') Array.from(content.querySelectorAll('button')).at(-1)?.focus();
  }

  function openFromLink() {
    if (panel?.isConnected && root.location.hash === '#md-business-portal') {
      panel.open = true;
      panel.scrollIntoView({ block: 'start' });
    }
  }

  function mount() {
    const main = doc.querySelector('body[data-page="services"] main');
    if (!main) return;
    if (panel?.parentElement !== main) {
      const open = panel?.open || false;
      const firstMount = !panel;
      panel = node('details', undefined, 'container md-bp');
      panel.id = 'md-business-portal';
      panel.open = open;
      summary = node('summary');
      content = node('div', undefined, 'md-bp-content');
      panel.append(summary, content);
      main.append(panel);
      render();
      if (firstMount) openFromLink();
    } else {
      const next = doc.documentElement.lang.split('-')[0];
      if ((Object.hasOwn(COPY, next) ? next : 'vi') !== language) render();
    }
  }

  const observer = new root.MutationObserver(mount);
  observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['lang'] });
  root.addEventListener('hashchange', openFromLink);
  root.addEventListener('storage', event => {
    if ((event.key === STORAGE_KEY || event.key === null) && company && panel?.isConnected && ['list', 'details'].includes(screen)) render();
  });
  mount();
})(typeof window === 'undefined' ? globalThis : window);
