import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function mediaSourcePolicy(){
  const bootstrap='wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();';
  const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  assert.ok(source.includes(bootstrap));
  const scope=vm.createContext({window:{},document:{body:{dataset:{page:'home'}}},sessionStorage:{getItem:()=>null},localStorage:{getItem:()=>null},structuredClone,Intl,Date,URL,URLSearchParams,location:{search:'',hash:''},console});
  vm.runInContext(readFileSync(new URL('../public/locale-routing.js',import.meta.url),'utf8'),scope);
  vm.runInContext(source.replace(bootstrap,'globalThis.checkMediaSource=validMediaSource;'),scope);
  return scope.checkMediaSource;
}
test('CMS accepts bundled nested logo paths and existing supported media sources',()=>{
  const validate=mediaSourcePolicy();
  for(const source of ['assets/partners/samsung.svg','assets/partners/luxshare.jpg','assets/gallery-line.webp','gallery-line.webp','assets/demo/portraits/example.png','https://example.invalid/logo.svg'])assert.equal(validate(source),true,source);
});
test('CMS media paths reject traversal, credentials and unsupported protocols',()=>{
  const validate=mediaSourcePolicy();
  for(const source of ['assets/../secret.svg','assets/partners/../../secret.png','//example.invalid/logo.png','/etc/private.png','javascript:alert(1)','http://example.invalid/logo.png','https://user:password@example.invalid/logo.png','data:image/svg+xml,<svg/>','assets/partners/logo.html'])assert.equal(validate(source),false,source);
});

function fixture({quota=false}={}){
  const values=new Map(),listeners={},notices=[],timers=[],reads=[];
  let data={home:{heroLine1:'Demo'},jobs:[],posts:[],partners:[]},rendered=0,requests=0;
  const document={documentElement:{lang:'vi'},querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(type,fn)=>{listeners[type]=fn;},createElement:()=>({setAttribute(){},focus(){this.focused=true;}})};
  const scope=vm.createContext({window:{},document,structuredClone,URL,console,setTimeout:fn=>timers.push(fn),confirm:()=>true,fetch(){requests++;throw Error('Prototype must not request a service');},FormData:class{constructor(){throw Error('Do not serialize contact or CV data');}},localStorage:{getItem(key){reads.push(key);return values.get(key)||null;},setItem(key,value){if(quota)throw Error('Quota');values.set(key,value);},removeItem(key){values.delete(key);}}});
  vm.runInContext(readFileSync(new URL('../public/prototype-v17.js',import.meta.url),'utf8'),scope);
  const adapter=scope.window.MD15;adapter.boot({page:'admin',getData:()=>data,setData:v=>{data=v;},render(){rendered++;},notify:v=>notices.push(v),validateForm:()=>true});
  return {adapter,values,listeners,notices,timers,reads,get rendered(){return rendered;},get requests(){return requests;}};
}
test('CMS uses its own local content store and reports quota failure',()=>{
  const f=fixture();assert.equal(f.rendered,1);assert.deepEqual(f.reads,['md_prototype_v16_content']);
  assert.equal(f.adapter.saveDraft({home:{heroLine1:'Changed'},jobs:[],posts:[],partners:[]}),true);assert.equal(f.values.size,1);
  const fail=fixture({quota:true});assert.equal(fail.adapter.saveDraft({home:{}}),false);assert.equal(fail.values.size,0);assert.match(fail.notices.at(-1),/Chưa lưu/);
});
test('form completion never serializes contacts, reads CVs or sends a request; repeat is guarded',async()=>{
  const f=fixture();let replacements=0,result;const button={};
  const form={id:'applyForm',dataset:{},querySelector:()=>button,replaceWith:node=>{replacements++;result=node;},get elements(){throw Error('Contact/CV fields must remain unread');}};
  const event={target:form,preventDefault(){},stopImmediatePropagation(){}};
  const first=f.listeners.submit(event),second=f.listeners.submit(event);await second;
  assert.equal(button.disabled,true);assert.equal(f.timers.length,1);f.timers.shift()();await first;
  assert.equal(replacements,1);assert.equal(f.requests,0);assert.equal(f.values.size,0);assert.match(result.innerHTML,/không được gửi hoặc lưu/);assert.equal(result.focused,true);
});
