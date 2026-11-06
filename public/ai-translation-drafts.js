/* Optional translation draft review for the public CMS demo. */
(() => {
  'use strict';
  if (window.MDTranslationDrafts) return;

  const panelSelector = '[data-l10n-kind]';
  const formIds = { home: 'homeEditForm', job: 'jobEditForm', post: 'postEditForm' };
  const languages = { en: 'en', zh: 'zh-Hans', ko: 'ko' };
  const fieldNames = {
    heroLine1: 'Dòng tiêu đề 1', heroLine2: 'Dòng tiêu đề 2', heroIntro: 'Mô tả Hero',
    aboutTitle: 'Tiêu đề giới thiệu', aboutIntro: 'Nội dung giới thiệu', galleryTitle: 'Tiêu đề album',
    videoTitle: 'Tiêu đề video', videoIntro: 'Giới thiệu video', title: 'Tiêu đề', description: 'Mô tả công việc',
    requirements: 'Yêu cầu', benefits: 'Quyền lợi', apply: 'Cách ứng tuyển', excerpt: 'Mô tả ngắn',
    body: 'Nội dung bài viết', seoTitle: 'Tiêu đề SEO', meta: 'Mô tả tìm kiếm'
  };
  const normalize = value => typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
  const allowedFields = panel => (panel.dataset.l10nFields || '').split(',').filter(key => Object.hasOwn(fieldNames, key));

  function findSample({ lang, kind, id, key, source }) {
    const original = normalize(source);
    if (!original || !Object.hasOwn(languages, lang)) return '';
    const value = normalize(window.MDPrototypeBridge?.translationSample?.(lang, kind, id, key, original));
    return value === original ? '' : value;
  }

  function readContext(panel, key) {
    if (!panel.isConnected || !allowedFields(panel).includes(key)) return null;
    const { l10nKind: kind, l10nId: id } = panel.dataset;
    const form = panel.closest('form');
    const select = panel.querySelector('[data-l10n-lang]');
    const lang = select?.value;
    if (!id || !Object.hasOwn(formIds, kind) || form?.id !== formIds[kind] || !Object.hasOwn(languages, lang)) return null;
    const sourceControl = form.elements.namedItem(key);
    const targets = [...panel.querySelectorAll('.l10n-fields textarea[data-l10n-key]')].filter(field => field.dataset.l10nKey === key);
    const [targetControl] = targets;
    if (!sourceControl?.matches?.('textarea, input:not([type]), input[type="text"]') || targets.length !== 1 ||
        targetControl.form !== form || targetControl.matches(':disabled') || targetControl.readOnly) return null;
    return { panel, form, select, kind, id, key, lang, sourceControl, targetControl, source: sourceControl.value, target: targetControl.value };
  }

  function isCurrent(panel, draft) {
    const current = readContext(panel, draft.key);
    return !!current && ['panel', 'form', 'select', 'kind', 'id', 'lang', 'sourceControl', 'targetControl', 'source', 'target']
      .every(key => current[key] === draft[key]);
  }

  function applyDraft(panel, draft, value, allowReplace) {
    if (!draft || !isCurrent(panel, draft)) return 'stale';
    const proposed = normalize(value);
    if (!proposed || proposed === normalize(draft.source)) return 'invalid';
    if (proposed === normalize(draft.target)) return 'unchanged';
    if (normalize(draft.target) && !allowReplace) return 'replace';
    draft.targetControl.value = value;
    return 'applied';
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function button(text, className = 'btn light') {
    const node = element('button', className, text);
    node.type = 'button';
    return node;
  }

  function labeled(text, control, className = 'md-translation-drafts-field') {
    const label = element('label', className);
    label.append(element('span', '', text), control);
    return label;
  }

  function mount(panel) {
    const fields = allowedFields(panel);
    const translationFields = panel.querySelector('.l10n-fields');
    if (!fields.length || !translationFields) return null;

    const root = element('details', 'md-translation-drafts');
    root.dataset.mdTranslationDrafts = '';
    const heading = element('summary', '', 'Thử trợ lý dịch');
    const body = element('div', 'md-translation-drafts-body');
    const intro = element('p', '', 'Demo dùng bản dịch có sẵn cho nội dung mẫu. Bạn có thể tự soạn bản nháp cho nội dung khác.');
    const controls = element('div', 'md-translation-drafts-controls');
    const fieldSelect = element('select');
    const placeholder = element('option', '', 'Chọn trường');
    placeholder.value = '';
    fieldSelect.append(placeholder);
    for (const key of fields) {
      const option = element('option', '', fieldNames[key]);
      option.value = key;
      fieldSelect.append(option);
    }
    const create = button('Tạo bản nháp');
    create.disabled = true;
    controls.append(labeled('Trường cần dịch', fieldSelect), create);

    const review = element('div', 'md-translation-drafts-review');
    review.hidden = true;
    const notice = element('p');
    const columns = element('div', 'md-translation-drafts-columns');
    const source = element('textarea');
    source.readOnly = true;
    source.lang = 'vi';
    source.rows = 4;
    const proposal = element('textarea');
    proposal.rows = 4;
    columns.append(labeled('Nguồn tiếng Việt', source), labeled('Bản nháp cần xem lại', proposal));
    const previous = element('details', 'md-translation-drafts-previous');
    const previousValue = element('div', 'md-translation-drafts-previous-value');
    previous.append(element('summary', '', 'Xem bản dịch đang có'), previousValue);
    const confirm = element('input');
    confirm.type = 'checkbox';
    const confirmLabel = labeled('Tôi đồng ý thay nội dung hiện có của trường này.', confirm, 'md-translation-drafts-confirm');
    const apply = button('Điền vào ô bản dịch', 'btn blue');
    const footer = element('div', 'md-translation-drafts-controls');
    footer.append(apply, element('p', '', 'Sau khi điền, dùng nút Lưu bản dịch của CMS để lưu thay đổi.'));
    review.append(notice, columns, previous, confirmLabel, footer);
    const status = element('p', 'md-translation-drafts-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    body.append(intro, controls, review, status);
    root.append(heading, body);
    translationFields.before(root);

    let draft;
    let initialProposal = '';
    let stale = false;
    const syncApply = () => {
      const value = normalize(proposal.value);
      const hasReplacement = !!draft && !!value && !!normalize(draft.target) && value !== normalize(draft.target);
      confirmLabel.hidden = stale || !hasReplacement;
      if (confirmLabel.hidden) confirm.checked = false;
      apply.disabled = !draft || stale || !value || value === normalize(draft.source) || (hasReplacement && !confirm.checked);
    };
    const checkContext = () => {
      if (!draft || stale || (fieldSelect.value === draft.key && isCurrent(panel, draft))) return;
      stale = true;
      status.textContent = 'Nội dung hoặc lựa chọn đã thay đổi. Hãy tạo bản nháp mới để điền vào biểu mẫu.';
      syncApply();
    };
    fieldSelect.addEventListener('change', () => {
      create.disabled = !fieldSelect.value;
      checkContext();
    });
    create.addEventListener('click', () => {
      checkContext();
      if (draft && !stale) {
        proposal.focus();
        return;
      }
      const context = readContext(panel, fieldSelect.value);
      if (!context || !normalize(context.source)) {
        status.textContent = 'Hãy nhập nội dung tiếng Việt của trường đã chọn trước khi tạo bản nháp.';
        return;
      }
      if (draft && proposal.value !== initialProposal && !window.confirm('Tạo bản nháp mới sẽ thay phần dịch bạn đã chỉnh sửa. Tiếp tục?')) return;
      draft = context;
      stale = false;
      const value = findSample(draft);
      const languageName = draft.select.selectedOptions[0].textContent;
      notice.textContent = value
        ? `Bản dịch mẫu · ${languageName}. Hãy đối chiếu với nguồn và chỉnh sửa trước khi điền.`
        : `Demo chưa có bản dịch mẫu phù hợp · ${languageName}. Bạn có thể tự nhập bản nháp bên dưới.`;
      source.value = draft.source;
      proposal.value = value;
      initialProposal = value;
      proposal.lang = previousValue.lang = languages[draft.lang];
      previous.hidden = !normalize(draft.target);
      previous.open = false;
      previousValue.textContent = draft.target;
      confirm.checked = false;
      review.hidden = false;
      status.textContent = '';
      syncApply();
      proposal.focus();
    });
    proposal.addEventListener('input', () => {
      if (!stale) status.textContent = normalize(proposal.value) === normalize(draft?.source)
        ? 'Hãy nhập bản dịch khác với nội dung nguồn tiếng Việt.' : '';
      syncApply();
    });
    confirm.addEventListener('change', syncApply);
    apply.addEventListener('click', () => {
      checkContext();
      if (!draft || stale) return;
      const outcome = applyDraft(panel, draft, proposal.value, confirm.checked);
      if (outcome !== 'applied' && outcome !== 'unchanged') return;
      const target = draft.targetControl;
      draft = null;
      review.hidden = true;
      status.textContent = outcome === 'applied'
        ? 'Đã điền bản nháp vào ô bản dịch. Hãy kiểm tra và bấm Lưu bản dịch khi sẵn sàng.'
        : 'Ô bản dịch đã có nội dung này. Bạn có thể chỉnh trực tiếp hoặc bấm Lưu bản dịch.';
      target.focus();
    });
    return { root, checkContext };
  }

  function init() {
    if (location.pathname.split('/').pop() !== 'cms-demo.html' || document.body.dataset.page !== 'admin') return;
    const app = document.getElementById('app');
    if (!app) return;
    const mounted = new WeakMap();
    const sync = () => {
      for (const panel of app.querySelectorAll(panelSelector)) {
        let widget = mounted.get(panel);
        if (!widget?.root.isConnected) {
          widget = mount(panel);
          if (widget) mounted.set(panel, widget);
        }
        widget?.checkContext();
      }
    };
    const check = () => {
      for (const panel of app.querySelectorAll(panelSelector)) mounted.get(panel)?.checkContext();
    };
    app.addEventListener('input', check);
    app.addEventListener('change', check);
    new MutationObserver(sync).observe(app, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['data-l10n-kind', 'data-l10n-id', 'data-l10n-fields']
    });
    sync();
  }

  window.MDTranslationDrafts = Object.freeze({ findSample, readContext, applyDraft });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
