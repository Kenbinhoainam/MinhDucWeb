import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validCompanyContent} from '../lib/company-profile-validation.ts';
import {validateContent} from '../lib/site-validation.ts';
import seed from '../lib/content-seed.json' with {type:'json'};
const company={legalName:'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA',description:'Cung ứng nguồn nhân lực',facebook:'https://www.facebook.com/md668.com.vn'};
const branch={id:'voi',name:'Chi nhánh Vôi',address:'',mapsUrl:'https://maps.app.goo.gl/2hj5gqjuaLS4t6hk8',embedUrl:'https://www.google.com/maps/embed?pb=!1m14!1sverified-place',visible:true};
test('legacy, empty and full company content round-trip without injecting branches',()=>{
 for(const value of [{},{company,branches:[]},{company,branches:[branch]}]){const data={...structuredClone(seed),...structuredClone(value)};if(!Object.hasOwn(value,'company')){delete data.company;delete data.branches;}const before=JSON.stringify(data);assert.equal(validCompanyContent(data),true);assert.equal(JSON.stringify(validateContent(data)),before);}
});
test('server rejects duplicate IDs, invalid shapes, limits, and unsafe map/facebook URLs',()=>{
 const cases=[{branches:[branch,branch]},{company:{...company,legalName:''}},{company:{...company,description:'x'.repeat(701)}},{branches:[{...branch,name:'x'.repeat(101)}]},{branches:[{...branch,visible:'true'}]},{branches:[{...branch,id:'../bad'}]},{branches:Array.from({length:21},(_,i)=>({...branch,id:'b-'+i}))}];
 for(const url of ['javascript:alert(1)','http://maps.app.goo.gl/abc','https://maps.app.goo.gl.evil.test/abc','https://user@maps.app.goo.gl/abc','https://www.google.com:444/maps/place/a','https://www.google.com/notmaps/a','<iframe src="https://www.google.com/maps/embed?pb=a">'])cases.push({branches:[{...branch,mapsUrl:url}]});
 for(const url of ['https://maps.app.goo.gl/abc','https://www.google.com/maps/place/a','https://www.google.com/maps/embed?pb=','https://www.google.com/maps/embed?pb=a&evil=b','https://www.google.com/maps/embed?pb=a#x','https://www.google.com/maps/embed?pb='+'x'.repeat(2500)])cases.push({branches:[{...branch,embedUrl:url}]});
 for(const url of ['https://www.facebook.com.evil.test/md','https://user@facebook.com/md','https://facebook.com/'])cases.push({company:{...company,facebook:url}});
 for(const value of cases){const data={...structuredClone(seed),company,branches:[branch],...value};assert.equal(validCompanyContent(data),false,JSON.stringify(value));assert.throws(()=>validateContent(data),e=>e.code==='invalid_company');}
});
test('browser import and server company schema agree on URL parsing attacks and explicit empty data',()=>{
 const window={};vm.runInNewContext(fs.readFileSync('public/company-profile.js','utf8'),{window,URL});const api=window.MDCompanyProfile;
 const values=[{},api.seed(),{company,branches:[]},{branches:[branch]},{company:{...company,extra:true}},{branches:[{...branch,extra:true}]},{companyProfileRevision:26}];
 const urls=['https://www.google.com/maps/embed?pb=a','https://www.google.com/maps/embed?pb=a&pb=b','https://www.google.com/maps/embed?pb=%20','https://www.google.com/maps/embed?pb=%0a','https://www.google.com/maps/../maps/embed?pb=a','https://www.google.com/maps/%2e%2e/a','https://www.google.com:443/maps/embed?pb=a','https://www.google.com/maps/embed?pb=a#bad','https://maps.app.goo.gl/abc','https://www.google.com\\@evil.test/maps/embed?pb=a'];
 for(const url of urls){values.push({branches:[{...branch,mapsUrl:url}]},{branches:[{...branch,embedUrl:url}]},{company:{...company,facebook:url}});}
 for(const data of values)assert.equal(validCompanyContent(data),api.valid(data),JSON.stringify(data));
});
