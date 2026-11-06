const STORAGE_KEY = 'md-sheets-sync-demo-v1';
const MUTATION_LOCK = `${STORAGE_KEY}:write`;
const STORAGE_VERSION = 1;
const HISTORY_LIMIT = 16;
const SHEETS = {
  applications: {
    name: 'Applications',
    columns: [
      ['Mã hồ sơ', 'Application ID'], ['Tên hiển thị', 'Candidate'],
      ['Vị trí', 'Role'], ['Ca làm', 'Shift'], ['Trạng thái', 'Status']
    ]
  },
  b2b: {
    name: 'B2B',
    columns: [
      ['Mã hồ sơ', 'Request ID'], ['Đơn vị mẫu', 'Company'],
      ['Nhu cầu', 'Service'], ['Quy mô', 'Headcount'], ['Trạng thái', 'Status']
    ]
  }
};

const RECORDS = {
  'APP-DEMO-01': { sheet: 'applications', name: 'Ứng viên Mẫu A', values: ['Vận hành đóng gói', 'Ca ngày', 'Mới'], update: ['Vận hành đóng gói', 'Ca xoay', 'Đã sơ tuyển'] },
  'APP-DEMO-02': { sheet: 'applications', name: 'Ứng viên Mẫu B', values: ['Kiểm tra chất lượng', 'Ca tối', 'Mới'], update: ['Kiểm tra chất lượng', 'Ca tối', 'Chờ phỏng vấn'] },
  'B2B-DEMO-01': { sheet: 'b2b', name: 'Doanh nghiệp Mẫu A', values: ['Bổ sung lao động kho', '12', 'Mới'], update: ['Bổ sung lao động kho', '18', 'Đã tiếp nhận'] },
  'B2B-DEMO-02': { sheet: 'b2b', name: 'Doanh nghiệp Mẫu B', values: ['Nhân sự đóng gói', '20', 'Mới'], update: ['Nhân sự đóng gói', '24', 'Đã tiếp nhận'] }
};

const OUTCOMES = {
  queued: 'Đã thêm vào hàng đợi',
  failed: 'Lỗi giả lập · Hồ sơ vẫn trong hàng đợi',
  inserted: 'Đã thêm dòng mới',
  updated: 'Đã cập nhật dòng hiện có',
  retryInserted: 'Thử lại thành công · Đã thêm dòng mới',
  retryUpdated: 'Thử lại thành công · Đã cập nhật dòng hiện có'
};

const FEEDBACK = {
  ...OUTCOMES,
  pending: 'Hồ sơ đang trong hàng đợi. Hãy xử lý hồ sơ trước khi thêm phiên bản khác',
  unchanged: 'Trang tính đã có phiên bản này hoặc phiên bản mới hơn',
  invalid: 'Thao tác không hợp lệ. Hãy kiểm tra lựa chọn và thử lại',
  missing: 'Hồ sơ không còn ở trạng thái cần xử lý. Danh sách đã được làm mới',
  reset: 'Đã xóa hàng đợi, bảng kết quả và lịch sử mẫu',
  unavailable: 'Trình duyệt không cho phép lưu dữ liệu mô phỏng. Vui lòng kiểm tra quyền lưu trữ và thử lại'
};

const SCOPE_LABELS = {
  shared: 'Lưu chung giữa các thẻ của trang này trong cùng trình duyệt.',
  tab: 'Lưu riêng trong thẻ này và giữ lại khi tải lại trang.',
  memory: 'Lưu tạm trên trang đang mở. Dữ liệu sẽ mất khi tải lại.'
};

const RECORD_LIMIT = Object.keys(RECORDS).length;

function knownRecord(value) {
  return typeof value === 'string' && Object.hasOwn(RECORDS, value);
}

function validRevision(value) {
  return value === 1 || value === 2;
}

function validEntry(value) {
  return value && knownRecord(value.id) && validRevision(value.revision);
}

function readEntries(value, allow, copy) {
  if (!Array.isArray(value)) return [];
  const entries = new Map();
  for (const entry of value.slice(0, RECORD_LIMIT)) {
    if (validEntry(entry) && allow(entry) && !entries.has(entry.id)) {
      entries.set(entry.id, copy(entry));
    }
  }
  return [...entries.values()];
}

export function createModel(raw = null) {
  const empty = { version: STORAGE_VERSION, queue: [], rows: [], history: [] };
  if (typeof raw !== 'string' || raw.length > 16000) return empty;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return empty;
  }
  if (saved?.version !== STORAGE_VERSION) return empty;

  const rows = readEntries(saved.rows, () => true, ({ id, revision }) => ({ id, revision }));
  const queue = readEntries(saved.queue, entry => (
    (entry.status === 'queued' || entry.status === 'failed') &&
    !rows.some(row => row.id === entry.id && row.revision >= entry.revision)
  ), ({ id, revision, status }) => ({ id, revision, status }));
  const history = Array.isArray(saved.history) ? saved.history.slice(0, HISTORY_LIMIT)
    .filter(entry => validEntry(entry) && typeof entry.code === 'string' && Object.hasOwn(OUTCOMES, entry.code))
    .map(({ id, revision, code }) => ({ id, revision, code })) : [];
  return { version: STORAGE_VERSION, queue, rows, history };
}

function recordOutcome(state, { id, revision }, code, changes) {
  return {
    state: { ...state, ...changes, history: [{ id, revision, code }, ...state.history].slice(0, HISTORY_LIMIT) },
    code
  };
}

export function applyAction(state, action) {
  if (action?.type === 'reset' && action.confirmed === true) return { state: createModel(), code: 'reset' };
  if (!knownRecord(action?.id)) return { state, code: 'invalid' };

  const { id, type, revision } = action;
  const row = state.rows.find(item => item.id === id);
  const pending = state.queue.find(item => item.id === id);
  if (type === 'enqueue') {
    if (!validRevision(revision)) return { state, code: 'invalid' };
    if (pending) return { state, code: 'pending' };
    if (row && row.revision >= revision) return { state, code: 'unchanged' };
    const next = { id, revision, status: 'queued' };
    return recordOutcome(state, next, 'queued', { queue: [...state.queue, next] });
  }

  if (type !== 'fail' && type !== 'write' && type !== 'retry') return { state, code: 'invalid' };
  const expected = type === 'retry' ? 'failed' : 'queued';
  if (!pending || pending.revision !== revision || pending.status !== expected) return { state, code: 'missing' };
  if (type === 'fail') {
    const queue = state.queue.map(item => item.id === id ? { ...item, status: 'failed' } : item);
    return recordOutcome(state, pending, 'failed', { queue });
  }

  const updated = { id, revision: pending.revision };
  const rows = row ? state.rows.map(item => item.id === id ? updated : item) : [...state.rows, updated];
  const queue = state.queue.filter(item => item.id !== id);
  let code = row ? 'updated' : 'inserted';
  if (type === 'retry') code = row ? 'retryUpdated' : 'retryInserted';
  return recordOutcome(state, pending, code, { rows, queue });
}

export function createSession(storage) {
  function read() {
    try {
      return { state: createModel(storage.getItem(STORAGE_KEY)), available: true };
    } catch {
      return { state: createModel(), available: false };
    }
  }

  function mutate(action) {
    const { state, available } = read();
    if (!available) return { state, code: 'unavailable' };
    const result = applyAction(state, action);
    if (result.state === state) return result;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(result.state));
      return result;
    } catch {
      return { state, code: 'unavailable' };
    }
  }

  return { read, mutate };
}

function storageSession(browser, key, scope) {
  try {
    const session = createSession(browser[key]);
    return session.read().available ? { ...session, scope } : null;
  } catch {
    return null;
  }
}

function memorySession(state = createModel()) {
  let raw = JSON.stringify(state);
  const session = createSession({ getItem: () => raw, setItem: (_, value) => { raw = value; } });
  return { ...session, scope: 'memory' };
}

export function createBrowserSession(browser) {
  let lockManager;
  try {
    const candidate = browser.navigator?.locks;
    if (typeof candidate?.request === 'function') lockManager = candidate;
  } catch {
    // Restricted frames may deny access to Web Locks.
  }

  function isolatedSession() {
    return storageSession(browser, 'sessionStorage', 'tab') ?? memorySession();
  }

  let backing = (lockManager && storageSession(browser, 'localStorage', 'shared')) || isolatedSession();
  let operations = Promise.resolve();

  async function performMutation(action) {
    if (backing.scope === 'shared') {
      try {
        // A shared mutation must read, sanitize and write inside the same origin lock.
        return await lockManager.request(MUTATION_LOCK, { mode: 'exclusive' }, () => backing.mutate(action));
      } catch {
        backing = isolatedSession();
      }
    }

    const result = backing.mutate(action);
    if (result.code !== 'unavailable' || backing.scope !== 'tab') return result;
    backing = memorySession(result.state);
    return backing.mutate(action);
  }

  return {
    read: () => ({ ...backing.read(), scope: backing.scope }),
    mutate(action) {
      const result = operations.then(() => performMutation(action));
      operations = result.catch(() => {});
      return result;
    }
  };
}

function node(tag, value, className) {
  const element = document.createElement(tag);
  if (value !== undefined) element.textContent = value;
  if (className) element.className = className;
  return element;
}

function valuesFor({ id, revision }) {
  const record = RECORDS[id];
  return [id, record.name, ...(revision === 2 ? record.update : record.values)];
}

function cells(tag, values) {
  const row = node('tr');
  row.append(...values.map(value => {
    const cell = node(tag, value);
    if (tag === 'th') cell.scope = 'col';
    return cell;
  }));
  return row;
}

function option(value, label) {
  const element = node('option', label);
  element.value = value;
  return element;
}

function mount() {
  const $ = id => document.getElementById(`sync-${id}`);
  const workspace = $('workspace');
  if (!workspace) return;

  const session = createBrowserSession(window);
  const form = $('form');
  const sheet = $('sheet');
  const record = $('record');
  const revision = $('revision');
  const feedback = $('feedback');
  const storageScope = $('storage-scope');
  const queueList = $('queue');
  const queueTitle = $('queue-title');
  const resetPanel = $('reset-panel');
  const consent = $('reset-consent');
  const reset = $('reset');
  let current = session.read();

  function announce(code) {
    feedback.textContent = `${FEEDBACK[code]}.`;
    feedback.dataset.tone = ['failed', 'invalid', 'unavailable', 'pending', 'missing'].includes(code) ? 'warning' : 'info';
  }

  async function update(action) {
    const result = await session.mutate(action);
    current = session.read();
    render();
    announce(result.code);
    return result.code;
  }

  function renderSelection() {
    const version = Number(revision.value);
    if (!knownRecord(record.value) || RECORDS[record.value].sheet !== sheet.value || !validRevision(version)) {
      announce('invalid');
      return;
    }
    const columns = SHEETS[sheet.value].columns;
    const values = valuesFor({ id: record.value, revision: version });
    $('mapping').replaceChildren(...columns.map(([source, target], index) => cells('td', [source, target, values[index]])));

    const rows = current.state.rows.filter(item => RECORDS[item.id].sheet === sheet.value);
    $('rows-caption').textContent = `Trang tính ${SHEETS[sheet.value].name}`;
    $('rows-count').textContent = `${rows.length} dòng`;
    $('rows-columns').replaceChildren(cells('th', columns.map(([, target]) => target)));
    const entries = rows.map(row => cells('td', valuesFor(row)));
    if (!entries.length) {
      const empty = cells('td', ['Chưa có dòng nào trên trang tính này.']);
      empty.firstElementChild.colSpan = columns.length;
      empty.firstElementChild.className = 'sync-table-empty';
      entries.push(empty);
    }
    $('rows').replaceChildren(...entries);
  }

  function selectSheet() {
    const choices = Object.entries(RECORDS).filter(([, item]) => item.sheet === sheet.value);
    record.replaceChildren(...choices.map(([id, item]) => option(id, `${item.name} · ${id}`)));
    renderSelection();
  }

  function queueButton(item, type, label, primary = false) {
    const button = node('button', label, `sync-button${primary ? ' sync-primary' : ''}`);
    button.type = 'button';
    button.dataset.syncQueueAction = `${item.id}:${item.revision}:${type}`;
    button.setAttribute('aria-label', `${label} · ${item.id} · V${item.revision}`);
    button.addEventListener('click', () => update({ type, id: item.id, revision: item.revision }));
    return button;
  }

  function render() {
    renderSelection();
    const scopeLabel = SCOPE_LABELS[current.scope];
    if (storageScope.textContent !== scopeLabel) storageScope.textContent = scopeLabel;
    const { queue, history } = current.state;
    $('queue-count').textContent = `${queue.length} hồ sơ`;
    $('queue-empty').hidden = queue.length !== 0;
    const active = document.activeElement;
    const activeAction = queueList.contains(active) ? active.dataset.syncQueueAction : null;
    queueList.replaceChildren(...queue.map(item => {
      const entry = node('li', undefined, 'sync-item');
      const details = node('div', undefined, 'sync-item-details');
      const data = RECORDS[item.id];
      const status = item.status === 'failed' ? 'Lỗi giả lập · Chờ thử lại' : 'Chờ xử lý';
      details.append(node('strong', data.name), node('small', `${item.id} · V${item.revision} · ${SHEETS[data.sheet].name}`));
      const badge = node('span', status, 'sync-badge');
      badge.dataset.tone = item.status === 'failed' ? 'warning' : 'info';
      details.append(badge);
      const actions = node('div', undefined, 'sync-actions');
      if (item.status === 'failed') actions.append(queueButton(item, 'retry', 'Thử lại', true));
      else actions.append(queueButton(item, 'fail', 'Mô phỏng lỗi'), queueButton(item, 'write', 'Ghi vào bảng', true));
      entry.append(details, actions);
      return entry;
    }));
    if (activeAction) {
      const replacement = Array.from(queueList.querySelectorAll('[data-sync-queue-action]'))
        .find(button => button.dataset.syncQueueAction === activeAction);
      (replacement ?? queueTitle).focus();
    }
    $('history-empty').hidden = history.length !== 0;
    $('history').replaceChildren(...history.map(({ id, revision: version, code }) => {
      const entry = node('li', undefined, 'sync-item');
      const label = node('div', undefined, 'sync-item-details');
      label.append(node('strong', OUTCOMES[code]), node('small', `${id} · V${version} · ${SHEETS[RECORDS[id].sheet].name}`));
      entry.append(label);
      return entry;
    }));
  }

  sheet.replaceChildren(...Object.entries(SHEETS).map(([id, item]) => option(id, item.name)));
  sheet.addEventListener('change', selectSheet);
  record.addEventListener('change', renderSelection);
  revision.addEventListener('change', renderSelection);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const id = record.value;
    if (!knownRecord(id) || RECORDS[id].sheet !== sheet.value) {
      announce('invalid');
      return;
    }
    update({ type: 'enqueue', id, revision: Number(revision.value) });
  });
  consent.addEventListener('change', () => { reset.disabled = !consent.checked; });
  resetPanel.addEventListener('toggle', () => {
    if (!resetPanel.open) {
      consent.checked = false;
      reset.disabled = true;
    }
  });
  reset.addEventListener('click', async () => {
    if (await update({ type: 'reset', confirmed: consent.checked }) !== 'reset') return;
    consent.checked = false;
    if (document.activeElement === reset) $('reset-summary').focus();
    reset.disabled = true;
  });
  window.addEventListener('storage', event => {
    if (current.scope !== 'shared' || (event.key !== STORAGE_KEY && event.key !== null)) return;
    current = session.read();
    render();
  });
  selectSheet();
  render();
  workspace.hidden = false;
  if (!current.available) announce('unavailable');
}

if (typeof document !== 'undefined') mount();
