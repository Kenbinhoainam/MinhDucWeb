import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('read-only tool snapshot follows current CMS and locale without mutating source records',()=>{
 const context=vm.createContext({window:{},document:{body:{dataset:{page:'admin'}},querySelector:()=>null,querySelectorAll:()=>[]},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null},location:{search:'',hash:''},URL,URLSearchParams,structuredClone,Intl,Date,console});
 for(const file of ['demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync('public/'+file,'utf8'),context);
 const source=fs.readFileSync('public/app.js','utf8').replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();','window.integrationTest={db,migrateEditorialData,setLang:lang=>{currentLang=lang}};');
 vm.runInContext(source,context);
 const {MDPrototypeBridge:bridge,integrationTest:app}=context.window;
 const first=bridge.snapshot();assert.ok(first.jobs.length>0);
 const id=first.jobs[0].id;first.jobs[0].tags.push('MUTATION');first.jobs[0].title='CHANGED';
 assert.ok(!app.db.jobs[0].tags.includes('MUTATION'));assert.notEqual(app.db.jobs[0].title,'CHANGED');
 app.db.jobs[0].max=99;app.db.jobs[0].open=false;app.setLang('ko');
 const next=bridge.snapshot(),job=next.jobs.find(j=>j.id===id);
 assert.equal(next.lang,'ko');assert.equal(job.max,99);assert.equal(job.open,false);assert.match(job.href,/lang=ko/);
 assert.ok(!('adminToken' in next));assert.ok(!('settings' in next));
 const qc=app.db.jobs.find(j=>j.id==='qc');qc.image='gallery-line.webp';app.db.jobImageryRevision=25;app.migrateEditorialData(app.db);assert.equal(qc.image,'gallery-line.webp','a later explicit CMS image choice must survive repeat migration');
});
