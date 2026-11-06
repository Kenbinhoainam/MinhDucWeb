/* V27 company data and browser-local CMS. Public rendering is a separate module. */
(function (root) {
  'use strict';
  if (root.MDCompanyProfile) return;

  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const clone = value => JSON.parse(JSON.stringify(value));
  const record = value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === null || Object.getPrototypeOf(proto) === null;
  };
  const only = (value, keys) => record(value) && keys.every(key => own(value, key)) && Object.keys(value).every(key => keys.includes(key));
  const string = (value, max) => typeof value === 'string' && value.length <= max;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const companyKeys = ['legalName', 'description', 'facebook'];
  const branchKeys = ['id', 'name', 'address', 'mapsUrl', 'embedUrl', 'visible'];
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const initial = {
    companyProfileRevision: 27,
    company: {
      legalName: 'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA',
      description: 'Cung ứng nguồn nhân lực, tư vấn và giới thiệu việc làm, hỗ trợ tuyển dụng lao động phổ thông cho nhà máy.',
      facebook: 'https://www.facebook.com/md668.com.vn',
    },
    branches: [
      {id:'voi', name:'Chi nhánh Vôi', address:'', mapsUrl:'https://maps.app.goo.gl/2hj5gqjuaLS4t6hk8', embedUrl:'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14863.567724490309!2d106.2507006!3d21.3547575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356d35c76fdbc5%3A0xdf7f9c998ab7ef61!2zQ8O0bmcgdHkgVE5ISCBOaMOibiBMxrDMo2MgTWluaCDEkMawzIFjIFZpbmE!5e0!3m2!1sen!2s!4v1793845290681!5m2!1sen!2s', visible:true},
      {id:'bac-ninh', name:'Chi nhánh Bắc Ninh', address:'', mapsUrl:'https://maps.app.goo.gl/VjV1DbkajBXDqGUE7?g_st=iz', embedUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.408263619011!2d106.14966299999999!3d21.2553011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350d96e2bf4c4f%3A0x940bfed5d4736488!2sCty%20TNHH%20MD668%20VINA!5e0!3m2!1sen!2s!4v1793845315824!5m2!1sen!2s', visible:true},
      {id:'quang-ninh', name:'Chi nhánh Quảng Ninh', address:'', mapsUrl:'', embedUrl:'', visible:true},
    ],
    // Sheet INDEX rows 20–24 supply these names, sectors and industrial parks.
    partners: [
      ['luxshare-ict', 'Luxshare - ICT','Linh kiện điện tử, thiết bị thông minh','KCN Bắc Ninh / Bắc Giang'], ['foxconn', 'Foxconn','Điện tử, linh kiện công nghệ cao','KCN Vân Trung / Quang Châu'], ['samsung', 'Samsung','Thiết bị di động, điện tử gia dụng','KCN Bắc Ninh / Thái Nguyên'],
      ['jeiltech-vina', 'Jeiltech - Vina','Sản xuất, gia công thiết bị viễn thông (mặt hàng nhôm)','KCN Vân Trung, Bắc Ninh'], ['tacu', 'TACU','Đối tác sản xuất tiêu biểu','KCN Vân Trung'],
    ].map(([id, name, sector, park], index) => ({
      id:'md-source-' + id, name, sector, country:'', website:'', logo:'',
      demoLogoVisible:false, approved:false, sample:false, sourceListed:true,
      visible:true, featured:true, priority:index + 1,
      note:park+'. Theo danh sách Minh Đức cung cấp; chưa xác nhận quyền sử dụng logo.',
    })),
  };
  const seed = () => clone(initial);

  // Check the raw authority as well as URL: URL normalizes explicit :443,
  // dot segments and backslashes, which must not bypass these allowlists.
  function safeUrl(value, max, hosts) {
    if (!string(value, max) || !value || /[\s\\<>"'\u0000-\u001f\u007f]/.test(value) || /%(?![0-9a-f]{2})|%(?:0[0-9a-f]|1[0-9a-f]|7f|3c|3e|22|27|5c)/i.test(value)) return null;
    const raw = /^https:\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?$/.exec(value);
    if (!raw || !hosts.includes(raw[1])) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== (raw[2] || '/')) return null;
      return url;
    } catch { return null; }
  }
  function mapsUrl(value) {
    const url = safeUrl(value, 500, ['maps.app.goo.gl', 'www.google.com']);
    if (!url) return '';
    if (url.hostname === 'maps.app.goo.gl') return /^\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname) ? value : '';
    return /^\/maps(?:\/|$)/.test(url.pathname) && !/%(?:2e|2f)/i.test(url.pathname) ? value : '';
  }
  function embedUrl(value) {
    const url = safeUrl(value, 2500, ['www.google.com']);
    if (!url || url.pathname !== '/maps/embed') return '';
    const entries = [...url.searchParams];
    return entries.length === 1 && entries[0][0] === 'pb' && entries[0][1].trim() ? value : '';
  }
  function facebookUrl(value) {
    const url = safeUrl(value, 300, ['facebook.com', 'www.facebook.com']);
    return url && /^\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(url.pathname) && url.pathname !== '/' ? value : '';
  }
  function valid(data) {
    if (!record(data) || Object.keys(data).some(key => ['__proto__', 'prototype', 'constructor'].includes(key))) return false;
    if (own(data, 'companyProfileRevision') && data.companyProfileRevision !== 27) return false;
    if (own(data, 'company')) {
      const company = data.company;
      if (!only(company, companyKeys) || !string(company.legalName, 160) || !company.legalName.trim() || !string(company.description, 700) || !string(company.facebook, 300) || (company.facebook !== '' && !facebookUrl(company.facebook))) return false;
    }
    if (own(data, 'branches')) {
      if (!Array.isArray(data.branches) || data.branches.length > 20) return false;
      const seen = new Set();
      // for..of also rejects sparse entries rather than skipping their holes.
      for (const branch of data.branches) {
        if (!only(branch, branchKeys) || !string(branch.id, 80) || !slug.test(branch.id) || seen.has(branch.id) || !string(branch.name, 100) || !branch.name.trim() || !string(branch.address, 250) || !string(branch.mapsUrl, 500) || !string(branch.embedUrl, 2500) || typeof branch.visible !== 'boolean') return false;
        if ((branch.mapsUrl !== '' && !mapsUrl(branch.mapsUrl)) || (branch.embedUrl !== '' && !embedUrl(branch.embedUrl))) return false;
        seen.add(branch.id);
      }
    }
    // Other partner fields and top-level collections belong to the host schema.
    if (own(data, 'partners') && (!Array.isArray(data.partners) || data.partners.some(partner => !record(partner) || (own(partner, 'sourceListed') && typeof partner.sourceListed !== 'boolean')))) return false;
    return true;
  }
  function same(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(key => own(b, key) && same(a[key], b[key]));
  }
  function migrate(data, legacyPartners = [], {seedMissing = true} = {}) {
    if (!record(data) || data.companyProfileRevision === 27 || !seedMissing) return data;
    const fresh = seed();
    if (seedMissing) for (const key of ['company', 'branches']) if (!own(data, key)) data[key] = fresh[key];
    if (!own(data, 'partners')) {
      if (seedMissing) data.partners = fresh.partners;
    } else if (Array.isArray(data.partners) && data.partners.length) {
      const kept = [], defaults = Array.isArray(legacyPartners) ? legacyPartners : [];
      let replaced = false;
      for (const partner of data.partners) {
        const old = defaults.find(item => item.id === partner?.id);
        if (old && same(partner, old)) { replaced = true; continue; }
        if (record(partner)) partner.sourceListed = false;
        kept.push(partner);
      }
      // No untouched seed remains => do not add partners to a custom collection.
      data.partners = replaced ? [...fresh.partners.filter(item => !kept.some(partner => partner?.id === item.id)), ...kept] : kept;
    }
    if (same(data.social, {enabled:true, hotline:'', zalo:'', messenger:''})) {
      data.social.hotline = '0364562868';
      data.social.zalo = 'https://zalo.me/0329138082';
    }
    data.companyProfileRevision = 27;
    return data;
  }

  function field(id, name, label, value, max, options = '') {
    return `<div class="md-company-editor__field"><label for="${id}">${label}</label><input id="${id}" name="${name}" value="${escape(value)}" maxlength="${max}" ${options}></div>`;
  }
  function branchHtml(branch, index, count) {
    const prefix = 'md-company-branch-' + index;
    return `<fieldset class="md-company-editor__branch" data-company-branch="${escape(branch.id)}"><legend>Chi nhánh ${index + 1}</legend>
      <input type="hidden" name="branch.${index}.id" value="${escape(branch.id)}">
      <div class="md-company-editor__grid">
        ${field(prefix + '-name', `branch.${index}.name`, 'Tên chi nhánh', branch.name, 100)}
        ${field(prefix + '-address', `branch.${index}.address`, 'Địa chỉ (có thể để trống)', branch.address, 250)}
        ${field(prefix + '-maps', `branch.${index}.mapsUrl`, 'Liên kết chỉ đường Google Maps', branch.mapsUrl, 500, 'type="url" inputmode="url"')}
        ${field(prefix + '-embed', `branch.${index}.embedUrl`, 'URL nhúng Google Maps (không nhập HTML iframe)', branch.embedUrl, 2500, 'type="url" inputmode="url"')}
      </div>
      <label class="md-company-editor__visible" for="${prefix}-visible"><input id="${prefix}-visible" type="checkbox" name="branch.${index}.visible" ${branch.visible === true ? 'checked' : ''}> Hiển thị chi nhánh</label>
      <div class="md-company-editor__actions">
        <button type="button" class="btn light" data-company-action="up" aria-label="Đưa chi nhánh ${index + 1} lên" ${index === 0 ? 'disabled' : ''}>↑ Lên</button>
        <button type="button" class="btn light" data-company-action="down" aria-label="Đưa chi nhánh ${index + 1} xuống" ${index === count - 1 ? 'disabled' : ''}>↓ Xuống</button>
        <button type="button" class="btn light" data-company-action="remove" aria-label="Xóa chi nhánh ${index + 1}">Xóa chi nhánh</button>
      </div></fieldset>`;
  }
  function settingsHtml(data) {
    const company = data.company || {}, branches = Array.isArray(data.branches) ? data.branches : [];
    return `<section class="admin-card md-company-editor" aria-labelledby="md-company-editor-title">
      <h2 id="md-company-editor-title">Hồ sơ công ty &amp; chi nhánh</h2>
      <p>Biên tập nội dung demo trên trình duyệt này. Để trống địa chỉ hoặc bản đồ chưa có thông tin; bản nhúng chỉ nhận URL Google Maps, không nhận HTML iframe.</p>
      <form id="mdCompanyProfileForm" data-company-form>
        ${field('md-company-legal-name', 'legalName', 'Tên pháp lý', company.legalName, 160)}
        <div class="md-company-editor__field"><label for="md-company-description">Mô tả dịch vụ</label><textarea id="md-company-description" name="description" rows="4" maxlength="700">${escape(company.description)}</textarea></div>
        ${field('md-company-facebook', 'facebook', 'Liên kết Facebook', company.facebook, 300, 'type="url" inputmode="url"')}
        <h3>Danh sách chi nhánh</h3>
        <p>Thứ tự bên dưới là thứ tự hiển thị. Thêm, xóa, ẩn và sắp xếp chỉ có hiệu lực sau khi lưu toàn bộ hồ sơ.</p>
        <div data-company-branches>${branches.map((branch, index) => branchHtml(branch, index, branches.length)).join('')}</div>
        <p data-company-empty ${branches.length ? 'hidden' : ''}>Chưa có chi nhánh. Bạn có thể thêm chi nhánh hoặc lưu danh sách trống.</p>
        <div class="md-company-editor__actions"><button class="btn light" type="button" data-company-action="add" ${branches.length >= 20 ? 'disabled' : ''}>Thêm chi nhánh</button><button class="btn blue" type="submit">Lưu hồ sơ &amp; chi nhánh</button></div>
        <p data-company-status role="status" aria-live="polite"></p>
      </form>
    </section>`;
  }

  let context, bound = false, sequence = 0, saving = false;
  const rows = form => [...form.querySelectorAll('[data-company-branch]')];
  const status = (form, message) => { const output = form.querySelector('[data-company-status]'); if (output) output.textContent = message; };
  function collect(form) {
    const value = name => form.elements.namedItem(name)?.value ?? '';
    return {
      company: {legalName:value('legalName'), description:value('description'), facebook:value('facebook')},
      branches: rows(form).map((row, index) => ({
        id:value(`branch.${index}.id`), name:value(`branch.${index}.name`), address:value(`branch.${index}.address`),
        mapsUrl:value(`branch.${index}.mapsUrl`), embedUrl:value(`branch.${index}.embedUrl`),
        visible:form.elements.namedItem(`branch.${index}.visible`)?.checked === true,
      })),
    };
  }
  // Reindex attributes in place: moving/removing rows never resets typed values,
  // checkbox state, validation or text selection in the rest of the form.
  function reindex(form) {
    const list = rows(form);
    list.forEach((row, index) => {
      row.querySelector('legend').textContent = 'Chi nhánh ' + (index + 1);
      row.querySelectorAll('[name]').forEach(input => {
        input.name = input.name.replace(/^branch\.\d+\./, `branch.${index}.`);
        if (input.id) {
          const label = [...row.querySelectorAll('label')].find(item => item.htmlFor === input.id);
          input.id = input.id.replace(/branch-\d+-/, `branch-${index}-`);
          if (label) label.htmlFor = input.id;
        }
      });
      for (const [action, title] of [['up', 'Đưa lên'], ['down', 'Đưa xuống'], ['remove', 'Xóa']]) {
        const button = row.querySelector(`[data-company-action="${action}"]`);
        button.disabled = action === 'up' ? index === 0 : action === 'down' ? index === list.length - 1 : false;
        button.setAttribute('aria-label', `${title} chi nhánh ${index + 1}`);
      }
    });
    form.querySelector('[data-company-empty]').hidden = list.length > 0;
    form.querySelector('[data-company-action="add"]').disabled = list.length >= 20;
  }
  function init(api) {
    context = api;
    if (bound || !root.document) return;
    bound = true;
    root.document.addEventListener('input', event => {
      const form = event.target.closest?.('[data-company-form]');
      if (form) status(form, 'Có thay đổi chưa lưu.');
    });
    root.document.addEventListener('click', event => {
      const button = event.target.closest?.('[data-company-action]'), form = button?.closest('[data-company-form]');
      if (!form || button.disabled || saving) return;
      event.preventDefault();
      const list = rows(form), action = button.dataset.companyAction, row = button.closest('[data-company-branch]'), index = list.indexOf(row);
      let focus;
      if (action === 'add') {
        if (list.length >= 20) { status(form, 'Tối đa 20 chi nhánh.'); return; }
        let id;
        const ids = new Set(list.map(item => item.dataset.companyBranch));
        do { id = 'branch-' + Date.now().toString(36) + '-' + (++sequence).toString(36); } while (ids.has(id));
        const container = form.querySelector('[data-company-branches]');
        container.insertAdjacentHTML('beforeend', branchHtml({id, name:'Chi nhánh mới', address:'', mapsUrl:'', embedUrl:'', visible:true}, list.length, list.length + 1));
        focus = rows(form).at(-1).querySelector('input:not([type="hidden"])');
      } else if (action === 'remove' && row) {
        focus = (list[index + 1] || list[index - 1])?.querySelector('input:not([type="hidden"])') || form.querySelector('[data-company-action="add"]');
        row.remove();
      } else if (action === 'up' && index > 0) {
        row.parentNode.insertBefore(row, list[index - 1]); focus = row.querySelector('input:not([type="hidden"])');
      } else if (action === 'down' && index >= 0 && index < list.length - 1) {
        row.parentNode.insertBefore(list[index + 1], row); focus = row.querySelector('input:not([type="hidden"])');
      }
      reindex(form);
      status(form, 'Có thay đổi chưa lưu. Bấm “Lưu hồ sơ & chi nhánh” để áp dụng.');
      focus?.focus();
    });
    root.document.addEventListener('submit', async event => {
      const form = event.target;
      if (!form.matches?.('[data-company-form]')) return;
      event.preventDefault();
      if (saving) return;
      const next = collect(form);
      if (!valid(next)) { status(form, 'Chưa lưu: kiểm tra độ dài, mã chi nhánh duy nhất và liên kết HTTPS đúng của Google Maps/Facebook.'); return; }
      const current = context, data = current.getData();
      if (!record(data)) { status(form, 'Chưa đọc được dữ liệu. Nội dung đang nhập vẫn được giữ.'); return; }
      const previous = Object.fromEntries(['company', 'branches'].map(key => [key, {exists:own(data, key), value:data[key]}]));
      data.company = next.company; data.branches = next.branches;
      saving = true;
      const controls = [...form.querySelectorAll('input, textarea, button')].map(input => [input, input.disabled]);
      for (const [input] of controls) input.disabled = true;
      form.setAttribute('aria-busy', 'true');
      status(form, 'Đang lưu hồ sơ…');
      let saved = false;
      try { saved = await current.persist() === true; } catch { /* Retain form edits and restore the prior in-memory fields. */ }
      if (!saved) for (const key of ['company', 'branches']) {
        // Do not overwrite a newer replacement from another host operation.
        if (data[key] !== next[key]) continue;
        if (previous[key].exists) data[key] = previous[key].value; else delete data[key];
      }
      for (const [input, disabled] of controls) input.disabled = disabled;
      saving = false; form.removeAttribute('aria-busy');
      if (!saved) { status(form, 'Chưa lưu được. Nội dung đang nhập vẫn được giữ để thử lại.'); return; }
      status(form, 'Đã lưu hồ sơ và chi nhánh trên trình duyệt này.');
      current.notify?.('Đã lưu hồ sơ công ty và chi nhánh.');
      current.renderAdmin?.();
    });
  }
  root.MDCompanyProfile = Object.freeze({seed, migrate, valid, mapsUrl, embedUrl, facebookUrl, settingsHtml, init});
})(window);
