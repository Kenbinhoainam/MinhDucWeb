(() => {
  'use strict';

  const ID = 'md-candidate-portal';
  const STORAGE_KEY = 'md_candidate_portal_demo_v1';
  const VERSION = 1;
  const OTP_LIFETIME = 120_000;
  const PREFERENCES = Object.freeze({
    shift: Object.freeze(['any', 'day', 'night', 'rotating']),
    transport: Object.freeze(['any', 'shuttle', 'self']),
  });
  const SAMPLE = Object.freeze(['submitted', 'screening', 'interview']);
  const COPY = {
    vi: {
      title: 'Cổng ứng viên', badge: 'Bản demo', intro: 'Thử lưu việc, đặt ưu tiên và theo dõi hồ sơ bằng tài khoản mẫu. Mã và phiên đăng nhập chỉ chạy trong tab này. Ưu tiên và hồ sơ thử được lưu trong trình duyệt này.',
      privacy: 'Vui lòng chỉ dùng hồ sơ mẫu. Bản demo không gửi mã qua SMS hoặc gửi hồ sơ cho nhà tuyển dụng.',
      persona: 'Ứng viên Mẫu MD-01', signIn: 'Đăng nhập mẫu', request: 'Tạo mã demo', resend: 'Tạo mã mới', code: 'Mã hiển thị trong tab', codeLabel: 'Nhập mã demo 6 chữ số', lifetime: 'Mã có hiệu lực trong 2 phút.', verify: 'Xác nhận mã', logout: 'Đăng xuất',
      wrong: 'Mã chưa đúng. Hãy nhập mã đang hiển thị.', expired: 'Mã đã hết hạn. Hãy tạo mã mới.', renewed: 'Đã tạo mã mới. Mã trước đã hết hiệu lực.', signedIn: 'Đã đăng nhập bằng hồ sơ mẫu.', signedOut: 'Đã đăng xuất phiên mẫu.',
      profile: 'Ưu tiên làm việc', shift: 'Ca làm', transport: 'Đi lại', any: 'Chưa có ưu tiên', day: 'Ca ngày', night: 'Ca đêm', rotating: 'Xoay ca', shuttle: 'Xe đưa đón', self: 'Tự túc', saveProfile: 'Lưu ưu tiên', profileSaved: 'Đã lưu ưu tiên mẫu.',
      saved: 'Việc đã lưu', savedEmpty: 'Chưa có việc đã lưu. Bạn có thể lưu việc từ danh sách tuyển dụng.', remove: 'Bỏ lưu', unavailableJob: 'Đã đóng tuyển', removed: 'Đã bỏ lưu việc.', savedTemporary: 'Đã bỏ lưu trong phiên này. Trình duyệt chưa lưu được thay đổi.',
      apply: 'Thử ứng tuyển', selectJob: 'Tin tuyển dụng đang mở', choose: 'Chọn một việc', noJobs: 'Chưa có việc mới để thử ứng tuyển.', review: 'Xem lại hồ sơ thử', reviewText: 'Xác nhận tạo hồ sơ mẫu cho vị trí này trên trình duyệt.', confirm: 'Xác nhận ứng tuyển thử', back: 'Quay lại',
      apps: 'Theo dõi hồ sơ', sample: 'Dữ liệu giả lập', sampleJob: 'Nhân viên kho mẫu', practice: 'Hồ sơ thử từ tin tuyển dụng', submitted: 'Đã nộp', screening: 'Đang sàng lọc', interview: 'Mời phỏng vấn', created: 'Đã tạo hồ sơ thử.', duplicate: 'Bạn đã có hồ sơ thử cho việc này.', unavailable: 'Tin này hiện không nhận hồ sơ thử.', storage: 'Trình duyệt chưa lưu được thay đổi. Bạn có thể thử lại.', loading: 'Đang tải dữ liệu việc làm.',
    },
    en: {
      title: 'Candidate portal', badge: 'Demo', intro: 'Use a sample account to view saved jobs, set preferences, and track applications. Codes and sign-in sessions stay in this tab. Practice preferences and applications are stored in this browser.',
      privacy: 'Use the sample profile only. The demo does not send SMS codes or applications to employers.',
      persona: 'MD-01 Sample Candidate', signIn: 'Demo sign-in', request: 'Generate demo code', resend: 'Generate new code', code: 'Code shown in this tab', codeLabel: 'Enter the 6-digit demo code', lifetime: 'The code expires after 2 minutes.', verify: 'Verify code', logout: 'Sign out',
      wrong: 'That code is incorrect. Enter the code shown here.', expired: 'This code has expired. Generate a new code.', renewed: 'A new code is ready. The previous code has expired.', signedIn: 'Signed in with the sample profile.', signedOut: 'Signed out of the demo session.',
      profile: 'Work preferences', shift: 'Shift', transport: 'Commute', any: 'No preference', day: 'Day shift', night: 'Night shift', rotating: 'Rotating shifts', shuttle: 'Shuttle', self: 'Own transport', saveProfile: 'Save preferences', profileSaved: 'Sample preferences saved.',
      saved: 'Saved jobs', savedEmpty: 'No saved jobs yet. You can save jobs from the listings.', remove: 'Remove from saved jobs', unavailableJob: 'Closed', removed: 'Job removed from saved jobs.', savedTemporary: 'Job removed for this session. The browser could not save the change.',
      apply: 'Practice applying', selectJob: 'Open job listing', choose: 'Choose a job', noJobs: 'There are no new jobs to practice applying for.', review: 'Review practice application', reviewText: 'Confirm to create a sample application for this role in your browser.', confirm: 'Confirm practice application', back: 'Go back',
      apps: 'Application tracker', sample: 'Fictional data', sampleJob: 'Sample warehouse associate', practice: 'Practice application from job listings', submitted: 'Submitted', screening: 'Screening', interview: 'Interview invited', created: 'Practice application created.', duplicate: 'You already have a practice application for this job.', unavailable: 'This listing is unavailable for practice applications.', storage: 'The browser could not save the change. You can try again.', loading: 'Loading job listings.',
    },
    zh: {
      title: '求职者门户', badge: '演示', intro: '使用示例账号查看收藏的职位、设置工作偏好并跟踪申请。验证码和登录会话仅在当前标签页有效。练习偏好和申请保存在当前浏览器中。',
      privacy: '请仅使用示例资料。演示不会发送短信验证码，也不会向雇主发送申请。',
      persona: 'MD-01 示例求职者', signIn: '演示登录', request: '生成演示验证码', resend: '生成新验证码', code: '此标签页显示的验证码', codeLabel: '输入 6 位演示验证码', lifetime: '验证码在 2 分钟后失效。', verify: '验证验证码', logout: '退出登录',
      wrong: '验证码不正确。请输入此处显示的验证码。', expired: '验证码已过期。请生成新验证码。', renewed: '新验证码已生成，旧验证码已失效。', signedIn: '已使用示例资料登录。', signedOut: '已退出演示会话。',
      profile: '工作偏好', shift: '班次', transport: '通勤方式', any: '无偏好', day: '白班', night: '夜班', rotating: '轮班', shuttle: '班车', self: '自行通勤', saveProfile: '保存偏好', profileSaved: '示例偏好已保存。',
      saved: '收藏的职位', savedEmpty: '暂无收藏的职位。你可以在招聘列表中收藏职位。', remove: '取消收藏', unavailableJob: '招聘已结束', removed: '已取消收藏该职位。', savedTemporary: '已在当前会话取消收藏。浏览器未能保存更改。',
      apply: '练习申请', selectJob: '正在招聘的职位', choose: '请选择职位', noJobs: '暂无新职位可供练习申请。', review: '核对练习申请', reviewText: '确认后会在浏览器中为此职位创建示例申请。', confirm: '确认练习申请', back: '返回',
      apps: '申请进度', sample: '虚构数据', sampleJob: '示例仓库专员', practice: '来自招聘列表的练习申请', submitted: '已提交', screening: '筛选中', interview: '已邀面试', created: '练习申请已创建。', duplicate: '你已为此职位创建练习申请。', unavailable: '此职位目前无法接受练习申请。', storage: '浏览器未能保存更改。请重试。', loading: '正在加载招聘列表。',
    },
    ko: {
      title: '지원자 포털', badge: '데모', intro: '샘플 계정으로 저장한 채용 공고를 확인하고, 근무 선호를 설정하고, 지원 내역을 확인할 수 있습니다. 코드와 로그인 세션은 이 탭에서만 유지됩니다. 연습용 설정과 지원서는 이 브라우저에 저장됩니다.',
      privacy: '샘플 프로필만 사용하세요. 이 데모는 문자 인증 코드나 지원서를 회사에 보내지 않습니다.',
      persona: 'MD-01 샘플 지원자', signIn: '데모 로그인', request: '데모 코드 생성', resend: '새 코드 생성', code: '이 탭에 표시된 코드', codeLabel: '6자리 데모 코드 입력', lifetime: '코드는 2분 후에 만료됩니다.', verify: '코드 확인', logout: '로그아웃',
      wrong: '코드가 올바르지 않습니다. 여기에 표시된 코드를 입력하세요.', expired: '코드가 만료되었습니다. 새 코드를 생성하세요.', renewed: '새 코드가 생성되었습니다. 이전 코드는 만료되었습니다.', signedIn: '샘플 프로필로 로그인했습니다.', signedOut: '데모 세션에서 로그아웃했습니다.',
      profile: '근무 선호', shift: '근무 시간', transport: '통근 수단', any: '선호 없음', day: '주간 근무', night: '야간 근무', rotating: '교대 근무', shuttle: '통근 버스', self: '개별 통근', saveProfile: '선호 저장', profileSaved: '샘플 근무 선호를 저장했습니다.',
      saved: '저장한 채용 공고', savedEmpty: '저장한 공고가 없습니다. 채용 목록에서 공고를 저장할 수 있습니다.', remove: '저장 취소', unavailableJob: '채용 마감', removed: '공고 저장을 취소했습니다.', savedTemporary: '이 세션에서 저장을 취소했습니다. 브라우저가 변경 사항을 저장하지 못했습니다.',
      apply: '지원 연습', selectJob: '모집 중인 채용 공고', choose: '공고 선택', noJobs: '연습 지원을 할 수 있는 새 공고가 없습니다.', review: '연습 지원서 확인', reviewText: '확인하면 이 공고의 샘플 지원서가 브라우저에 생성됩니다.', confirm: '연습 지원 확인', back: '돌아가기',
      apps: '지원 내역', sample: '가상 데이터', sampleJob: '샘플 물류 담당자', practice: '채용 공고를 바탕으로 작성한 연습 지원', submitted: '지원 완료', screening: '심사 중', interview: '면접 제안', created: '연습 지원서를 만들었습니다.', duplicate: '이 공고의 연습 지원서가 이미 있습니다.', unavailable: '이 공고는 현재 연습 지원을 받지 않습니다.', storage: '브라우저가 변경 사항을 저장하지 못했습니다. 다시 시도해 주세요.', loading: '채용 공고를 불러오는 중입니다.',
    },
  };

  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const copy = lang => COPY[Object.hasOwn(COPY, lang) ? lang : 'vi'];
  const validId = id => typeof id === 'string' && /^[\w-]{1,120}$/.test(id);

  function issueOtp(previous, now, random = Math.random) {
    let code = String(Math.floor(random() * 1_000_000)).padStart(6, '0');
    if (code === previous?.code) code = String((Number(code) + 1) % 1_000_000).padStart(6, '0');
    return { code, expiresAt: now + OTP_LIFETIME };
  }

  function verifyOtp(challenge, input, now) {
    if (!challenge || now >= challenge.expiresAt) return 'expired';
    return input === challenge.code ? 'verified' : 'wrong';
  }

  function preferences(value) {
    return Object.fromEntries(Object.entries(PREFERENCES).map(([key, values]) => [
      key, values.includes(value?.[key]) ? value[key] : 'any',
    ]));
  }

  function sanitize(value, jobs) {
    const accepted = value?.version === VERSION ? value : null;
    const jobIds = new Set(jobs.map(job => job?.id).filter(validId));
    const ids = Array.isArray(accepted?.applicationJobIds) ? accepted.applicationJobIds : [];
    return {
      version: VERSION,
      preferences: preferences(accepted?.preferences),
      applicationJobIds: [...new Set(ids.filter(id => jobIds.has(id)))],
    };
  }

  function read(storage, jobs) {
    try { return sanitize(JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null'), jobs); }
    catch { return sanitize(null, jobs); }
  }

  function write(storage, value) {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
    catch { return false; }
  }

  function savePreferences(storage, jobs, value) {
    const current = read(storage, jobs);
    return write(storage, { ...current, preferences: preferences(value) }) ? 'profileSaved' : 'storage';
  }

  function submitApplication(storage, jobs, id) {
    const current = read(storage, jobs);
    if (current.applicationJobIds.includes(id)) return 'duplicate';
    if (!validId(id) || !jobs.some(job => job.id === id && job.open === true)) return 'unavailable';
    current.applicationJobIds.push(id);
    return write(storage, current) ? 'created' : 'storage';
  }

  function snapshot() {
    try {
      const data = window.MDPrototypeBridge?.snapshot();
      if (Array.isArray(data?.jobs)) {
        return { ready: true, lang: Object.hasOwn(COPY, data.lang) ? data.lang : 'vi', jobs: data.jobs.filter(job => validId(job?.id)) };
      }
    } catch { /* The normal page render will trigger a refresh. */ }
    const lang = document.documentElement.lang;
    return { ready: false, lang: Object.hasOwn(COPY, lang) ? lang : 'vi', jobs: [] };
  }

  function storage() {
    try { return window.localStorage; } catch { return null; }
  }

  function savedJobs(jobs) {
    try {
      const ids = new Set(window.MDPrototypeBridge.getSavedJobIds());
      return jobs.filter(job => ids.has(job.id));
    } catch { return []; }
  }

  const jobHref = (id, lang) => 'chi-tiet-viec-lam.html?id=' + encodeURIComponent(id) + '&lang=' + lang;
  const button = (action, label, { id = action, secondary = false } = {}) =>
    '<button type="button" class="md-cp-button' + (secondary ? ' md-cp-secondary' : '') + '" id="md-cp-' + id + '" data-cp-action="' + action + '">' + label + '</button>';

  function timeline(keys, labels) {
    return '<ol class="md-cp-timeline" role="list">' + keys.map((key, index) => '<li' +
      (index === keys.length - 1 ? ' aria-current="step"' : '') + '>' + labels[key] + '</li>').join('') + '</ol>';
  }

  function authMarkup(labels) {
    const challenge = state.challenge;
    const active = challenge && verifyOtp(challenge, challenge.code, Date.now()) === 'verified';
    return '<section class="md-cp-card" aria-labelledby="md-cp-auth-title"><h2 id="md-cp-auth-title">' + labels.signIn + '</h2><p>' + labels.persona + '</p>' +
      (active ? '<p>' + labels.code + ' <strong class="md-cp-code">' + challenge.code + '</strong></p>' +
        '<form id="md-cp-otp-form" class="md-cp-form">' +
        '<label for="md-cp-code-input">' + labels.codeLabel + '</label>' +
        '<input id="md-cp-code-input" name="code" inputmode="numeric" autocomplete="off" maxlength="6" value="' + state.codeInput + '" aria-describedby="md-cp-lifetime"' +
        (state.notice === 'wrong' ? ' aria-invalid="true" aria-errormessage="md-cp-status"' : '') + '>' +
        '<p id="md-cp-lifetime">' + labels.lifetime + '</p><div class="md-cp-actions"><button class="md-cp-button" id="md-cp-verify" type="submit">' + labels.verify + '</button>' +
        button('code', labels.resend, { secondary: true }) + '</div></form>' :
        button('code', challenge ? labels.resend : labels.request)) + '</section>';
  }

  function profileMarkup(labels, profile) {
    return '<section class="md-cp-card" aria-labelledby="md-cp-profile-title"><h2 id="md-cp-profile-title">' + labels.profile + '</h2>' +
      '<form id="md-cp-profile-form" class="md-cp-form"><div class="md-cp-fields">' +
      Object.entries(PREFERENCES).map(([key, values]) =>
        '<div><label for="md-cp-' + key + '">' + labels[key] + '</label><select id="md-cp-' + key + '" name="' + key + '">' +
        values.map(value => '<option value="' + value + '"' + (profile[key] === value ? ' selected' : '') + '>' + labels[value] + '</option>').join('') +
        '</select></div>').join('') + '</div><button class="md-cp-button" id="md-cp-save-profile" type="submit">' + labels.saveProfile + '</button></form></section>';
  }

  function savedMarkup(data, labels) {
    const jobs = savedJobs(data.jobs);
    return '<section class="md-cp-card" aria-labelledby="md-cp-saved-title"><h2 id="md-cp-saved-title" tabindex="-1">' + labels.saved + '</h2>' +
      (jobs.length ? '<ul class="md-cp-list" role="list">' + jobs.map(job => '<li><div>' + (job.open ? '<a id="md-cp-saved-' + job.id + '" href="' + escape(jobHref(job.id, data.lang)) + '">' +
        escape(job.title) + '</a>' : '<strong>' + escape(job.title) + '</strong><p>' + labels.unavailableJob + '</p>') + '</div>' +
        '<button class="md-cp-button md-cp-secondary" id="md-cp-remove-' + job.id + '" type="button" data-cp-action="remove" data-cp-job="' + job.id +
        '" aria-label="' + labels.remove + ' · ' + escape(job.title) + '">' + labels.remove + '</button></li>').join('') + '</ul>' :
        '<p>' + labels.savedEmpty + '</p>') + '</section>';
  }

  function applyMarkup(data, labels, persisted) {
    const pending = data.jobs.find(job => job.id === state.pending);
    const available = data.jobs.filter(job => job.open === true && !persisted.applicationJobIds.includes(job.id));
    let content = '<p>' + (data.ready ? labels.noJobs : labels.loading) + '</p>';
    if (pending) {
      content = '<div class="md-cp-review"><h3 id="md-cp-review-title" tabindex="-1">' + labels.review + '</h3><p><strong>' +
        escape(pending.title) + '</strong> · ' + labels.persona + '</p><p>' + labels.reviewText + '</p><div class="md-cp-actions">' +
        button('confirm', labels.confirm) + button('back', labels.back, { secondary: true }) + '</div></div>';
    } else if (available.length) {
      content = '<form id="md-cp-apply-form" class="md-cp-form"><label for="md-cp-job">' + labels.selectJob + '</label>' +
        '<select id="md-cp-job" name="job" required><option value="">' + labels.choose + '</option>' +
        available.map(job => '<option value="' + job.id + '"' + (state.selection === job.id ? ' selected' : '') + '>' + escape(job.title) + '</option>').join('') +
        '</select><button class="md-cp-button" id="md-cp-review-button" type="submit">' + labels.review + '</button></form>';
    }
    return '<section class="md-cp-card" aria-labelledby="md-cp-apply-title"><h2 id="md-cp-apply-title" tabindex="-1">' + labels.apply + '</h2>' + content + '</section>';
  }

  function applicationsMarkup(data, labels, persisted) {
    const jobs = new Map(data.jobs.map(job => [job.id, job]));
    const items = [...persisted.applicationJobIds].reverse().map(id =>
      '<li id="md-cp-application-' + id + '" tabindex="-1"><p class="md-cp-source">' + labels.practice + '</p><h3>' +
      escape(jobs.get(id).title) + '</h3>' + timeline(['submitted'], labels) + '</li>');
    items.push('<li><p class="md-cp-source">' + labels.sample + '</p><h3>' + labels.sampleJob + '</h3>' + timeline(SAMPLE, labels) + '</li>');
    return '<section class="md-cp-card" aria-labelledby="md-cp-applications-title"><h2 id="md-cp-applications-title" tabindex="-1">' + labels.apps +
      '</h2><ul class="md-cp-applications" role="list">' + items.join('') + '</ul></section>';
  }

  const state = {
    challenge: null, codeInput: '', signedIn: false, profile: null, selection: '', pending: '',
    notice: '', open: false,
  };
  let root, shellLang, bodyMarkup, focusedId, expiryTimer, queued = false;

  function focus(id) {
    const target = document.getElementById(id);
    if (root?.open && root.contains(target)) target.focus();
  }

  function show(data = snapshot()) {
    if (!root?.isConnected) return;
    const labels = copy(data.lang);
    if (shellLang !== data.lang) {
      root.lang = data.lang;
      root.querySelector('.md-cp-title').textContent = labels.title;
      root.querySelector('.md-cp-badge').textContent = labels.badge;
      root.querySelector('.md-cp-intro').textContent = labels.intro;
      root.querySelector('.md-cp-privacy').textContent = labels.privacy;
      shellLang = data.lang;
    }
    const persisted = read(storage(), data.jobs);
    if (state.pending && data.ready && !data.jobs.some(job => job.id === state.pending && job.open === true)) {
      state.pending = '';
      state.notice = 'unavailable';
    }
    const html = state.signedIn ?
      '<div class="md-cp-session"><p><strong>' + labels.persona + '</strong></p>' + button('logout', labels.logout, { secondary: true }) + '</div>' +
      '<div class="md-cp-grid">' + profileMarkup(labels, state.profile || persisted.preferences) + savedMarkup(data, labels) +
      applyMarkup(data, labels, persisted) + applicationsMarkup(data, labels, persisted) + '</div>' : authMarkup(labels);
    const status = root.querySelector('#md-cp-status');
    if (status.textContent !== (labels[state.notice] || '')) status.textContent = labels[state.notice] || '';
    if (html !== bodyMarkup) {
      const code = root.querySelector('#md-cp-code-input');
      const position = document.activeElement === code && code ? [code.selectionStart, code.selectionEnd] : null;
      root.querySelector('.md-cp-content').innerHTML = html;
      bodyMarkup = html;
      const target = focusedId && document.getElementById(focusedId);
      if (root.open && target && root.contains(target) && document.activeElement === document.body) {
        target.focus({ preventScroll: true });
        if (position && target.id === 'md-cp-code-input') target.setSelectionRange(...position);
      }
    }
  }

  function setNotice(key, target) {
    state.notice = key;
    show();
    if (target) focus(target);
  }

  function generateCode() {
    const renewed = Boolean(state.challenge);
    state.challenge = issueOtp(state.challenge, Date.now());
    state.codeInput = '';
    clearTimeout(expiryTimer);
    expiryTimer = window.setTimeout(() => {
      state.codeInput = '';
      const target = focusedId === 'md-cp-code-input' || focusedId === 'md-cp-verify' ? 'md-cp-code' : '';
      setNotice('expired', target);
    }, OTP_LIFETIME);
    setNotice(renewed ? 'renewed' : '', 'md-cp-code-input');
  }

  function signIn(input) {
    const result = verifyOtp(state.challenge, input, Date.now());
    if (result !== 'verified') {
      setNotice(result, result === 'wrong' ? 'md-cp-code-input' : 'md-cp-code');
      return;
    }
    clearTimeout(expiryTimer);
    state.challenge = null;
    state.codeInput = '';
    state.signedIn = true;
    setNotice('signedIn', 'md-cp-shift');
  }

  function signOut() {
    Object.assign(state, { signedIn: false, profile: null, selection: '', pending: '' });
    setNotice('signedOut', 'md-cp-code');
  }

  function startReview(id, data) {
    const current = read(storage(), data.jobs);
    if (current.applicationJobIds.includes(id)) return setNotice('duplicate', 'md-cp-apply-title');
    if (!data.jobs.some(job => job.id === id && job.open === true)) return setNotice('unavailable', 'md-cp-apply-title');
    state.pending = id;
    setNotice('', 'md-cp-review-title');
  }

  function confirm() {
    const id = state.pending;
    const data = snapshot();
    if (!data.ready) return setNotice('loading');
    const result = submitApplication(storage(), data.jobs, id);
    if (result === 'storage') return setNotice(result);
    state.pending = state.selection = '';
    setNotice(result, result === 'created' ? 'md-cp-application-' + id : 'md-cp-apply-title');
  }

  function removeSaved(id) {
    const { jobs } = snapshot();
    if (!savedJobs(jobs).some(job => job.id === id)) return;
    let persisted = false;
    try { persisted = window.MDPrototypeBridge.setJobSaved(id, false); } catch { /* Show the storage result below. */ }
    const removed = !savedJobs(jobs).some(job => job.id === id);
    setNotice(removed ? (persisted ? 'removed' : 'savedTemporary') : 'storage', removed ? 'md-cp-saved-title' : '');
  }

  function wire() {
    root.addEventListener('toggle', () => { state.open = root.open; });
    root.addEventListener('input', event => {
      if (event.target.id !== 'md-cp-code-input') return;
      state.codeInput = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (event.target.value !== state.codeInput) event.target.value = state.codeInput;
      if (state.notice === 'wrong') {
        state.notice = '';
        event.target.removeAttribute('aria-invalid');
        event.target.removeAttribute('aria-errormessage');
        root.querySelector('#md-cp-status').textContent = '';
      }
    });
    root.addEventListener('change', event => {
      if (!state.signedIn) return;
      if (event.target.id === 'md-cp-job') state.selection = validId(event.target.value) ? event.target.value : '';
      if (event.target.closest('#md-cp-profile-form')) {
        const fields = event.target.form.elements;
        state.profile = preferences({ shift: fields.shift.value, transport: fields.transport.value });
      }
    });
    root.addEventListener('submit', event => {
      const form = event.target;
      event.preventDefault();
      if (!state.signedIn) {
        if (form.id === 'md-cp-otp-form') signIn(form.elements.code.value);
        return;
      }
      const data = snapshot();
      if (!data.ready) return setNotice('loading');
      if (form.id === 'md-cp-profile-form') {
        const result = savePreferences(storage(), data.jobs, { shift: form.elements.shift.value, transport: form.elements.transport.value });
        if (result === 'profileSaved') state.profile = null;
        setNotice(result);
      } else if (form.id === 'md-cp-apply-form') {
        startReview(form.elements.job.value, data);
      }
    });
    root.addEventListener('click', event => {
      const control = event.target.closest('[data-cp-action]');
      if (!control) return;
      const action = control.dataset.cpAction;
      if (!state.signedIn) {
        if (action === 'code') generateCode();
        return;
      }
      if (action === 'logout') signOut();
      if (action === 'remove') removeSaved(control.dataset.cpJob);
      if (action === 'confirm' && state.pending) confirm();
      if (action === 'back') {
        state.pending = '';
        setNotice('', 'md-cp-job');
      }
    });
  }

  function refresh() {
    const main = document.getElementById('main');
    if (!main || document.body?.dataset.page !== 'jobs') return;
    if (!root?.isConnected || root.parentElement !== main) {
      const firstMount = !root;
      if (root) state.open = root.open;
      root?.remove();
      root = document.createElement('details');
      root.id = ID;
      root.className = 'container';
      root.open = state.open || (firstMount && location.hash === '#' + ID);
      root.innerHTML = '<summary id="md-cp-summary"><span class="md-cp-title"></span><span class="md-cp-badge"></span></summary>' +
        '<div class="md-cp-body"><p class="md-cp-intro"></p><p class="md-cp-privacy"></p>' +
        '<p id="md-cp-status" role="status" aria-live="polite" aria-atomic="true"></p><div class="md-cp-content"></div></div>';
      shellLang = bodyMarkup = null;
      main.append(root);
      wire();
      if (firstMount && root.open) queueMicrotask(openAnchor);
    }
    show();
  }

  function queueRefresh() {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; refresh(); });
  }

  function openAnchor() {
    if (location.hash === '#' + ID && root) {
      root.open = state.open = true;
      root.scrollIntoView({ block: 'start' });
    }
  }

  function start() {
    if (document.body?.dataset.page !== 'jobs') return;
    const app = document.getElementById('app');
    if (!app) return;
    refresh();
    document.addEventListener('focusin', event => { focusedId = root?.contains(event.target) ? event.target.id : ''; });
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (root && link?.hash === '#' + ID && link.origin === location.origin && link.pathname === location.pathname) root.open = true;
    });
    window.addEventListener('hashchange', openAnchor);
    window.addEventListener('md:saved-jobs-change', queueRefresh);
    window.addEventListener('storage', event => { if (event.key === STORAGE_KEY || event.key === null) queueRefresh(); });
    new MutationObserver(records => {
      if (records.some(record => !record.target.closest?.('#' + ID))) queueRefresh();
    }).observe(app, { childList: true, subtree: true });
    new MutationObserver(queueRefresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.MDCandidatePortalDemo = Object.freeze({ issueOtp, verifyOtp, sanitize, read, savePreferences, submitApplication });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
