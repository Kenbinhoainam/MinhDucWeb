/* V27 public identity and branches. The selected branch map loads automatically. */
window.MDCompanyLocations = (() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const locales = ['vi', 'en', 'zh', 'ko'];
  const language = value => value === 'zh-CN' ? 'zh' : locales.includes(value) ? value : 'vi';
  const copy = {
    identity: ['Về Minh Đức', 'About Minh Đức', '关于 Minh Đức', 'Minh Đức 소개'],
    contact: ['Kết nối với Minh Đức', 'Connect with Minh Đức', '联系 Minh Đức', 'Minh Đức에 문의하세요'],
    branches: ['Chi nhánh & đường đi', 'Branches & directions', '分支机构与路线', '지점 및 오시는 길'],
    choose: ['Chọn chi nhánh', 'Choose a branch', '选择分支机构', '지점 선택'],
    select: ['Chọn chi nhánh: ', 'Select branch: ', '选择分支机构：', '지점 선택: '],
    before: ['Liên hệ trước khi đến', 'Please contact us before visiting', '到访前请先联系', '방문 전에 연락해 주세요'],
    directions: ['Mở Google Maps', 'Open Google Maps', '打开 Google Maps', 'Google Maps 열기'],
    directionsFor: ['Mở Google Maps: ', 'Open Google Maps: ', '打开 Google Maps：', 'Google Maps 열기: '],
    mapFor: ['Bản đồ chi nhánh: ', 'Branch map: ', '分支机构地图：', '지점 지도: '],
    noEmbed: ['Dùng liên kết Google Maps để xem đường đi.', 'Use the Google Maps link for directions.', '请通过 Google Maps 链接查看路线。', 'Google Maps 링크에서 경로를 확인하세요.'],
    noMap: ['Chưa có bản đồ. Liên hệ để được hướng dẫn.', 'No map is available yet. Contact us for directions.', '暂无地图，请联系我们了解路线。', '지도가 아직 없습니다. 오시는 길을 문의해 주세요.'],
    selected: ['Đã chọn: ', 'Selected: ', '已选择：', '선택됨: '],
    recovered: ['Chi nhánh trước không còn hiển thị. Đã chọn: ', 'The previous branch is unavailable. Selected: ', '之前的分支机构已不可用，现已选择：', '이전 지점은 더 이상 표시되지 않습니다. 선택됨: '],
    loading: ['Đang tải bản đồ: ', 'Loading map: ', '正在加载地图：', '지도 불러오는 중: '],
    loaded: ['Đã mở khung bản đồ: ', 'Map frame opened: ', '地图框架已打开：', '지도 프레임이 열렸습니다: '],
    fallback: ['Nếu bản đồ không hiển thị, hãy dùng liên kết Google Maps.', 'If the map does not appear, use the Google Maps link.', '若地图未显示，请使用 Google Maps 链接。', '지도가 표시되지 않으면 Google Maps 링크를 이용하세요.'],
    empty: ['Chưa có chi nhánh hiển thị. Vui lòng liên hệ trước khi đến.', 'No branches are listed yet. Please contact us before visiting.', '暂未列出分支机构，到访前请先联系。', '표시할 지점이 없습니다. 방문 전에 연락해 주세요.'],
    hotline: ['Gọi hotline', 'Call our hotline', '拨打热线', '전화 상담'],
    zalo: ['Nhắn Zalo', 'Chat on Zalo', '通过 Zalo 咨询', 'Zalo 상담'],
    facebook: ['Trang Facebook', 'Facebook page', 'Facebook 主页', 'Facebook 페이지'],
    channels: ['Liên hệ trực tiếp', 'Contact us directly', '直接联系', '직접 문의'],
    noChannels: ['Kênh liên hệ đang được cập nhật. Bạn có thể dùng biểu mẫu liên hệ trên trang.', 'Contact channels are being updated. You can use the contact form on this page.', '联系方式正在更新，您可使用本页联系表单。', '연락 채널을 업데이트 중입니다. 이 페이지의 문의 양식을 이용해 주세요.'],
    visit: ['Xem chi nhánh & liên hệ', 'Branches & contact', '分支机构与联系方式', '지점 및 연락처'],
    logo: ['Logo Minh Đức', 'Minh Đức logo', 'Minh Đức 标志', 'Minh Đức 로고'],
  };
  const t = (key, lang) => copy[key][locales.indexOf(language(lang))];
  const text = value => typeof value === 'string' ? value : '';
  // The profile helper owns the strict host/path allowlists. Fail closed if absent.
  function profileUrl(kind, value) {
    if (typeof value !== 'string' || !value) return '';
    try {
      const checked = window.MDCompanyProfile?.[kind]?.(value);
      return typeof checked === 'string' && checked ? value : '';
    } catch { return ''; }
  }
  function channelUrl(kind, value) {
    try { return window.MDExperience?.channelUrl?.(kind, value) || ''; }
    catch { return ''; }
  }
  function visibleBranches(data) {
    const seen = new Set();
    return (Array.isArray(data?.branches) ? data.branches : []).filter(branch => {
      if (!branch || branch.visible !== true || typeof branch.id !== 'string' || branch.id.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(branch.id) || seen.has(branch.id) || !text(branch.name).trim()) return false;
      seen.add(branch.id);
      return true;
    }).slice(0, 20);
  }
  const contactHref = (lang, branchId) => `lien-he.html?${branchId ? `branch=${branchId}&` : ''}lang=${language(lang)}#chi-nhanh`;
  function channelsHtml(data, lang) {
    const social = data?.social || {};
    const rows = [
      ['hotline', channelUrl('hotline', social.hotline), text(social.hotline)],
      ['zalo', channelUrl('zalo', social.zalo), ''],
      ['facebook', profileUrl('facebookUrl', data?.company?.facebook), ''],
    ].filter(([, url]) => url);
    return `<div class="md-company-channels" aria-label="${escape(t('channels', lang))}">${rows.map(([kind, url, detail]) => `<a class="md-company-channel md-company-channel-${kind}" href="${escape(url)}"${kind === 'hotline' ? '' : ' target="_blank" rel="noopener noreferrer"'}><span>${escape(t(kind, lang))}</span>${detail ? `<b>${escape(detail)}</b>` : '<span aria-hidden="true">↗</span>'}</a>`).join('') || `<p class="md-company-note">${escape(t('noChannels', lang))}</p>`}</div>`;
  }
  function panelHtml(branch, lang) {
    if (!branch) return `<p class="md-branches-empty">${escape(t('empty', lang))}</p>`;
    const maps = profileUrl('mapsUrl', branch.mapsUrl), embed = profileUrl('embedUrl', branch.embedUrl), fallback = maps || embed;
    const name = escape(branch.name);
    return `<div class="md-branches-panel-heading"><span class="md-company-kicker">${escape(t('branches', lang))}</span><h3 translate="no">${name}</h3><p translate="no">${escape(text(branch.address)) || escape(t('before', lang))}</p></div><div class="md-branches-map" id="md-branches-contact-map" data-md-branches-map><div class="md-branches-placeholder"><span class="md-branches-pin" aria-hidden="true">⌖</span><p>${escape(embed ? t('loading', lang) + branch.name : t(maps ? 'noEmbed' : 'noMap', lang))}</p></div></div><div class="md-branches-map-footer">${fallback ? `<a class="md-company-button md-company-button-outline" href="${escape(fallback)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(t('directionsFor', lang) + branch.name)}">${escape(t('directions', lang))}<span aria-hidden="true">↗</span></a>` : ''}<p class="md-company-note">${escape(t(fallback ? 'fallback' : 'before', lang))}</p></div>`;
  }
  function html(data = {}, mode = 'contact', lang = 'vi') {
    if (!['contact', 'about', 'home'].includes(mode)) return '';
    lang = language(lang);
    const company = data?.company || {}, branches = visibleBranches(data);
    const identity = `<p class="md-company-legal" translate="no">${escape(text(company.legalName))}</p>${text(company.description) ? `<p class="md-company-description" translate="no">${escape(company.description)}</p>` : ''}`;
    const attrs = `data-md-company-scope="${mode}" data-md-company-lang="${lang}" lang="${lang === 'zh' ? 'zh-CN' : lang}" translate="no"`;
    if (mode === 'home') return `<section class="md-company-home" ${attrs} aria-label="${escape(t('contact', lang))}"><div class="md-company-home-copy">${identity}</div><a class="md-company-button md-company-button-outline" href="${contactHref(lang)}">${escape(t('visit', lang))}<span aria-hidden="true">→</span></a></section>`;
    if (mode === 'about') return `<section class="md-company-about" ${attrs} aria-labelledby="md-company-about-title"><div class="md-company-logo"><img src="assets/logo-minh-duc-source.jpg" alt="${escape(t('logo', lang))}" loading="lazy" decoding="async"></div><div class="md-company-about-copy"><h2 id="md-company-about-title">${escape(t('identity', lang))}</h2>${identity}<nav class="md-company-branch-links" aria-label="${escape(t('branches', lang))}">${branches.map(branch => `<a href="${escape(contactHref(lang, branch.id))}" translate="no">${escape(branch.name)}<span aria-hidden="true">↗</span></a>`).join('')}</nav><a class="md-company-button md-company-button-outline" href="${contactHref(lang)}">${escape(t('visit', lang))}</a></div></section>`;
    const first = branches[0];
    const choices = branches.map((branch, index) => {
      const address = text(branch.address).trim();
      return `<li><button type="button" class="md-branches-choice" data-md-branches-select="${escape(branch.id)}" aria-controls="md-branches-contact-panel" aria-pressed="${index === 0}" aria-label="${escape(t('select', lang) + branch.name)}"><span class="md-branches-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="md-branches-choice-copy"><b translate="no">${escape(branch.name)}</b>${address ? `<small translate="no">${escape(address)}</small>` : ''}</span><span class="md-branches-choice-mark" aria-hidden="true">→</span></button></li>`;
    }).join('');
    return `<section class="md-company-contact" id="chi-nhanh" ${attrs} aria-labelledby="md-company-contact-title"><div class="md-branches-directory"><div class="md-company-intro"><span class="md-company-kicker">${escape(t('channels', lang))}</span><h2 id="md-company-contact-title">${escape(t('contact', lang))}</h2>${identity}</div>${channelsHtml(data, lang)}<div class="md-branches-chooser" role="group" aria-labelledby="md-branches-choose"><h3 id="md-branches-choose">${escape(t('choose', lang))}</h3><ul class="md-branches-list">${choices}</ul>${first ? '' : `<p class="md-company-note">${escape(t('empty', lang))}</p>`}</div></div><div class="md-branches-detail"><div id="md-branches-contact-panel" data-md-branches-panel>${panelHtml(first, lang)}</div><p class="md-branches-status" data-md-branches-status role="status" aria-live="polite" aria-atomic="true">${escape(first ? t('selected', lang) + first.name : t('empty', lang))}</p></div></section>`;
  }
  let selectedId = '', bound = false;
  const mounted = new WeakSet();
  function snapshot() {
    try { return window.MDPrototypeBridge?.snapshot?.() || null; }
    catch { return null; }
  }
  function status(root, message) {
    const node = root.querySelector('[data-md-branches-status]');
    if (node) node.textContent = message;
  }
  function removeMaps(root) {
    root.querySelectorAll('iframe').forEach(frame => frame.remove());
  }
  function selectBranch(root, branch, lang, message) {
    removeMaps(root);
    root.querySelectorAll('[data-md-branches-select]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mdBranchesSelect === branch?.id)));
    const panel = root.querySelector('[data-md-branches-panel]');
    if (panel) panel.innerHTML = panelHtml(branch, lang);
    selectedId = branch?.id || '';
    status(root, message || (branch ? t(profileUrl('embedUrl', branch.embedUrl) ? 'loading' : 'selected', lang) + branch.name : t('empty', lang)));
    if (branch) loadMap(root, branch, lang);
  }
  function click(event) {
    const button = event.target?.closest?.('[data-md-branches-select]');
    const root = button?.closest('[data-md-company-scope="contact"]');
    if (!root) return;
    const data = snapshot();
    if (!data) return;
    const lang = language(root.dataset.mdCompanyLang), branches = visibleBranches(data);
    const id = button.dataset.mdBranchesSelect;
    const branch = branches.find(item => item.id === id);
    if (!branch) {
      const next = branches[0];
      selectBranch(root, next, lang, next ? t('recovered', lang) + next.name : t('empty', lang));
      return;
    }
    if (selectedId !== branch.id) selectBranch(root, branch, lang);
  }
  function loadMap(root, branch, lang) {
    const url = profileUrl('embedUrl', branch.embedUrl), host = root.querySelector('[data-md-branches-map]');
    if (!url || !host || host.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.title = t('mapFor', lang) + branch.name;
    frame.loading = 'eager';
    frame.referrerPolicy = 'no-referrer';
    frame.setAttribute('allowfullscreen', '');
    frame.addEventListener('load', () => {
      if (frame.isConnected && selectedId === branch.id) status(root, t('loaded', lang) + branch.name + '. ' + t('fallback', lang));
    }, { once: true });
    // Load only the selected branch, using the same validated CMS embed URL.
    frame.src = url;
    host.replaceChildren(frame);
  }
  function init() {
    if (typeof document === 'undefined') return;
    if (!bound && typeof document.addEventListener === 'function') {
      document.addEventListener('click', click);
      bound = true;
    }
    if (typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('[data-md-company-scope="contact"]').forEach(root => {
      if (mounted.has(root)) return;
      const data = snapshot();
      if (!data) return;
      mounted.add(root);
      const branches = visibleBranches(data), lang = language(root.dataset.mdCompanyLang);
      const previous = selectedId;
      const requested = previous || new URLSearchParams(window.location?.search).get('branch');
      const selected = branches.find(branch => branch.id === requested) || branches[0];
      selectBranch(root, selected, lang, previous && previous !== selected?.id && selected ? t('recovered', lang) + selected.name : '');
    });
  }
  return Object.freeze({ html, init });
})();
