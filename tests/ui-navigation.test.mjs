import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function scope(lang) {
  const location = new URL('https://minh-duc.example/dich-vu.html?service=recruitment&lang='+lang);
  const context=vm.createContext({window:{},document:{body:{dataset:{page:'services'}},querySelector:()=>null,querySelectorAll:()=>[]},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null},location,URL,URLSearchParams,structuredClone,Intl,Date,console});
  for(const file of ['demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync('public/'+file,'utf8'),context);
  const source=fs.readFileSync('public/app.js','utf8').replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();','window.uiTest={dock:mobileActionDock,choose:id=>{activeService=id},locale:value=>{currentLang=value}};');
  vm.runInContext(source,context);
  context.window.uiTest.locale(lang);
  return context.window.uiTest;
}

for(const lang of ['vi','en','zh','ko'])test(lang+': service dock follows current selection and keeps planner within page',()=>{
  const ui=scope(lang);
  for(const service of ['recruitment','factory','consulting','supply']){
    ui.choose(service);
    const hrefs=[...ui.dock().matchAll(/href="([^"]+)"/g)].map(match=>match[1].replaceAll('&amp;','&'));
    assert.equal(hrefs[0],'#workforce');
    const contact=new URL(hrefs[1],'https://minh-duc.example/');
    assert.equal(contact.pathname,'/lien-he.html');
    assert.equal(contact.searchParams.get('service'),service);
    assert.equal(contact.searchParams.get('lang'),lang);
  }
  ui.choose('unrecognized');
  assert.match(ui.dock(),/service=supply/);
});
