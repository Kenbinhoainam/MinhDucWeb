import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/company-profile.js', import.meta.url), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
function load(document) {
  const window = document ? {document} : {};
  vm.runInContext(source, vm.createContext({window, URL}));
  return window.MDCompanyProfile;
}
const legacy = [
  {id:'sample-one', name:'Sample one', logo:'assets/one.svg', sample:true, visible:true, demoLogoVisible:true, approved:false, sector:'Old sector'},
  {id:'sample-two', name:'Sample two', logo:'assets/two.svg', sample:true, visible:true, demoLogoVisible:true, approved:false, sector:'Old sector'},
  {id:'sample-three', name:'Sample three', logo:'', sample:true, visible:true, demoLogoVisible:false, approved:false, sector:''},
];

test('seed is isolated, source-only, exact verified links, with no inferred address or contact email', () => {
  const api = load(), data = api.seed();
  assert.deepEqual(Object.keys(api).sort(), ['seed','migrate','valid','mapsUrl','embedUrl','facebookUrl','settingsHtml','init'].sort());
  assert.equal(data.companyProfileRevision, 27);
  assert.equal(data.company.legalName, 'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA');
  assert.equal(data.company.facebook, 'https://www.facebook.com/md668.com.vn');
  assert.ok(data.company.description.length <= 700);
  assert.match(data.company.description, /Cung ứng nguồn nhân lực/);
  assert.deepEqual(plain(data.branches.map(b => [b.id,b.name,b.address,b.mapsUrl,b.visible])), [
    ['voi','Chi nhánh Vôi','','https://maps.app.goo.gl/2hj5gqjuaLS4t6hk8',true],
    ['bac-ninh','Chi nhánh Bắc Ninh','','https://maps.app.goo.gl/VjV1DbkajBXDqGUE7?g_st=iz',true],
    ['quang-ninh','Chi nhánh Quảng Ninh','','',true],
  ]);
  assert.equal(data.branches[0].embedUrl, 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14863.567724490309!2d106.2507006!3d21.3547575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356d35c76fdbc5%3A0xdf7f9c998ab7ef61!2zQ8O0bmcgdHkgVE5ISCBOaMOibiBMxrDMo2MgTWluaCDEkMawzIFjIFZpbmE!5e0!3m2!1sen!2s!4v1793845290681!5m2!1sen!2s');
  assert.equal(data.branches[1].embedUrl, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.408263619011!2d106.14966299999999!3d21.2553011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350d96e2bf4c4f%3A0x940bfed5d4736488!2sCty%20TNHH%20MD668%20VINA!5e0!3m2!1sen!2s!4v1793845315824!5m2!1sen!2s');
  assert.equal(data.branches[2].embedUrl, '');
  assert.deepEqual(plain(data.partners.map(p => p.name)), ['Luxshare - ICT','Foxconn','Samsung','Jeiltech - Vina','TACU']);
  assert.equal(new Set(data.partners.map(p => p.id)).size, 5);
  for (const partner of data.partners) {
    assert.match(partner.id, /^md-source-/);
    assert.equal(partner.logo, '');
    for (const flag of ['demoLogoVisible','approved','sample']) assert.equal(partner[flag], false);
    assert.equal(partner.sourceListed, true);
  }
  assert.doesNotMatch(JSON.stringify(data), /@|telesale/i);
  assert.equal(api.valid(data), true);
  data.company.legalName = 'changed'; data.branches[0].name = 'changed'; data.partners[0].name = 'changed';
  assert.notEqual(api.seed().company.legalName, 'changed');
  assert.notEqual(api.seed().branches[0].name, 'changed');
  assert.notEqual(api.seed().partners[0].name, 'changed');
});

test('migration replaces only unchanged legacy profiles and preserves edited/hidden/custom references', () => {
  const api = load(), data = {partners:plain(legacy)};
  data.partners[1].visible = false;
  data.partners[2].name = 'CMS edit';
  const hidden = data.partners[1], edited = data.partners[2];
  const custom = {id:'custom', name:'A custom company', logo:'', visible:true};
  data.partners.push(custom);
  assert.equal(api.migrate(data, legacy), data);
  assert.equal(data.partners.length, 8);
  assert.equal(data.partners.some(p => p.id === 'sample-one'), false);
  assert.equal(data.partners.find(p => p.id === hidden.id), hidden);
  assert.equal(hidden.visible, false);
  assert.equal(hidden.logo, legacy[1].logo);
  assert.equal(hidden.sourceListed, false);
  assert.equal(edited.name, 'CMS edit'); assert.equal(edited.sourceListed, false);
  assert.equal(custom.sourceListed, false);
  assert.equal(custom.logo, '');
  const first = JSON.stringify(data);
  api.migrate(data, legacy);
  assert.equal(JSON.stringify(data), first);
  data.partners = data.partners.filter(p => p.id !== 'md-source-foxconn');
  data.branches = [];
  const deleted = JSON.stringify(data);
  api.migrate(data, legacy);
  assert.equal(JSON.stringify(data), deleted, 'deleted source entries must never return');
});

test('deleted legacy entries and edited-only collections are never resurrected', () => {
  const api = load();
  const editedOnly = {partners:[{...legacy[1], name:'Changed'}]};
  api.migrate(editedOnly, legacy);
  assert.equal(editedOnly.partners.length, 1);
  assert.equal(editedOnly.partners[0].name, 'Changed');
  assert.equal(editedOnly.partners[0].sourceListed, false);
  const partial = {partners:[plain(legacy[0])]};
  api.migrate(partial, legacy);
  assert.equal(partial.partners.length, 5);
  assert.ok(partial.partners.every(p => p.id.startsWith('md-source-')));
  for (const key of ['name','sector','logo','demoLogoVisible','approved','visible']) {
    const old = plain(legacy[0]), data = {partners:[old]};
    old[key] = typeof old[key] === 'boolean' ? !old[key] : 'edited';
    api.migrate(data, legacy);
    assert.equal(data.partners.length, 1, key);
    assert.equal(data.partners[0], old);
  }
});

test('own empty values are intentional; server snapshots and revision27 round trips are exact no-ops', () => {
  const api = load(), empty = {company:{legalName:'',description:'',facebook:''}, branches:[], partners:[]};
  api.migrate(empty, legacy);
  assert.equal(empty.company.legalName, ''); assert.equal(empty.branches.length, 0); assert.equal(empty.partners.length, 0);
  const nulls = {company:null, branches:null, partners:null};
  api.migrate(nulls, legacy);
  assert.equal(nulls.company, null); assert.equal(nulls.branches, null); assert.equal(nulls.partners, null);
  const snapshot = {companyDemoRevision:1, illustrationRevision:26, partners:plain(legacy), social:{enabled:true,hotline:'',zalo:'',messenger:''}};
  const before = JSON.stringify(snapshot);
  assert.equal(api.migrate(snapshot, legacy, {seedMissing:false}), snapshot);
  assert.equal(JSON.stringify(snapshot), before);
  const absent = {};
  api.migrate(absent, legacy, {seedMissing:false});
  assert.deepEqual(absent, {});
  const revision = {companyProfileRevision:27, partners:[], branches:[], company:{legalName:'saved',description:'',facebook:''}};
  const roundTrip = JSON.stringify(revision);
  api.migrate(revision, legacy);
  assert.equal(JSON.stringify(revision), roundTrip);
  const fresh = {}; api.migrate(fresh, legacy);
  assert.equal(fresh.branches.length, 3); assert.equal(fresh.partners.length, 5);
});

test('only the exact untouched social object migrates once', () => {
  const api = load(), original = {enabled:true,hotline:'',zalo:'',messenger:''};
  const data = {social:{...original}};
  api.migrate(data);
  assert.deepEqual(data.social, {...original, hotline:'0364562868', zalo:'https://zalo.me/0329138082'});
  data.social.hotline = ''; api.migrate(data); assert.equal(data.social.hotline, '');
  for (const social of [undefined, {}, {...original,enabled:false}, {...original,hotline:'123'}, {...original,zalo:'custom'}, {...original,messenger:'custom'}, {...original,extra:true}]) {
    const candidate = social === undefined ? {} : {social};
    const before = JSON.stringify(candidate.social);
    api.migrate(candidate);
    assert.equal(JSON.stringify(candidate.social), before);
  }
});

test('URL helpers preserve approved source strings and accept only allowlisted navigation paths', () => {
  const api = load();
  for (const branch of api.seed().branches.slice(0,2)) {
    assert.equal(api.mapsUrl(branch.mapsUrl), branch.mapsUrl);
    assert.equal(api.embedUrl(branch.embedUrl), branch.embedUrl);
  }
  for (const value of ['https://www.google.com/maps','https://www.google.com/maps/search/?api=1&query=Minh%20Duc','https://www.google.com/maps/dir/?api=1&destination=Bac%20Ninh','https://maps.app.goo.gl/aBc123/']) assert.equal(api.mapsUrl(value), value);
  for (const value of ['https://facebook.com/md668.com.vn','https://www.facebook.com/md668.com.vn']) assert.equal(api.facebookUrl(value), value);
});

test('URL attacks, iframe HTML, credentials, explicit ports, normalization and duplicate embed keys are blocked', () => {
  const api = load();
  const common = [null, undefined, {}, 42, '', 'javascript:alert(1)', '//www.google.com/maps', 'http://www.google.com/maps',
    ' https://www.google.com/maps', 'https://www.google.com/maps\n', 'https://www.google.com:443/maps',
    'https://www.google.com:444/maps', 'https://user@www.google.com/maps', 'https://user:pass@www.google.com/maps',
    'https://www.google.com.evil.test/maps', 'https://www.google.com@evil.test/maps', 'https://www.google.com\\@evil.test/maps',
    'https://www.google.com/maps%0aevil', 'https://www.google.com/maps/%2e%2e/maps', 'https://www.google.com/x/../maps',
    'https://www.google.com/maps?q=%3Cscript%3E', 'https://www.google.com/maps?q=%zz', '<iframe src="https://www.google.com/maps/embed?pb=abc"></iframe>'];
  for (const value of common) for (const helper of ['mapsUrl','embedUrl','facebookUrl']) assert.equal(api[helper](value), '', `${helper}: ${value}`);
  for (const value of ['https://maps.app.goo.gl/','https://maps.app.goo.gl/x/y','https://www.google.com/maps.evil','https://google.com/maps','https://www.google.com/maps#x','https://maps.app.goo.gl/' + 'a'.repeat(500)]) assert.equal(api.mapsUrl(value), '', value);
  for (const value of ['https://www.google.com/maps/embed','https://www.google.com/maps/embed?pb=','https://www.google.com/maps/embed?pb=x&pb=y','https://www.google.com/maps/embed?pb=x&key=y','https://www.google.com/maps/embed?pb=x#hash','https://www.google.com/maps/embed/?pb=x','https://maps.google.com/maps/embed?pb=x','https://www.google.com/maps/embed?pb=' + 'a'.repeat(2500)]) assert.equal(api.embedUrl(value), '', value);
  for (const value of ['https://facebook.com/','https://www.facebook.com/?id=1','https://facebook.com:443/test','https://facebook.com.evil.test/name','https://www.facebook.com/foo/../','https://www.facebook.com/' + 'a'.repeat(300)]) assert.equal(api.facebookUrl(value), '', value);
});

test('validation has no coercions, enforces all bounds, optional legacy content and no unknown nested keys', () => {
  const api = load();
  assert.equal(api.valid({jobs:[],home:{}}), true);
  assert.equal(api.valid({branches:[]}), true);
  for (const value of [null, [], 'value', 1, false]) assert.equal(api.valid(value), false);
  for (const [key, limit] of [['legalName',160],['description',700],['facebook',300]]) {
    const data = plain(api.seed()); data.company[key] = 'a'.repeat(limit + 1); assert.equal(api.valid(data), false, key);
  }
  const atLimit = plain(api.seed());
  Object.assign(atLimit.company, {legalName:'a'.repeat(160),description:'b'.repeat(700),facebook:''});
  Object.assign(atLimit.branches[0], {id:'a'.repeat(80),name:'b'.repeat(100),address:'c'.repeat(250),mapsUrl:'',embedUrl:''});
  assert.equal(api.valid(atLimit), true);
  for (const [key, value] of [['legalName',''],['legalName','  '],['legalName',12],['description',null],['facebook',false],['extra',true],['approved',true]]) {
    const data = plain(api.seed()); data.company[key] = value; assert.equal(api.valid(data), false, key);
  }
  for (const [key, value] of [['id',''],['id','UPPER'],['id','a--b'],['id','a_b'],['id','a'.repeat(81)],['name',''],['name','  '],['name','a'.repeat(101)],['address','a'.repeat(251)],['address',null],['visible',1],['visible','true'],['approved',true],['iframe','<iframe>'],['mapsUrl',null],['embedUrl',{}]]) {
    const data = plain(api.seed()); data.branches[0][key] = value; assert.equal(api.valid(data), false, key);
  }
  for (const key of ['legalName','description','facebook']) {const data = plain(api.seed()); delete data.company[key]; assert.equal(api.valid(data), false);}
  for (const key of ['id','name','address','mapsUrl','embedUrl','visible']) {const data = plain(api.seed()); delete data.branches[0][key]; assert.equal(api.valid(data), false);}
  const tooMany = {branches:Array.from({length:21}, (_,i) => ({...plain(api.seed().branches[0]),id:'branch-' + i}))};
  assert.equal(api.valid(tooMany), false); tooMany.branches.pop(); assert.equal(api.valid(tooMany), true);
  assert.equal(api.valid({branches:[api.seed().branches[0],api.seed().branches[0]]}), false);
  assert.equal(api.valid({branches:new Array(1)}), false);
  assert.equal(api.valid({companyProfileRevision:'27'}), false);
  assert.equal(api.valid({partners:[{sourceListed:'true'}]}), false);
  assert.equal(api.valid({partners:[{sourceListed:false}]}), true);
  assert.equal(api.valid(JSON.parse('{"company":{"legalName":"Name","description":"","facebook":"","__proto__":{}}}')), false);
});

// A small DOM harness drives the actual delegated CMS handlers without a browser.
// It implements only the DOM operations used by this module, including row moves.
const decode = value => value.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
class Element {
  constructor(tag, attrs = {}) { this.tagName = tag; this.attrs = attrs; this.children = []; this.parentNode = null; this.value = attrs.value || ''; this.checked = 'checked' in attrs; this.disabled = 'disabled' in attrs; this.hidden = 'hidden' in attrs; this._text = ''; }
  get id() {return this.attrs.id || ''; } set id(value) {this.attrs.id = value;}
  get name() {return this.attrs.name || ''; } set name(value) {this.attrs.name = value;}
  get htmlFor() {return this.attrs.for || ''; } set htmlFor(value) {this.attrs.for = value;}
  get dataset() {return Object.fromEntries(Object.entries(this.attrs).filter(([key]) => key.startsWith('data-')).map(([key,value]) => [key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), value]));}
  get textContent() {return this._text + this.children.map(c => c.textContent).join('');} set textContent(value) {this._text = value; this.children = [];}
  append(node) {if (node.parentNode) node.remove(); node.parentNode = this; this.children.push(node);}
  remove() {if (!this.parentNode) return; this.parentNode.children.splice(this.parentNode.children.indexOf(this),1); this.parentNode = null;}
  insertBefore(node, reference) {node.remove(); node.parentNode = this; this.children.splice(this.children.indexOf(reference),0,node);}
  setAttribute(key, value) {this.attrs[key] = value;} removeAttribute(key) {delete this.attrs[key];}
  matches(selector) {
    if (selector.includes(',')) return selector.split(',').some(part => this.matches(part.trim()));
    if (selector === 'input:not([type="hidden"])') return this.tagName === 'input' && this.attrs.type !== 'hidden';
    const attr = /^\[([^=\]]+)(?:="([^"]*)")?\]$/.exec(selector);
    if (attr) return attr[1] in this.attrs && (attr[2] === undefined || this.attrs[attr[1]] === attr[2]);
    return this.tagName === selector;
  }
  closest(selector) {return this.matches(selector) ? this : this.parentNode?.closest(selector);}
  querySelectorAll(selector) {return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);}
  querySelector(selector) {return this.querySelectorAll(selector)[0] || null;}
  get elements() {return {namedItem:name => this.querySelectorAll('[name]').find(input => input.name === name)};}
  focus() {this.focused = true;}
  insertAdjacentHTML(_position, html) {for (const node of [...parse(html).children]) this.append(node);}
}
function parse(html) {
  const root = new Element('root'), stack = [root];
  for (const token of html.match(/<[^>]+>|[^<]+/g) || []) {
    if (token.startsWith('</')) {stack.pop(); continue;}
    if (token.startsWith('<')) {
      const tag = /^<(\w+)/.exec(token)?.[1]; if (!tag) continue;
      const attrs = {};
      for (const match of token.slice(tag.length + 1,-1).matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[match[1]] = decode(match[2] || '');
      const node = new Element(tag, attrs); stack.at(-1).append(node);
      if (!['input','br','hr'].includes(tag)) stack.push(node);
    } else {const node = stack.at(-1); node._text += decode(token); if (node.tagName === 'textarea') node.value += decode(token);}
  }
  return root;
}
function editor(persist = () => true, original) {
  const listeners = new Map();
  const document = {addEventListener(type, callback) {const list = listeners.get(type) || []; list.push(callback); listeners.set(type,list);}};
  const api = load(document), data = original || plain(api.seed()), dom = parse(api.settingsHtml(data)), form = dom.querySelector('[data-company-form]');
  let renders = 0, notifications = 0;
  const options = {getData:() => data, persist, renderAdmin:() => renders++, notify:() => notifications++};
  api.init(options); api.init(options);
  const dispatch = async (type, target = form) => {const event = {target, preventDefault() {this.prevented = true;}}; for (const handler of listeners.get(type) || []) await handler(event); return event;};
  const action = (name, row) => dispatch('click', (row || form).querySelector(`[data-company-action="${name}"]`));
  return {api, data, form, dom, listeners, options, action, dispatch, get renders() {return renders;}, get notifications() {return notifications;}};
}

test('CMS has distinct accessible labels, escapes content, isolated styles and no iframe/network actions', () => {
  const api = load(), data = plain(api.seed());
  data.company.legalName = '<img src=x onerror="attack()">'; data.company.description = '</textarea><script>attack()</script>';
  data.branches[0].name = '" onfocus="attack()';
  const html = api.settingsHtml(data), dom = parse(html);
  assert.doesNotMatch(html, /<iframe|<script|<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /data-company-empty/);
  assert.match(html, /aria-live="polite"/);
  const inputs = dom.querySelectorAll('input,textarea').filter(input => input.attrs.type !== 'hidden');
  const labels = dom.querySelectorAll('label');
  for (const input of inputs) assert.equal(labels.filter(label => label.htmlFor === input.id).length, 1, input.id);
  const ids = dom.querySelectorAll('[id]').map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  const css = fs.readFileSync(new URL('../public/company-profile.css', import.meta.url),'utf8');
  assert.match(css, /minmax\(0, 1fr\)/); assert.match(css, /focus-visible/); assert.match(css, /max-width: 680px/);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|\.innerHTML\s*=/);
});

test('CMS binds once; add/remove/reorder and visible state save the whole form without losing edits', async () => {
  const state = editor(), {form} = state;
  for (const type of ['input','click','submit']) assert.equal(state.listeners.get(type).length, 1);
  form.elements.namedItem('legalName').value = 'Công ty sửa';
  form.elements.namedItem('description').value = 'Dịch vụ đã sửa';
  form.elements.namedItem('branch.0.name').value = 'Tên chi nhánh sửa';
  form.elements.namedItem('branch.0.visible').checked = false;
  await state.action('down', form.querySelectorAll('[data-company-branch]')[0]);
  assert.equal(form.elements.namedItem('branch.1.name').value, 'Tên chi nhánh sửa');
  assert.equal(form.elements.namedItem('branch.1.visible').checked, false);
  await state.action('add');
  assert.equal(form.querySelectorAll('[data-company-branch]').length, 4);
  form.elements.namedItem('branch.3.name').value = 'Chi nhánh thêm';
  await state.action('up', form.querySelectorAll('[data-company-branch]')[3]);
  await state.action('remove', form.querySelectorAll('[data-company-branch]')[0]);
  assert.equal(form.elements.namedItem('legalName').value, 'Công ty sửa');
  assert.equal(state.data.company.legalName, state.api.seed().company.legalName, 'draft controls do not mutate persisted data');
  await state.dispatch('submit');
  assert.equal(state.data.company.legalName, 'Công ty sửa');
  assert.equal(state.data.company.description, 'Dịch vụ đã sửa');
  assert.deepEqual(plain(state.data.branches.map(row => row.name)), ['Tên chi nhánh sửa','Chi nhánh thêm','Chi nhánh Quảng Ninh']);
  assert.equal(state.data.branches[0].visible, false);
  assert.equal(state.renders, 1); assert.equal(state.notifications, 1);
  assert.equal(state.api.valid(state.data), true);
  const ids = form.querySelectorAll('[id]').map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const input of form.querySelectorAll('input').filter(node => node.id)) assert.equal(form.querySelectorAll('label').filter(label => label.htmlFor === input.id).length, 1);
});

test('CMS allows empty branch collections, enforces 20 branches, validates URLs before persisting', async () => {
  let calls = 0;
  const state = editor(() => {calls++; return true;});
  state.form.elements.namedItem('branch.0.embedUrl').value = '<iframe src="bad">';
  await state.dispatch('submit'); assert.equal(calls, 0); assert.equal(state.renders, 0);
  assert.match(state.form.querySelector('[data-company-status]').textContent, /Chưa lưu/);
  while (state.form.querySelectorAll('[data-company-branch]').length) await state.action('remove', state.form.querySelector('[data-company-branch]'));
  assert.equal(state.form.querySelector('[data-company-empty]').hidden, false);
  await state.dispatch('submit'); assert.equal(calls, 1); assert.equal(state.data.branches.length, 0);
  for (let i = 0; i < 21; i++) await state.action('add');
  assert.equal(state.form.querySelectorAll('[data-company-branch]').length, 20);
  assert.equal(state.form.querySelector('[data-company-action="add"]').disabled, true);
});

test('boolean failure, rejection and thrown save restore data while preserving all visible edits', async () => {
  for (const persist of [() => false, () => Promise.resolve(false), () => Promise.reject(Error('quota')), () => {throw Error('quota');}]) {
    const state = editor(persist), before = JSON.stringify(state.data);
    state.form.elements.namedItem('legalName').value = 'Unsaved legal name';
    state.form.elements.namedItem('branch.0.address').value = 'Unsaved address';
    await state.dispatch('submit');
    assert.equal(JSON.stringify(state.data), before);
    assert.equal(state.form.elements.namedItem('legalName').value, 'Unsaved legal name');
    assert.equal(state.form.elements.namedItem('branch.0.address').value, 'Unsaved address');
    assert.equal(state.form.elements.namedItem('legalName').disabled, false);
    assert.equal(state.renders, 0); assert.equal(state.notifications, 0);
    assert.match(state.form.querySelector('[data-company-status]').textContent, /Chưa lưu được/);
    state.api.init({...state.options,persist:() => Promise.resolve(true)});
    await state.dispatch('submit');
    assert.equal(state.data.company.legalName, 'Unsaved legal name');
    assert.equal(state.renders, 1); assert.equal(state.notifications, 1);
  }
});

test('async save prevents overlapping writes and restores previously absent fields on failure', async () => {
  let resolve, calls = 0;
  const data = {partners:[]}, state = editor(() => {calls++; return new Promise(done => {resolve = done;});}, data);
  state.form.elements.namedItem('legalName').value = 'New company';
  const pending = state.dispatch('submit');
  assert.equal(state.form.attrs['aria-busy'], 'true');
  assert.equal(state.form.elements.namedItem('legalName').disabled, true);
  await state.dispatch('submit'); assert.equal(calls, 1);
  resolve(false); await pending;
  assert.deepEqual(data, {partners:[]});
  assert.equal(state.form.elements.namedItem('legalName').value, 'New company');
  assert.equal(state.renders, 0);
});
