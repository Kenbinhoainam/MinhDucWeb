import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = name => fs.readFileSync(new URL('../public/' + name, import.meta.url), 'utf8');
const source = read('workforce-brief.js');
function pure() {
  const context = vm.createContext({window:{}, URL, URLSearchParams});
  vm.runInContext(source, context);
  return context.window.MDWorkforceBrief;
}
const planned = {industry:'electronic', size:'medium', area:'bn', start:'two-weeks', shift:'rotating', count:'120'};
const plain = value => JSON.parse(JSON.stringify(value));
test('HTML language subtags retain the same brief language',()=>{const api=pure();assert.deepEqual(plain(api.summary(planned,'zh-CN')),plain(api.summary(planned,'zh')));assert.equal(new URL(api.contactHref(planned,'zh-CN'),'https://example.test').searchParams.get('lang'),'zh');});

test('handoff round-trips only planning values and actual MD14 service IDs in all four locales', () => {
  const api = pure(), serviceScope = vm.createContext({window:{}});
  vm.runInContext(read('v14-copy.js'), serviceScope);
  const ids = Array.from(serviceScope.window.MD14.services, service => service.id);
  assert.ok(ids.includes('supply'));
  for (const lang of ['vi','en','zh','ko']) for (const service of ids) {
    const href = api.contactHref({...planned, company:'PRIVATE', phone:'0901234567', message:'PRIVATE'}, lang, service);
    const url = new URL(href, 'https://example.test/');
    assert.equal(url.pathname, '/lien-he.html');
    assert.equal(url.searchParams.get('service'), service);
    assert.equal(url.searchParams.get('lang'), lang);
    assert.deepEqual(plain(api.readContext(href).values), planned);
    assert.equal(api.readContext(href).invalid, false);
    assert.doesNotMatch(href, /PRIVATE|0901234567|company|phone|message|staffing=/);
    assert.deepEqual([...url.searchParams.keys()].sort(), ['lang','service','wb','wb_a','wb_h','wb_i','wb_n','wb_s','wb_t'].sort());
  }
  assert.equal(new URL(api.contactHref(planned, 'en', 'staffing'), 'https://example.test').searchParams.has('service'), false);
});

test('empty, unsupported, duplicate, hostile and oversized URL details never become planning facts', () => {
  const api = pure();
  for (const href of ['', 'lien-he.html', '?wb_i=electronic', '?wb=2&wb_n=10', '?wb=1&wb=1&wb_n=10']) {
    assert.deepEqual(plain(api.readContext(href).values), {industry:'',size:'',area:'',start:'',shift:'',count:''});
  }
  for (const value of ['-1','0','1.5','1e3','NaN','Infinity','1000000',' 20 ','0901234567','<img onerror=alert(1)>']) {
    const state = api.readContext('?wb=1&wb_i=warehouse&wb_t=month&wb_n=' + encodeURIComponent(value));
    assert.equal(state.values.count, '');
    assert.equal(state.values.industry, 'warehouse');
    assert.equal(state.values.start, 'month', 'one corrupt field must not discard later valid fields');
    assert.equal(state.invalid, true);
  }
  for (const query of ['wb_i=electronic&wb_i=other', 'wb_a=PRIVATE_ADDRESS', 'wb_h=' + 'x'.repeat(1000), 'wb_t=javascript:alert(1)']) {
    const state = api.readContext('?wb=1&' + query);
    assert.equal(state.invalid, true);
    assert.ok(Object.values(state.values).every(value => value === ''));
  }
  assert.equal(api.readContext('?wb=1&service=supply&service=consulting').service, '');
  assert.equal(api.readContext('?wb=1&service=https://evil.test').service, '');
  assert.equal(api.readContext('http://[').invalid, true);
  assert.equal(api.readContext('?wb=1&wb_n=000012').values.count, '12');
});

test('undecided is supported and translated separately from total headcount and requested start', () => {
  const api = pure();
  const expected = {vi:'Chưa xác định',en:'Undecided',zh:'尚未确定',ko:'미정'};
  for (const [lang, unknown] of Object.entries(expected)) {
    const rows = api.summary({}, lang);
    assert.equal(rows.length, 6);
    assert.ok(rows.every(row => row.value === unknown));
    assert.ok(api.summary(planned, lang).every(row => row.label && row.value));
  }
  assert.equal(api.summary(planned, 'en').find(row => row.key === 'count').label, 'Exact headcount · total');
  assert.equal(api.summary(planned, 'en').find(row => row.key === 'start').label, 'Requested start');
  assert.equal(api.contactHref({}, 'bad'), 'lien-he.html?wb=1&lang=vi');
});

test('exact total determines one consistent size band, including conflicting and corrupt URL values', () => {
  const api = pure();
  for (const [count,size] of [['1','small'],['49','small'],['50','medium'],['150','medium'],['151','large'],['350','large'],['351','xlarge'],['999999','xlarge']]) {
    assert.equal(api.normalize({size:'small',count}).size,size);
    assert.equal(api.readContext('?wb=1&wb_s=small&wb_n=' + count).values.size,size);
    assert.equal(api.readContext(api.contactHref({size:'small',count})).values.size,size);
  }
  const corrupt = api.readContext('?wb=1&wb_s=PRIVATE&wb_n=120');
  assert.equal(corrupt.invalid,true);
  assert.equal(corrupt.values.size,'medium');
  assert.equal(corrupt.values.count,'120');
  const invalidCount = api.readContext('?wb=1&wb_s=xlarge&wb_n=1e3');
  assert.equal(invalidCount.invalid,true);
  assert.equal(invalidCount.values.count,'');
  assert.equal(invalidCount.values.size,'xlarge');
});

// A small deterministic DOM exercises the standalone/runtime boundary without browser automation.
// Mutation callbacks are flushed explicitly to model the end of a runtime rerender.
class Element {
  get isConnected() { return this.tagName === 'HTML' || Boolean(this.parentElement?.isConnected); }
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.parentElement = null; this.attrs = {}; this.dataset = {}; this._text = ''; this._value = ''; this.hidden = false; this.checked = false; this.type = this.tagName === 'INPUT' ? 'text' : this.tagName === 'SELECT' ? 'select-one' : ''; this.className = ''; }
  get classList() { return {contains:name => this.className.split(' ').includes(name), toggle:(name, on) => { const names = new Set(this.className.split(' ').filter(Boolean)); if (on) names.add(name); else names.delete(name); this.className = [...names].join(' '); }}; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set textContent(value) { this.textWrites = (this.textWrites || 0) + 1; for (const child of this.children) child.parentElement = null; this.children = []; this._text = String(value); }
  get options() { return this.children.filter(child => child.tagName === 'OPTION'); }
  get selectedIndex() { return this.options.findIndex(item => item.value === this.value); }
  set selectedIndex(value) { this._value = this.options[value]?.value ?? ''; }
  get selectedOptions() { return this.options.filter(option => option.value === this.value); }
  get value() { return this.tagName === 'SELECT' ? this._value || this.options[0]?.value || '' : this._value; }
  set value(value) { this._value = String(value); }
  get elements() { const fields = this.querySelectorAll('input,select,textarea'); return {namedItem:name => fields.find(item => item.name === name)}; }
  append(...nodes) { for (const child of nodes) { child.remove(); this.children.push(child); child.parentElement = this; } }
  prepend(child) { this.insertBefore(child, this.children[0]); }
  insertBefore(child, before) { child.remove(); const at = this.children.indexOf(before); this.children.splice(at < 0 ? this.children.length : at, 0, child); child.parentElement = this; }
  remove() { if (this.parentElement) { const children = this.parentElement.children; children.splice(children.indexOf(this), 1); this.parentElement = null; } }
  replaceWith(child) { const parent = this.parentElement; parent.insertBefore(child, this); this.remove(); }
  after(child) { const parent = this.parentElement; parent.insertBefore(child, parent.children[parent.children.indexOf(this) + 1]); }
  setAttribute(name, value) { if (name === 'class') this.className = String(value); else this.attrs[name] = String(value); }
  getAttribute(name) {
    if (name.startsWith('data-')) { const key = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()); return this.dataset[key] ?? null; }
    if (name === 'class') return this.className || null;
    if (name === 'hidden') return this.hidden ? '' : null;
    return this.attrs[name] ?? (['id','name','type'].includes(name) ? this[name] ?? null : null);
  }
  hasAttribute(name) { return this.getAttribute(name) !== null; }
  removeAttribute(name) { delete this.attrs[name]; }
  matches(selector) {
    return selector.split(',').some(part => {
      let value = part.trim();
      const not = value.match(/:not\(([^)]+)\)/); if (not) { if (this.matches(not[1])) return false; value = value.replace(not[0], ''); }
      for (const attr of value.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)) { const actual = this.getAttribute(attr[1]); if (actual === null || attr[2] !== undefined && actual !== attr[2]) return false; }
      value = value.replace(/\[[^\]]+\]/g, '');
      const id = value.match(/#([\w-]+)/); if (id && this.id !== id[1]) return false;
      for (const cls of value.matchAll(/\.([\w-]+)/g)) if (!this.classList.contains(cls[1])) return false;
      const tag = value.match(/^[a-z]+/i); return !tag || this.tagName === tag[0].toUpperCase();
    });
  }
  querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
  focus() { this.focused = true; }
  checkValidity() { return !this.required || this.type === 'checkbox' ? !this.required || this.checked : this.value.length >= (this.minLength || 1); }
}
function harness({page = 'home', href = 'https://example.test/index.html?lang=en', lang = 'en', message = ''} = {}) {
  const html = new Element('html'), body = new Element('body'), listeners = [], windowListeners = [];
  html.lang = lang; html.append(body);
  const document = {documentElement:html, body, readyState:'complete', createElement:tag => new Element(tag), querySelector:selector => html.querySelector(selector), querySelectorAll:selector => html.querySelectorAll(selector), addEventListener(type, handler, capture) { listeners.push({type,handler,capture:capture === true}); }};
  const root = {document, location:{href}, MutationObserver:class {constructor(callback) {this.callback = callback;} observe() {}}, addEventListener(type,handler) { windowListeners.push({type,handler}); }};
  const ctx = vm.createContext({window:root, document, URL, URLSearchParams, structuredClone, setTimeout:fn => {fn();return 1;}, localStorage:{getItem:() => null}, C:key => key});
  for (const name of ['fetch','XMLHttpRequest','WebSocket','sessionStorage']) Object.defineProperty(root, name, {get() { throw new Error('Unexpected I/O: ' + name); }});
  let form;
  const el = (tag, id, value = '') => { const item = new Element(tag); item.id = id; item.value = value; return item; };
  function build(initialMessage = '') {
    body.textContent = '';
    form = el('form', page === 'home' ? 'staffingCalculator' : 'contactForm');
    if (page === 'home') {
      for (const [id, name, values] of [['staffIndustry','industry',['electronic','mechanical','warehouse','other']], ['staffSize','size',['small','medium','large','xlarge']], ['staffArea','area',['','Bắc Ninh','Bắc Giang','Hà Nội']]]) {
        const select = el('select', id); select.name = name;
        for (const value of values) { const option = el('option', '', value); option.textContent = value; select.append(option); } form.append(select);
      }
      const result = el('div'); result.className = 'md-brief-result'; result.append(el('strong', 'staffingSummary'));
      form.append(result, el('a', 'staffingCta'));
    } else {
      const step1 = el('fieldset'); step1.dataset.contactStep = '1';
      const company = el('input', 'briefCompany', ''); company.name = 'company';
      const textarea = el('textarea', 'briefMessage', initialMessage); textarea.name = 'message'; textarea.required = true; textarea.minLength = 10;
      step1.append(company, textarea, el('span', 'briefCharCount'), el('button', 'contactNext'));
      const step2 = el('fieldset'); step2.dataset.contactStep = '2'; step2.hidden = true;
      step2.append(el('div', 'contactReview'));
      for (const [id,name,type] of [['contactName','name','text'], ['contactPhone','phone','tel'], ['contactConsent','consent','checkbox']]) { const field = el('input', id); field.name = name; field.type = type; field.required = true; const wrapper = el('div'); wrapper.className = 'field'; wrapper.append(field); step2.append(wrapper); }
      step2.append(el('button', 'contactBack')); const submit = el('button', 'contactSubmit'); submit.type = 'submit'; step2.append(submit);
      form.append(step1, step2);
    }
    body.append(form);
    if (page !== 'home') form.querySelector('#contactBack').click = () => { form.querySelector('[data-contact-step="1"]').hidden = false; form.querySelector('[data-contact-step="2"]').hidden = true; };
    return form;
  }
  build(message);
  vm.runInContext(read('contact-media.js'), ctx);
  vm.runInContext(source, ctx);
  const api = root.MDWorkforceBrief;
  function event(type, target) {
    const event = {type,target,defaultPrevented:false,stopped:false,preventDefault() {this.defaultPrevented = true;}, stopImmediatePropagation() {this.stopped = true;}};
    for (const item of windowListeners) if (item.type === type && !event.stopped) item.handler(event);
    for (const item of listeners) if (item.type === type && item.capture && !event.stopped) item.handler(event);
    // Model only the unchanged runtime's Next/Back behavior here; real validators/adapter are tested below.
    if (type === 'click' && target.id === 'contactNext' && !event.stopped && form.querySelector('#briefMessage').value.trim().length >= 10) {
      form.querySelector('[data-contact-step="1"]').hidden = true;
      form.querySelector('[data-contact-step="2"]').hidden = false;
      form.querySelector('#contactReview').textContent = form.querySelector('#briefMessage').value.trim();
    }
    for (const item of listeners) if (item.type === type && !item.capture && !event.stopped) item.handler(event);
    api.mount(); return event;
  }
  return {api,ctx,root,document,body,get form() {return form;},event,set(key,value) { const control = form.querySelector('[data-wb-key="' + key + '"]'); control.value = value; event('input',control); return control; }, rerender(nextLang) {const snapshot = root.MDExperience.captureForms(document); html.lang = nextLang; build(); root.MDExperience.restoreForms(snapshot, document); api.mount();},build};
}

test('home retains three native controls, allows unknown, and carries optional total/start/shift', () => {
  const h = harness();
  assert.equal(h.form.querySelectorAll('[data-wb-key]').length, 3);
  assert.equal(h.form.querySelector('#staffIndustry').value, 'electronic');
  assert.equal(h.form.querySelector('#staffSize').value, 'small');
  h.set('count','45'); h.set('shift','night'); h.set('start','month');
  const area = h.form.querySelector('#staffArea'); area.value = 'Bắc Giang'; h.event('change',area);
  const industry = h.form.querySelector('#staffIndustry'); industry.value = ''; h.event('change',industry);
  const href = h.form.querySelector('#staffingCta').getAttribute('href');
  assert.deepEqual(plain(h.api.readContext(href).values), {industry:'',size:'small',area:'bg',start:'month',shift:'night',count:'45'});
  h.rerender('ko');
  assert.equal(h.form.querySelector('#staffIndustry').value,'');
  assert.equal(h.form.querySelector('#staffArea').value,'Bắc Giang');
  assert.equal(h.form.querySelector('[data-wb-key="count"]').value,'45');
  assert.match(h.form.querySelector('#staffingCta').getAttribute('href'), /lang=ko/);
});

test('assistant reseeds untouched contact summaries but preserves edited and cleared messages', () => {
  const h=harness({page:'contact',lang:'vi'}), message=h.form.querySelector('#briefMessage');
  h.set('count','120'); h.set('shift','rotating');
  assert.equal(h.api.seedContactMessage(h.form),true);
  assert.match(message.value,/120/);
  h.set('count','35'); h.set('shift','night');
  assert.equal(h.api.seedContactMessage(h.form),true);
  assert.match(message.value,/35/);
  assert.doesNotMatch(message.value,/120/);
  message.value='Nội dung đã chỉnh tay cần giữ nguyên'; h.event('input',message);
  h.set('count','50');
  assert.equal(h.api.seedContactMessage(h.form),false);
  assert.equal(message.value,'Nội dung đã chỉnh tay cần giữ nguyên');
  message.value=''; h.event('input',message);
  h.set('count','60');
  assert.equal(h.api.seedContactMessage(h.form),false);
  assert.equal(message.value,'');
});

test('invalid optional totals block both the home CTA and submit before the legacy adapter', () => {
  for (const value of ['0','-1','1.5','1e3','PRIVATE','1000000']) {
    const h = harness(), count = h.set('count',value);
    const click = h.event('click',h.form.querySelector('#staffingCta'));
    assert.equal(click.defaultPrevented,true,value);
    assert.equal(count.getAttribute('aria-invalid'),'true');
    assert.equal(count.focused,true);
    assert.equal(count.closest('details').open,true);
    assert.match(count.getAttribute('aria-describedby'),/wb-count-error/);
    assert.equal(h.event('submit',h.form).defaultPrevented,true);
    h.set('count',''); assert.equal(count.hasAttribute('aria-invalid'),false);
    assert.equal(h.event('click',h.form.querySelector('#staffingCta')).defaultPrevented,false);
  }
});

test('entering an exact total synchronizes both the native home band and editable contact band', () => {
  const h = harness();
  h.set('count','120');
  assert.equal(h.form.querySelector('#staffSize').value,'medium');
  assert.doesNotMatch(h.form.querySelector('#staffingSummary').textContent,/Under 50/);
  const contact = harness({page:'contact',href:'https://example.test/' + h.form.querySelector('#staffingCta').getAttribute('href')});
  contact.set('count','351');
  assert.equal(contact.form.querySelector('[data-wb-key="size"]').value,'xlarge');
  contact.set('size','small');
  assert.equal(contact.form.querySelector('[data-wb-key="size"]').value,'xlarge','the exact total remains authoritative');
  assert.doesNotMatch(contact.form.querySelector('[data-wb-review]').textContent,/Under 50|50–150 people/);
  assert.match(contact.form.querySelector('[data-wb-review]').textContent,/351/);
  assert.match(contact.form.querySelector('#briefMessage').value,/351/,'an untouched generated draft follows the current plan');
  const custom='Keep this custom business message';contact.form.querySelector('#briefMessage').value=custom;contact.set('count','400');assert.equal(contact.form.querySelector('#briefMessage').value,custom,'a visitor-edited message must never be overwritten');
  assert.match(contact.form.querySelector('#wb-count-hint').textContent,/updates the headcount band/);
});

for (const language of ['vi','en','zh','ko']) test(language + ': structured brief seeds one editable message, then preserves legacy fields through review/back/locale', () => {
  const href = 'https://example.test/' + pure().contactHref(planned,language,'supply');
  const h = harness({page:'contact',href,lang:language});
  assert.equal(h.form.querySelector('#contactConsent').checked,false,'planning context never grants consent');
  const originalFields = ['briefCompany','briefMessage','contactName','contactPhone','contactConsent'];
  assert.deepEqual(h.form.querySelectorAll('input,select,textarea').slice(0,5).map(field => field.id),originalFields);
  assert.ok(h.form.querySelector('#briefMessage').value.trim().length >= 10, 'no retyping needed for the unchanged Next gate');
  assert.equal(h.form.querySelector('#briefCharCount').textContent,String(h.form.querySelector('#briefMessage').value.length));
  h.event('click',h.form.querySelector('#contactNext'));
  assert.equal(h.form.querySelector('[data-contact-step="2"]').hidden,false);
  assert.equal(h.form.querySelector('[data-wb-extension]').hidden,true);
  assert.match(h.form.querySelector('#contactReview').textContent,/120/);
  assert.match(h.form.querySelector('#contactReview').textContent,/Bắc Ninh/);
  const custom = 'Custom message · 自定义 · 사용자 메모';
  h.form.querySelector('#briefMessage').value = custom;
  h.form.querySelector('#briefCompany').value = 'SAMPLE COMPANY';
  h.form.querySelector('#contactName').value = 'Sample Person';
  h.form.querySelector('#contactPhone').value = '0901234567';
  h.form.querySelector('#contactConsent').checked = true;
  h.event('click',h.form.querySelector('[data-wb-edit]'));
  assert.equal(h.form.querySelector('[data-contact-step="1"]').hidden,false);
  assert.equal(h.form.querySelector('[data-wb-key="industry"]').focused,true);
  h.set('count','123');
  assert.equal(h.form.querySelector('#briefMessage').value,custom);
  for (const nextLang of ['ko','zh','en','vi']) {
    h.rerender(nextLang);
    assert.equal(h.form.querySelector('#briefMessage').value,custom);
    assert.equal(h.form.querySelector('#briefCompany').value,'SAMPLE COMPANY');
    assert.equal(h.form.querySelector('#contactName').value,'Sample Person');
    assert.equal(h.form.querySelector('#contactPhone').value,'0901234567');
    assert.equal(h.form.querySelector('#contactConsent').checked,true);
    assert.equal(h.form.querySelector('[data-wb-key="count"]').value,'123');
    h.event('click',h.form.querySelector('#contactNext'));
    assert.ok(h.form.querySelector('#contactReview').textContent.includes(custom));
    assert.match(h.form.querySelector('#contactReview').textContent,/123/);
  }
});

test('editing then restoring the generated message still disables automatic message updates', () => {
  const h=harness({page:'contact',href:'https://example.test/'+pure().contactHref(planned)});
  const message=h.form.querySelector('#briefMessage'),seed=message.value;
  message.value=seed+' user edit';h.event('input',message);
  message.value=seed;h.event('input',message);
  h.set('count','351');assert.equal(message.value,seed);
  h.event('click',h.form.querySelector('#contactNext'));
  assert.equal(h.form.querySelector('.wb-draft-preview'),null);assert.equal(h.form.querySelector('.wb-message').textContent,seed);
  h.rerender('ko');h.set('count','400');assert.equal(h.form.querySelector('#briefMessage').value,seed);
  h.event('click',h.form.querySelector('#contactNext'));
  assert.equal(h.form.querySelector('.wb-draft-preview'),null);assert.equal(h.form.querySelector('.wb-message').textContent,seed);
});

test('an intentionally emptied or pre-existing free message is never replaced during edits or locale changes', () => {
  const href = 'https://example.test/' + pure().contactHref(planned);
  const h = harness({page:'contact',href,message:'Existing independent message'});
  assert.equal(h.form.querySelector('#briefMessage').value,'Existing independent message');
  h.form.querySelector('#briefMessage').value = '';
  h.set('shift','night'); h.rerender('zh');
  assert.equal(h.form.querySelector('#briefMessage').value,'');
  const empty = harness({page:'contact'});
  assert.equal(empty.form.querySelector('#briefMessage').value,'');
  assert.equal(empty.form.querySelector('[data-wb-key="start"]').value,'');
  assert.equal(empty.event('click',empty.form.querySelector('#contactNext')).defaultPrevented,false);
  assert.equal(empty.form.querySelector('[data-contact-step="2"]').hidden,true,'legacy message requirement remains in control');
});

test('repeated observer reconciliation is idempotent and invalid link values render only as undecided', () => {
  const h = harness({page:'contact',href:'https://example.test/lien-he.html?wb=1&wb_n=%3Cscript%3E&wb_a=PRIVATE'});
  const before = h.form.querySelectorAll('input,select,textarea').length;
  for (let n=0;n<20;n++) h.api.mount();
  assert.equal(h.form.querySelectorAll('[data-wb-extension]').length,1);
  assert.equal(h.form.querySelectorAll('[data-wb-review]').length,1);
  assert.equal(h.form.querySelectorAll('input,select,textarea').length,before);
  assert.doesNotMatch(h.form.querySelector('#contactReview').textContent, /PRIVATE|script/);
  assert.ok(h.form.querySelector('.wb-link-warning'));
  const home = harness(), summary = home.form.querySelector('#staffingSummary'), writes = summary.textWrites;
  for (let n=0;n<20;n++) home.api.mount();
  assert.equal(summary.textWrites,writes,'stable home summary must not create an observer/text mutation loop');
});

test('existing name/phone/consent checks and the real no-send prototype adapter still own valid contact completion', async () => {
  const href = 'https://example.test/' + pure().contactHref(planned);
  const h = harness({page:'contact',href});
  const validator = read('app.js').match(/function validatePublicForm\(form\)\{[\s\S]*?\n\s*\}/)?.[0];
  assert.ok(validator,'load the current public validator rather than a duplicate implementation');
  vm.runInContext(validator + '\nwindow.testValidate=validatePublicForm;',h.ctx);
  assert.equal(h.root.testValidate(h.form),false,'empty legacy contact fields still fail');
  assert.equal(h.form.querySelector('#contactName').getAttribute('aria-invalid'),'true');
  h.form.querySelector('#contactName').value = 'Sample Person';
  h.form.querySelector('#contactPhone').value = '0901234567';
  assert.equal(h.root.testValidate(h.form),false,'consent is still required');
  h.form.querySelector('#contactConsent').checked = true;
  assert.equal(h.root.testValidate(h.form),true);
  vm.runInContext(read('prototype-v17.js'),h.ctx);
  h.root.MD15.boot({getData:() => ({home:{},jobs:[],posts:[],partners:[]}),render:() => {},validateForm:h.root.testValidate});
  h.set('count','0');
  const invalid = h.event('submit',h.form);
  assert.equal(invalid.defaultPrevented,true);
  assert.equal(h.form.dataset.sending,undefined,'invalid optional data is stopped before the runtime demo submit');
  assert.ok(h.document.querySelector('#contactForm'));
  h.set('count','120');
  const submit = h.event('submit',h.form);
  assert.equal(submit.defaultPrevented,true,'the prototype adapter intercepts the native submit');
  await Promise.resolve(); await Promise.resolve(); h.api.mount();
  const completion = h.document.querySelector('.prototype-success');
  assert.ok(completion);
  // The legacy adapter uses innerHTML; this deliberately minimal DOM keeps that markup verbatim.
  assert.match(completion.innerHTML,/not sent or stored/);
  assert.match(completion.textContent,/has not sent a request/);
  assert.match(completion.textContent,/120/);
  assert.match(completion.innerHTML,/data-form-again/);
});

test('standalone script has no persistence/network operations and exposes only planning helpers', () => {
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB)\b/);
  assert.deepEqual(Object.keys(pure()).sort(), ['contactHref','normalize','readContext','summary']);
  const css = read('workforce-brief.css');
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(css, /focus-visible/);
  assert.match(css, /minmax\(0,1fr\)/);
});
