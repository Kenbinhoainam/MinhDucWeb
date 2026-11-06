import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const scope=vm.createContext({window:{},URL,Date,Object});
vm.runInContext(readFileSync(new URL('../public/brand-rights.js',import.meta.url),'utf8'),scope);
const policy=scope.window.MDBrandRights;
const partner={id:'test',visible:true,approved:true,logo:'https://example.invalid/logo.svg'};
const origin='https://minh-duc-prototype.kenbinhoainam.chatgpt.site';
const grant={partnerId:'test',logo:partner.logo,origin,permissionDocument:'private-permission-001',partnershipDocument:'private-relationship-001',issuer:'Sample rights owner',reviewer:'Sample reviewer',reviewedAt:'2026-11-01',validFrom:'2026-01-01',validUntil:'2027-01-01'};
const now=Date.parse('2026-11-01');
test('CMS approval flags and imported permission references cannot publish logos',()=>{assert.equal(policy.reviewedCount,0);assert.equal(policy.canDisplay(partner),false);assert.equal(Object.isFrozen(policy),true);});
test('reviewed grants must bind the exact logo, domain, dates and both evidence documents',()=>{assert.equal(policy.matches(partner,grant,origin,now),true);for(const delta of [{logo:'https://example.invalid/other.svg'},{origin:'https://other.invalid'},{permissionDocument:''},{partnershipDocument:''},{reviewer:''},{validUntil:'2026-01-01'},{validFrom:'invalid'}])assert.equal(policy.matches(partner,{...grant,...delta},origin,now),false);assert.equal(policy.matches({...partner,visible:false},grant,origin,now),false);});
test('demo logo visibility is separate from legal permission and respects editor controls',()=>{
 const demo={...partner,approved:false,demoLogoVisible:true,logo:'assets/partners/samsung.svg'};
 assert.equal(policy.canDisplayDemo(demo),true);assert.equal(policy.canDisplay(demo),false);
 for(const delta of [{visible:false},{demoLogoVisible:false},{demoLogoVisible:undefined},{logo:''}])assert.equal(policy.canDisplayDemo({...demo,...delta}),false);
});
test('one-time rollback restores known sample logos while preserving other content and future edits',()=>{
 const data={home:{heroLine1:'Customer edit'},jobs:[{id:'custom-job'}],posts:[],partners:[{id:'sample-samsung',name:'Edited name',logo:'',visible:false,approved:false},{id:'custom',logo:'',visible:false}]};
 const seed={partners:[{id:'sample-samsung',sample:true,logo:'assets/partners/samsung.svg',featured:true}]};
 assert.equal(policy.restoreDemoProfiles(data,seed),true);
 assert.equal(data.home.heroLine1,'Customer edit');assert.equal(data.jobs[0].id,'custom-job');
 assert.equal(data.partners[0].name,'Edited name');assert.equal(data.partners[0].logo,seed.partners[0].logo);
 assert.equal(policy.canDisplayDemo(data.partners[0]),true);assert.equal(data.partners[0].approved,false);
 assert.equal(data.partners[1].visible,false);assert.equal(data.partners[1].demoLogoVisible,undefined);
 data.partners[0].visible=false;assert.equal(policy.restoreDemoProfiles(data,seed),false);assert.equal(data.partners[0].visible,false);
});
