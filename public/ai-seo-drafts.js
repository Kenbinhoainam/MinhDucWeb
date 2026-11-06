(() => {
  'use strict';

  if (window.MDSeoDrafts) return;

  const ROOT = '[data-md-seo-drafts]';
  const MAX_TOPIC = 110;
  const fields = [
    { name: 'title', label: 'Tiêu đề bài viết', max: 140 },
    { name: 'keyword', label: 'Từ khóa SEO', max: MAX_TOPIC },
    { name: 'seoTitle', label: 'Tiêu đề SEO', max: 70 },
    { name: 'meta', label: 'Mô tả SEO', max: 165, rows: 3 },
    { name: 'excerpt', label: 'Mô tả ngắn', max: 290, rows: 3 },
    { name: 'body', label: 'Nội dung bài viết', rows: 12 }
  ];
  const templates = [
    {
      match: /\b(luong|phu cap|phuc loi|bao hiem|quyen loi|hop dong)\b/,
      title: 'Những điểm cần làm rõ trước khi nhận việc',
      seo: 'Các mục cần đối chiếu',
      summary: 'Cách đối chiếu thông tin trong tin tuyển dụng, thư mời nhận việc và hợp đồng.',
      sections: [
        ['Đọc kỹ thông tin ban đầu', 'Lưu lại tin tuyển dụng và ghi riêng những điều kiện bạn chưa rõ. Nếu tin đăng nhắc đến phụ cấp hoặc thưởng, hãy hỏi khoản nào được trả cố định, khoản nào phụ thuộc vào điều kiện cụ thể.'],
        ['Đối chiếu trước khi đồng ý', 'So sánh thông tin đã trao đổi với văn bản bạn được cung cấp. Bạn có thể hỏi cách tính thu nhập, thời điểm chi trả, lịch làm việc và đầu mối giải đáp khi có chênh lệch. Ghi lại phần cần xác nhận để tiện theo dõi.'],
        ['Giữ thông tin để tra cứu', 'Giữ bản sao giấy tờ và nội dung xác nhận qua kênh chính thức. Khi một điều kiện ảnh hưởng đến quyết định nhận việc, đề nghị người phụ trách giải thích bằng ví dụ phù hợp với vị trí của bạn.']
      ]
    },
    {
      match: /\b(phong van|ho so|ung tuyen|thu viec|nhan viec)\b/,
      title: 'Cách chuẩn bị từng bước',
      seo: 'Hướng dẫn chuẩn bị',
      summary: 'Các bước đọc yêu cầu, chuẩn bị thông tin và trao đổi với người phụ trách tuyển dụng.',
      sections: [
        ['Đọc lại yêu cầu của vị trí', 'Ghi lại công việc chính, địa điểm, ca làm và cách ứng tuyển. Nếu tin đăng chưa nêu đầy đủ, hãy xác nhận các thông tin có thể ảnh hưởng đến lịch trình hoặc việc đi lại của bạn.'],
        ['Chuẩn bị thông tin cần thiết', 'Sắp xếp kinh nghiệm và kỹ năng theo yêu cầu của vị trí. Chuẩn bị một ví dụ cụ thể về công việc bạn từng làm và một vài câu hỏi muốn trao đổi. Xác nhận trước giấy tờ cần mang và kênh nhận hồ sơ.'],
        ['Theo dõi sau khi trao đổi', 'Ghi lại người liên hệ, mốc phản hồi dự kiến và những nội dung hai bên còn cần làm rõ. Nếu cần bổ sung thông tin, gửi qua kênh đã được xác nhận và giữ bản sao để tiện đối chiếu.']
      ]
    },
    {
      match: /\b(tuyen dung|viec lam|cong nhan|khu cong nghiep|nha may|lao dong|nhan su)\b/,
      title: 'Thông tin cần kiểm tra và cách chuẩn bị',
      seo: 'Hướng dẫn thực tế',
      summary: 'Các bước kiểm tra tin tuyển dụng, so sánh điều kiện làm việc và chuẩn bị ứng tuyển.',
      sections: [
        ['Xác định công việc phù hợp', 'Bắt đầu bằng các tiêu chí bạn có thể kiểm tra: địa điểm làm việc, nhiệm vụ chính, lịch làm và yêu cầu kinh nghiệm. Đọc kỹ mô tả để biết điểm nào phù hợp và điểm nào cần trao đổi thêm.'],
        ['Xác nhận các điều kiện thực tế', 'Hỏi người phụ trách về cách tính thu nhập, khoản phụ cấp nếu có, ca làm và phương án đi lại. Khi so sánh nhiều vị trí, dùng cùng một nhóm tiêu chí để nhìn rõ điểm khác nhau.'],
        ['Chuẩn bị bước ứng tuyển', 'Xác nhận vị trí còn tuyển, giấy tờ cần nộp và kênh liên hệ chính thức. Ghi lại tên vị trí và thời điểm đã gửi hồ sơ để tiện theo dõi khi có phản hồi.']
      ]
    },
    {
      title: 'Những điều cần biết và cách áp dụng',
      seo: 'Điểm cần biết',
      summary: 'Cách xác định thông tin cần thiết, đối chiếu nguồn và chuẩn bị bước tiếp theo.',
      sections: [
        ['Bắt đầu từ câu hỏi cụ thể', 'Xác định điều bạn muốn tìm hiểu và bối cảnh áp dụng. Ghi lại các câu hỏi theo thứ tự ưu tiên, bắt đầu từ thông tin có thể ảnh hưởng trực tiếp đến quyết định của bạn.'],
        ['Kiểm tra nguồn và điều kiện áp dụng', 'Ưu tiên thông tin có ngày cập nhật và đơn vị chịu trách nhiệm rõ ràng. Khi hai nguồn đưa ra nội dung khác nhau, xem mỗi nguồn đang nói về đối tượng, thời điểm và điều kiện nào.'],
        ['Chuẩn bị việc cần làm tiếp theo', 'Tóm tắt điều đã xác nhận, thông tin cần bổ sung và người có thể giải đáp. Nếu bạn cần trao đổi với người phụ trách, hãy nêu rõ tình huống của mình và hỏi về bước tiếp theo.']
      ]
    }
  ];
  const sources = new WeakMap();

  function isDemoPath(pathname) {
    return /\/cms-demo(?:\.html)?\/?$/.test(pathname);
  }

  function fit(text, max) {
    if (text.length <= max) return text;
    const shortened = text.slice(0, max - 1).replace(/[\uD800-\uDBFF]$/, '');
    const lastSpace = shortened.lastIndexOf(' ');
    return (lastSpace >= max * 0.75 ? shortened.slice(0, lastSpace) : shortened).trimEnd() + '…';
  }

  function normalizeTopic(input) {
    return String(input ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  }

  function generateDraft(input) {
    const keyword = normalizeTopic(input);
    if (keyword.length > MAX_TOPIC || !/[\p{L}\p{N}]/u.test(keyword)) return null;

    const first = [...keyword][0];
    const topic = first.toLocaleUpperCase('vi-VN') + keyword.slice(first.length);
    const normalized = keyword.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
    const template = templates.find(item => !item.match || item.match.test(normalized));
    const excerpt = `Bạn đang tìm hiểu về “${keyword}”? ${template.summary}`;
    return {
      title: fit(`${topic}: ${template.title}`, 140),
      keyword,
      seoTitle: fit(`${topic}: ${template.seo}`, 70),
      slug: normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,160) || 'bai-viet',
      meta: fit(`${topic}. ${template.summary}`, 165),
      excerpt,
      outline: ['Mở bài', ...template.sections.map(([heading]) => heading), 'Kết luận'],
      body: [
        excerpt,
        ...template.sections.flat(),
        `Trước khi quyết định, dành thời gian rà lại các thông tin quan trọng về “${keyword}”. Lưu những nội dung đã xác nhận và liên hệ đầu mối phù hợp để làm rõ các câu hỏi còn lại.`
      ].join('\n\n')
    };
  }

  function captureSource(form) {
    if (form?.id !== 'postEditForm' || !form.isConnected) return null;
    const recordId = form.querySelector('[data-l10n-kind="post"][data-l10n-id]')?.dataset.l10nId;
    const type = form.elements.namedItem('type');
    if (!recordId || type?.form !== form) return null;

    const controls = fields.map(({ name }) => form.elements.namedItem(name));
    if (controls.some(control => control?.form !== form || control.disabled || control.readOnly ||
      (control.tagName !== 'TEXTAREA' && control.type !== 'text'))) return null;

    return { form, recordId, type, postType: type.value, controls, values: controls.map(control => control.value) };
  }

  function applyDraft(form, source, draft) {
    const current = captureSource(form);
    if (!source || !current || current.form !== source.form || current.recordId !== source.recordId ||
      current.type !== source.type || current.postType !== source.postType ||
      current.controls.some((control, i) => control !== source.controls[i] || control.value !== source.values[i])) {
      return 'stale';
    }

    const values = fields.map(({ name }) => typeof draft?.[name] === 'string' ? draft[name].trim() : '');
    if (values.some((value, i) => {
      const { max } = fields[i];
      const nativeMax = current.controls[i].maxLength;
      return !value || (max && value.length > max) || (nativeMax >= 0 && value.length > nativeMax);
    })) return 'invalid';

    const changed = [];
    current.controls.forEach((control, i) => {
      if (control.value === values[i]) return;
      control.value = values[i];
      changed.push(control);
    });
    changed.forEach(control => {
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return 'applied';
  }

  function currentForm() {
    return document.querySelector('#adminContent #postEditForm');
  }

  function mount() {
    const card = currentForm()?.querySelector('.cms-ai-seo');
    if (!card || card.querySelector(ROOT)) return;
    const panel = document.createElement('section');
    panel.dataset.mdSeoDrafts = '';
    panel.lang = 'vi';
    panel.setAttribute('aria-labelledby', 'md-seo-draft-heading');
    panel.innerHTML = `
      <div class="md-seo-draft-heading">
        <h4 id="md-seo-draft-heading">Soạn nháp bài viết SEO</h4>
        <span class="md-seo-draft-badge">AI mô phỏng</span>
      </div>
      <p>Bản nháp tiếng Việt được tạo theo mẫu. Hãy rà soát nội dung trước khi lưu.</p>
      <div class="md-seo-draft-start">
        <label>
          <span>Chủ đề hoặc từ khóa</span>
          <input type="text" data-seo-topic maxlength="${MAX_TOPIC}" autocomplete="off" placeholder="Ví dụ: Chuẩn bị hồ sơ ứng tuyển">
        </label>
        <button type="button" class="btn light" data-seo-action="generate">Tạo bản nháp</button>
      </div>
      <div class="md-seo-draft-preview" data-seo-preview hidden>
        <h5 data-seo-preview-heading tabindex="-1">Xem trước và chỉnh sửa</h5>
        <p>Đường dẫn gợi ý cho bản chính thức <code data-seo-slug></code></p>
        <details class="md-seo-draft-outline" open>
          <summary>Dàn ý tham khảo</summary>
          <ol data-seo-outline></ol>
        </details>
        <div class="md-seo-draft-fields">
          ${fields.map(({ name, label, max, rows }) => {
            const attributes = `data-seo-field="${name}"${max ? ` maxlength="${max}"` : ''}`;
            const control = rows ? `<textarea ${attributes} rows="${rows}"></textarea>` : `<input type="text" ${attributes} autocomplete="off">`;
            return `<label${rows ? ' class="md-seo-draft-wide"' : ''}><span>${label}</span>${control}</label>`;
          }).join('')}
        </div>
        <p>Áp dụng sẽ thay các trường tiếng Việt tương ứng trong bài đang mở. Sau khi kiểm tra, chọn “Lưu nội dung”.</p>
        <button type="button" class="btn blue" data-seo-action="apply">Áp dụng bản nháp</button>
      </div>
      <p class="md-seo-draft-status" data-seo-status role="status"></p>`;
    card.append(panel);
  }

  function setStatus(panel, message) {
    panel.querySelector('[data-seo-status]').textContent = message;
  }

  function generate(panel, form) {
    const previous = sources.get(panel);
    const edited = previous?.generated && [...panel.querySelectorAll('[data-seo-field]')].some(control => control.value !== previous.generated[control.dataset.seoField]);
    if (edited && !window.confirm('Tạo lại sẽ thay bản nháp bạn đã chỉnh sửa. Tiếp tục?')) return;
    const topic = panel.querySelector('[data-seo-topic]');
    const draft = generateDraft(topic.value);
    const source = captureSource(form);
    if (!draft) {
      setStatus(panel, `Hãy nhập chủ đề hoặc từ khóa có tối đa ${MAX_TOPIC} ký tự.`);
      topic.setAttribute('aria-invalid', 'true');
      topic.focus();
      return;
    }
    if (!source) {
      setStatus(panel, 'Hãy mở lại trình sửa bài viết để tạo bản nháp.');
      return;
    }

    topic.removeAttribute('aria-invalid');
    sources.set(panel, { source, topic: draft.keyword, generated: { ...draft } });
    panel.querySelector('[data-seo-slug]').textContent = draft.slug;
    panel.querySelectorAll('[data-seo-field]').forEach(control => { control.value = draft[control.dataset.seoField]; });
    const items = draft.outline.map(heading => {
      const li = document.createElement('li');
      li.textContent = heading;
      return li;
    });
    panel.querySelector('[data-seo-outline]').replaceChildren(...items);
    panel.querySelector('[data-seo-preview]').hidden = false;
    setStatus(panel, 'Đã tạo bản nháp. Bạn có thể chỉnh sửa trước khi áp dụng.');
    panel.querySelector('[data-seo-preview-heading]').focus();
  }

  function apply(panel, form) {
    const draftSource = sources.get(panel);
    const topic = panel.querySelector('[data-seo-topic]');
    const currentTopic = normalizeTopic(topic.value);
    if (!draftSource || currentTopic !== draftSource.topic) {
      setStatus(panel, 'Hãy tạo lại bản nháp theo chủ đề hiện tại trước khi áp dụng.');
      topic.focus();
      return;
    }

    const draft = Object.fromEntries(Array.from(panel.querySelectorAll('[data-seo-field]'), control => [control.dataset.seoField, control.value]));
    const result = applyDraft(form, draftSource.source, draft);
    if (result === 'stale') {
      setStatus(panel, 'Bài đang sửa đã thay đổi. Hãy tạo lại bản nháp từ phiên bản hiện tại.');
      return;
    }
    if (result === 'invalid') {
      setStatus(panel, 'Hãy điền đủ nội dung trong bản nháp và kiểm tra độ dài các trường.');
      return;
    }

    draftSource.source = captureSource(form);
    setStatus(panel, 'Đã điền nội dung tiếng Việt vào bài đang mở. Kiểm tra lại rồi chọn “Lưu nội dung”.');
  }

  function init() {
    if (document.body.dataset.page !== 'admin' || !isDemoPath(location.pathname)) return;
    mount();
    const app = document.querySelector('#app');
    if (app) new MutationObserver(records => {
      if (records.some(({ target, addedNodes }) => !target.closest?.(ROOT) &&
        Array.from(addedNodes).some(node => node.nodeType === 1 && !node.matches(ROOT)))) mount();
    }).observe(app, { childList: true, subtree: true });

    document.addEventListener('click', event => {
      const button = event.target.closest?.('[data-seo-action]');
      const panel = button?.closest(ROOT);
      if (!panel) return;
      const form = currentForm();
      if (!form?.contains(panel)) return;
      if (button.dataset.seoAction === 'generate') generate(panel, form);
      if (button.dataset.seoAction === 'apply') apply(panel, form);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || event.isComposing || !event.target.matches?.('input')) return;
      const panel = event.target.closest(ROOT);
      if (!panel) return;
      const form = currentForm();
      if (!form?.contains(panel)) return;
      event.preventDefault();
      if (event.target.matches('[data-seo-topic]')) generate(panel, form);
    });
  }

  window.MDSeoDrafts = Object.freeze({ generateDraft, captureSource, applyDraft, isDemoPath });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
