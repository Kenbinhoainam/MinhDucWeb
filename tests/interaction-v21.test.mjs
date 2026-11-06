import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = name => fs.readFileSync(new URL('../public/' + name, import.meta.url), 'utf8');
const scope = vm.createContext({ window: {}, URL });
vm.runInContext(read('locale-routing.js'), scope);
const locale = scope.window.MDLocale;

test('news -> article -> return keeps content type, query and each locale', () => {
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    const first = locale.newsHref({kind:'video',query:'nhà máy & ca làm'},lang);
    const selected = locale.newsState(first);
    const detail = locale.newsHref(selected,lang,'video-moi-truong');
    assert.equal(new URL(detail,'https://example.test').searchParams.get('id'),'video-moi-truong');
    assert.equal(locale.newsHref(locale.newsState(detail),lang),first);
    assert.equal(locale.newsState(detail).kind,'video');
    assert.equal(locale.newsState(detail).query,'nhà máy & ca làm');
    for (const next of ['vi','en','zh','ko']) {
      const changed = locale.withLocale(detail,next,'https://example.test/tin-tuc.html');
      assert.equal(locale.newsState(changed).query,selected.query);
      assert.equal(locale.newsState(changed).kind,selected.kind);
    }
  }
});

test('news state validates type, bounds search text and never accepts a return redirect', () => {
  const state = locale.newsState('tin-tuc.html?kind=unknown&q='+ 'a'.repeat(250)+'&return=https://unrelated.example');
  assert.equal(state.kind,'all');
  assert.equal(state.query.length,200);
  const href=locale.newsHref({...state,return:'https://unrelated.example'},'en');
  assert.match(href,/^tin-tuc\.html\?/);
  assert.doesNotMatch(href,/return|unrelated|kind=/);
  assert.equal(locale.newsHref({kind:'all',query:''},'ko'),'tin-tuc.html?lang=ko');
});

function contactScope({ contact=false }={}) {
  const link={textContent:'Liên hệ tư vấn',replaceWith(node){this.replacement=node;}};
  const listing={textContent:'Xem tất cả việc làm'},apply={textContent:'Ứng tuyển'};
  const social={classList:{toggle(name,value){social[name]=value;}}};
  const dock={querySelector(selector){
    if(selector==='a')return listing;
    if(selector==='a[data-action="contact"]')return contact?link:null;
    if(selector==='[data-social-toggle]')return link.replacement;
    return null;
  }};
  const document={documentElement:{lang:'vi'},querySelector(selector){return selector==='.mobile-action-dock'?dock:selector==='.md-social'?social:null;},createElement(){return {dataset:{},setAttribute(name,value){this[name]=value;}};}};
  const ctx=vm.createContext({window:{},document,URL});
  vm.runInContext(read('contact-media.js'),ctx);
  return {api:ctx.window.MDExperience,ctx,link,listing,apply,social};
}

test('mounting contact widget preserves listing/apply actions and converts only marked contact action',()=>{
  const detail=contactScope();detail.api.mountPublic();
  assert.equal(detail.listing.replacement,undefined);
  assert.equal(detail.apply.replacement,undefined);
  assert.equal(detail.social['has-dock-contact'],false);
  const home=contactScope({contact:true});home.api.mountPublic();
  assert.equal(home.link.replacement.textContent,'Liên hệ tư vấn');
  assert.equal(home.link.replacement['aria-controls'],'md-social-panel');
  assert.equal(home.social['has-dock-contact'],true);
});

test('empty video uses an honest noninteractive poster in every locale; configured sources keep play action',()=>{
  const {api,ctx}=contactScope();
  const fn=read('app.js').match(/function videoBlock\([\s\S]*?\n\}/)?.[0];
  assert.ok(fn,'videoBlock source is available');
  Object.assign(ctx,{E:value=>String(value).replaceAll('"','&quot;'),imgSrc:value=>'assets/'+value,I:()=>'<svg></svg>',currentLang:'vi'});
  vm.runInContext(fn,ctx);
  for(const lang of ['vi','en','zh','ko']){
    ctx.currentLang=lang;
    const empty=ctx.videoBlock('','poster.webp','post:sample');
    assert.match(empty,/md-video-unavailable/);
    assert.ok(empty.includes(api.videoLabel('',lang).empty));
    assert.doesNotMatch(empty,/data-video=|class="play"|href=/);
    assert.match(empty,/data-media-key="post:sample"/);
    const playable=ctx.videoBlock('https://example.test/demo.mp4','poster.webp');
    assert.match(playable,/data-video="https:\/\/example.test\/demo.mp4"/);
    assert.ok(playable.includes(api.videoLabel('',lang).play));
  }
});

test('empty player state differs from a broken video link',async()=>{
  const {api}=contactScope();
  const container=()=>({isConnected:true,textContent:'',setAttribute(){}});
  const empty=container(),broken=container();
  await api.player(empty,'');
  await api.player(broken,'https://example.test/not-a-video');
  assert.equal(empty.textContent,api.videoLabel('','vi').empty);
  assert.match(broken.textContent,/Không phát được/);
});

test('selected service is separate from visitor text, including old generated links',()=>{
  const services=[{id:'recruitment',name:['Tuyển dụng theo yêu cầu','Targeted recruitment','定向招聘','맞춤 채용']}];
  for(const generated of services[0].name){
    const context=locale.contactContext('lien-he.html?'+new URLSearchParams({service:'recruitment',staffing:generated}),services);
    assert.equal(context.service.id,'recruitment');
    assert.equal(context.message,'');
  }
  const message='Cần đội ngũ làm ca ngày. Giữ nguyên nội dung tôi đã viết.';
  assert.equal(locale.contactContext('lien-he.html?'+new URLSearchParams({service:'recruitment',staffing:message}),services).message,message);
  assert.equal(locale.contactContext('lien-he.html?service=invalid',services).service,undefined);
});

test('locale rerender keeps text, choices, current form step and the exact selected file input in memory',()=>{
  const {api}=contactScope();
  const classes=initial=>{const values=new Set(initial);return {contains:key=>values.has(key),toggle(key,on){on?values.add(key):values.delete(key);}};};
  const step=(n,hidden)=>({hidden,hasAttribute:key=>key==='data-step',getAttribute:key=>key==='data-step'?String(n):null});
  const progress=(n,on)=>({classList:classes(on?['is-active']:[]),hasAttribute:key=>key==='data-apply-progress',getAttribute:key=>key==='data-apply-progress'?String(n):null});
  const oldFields=[{type:'text',value:'Demo Candidate',tagName:'INPUT'},{type:'checkbox',checked:true,tagName:'INPUT'},{type:'radio',checked:true,tagName:'INPUT'},{type:'select-one',value:'third',selectedIndex:2,tagName:'SELECT'},{type:'file',value:'sample.pdf',files:[{name:'sample.pdf'}],tagName:'INPUT'}];
  const makeForm=(fields,active)=>{
    const steps=[step(1,active===2),step(2,active===1)],markers=[progress(1,active===1),progress(2,active===2)];
    return {id:'applyForm',steps,markers,querySelectorAll(selector){
      if(selector.startsWith('input'))return fields;
      if(selector==='[data-step],[data-contact-step]')return steps;
      if(selector==='[data-apply-progress],[data-contact-progress]')return markers;
      return [];
    },querySelector(selector){
      if(selector==='[aria-invalid="true"]')return null;
      const n=Number(selector.match(/="([12])"/)?.[1]);
      return selector.includes('progress')?markers[n-1]:steps[n-1];
    }};
  };
  const original=makeForm(oldFields,2);
  const snapshots=api.captureForms({querySelectorAll:()=>[original]});
  const freshFields=oldFields.map(field=>({type:field.type,tagName:field.tagName,value:'',checked:false,selectedIndex:0,replaceWith(node){this.replacedBy=node;}}));
  freshFields[3].options=[{value:''},{value:'second'},{value:'third'}];
  Object.defineProperty(freshFields[3],'value',{get(){return this.options[this.selectedIndex]?.value||'';},set(value){this.selectedIndex=this.options.findIndex(option=>option.value===value);}});
  const fresh=makeForm(freshFields,1);
  api.restoreForms(snapshots,{querySelector:()=>fresh});
  assert.equal(freshFields[0].value,'Demo Candidate');
  assert.equal(freshFields[1].checked,true);
  assert.equal(freshFields[2].checked,true);
  assert.equal(freshFields[3].selectedIndex,2);
  assert.equal(freshFields[4].replacedBy,oldFields[4]);
  assert.equal(freshFields[4].replacedBy.files[0].name,'sample.pdf');
  assert.equal(fresh.steps[0].hidden,true);
  assert.equal(fresh.steps[1].hidden,false);
  assert.equal(fresh.markers[1].classList.contains('is-active'),true);
});

test('language switch does not validate hidden second-step fields after a first-step error',()=>{
  const branch=read('app.js').match(/if\(e\.target\.id==='languageSelect'\)\{[\s\S]*?(?=if\(e\.target\.id==='transEntity')/)?.[0];
  assert.ok(branch);
  for(const secondStepHidden of [true,false]){
    const draft={id:'contactForm',hadErrors:true};let validations=0,restored=false,focused=false;
    const form={querySelector:()=>secondStepHidden?{}:null};
    const ctx=vm.createContext({page:'contact',currentLang:'vi',window:{MDLocale:{persist:value=>value},MDExperience:{captureForms:()=>[draft],restoreForms:()=>{restored=true;}}},
      renderPage(){},qs:selector=>selector==='#contactForm'?form:{focus(){focused=true;}},validatePublicForm(){validations++;}});
    vm.runInContext('function switchLanguage(e){'+branch+'}',ctx);
    ctx.switchLanguage({target:{id:'languageSelect',value:'en'}});
    assert.equal(ctx.currentLang,'en');assert.equal(restored,true);assert.equal(focused,true);
    assert.equal(validations,secondStepHidden?0:1);
  }
});

test('restoring a first-step alert preserves the newly translated text',()=>{
  const {api}=contactScope();
  const alert={id:'contactStepError',hidden:true,textContent:'Please describe your requirements.'};
  const form={querySelectorAll:()=>[],querySelector:selector=>selector==='#contactStepError'?alert:null};
  api.restoreForms([{id:'contactForm',fields:[],steps:[],progress:[],alerts:[{id:'contactStepError',hidden:false}]}],{querySelector:()=>form});
  assert.equal(alert.hidden,false);
  assert.equal(alert.textContent,'Please describe your requirements.');
});
