import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(){
 const window={},ctx=vm.createContext({window,document:{body:{dataset:{page:'admin'}}},URL,URLSearchParams,location:{href:'https://example.test/cms-demo.html',search:'',hash:''},structuredClone,Intl,Date,localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}});
 for(const f of ['demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','contact-media.js','company-profile.js','company-locations.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync('public/'+f,'utf8'),ctx);
 const source=fs.readFileSync('public/app.js','utf8');const start='wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();';assert.ok(source.includes(start));
 vm.runInContext(source.replace(start,'window.integrated={defaults,migrateEditorialData,restoreImportedData,validImport,isSourcePartner,legacy:defaultPartners,data:()=>db};'),ctx);return window.integrated;
}
const plain=v=>JSON.parse(JSON.stringify(v));
test('fresh integrated prototype has five sourced text profiles and no inferred address',()=>{
 const api=harness(),data=plain(api.data());assert.equal(data.company.legalName,'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA');assert.equal(data.branches.length,3);assert.equal(data.partners.length,5);assert.ok(data.partners.every(p=>p.sourceListed&&!p.logo));assert.ok(data.branches.every(b=>b.address===''));assert.equal(data.social.hotline,'0364562868');
});
test('actual import migration recognizes old seed while preserving edits, empty collections and deletions',()=>{
 const api=harness(),old=plain(api.defaults());delete old.company;delete old.branches;delete old.companyProfileRevision;old.partners=plain(api.legacy);old.social={enabled:true,hotline:'',zalo:'',messenger:''};
 old.partners[0].name='Custom Samsung record';old.partners[1].visible=false;old.partners.splice(2,1);
 assert.equal(api.validImport(old),true);const restored=plain(api.restoreImportedData(old));assert.equal(restored.branches.length,3);assert.equal(restored.social.hotline,'0364562868');assert.equal(restored.partners.filter(p=>p.sourceListed).length,5);assert.ok(restored.partners.some(p=>p.name==='Custom Samsung record'&&!p.sourceListed));assert.equal(restored.partners.find(p=>p.id==='sample-lg-electronics').visible,false);assert.ok(!restored.partners.some(p=>p.id==='sample-canon-viet-nam'));
 restored.branches=[];restored.partners=[];const again=plain(api.restoreImportedData(restored));assert.deepEqual(again.branches,[]);assert.deepEqual(again.partners,[]);
 assert.deepEqual(plain(api.restoreImportedData(again)),again);
 const deliberatelyEmpty={...old,branches:[],partners:[]};assert.deepEqual(plain(api.restoreImportedData(deliberatelyEmpty)).branches,[]);assert.deepEqual(plain(api.restoreImportedData(deliberatelyEmpty)).partners,[]);
});
test('server snapshot path does not inject company or branches into old rollback payloads',()=>{
 const api=harness(),old=plain(api.defaults());delete old.company;delete old.branches;delete old.companyProfileRevision;old.partners=plain(api.legacy);const partners=structuredClone(old.partners);api.migrateEditorialData(old,{seedMissing:false});assert.equal(Object.hasOwn(old,'company'),false);assert.equal(Object.hasOwn(old,'branches'),false);assert.deepEqual(old.partners,partners);
});
test('incomplete V27 partner collections cannot replace live data or crash fallback restoration',()=>{
 const api=harness(),broken=plain(api.defaults());delete broken.partners;assert.equal(api.validImport(broken),false);assert.deepEqual(plain(api.restoreImportedData(broken)).partners,[]);
});
test('renamed or changed records do not retain the Sheet source label even with a forged flag',()=>{
 const api=harness(),p=plain(api.defaults()).partners[0];assert.equal(api.isSourcePartner(p),true);
 for(const key of ['name','sector','country','website','note','logo'])assert.equal(api.isSourcePartner({...p,[key]:'Changed by editor'}),false,key);
 assert.equal(api.isSourcePartner({...p,id:'custom-profile'}),false);assert.equal(api.isSourcePartner({...p,sourceListed:false}),false);
});
