import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function view(lang){
 const scope=vm.createContext({window:{},document:{body:{dataset:{page:'admin'}},querySelector:()=>null,querySelectorAll:()=>[]},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null},location:{search:'',hash:''},URL,URLSearchParams,structuredClone,Intl,Date,console});
 for(const file of ['demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync('public/'+file,'utf8'),scope);
 vm.runInContext(fs.readFileSync('public/app.js','utf8').replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();','window.homeTest={db,home,setLang:l=>{currentLang=l}};'),scope);
 const api=scope.window.homeTest;api.setLang(lang);return api;
}
for(const lang of ['vi','en','zh','ko'])test(`${lang}: worker-first structure retains employer CMS content and both entry points`,()=>{
 const api=view(lang);api.db.home.heroLine1='CUSTOM EMPLOYER TITLE';api.db.home.heroLine2='CUSTOM EMPLOYER NEXT';api.db.home.heroIntro='CUSTOM EMPLOYER INTRO';
 if(api.db.i18n?.['home:main'])delete api.db.i18n['home:main'][lang];
 const html=api.home();assert.match(html,/id="persona-candidate" aria-selected="true"/);assert.match(html,/id="panel-candidate" aria-labelledby="persona-candidate"><h1>/);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(html.includes('CUSTOM EMPLOYER TITLE'));assert.ok(html.includes('CUSTOM EMPLOYER INTRO'));
 assert.ok(html.indexOf('id="find-work"')<html.indexOf('opportunities-section'));assert.ok(html.indexOf('opportunities-section')<html.indexOf('id="solutions"'));
 assert.match(html,/href="#workforce"/);assert.match(html,/href="#worker-guide"/);
 api.db.home.sections.jobs=false;const noJobs=api.home();assert.ok(!noJobs.includes('opportunities-section'));assert.ok(noJobs.includes('id="find-work"'));
});
