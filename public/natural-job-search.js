/* Rule-based, on-page search over the current prototype jobs. */
(() => {
  'use strict';
  if (window.MDNaturalJobSearch) return;

  const ROOT_ID = 'md-natural-job-search';
  const EXAMPLE = 'Tìm việc ca ngày ở Bắc Ninh';
  const SHIFTS = ['day', 'night', 'rotating', 'flexible'];
  const SHIFT_PHRASES = {
    day: 'ca ngay|ca sang|ban ngay',
    night: 'ca dem|ban dem',
    rotating: 'ca luan phien|ca luan chuyen|ca xoay|xoay ca|doi ca',
    flexible: 'ca linh hoat|linh hoat ca'
  };
  const NEGATION = new RegExp(
    '(?:^| )((?:khong|chang|chua|tranh|ngoai tru|tru)' +
    '(?: (?:muon|can|phai|the|co|lam|di|tim|chon|nhan|viec|cong viec|vi tri|cac|theo|o|tai|vao|trong|voi|luong|muc luong|thu nhap|bat buoc|san sang|chap nhan|phu hop)){0,12} ' +
    `(?:(?:${Object.values(SHIFT_PHRASES).join('|')}) (?:hoac|hay|va) )*)$`
  );
  const TYPES = ['worker', 'internal'];
  const FIELDS = ['location', 'park', 'income', 'shift', 'type'];
  const copy = {
    vi: {
      title: 'Tìm việc bằng câu tiếng Việt', badge: 'DEMO THEO QUY TẮC',
      intro: 'Nhập một câu tiếng Việt. Bản demo gợi ý tiêu chí từ tin mẫu để bạn kiểm tra và sửa. Câu tìm kiếm chỉ dùng trên trang này.',
      query: 'Bạn muốn tìm việc như thế nào?', example: 'Dùng câu mẫu', interpret: 'Đọc tiêu chí', review: 'Kiểm tra tiêu chí trước khi tìm',
      confirm: 'Xác nhận và tìm', reset: 'Đặt lại tìm kiếm', fallback: 'Về bộ lọc thường', any: 'Không yêu cầu',
      fields: ['Khu vực', 'Khu công nghiệp / nơi làm việc', 'Thu nhập từ (triệu đồng/tháng)', 'Ca làm', 'Loại việc'],
      shifts: ['Ca ngày', 'Ca đêm', 'Ca luân phiên', 'Ca linh hoạt'], types: ['Việc làm phổ thông', 'Tuyển dụng nội bộ'],
      incomeNote: 'Tin có thể đạt mức thu nhập đã chọn nếu mức cao nhất trong khoảng tham khảo đạt ngưỡng.',
      missing: 'Hãy nhập một câu tiếng Việt hoặc dùng câu mẫu.', unavailable: 'Chưa đọc được dữ liệu việc làm. Bạn có thể dùng bộ lọc thường.',
      unknown: 'Chưa hiểu hoặc chưa hỗ trợ phần này', conflict: 'Có nhiều lựa chọn cho', check: 'Hãy kiểm tra và chọn tiêu chí trước khi xác nhận.',
      zero: 'Chưa có tin đang tuyển khớp các tiêu chí đã xác nhận.', result: n => `${n} tin mẫu đang tuyển phù hợp`,
      unknownShift: n => `${n} tin phù hợp với các tiêu chí còn lại chưa có dữ liệu ca làm rõ ràng và đã được loại khỏi kết quả.`,
      salary: 'triệu đồng/tháng', results: 'Kết quả tìm bằng câu tiếng Việt'
    },
    en: {
      title: 'Search jobs in plain Vietnamese', badge: 'RULE-BASED DEMO',
      intro: 'Enter a Vietnamese sentence. This demo suggests criteria from sample listings for you to review and edit. Your query stays on this page.',
      query: 'What kind of job are you looking for?', example: 'Use example', interpret: 'Read criteria', review: 'Review criteria before searching',
      confirm: 'Confirm and search', reset: 'Reset search', fallback: 'Return to standard filters', any: 'Any',
      fields: ['Location', 'Industrial park / workplace', 'Income from (million VND/month)', 'Shift', 'Job type'],
      shifts: ['Day shift', 'Night shift', 'Rotating shifts', 'Flexible shifts'], types: ['General worker jobs', 'Internal recruitment'],
      incomeNote: 'A listing could reach your target if the upper end of its estimated income range meets the threshold.',
      missing: 'Enter a Vietnamese sentence or use the example.', unavailable: 'Job data is unavailable. You can use the standard filters.',
      unknown: 'Unrecognized or unsupported text', conflict: 'Multiple choices for', check: 'Review and select your criteria before confirming.',
      zero: 'No open jobs match the confirmed criteria.', result: n => `${n} open sample listings match`,
      unknownShift: n => `${n} listings match the other criteria but have no explicit shift data and were excluded.`,
      salary: 'million VND/month', results: 'Plain Vietnamese search results'
    },
    zh: {
      title: '用越南语句子找工作', badge: '规则演示',
      intro: '请输入一句越南语。演示将根据示例职位建议筛选条件，供您确认和修改。查询内容仅用于当前页面。',
      query: '您在找什么样的工作？', example: '使用示例', interpret: '识别条件', review: '搜索前确认条件',
      confirm: '确认并搜索', reset: '重置搜索', fallback: '返回常规筛选', any: '不限',
      fields: ['地区', '工业园区／工作地点', '月收入起点（百万越南盾）', '班次', '职位类型'],
      shifts: ['白班', '夜班', '轮班', '灵活班次'], types: ['普工职位', '内部招聘'],
      incomeNote: '若参考收入区间的上限达到所选金额，该职位可能达到您的收入目标。',
      missing: '请输入一句越南语，或使用示例。', unavailable: '暂时无法读取职位数据。您可以使用常规筛选。',
      unknown: '无法识别或不支持的内容', conflict: '存在多个选项的条件', check: '请检查并选择条件后再确认。',
      zero: '目前没有符合已确认条件的招聘职位。', result: n => `有 ${n} 条正在招聘的示例职位符合条件`,
      unknownShift: n => `有 ${n} 条职位符合其他条件，但未明确提供班次信息，已从结果中排除。`,
      salary: '百万越南盾／月', results: '越南语句子搜索结果'
    },
    ko: {
      title: '베트남어 문장으로 일자리 찾기', badge: '규칙 기반 데모',
      intro: '베트남어로 한 문장을 입력하세요. 예시 공고를 바탕으로 조건을 제안하며, 직접 검토하고 수정할 수 있습니다. 입력 문장은 이 페이지에서만 사용됩니다.',
      query: '어떤 일자리를 찾고 계신가요?', example: '예문 사용', interpret: '조건 읽기', review: '검색 전 조건 확인',
      confirm: '확인하고 검색', reset: '검색 초기화', fallback: '기본 필터로 돌아가기', any: '상관없음',
      fields: ['지역', '산업단지 / 근무지', '월수입 기준(백만 동)', '근무조', '채용 유형'],
      shifts: ['주간 근무', '야간 근무', '순환 근무', '유연한 근무조'], types: ['일반 근로자 채용', '내부 채용'],
      incomeNote: '공고의 예상 수입 범위에서 상한이 선택한 금액 이상이면 목표 금액에 도달할 수 있습니다.',
      missing: '베트남어 문장을 입력하거나 예문을 사용하세요.', unavailable: '채용 데이터를 읽을 수 없습니다. 기본 필터를 이용할 수 있습니다.',
      unknown: '인식할 수 없거나 지원하지 않는 내용', conflict: '선택지가 여러 개인 조건', check: '확인하기 전에 조건을 검토하고 선택하세요.',
      zero: '확인한 조건에 맞는 진행 중인 공고가 없습니다.', result: n => `조건에 맞는 진행 중인 예시 공고 ${n}건`,
      unknownShift: n => `다른 조건에는 맞지만 근무조가 명시되지 않은 공고 ${n}건을 결과에서 제외했습니다.`,
      salary: '백만 동/월', results: '베트남어 문장 검색 결과'
    }
  };
  const fold = value => String(value ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const tokensOf = value => [...value.matchAll(/\d+(?:[,.]\d+)?|\p{L}+|[<>]=?|[=≤≥+~–—-]/gu)];
  const normalize = value => tokensOf(value.normalize('NFC')).map(([raw]) => fold(raw)).join(' ');
  const openJobs = jobs => Array.isArray(jobs) ? jobs.filter(job => job?.open === true) : [];
  const choices = (jobs, field) => [...new Set(openJobs(jobs).map(job => job[field]).filter(
    value => typeof value === 'string' && value.trim()
  ))].sort((first, second) => first.localeCompare(second, 'vi'));
  const incomeValue = value => {
    const number = Number(String(value ?? '').replace(',', '.'));
    return Number.isFinite(number) && number >= 0.01 && number <= 999 ? number : '';
  };
  const blankCriteria = (type = '') => ({ location: '', park: '', income: '', shift: '', type });
  const phrase = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const whole = source => new RegExp(`(?<!\\S)(?:${source})(?!\\S)`, 'g');

  function parseQuery(query, jobs) {
    const source = String(query ?? '').slice(0, 240).normalize('NFC');
    let cursor = 0, rawEnd = 0;
    const clauseStarts = [0];
    const spans = tokensOf(source).map(({ 0: raw, index }) => {
      const text = fold(raw), start = cursor;
      if (start && /[,;.!?…\n]/.test(source.slice(rawEnd, index))) clauseStarts.push(start);
      rawEnd = index + raw.length;
      cursor += text.length + 1;
      return { raw, text, start, end: cursor - 1 };
    });
    const original = spans.map(span => span.text).join(' ');
    let remaining = original;
    const candidates = Object.fromEntries(FIELDS.map(field => [field, new Set()]));
    const negatedRanges = [];
    function mask(start, end) {
      remaining = remaining.slice(0, start) + ' '.repeat(end - start) + remaining.slice(end);
    }
    function consume(pattern, field, value) {
      for (const match of remaining.matchAll(pattern)) {
        const { index } = match;
        const end = index + match[0].length;
        if (field) {
          const clauseStart = clauseStarts.findLast(start => start <= index);
          const negation = original.slice(clauseStart, index).match(NEGATION);
          if (negation) {
            const start = index - negation[1].length;
            // Preserve the complete phrase for review and keep its text out of later rules.
            negatedRanges.push({ start, end });
            mask(start, end);
            continue;
          }
        }
        const candidate = typeof value === 'function' ? value(match) : value;
        if (field && candidate === '') continue;
        if (field) for (const item of [].concat(candidate)) candidates[field].add(item);
        mask(index, end);
      }
    }

    // Parks take precedence over a location whose name occurs inside a park name.
    for (const field of ['park', 'location']) {
      const aliases = new Map();
      for (const value of choices(jobs, field)) {
        const name = normalize(value);
        if (!name) continue;
        const short = name.replace(/^(?:kcn|khu cong nghiep) /, '');
        const forms = field === 'park' && short !== name ? [`kcn ${short}`, `khu cong nghiep ${short}`, short] : [name];
        for (const alias of forms) aliases.set(alias, [...(aliases.get(alias) || []), value]);
      }
      const longestFirst = [...aliases].sort(([first], [second]) => second.length - first.length);
      for (const [alias, values] of longestFirst) consume(whole(phrase(alias)), field, values);
    }
    for (const [shift, phrases] of Object.entries(SHIFT_PHRASES)) consume(whole(phrases), 'shift', shift);
    consume(whole('viec lam pho thong|viec pho thong|lao dong pho thong|cong nhan|pho thong'), 'type', 'worker');
    consume(whole('tuyen dung noi bo|viec lam noi bo|viec noi bo|noi bo'), 'type', 'internal');
    consume(whole('(?:(tu|toi thieu|it nhat|thap nhat|tren|duoi|toi da|cao nhat|tam|khoang|hon|<=|>=|<|>|≤|≥|~|-) )?(\\d+(?:[,.]\\d+)?)(?: (?:-|–|—|den|toi) (\\d+(?:[,.]\\d+)?))? (?:trieu|tr)(?: (?:vnd|dong))?(?: (?:moi |mot )?thang)?(?: (tro len|tro xuong))?'),
      'income', match => !match[3] && match[4] !== 'tro xuong' && [undefined, 'tu', 'toi thieu', 'it nhat', 'thap nhat', '>=', '≥'].includes(match[1])
        ? incomeValue(match[2]) : '');
    consume(whole('(?:(?:toi|em|minh) )?(?:(?:muon|can) )?tim(?: viec(?: lam)?)?|viec lam|thu nhap|muc luong|luong|lam viec|lam|o|tai|va|voi|cho toi|cho em'));

    const criteria = blankCriteria();
    const conflicts = FIELDS.filter(field => candidates[field].size > 1);
    for (const field of FIELDS) {
      if (candidates[field].size === 1) [criteria[field]] = candidates[field];
    }
    const unknown = [];
    let part = [];
    for (const { raw, start, end } of spans) {
      const unsupported = remaining.slice(start, end).trim() || negatedRanges.some(range => range.start <= start && range.end >= end);
      if (part.length && (!unsupported || clauseStarts.includes(start))) {
        unknown.push(part.join(' '));
        part = [];
      }
      if (unsupported) part.push(raw);
    }
    if (part.length) unknown.push(part.join(' '));
    if (!spans.length && source.trim()) unknown.push(source.trim());
    return { criteria, unknown, conflicts };
  }

  function filterJobs(jobs, criteria = {}) {
    const { location, park, shift, type } = criteria;
    const minimum = incomeValue(criteria.income);
    const matches = openJobs(jobs).filter(job =>
      (!type || job.type === type) && (!location || job.location === location) &&
      (!park || job.park === park) && (!minimum || Number(job.max) >= minimum)
    );
    if (!SHIFTS.includes(shift)) return { matches, unknownShift: 0 };
    const unknownShift = matches.filter(job => !SHIFTS.includes(job.shift)).length;
    return { matches: matches.filter(job => job.shift === shift), unknownShift };
  }

  function jobLink(id, lang) {
    return `chi-tiet-viec-lam.html?${new URLSearchParams({ id, lang: Object.hasOwn(copy, lang) ? lang : 'vi' })}`;
  }

  function snapshot() {
    try {
      const data = window.MDPrototypeBridge?.snapshot();
      if (Array.isArray(data?.jobs)) return { ready: true, jobs: data.jobs, lang: Object.hasOwn(copy, data.lang) ? data.lang : 'vi' };
    } catch { /* The regular job filter remains available. */ }
    const lang = document.documentElement.lang;
    return { ready: false, jobs: [], lang: Object.hasOwn(copy, lang) ? lang : 'vi' };
  }

  function option(value, label, selected) {
    return `<option value="${escape(value)}"${value === selected ? ' selected' : ''}>${escape(label)}</option>`;
  }

  function controls(data, state) {
    const t = copy[data.lang], c = state.criteria;
    const select = (field, values, labels = values) => `<select id="md-njs-${field}">
      ${option('', t.any, c[field])}${values.map((value, index) => option(value, labels[index], c[field])).join('')}
      </select>`;
    const inputs = {
      location: select('location', choices(data.jobs, 'location')), park: select('park', choices(data.jobs, 'park')),
      income: `<input id="md-njs-income" type="number" min="0.01" max="999" step="any" inputmode="decimal" value="${escape(c.income)}" aria-describedby="md-njs-income-note">`,
      shift: select('shift', SHIFTS, t.shifts), type: select('type', TYPES, t.types)
    };
    return FIELDS.map((field, index) => `<div class="field"><label for="md-njs-${field}">${escape(t.fields[index])}</label>${inputs[field]}</div>`).join('');
  }

  function markup(data, state) {
    const t = copy[data.lang];
    return `<summary id="md-njs-summary"><span class="md-njs-heading"><span>${escape(t.title)}</span><span class="md-njs-badge">${escape(t.badge)}</span></span></summary>
      <div class="md-njs-body">
        <p>${escape(t.intro)}</p>
        <form id="md-njs-query-form">
          <div class="field"><label for="md-njs-query">${escape(t.query)}</label>
            <input id="md-njs-query" type="text" lang="vi" value="${escape(state.query)}" placeholder="${escape(EXAMPLE)}" maxlength="240" autocomplete="off"></div>
          <div class="md-njs-actions">
            <button id="md-njs-interpret" class="btn light" type="submit">${escape(t.interpret)}</button>
            <button id="md-njs-example" class="md-njs-text-button" type="button">${escape(t.example)}</button>
          </div>
        </form>
        <p id="md-njs-message" role="status"></p>
        <form id="md-njs-criteria-form" hidden>
          <h2 id="md-njs-review" tabindex="-1">${escape(t.review)}</h2>
          <div class="md-njs-grid">${controls(data, state)}</div>
          <p id="md-njs-income-note">${escape(t.incomeNote)}</p>
          <div class="md-njs-actions">
            <button id="md-njs-confirm" class="btn red" type="submit">${escape(t.confirm)}</button>
            <button id="md-njs-reset" class="md-njs-text-button" type="button">${escape(t.reset)}</button>
          </div>
        </form>
        <p id="md-njs-result-status" role="status"></p>
        <ul id="md-njs-results" aria-label="${escape(t.results)}" hidden></ul>
        <button id="md-njs-fallback" class="md-njs-text-button" type="button">${escape(t.fallback)}</button>
      </div>`;
  }

  const state = {
    page: '', tab: '', query: '', criteria: blankCriteria(), parsed: null, error: '', searched: false, opened: false
  };
  let root, host, signature, observer, queued, focusedId;
  const part = id => root.querySelector(`#md-njs-${id}`);
  const read = () => Object.fromEntries(FIELDS.map(field => [field, part(field).value]));

  function show(data = snapshot()) {
    const t = copy[data.lang], parsed = state.parsed;
    const message = part('message');
    const warnings = [];
    if (parsed?.unknown.length) warnings.push(`${escape(t.unknown)} <q lang="vi">${escape(parsed.unknown.join(' · '))}</q>.`);
    if (parsed?.conflicts.length) warnings.push(`${escape(t.conflict)} ${escape(parsed.conflicts.map(field => t.fields[FIELDS.indexOf(field)]).join(', '))}.`);
    if (warnings.length) warnings.push(escape(t.check));
    const messageMarkup = state.error || !data.ready ? escape(t[state.error || 'unavailable']) : warnings.join(' ');
    if (message.innerHTML !== messageMarkup) message.innerHTML = messageMarkup;
    part('criteria-form').hidden = !parsed;
    const results = part('results'), status = part('result-status');
    if (!state.searched || !data.ready) {
      status.textContent = '';
      results.replaceChildren();
      results.hidden = true;
      return;
    }
    const { matches, unknownShift } = filterJobs(data.jobs, state.criteria);
    const statusText = [matches.length ? t.result(matches.length) : t.zero, unknownShift ? t.unknownShift(unknownShift) : ''].filter(Boolean).join(' ');
    if (status.textContent !== statusText) status.textContent = statusText;
    results.hidden = !matches.length;
    const resultMarkup = matches.map((job, index) => {
      const place = [job.park, job.location].filter(Boolean).join(' · ');
      const range = incomeValue(job.min) && incomeValue(job.max) ? `${job.min}–${job.max} ${t.salary}` : '';
      return `<li><a id="md-njs-result-${index}" href="${escape(jobLink(job.id, data.lang))}">${escape(job.title)}</a>
        <span>${escape([place, range].filter(Boolean).join(' · '))}</span></li>`;
    }).join('');
    if (results.innerHTML !== resultMarkup) results.innerHTML = resultMarkup;
  }

  function reset() {
    state.query = '';
    state.criteria = blankCriteria(state.tab);
    state.parsed = null;
    state.error = '';
    state.searched = false;
    part('query').value = '';
    for (const field of FIELDS) part(field).value = state.criteria[field];
    show();
    part('query').focus();
  }

  function setQuery(value) {
    state.query = value;
    state.parsed = null;
    state.error = '';
    state.searched = false;
    show();
  }

  function wire() {
    root.addEventListener('input', event => {
      if (event.target === part('query')) setQuery(event.target.value);
      if (event.target.closest('#md-njs-criteria-form')) {
        state.criteria = read();
        state.searched = false;
        show();
      }
    });
    root.addEventListener('submit', event => {
      event.preventDefault();
      const data = snapshot();
      if (!data.ready) {
        state.error = 'unavailable';
        show(data);
        return;
      }
      if (event.target === part('query-form')) {
        const query = part('query').value.trim();
        setQuery(query);
        if (query) {
          state.parsed = parseQuery(query, data.jobs);
          state.criteria = { ...state.parsed.criteria, type: state.parsed.conflicts.includes('type') ? '' : state.parsed.criteria.type || state.tab };
          for (const field of FIELDS) part(field).value = state.criteria[field];
        } else state.error = 'missing';
        show(data);
        if (state.parsed) part('review').focus();
      } else if (event.target === part('criteria-form') && state.parsed) {
        state.criteria = read();
        state.searched = true;
        show(data);
      }
    });
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button === part('example')) {
        part('query').value = EXAMPLE;
        setQuery(EXAMPLE);
        part('query').focus();
      }
      if (button === part('reset')) reset();
      if (button === part('fallback')) {
        const form = document.getElementById('jobFilter');
        const filters = form?.querySelector('.v14-filter-disclosure') || form?.closest('details');
        if (filters) filters.open = true;
        root.open = false;
        state.opened = false;
        form?.querySelector('input, select, button')?.focus();
      }
    });
    root.addEventListener('toggle', event => { if (event.target === root) state.opened = root.open; });
  }

  function refresh() {
    const page = document.body?.dataset.page, data = snapshot();
    const app = document.getElementById('app');
    const nextHost = page === 'jobs' || page === 'internal' ? app?.querySelector('#jobResults') : null;
    if (!nextHost) return;
    const tab = page === 'internal' ? 'internal' : window.MDLocale?.jobsState?.(location)?.tab || 'worker';
    const nextSignature = JSON.stringify([page, tab, data.lang, choices(data.jobs, 'location'), choices(data.jobs, 'park')]);
    if (root?.isConnected && host === nextHost && signature === nextSignature) {
      show(data);
      return;
    }
    if (root) state.opened = root.open;
    if (state.page !== page || state.tab !== tab) {
      Object.assign(state, { page, tab, query: '', criteria: blankCriteria(tab), parsed: null, error: '', searched: false, opened: false });
      focusedId = '';
    }
    if (!root?.isConnected || host !== nextHost) {
      root?.remove();
      root = document.createElement('details');
      root.id = ROOT_ID;
      nextHost.insertAdjacentElement('afterend', root);
      wire();
    }
    for (const field of ['location', 'park']) {
      if (!choices(data.jobs, field).includes(state.criteria[field])) {
        if (state.criteria[field]) state.searched = false;
        state.criteria[field] = '';
      }
    }
    host = nextHost;
    signature = nextSignature;
    root.lang = data.lang;
    root.open = state.opened;
    root.innerHTML = markup(data, state);
    show(data);
    if (focusedId && (document.activeElement === document.body || root.contains(document.activeElement))) {
      document.getElementById(focusedId)?.focus({ preventScroll: true });
    }
  }

  function start() {
    if (!['jobs', 'internal'].includes(document.body?.dataset.page)) return;
    const app = document.getElementById('app');
    if (!app || observer) return;
    refresh();
    window.addEventListener('md:jobs-view-change', refresh);
    document.addEventListener('focusin', event => { focusedId = root?.contains(event.target) ? event.target.id : ''; });
    observer = new MutationObserver(records => {
      if (queued || records.every(record => record.target.closest?.(`#${ROOT_ID}`))) return;
      queued = true;
      queueMicrotask(() => { queued = false; refresh(); });
    });
    observer.observe(app, { childList: true, subtree: true });
  }

  window.MDNaturalJobSearch = Object.freeze({ parseQuery, filterJobs, jobLink, refresh });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
