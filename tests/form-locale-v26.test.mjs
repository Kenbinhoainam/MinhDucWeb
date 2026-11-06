import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const scope=vm.createContext({window:{},document:{documentElement:{lang:'vi'}},URL});vm.runInContext(fs.readFileSync('public/contact-media.js','utf8'),scope);const api=scope.window.MDExperience;
const field=(name,type,value,extra={})=>({name,type,value,id:'',checked:false,tagName:'INPUT',...extra});
const root=fields=>{const form={id:'applyForm',querySelectorAll:s=>s.startsWith('input:not')?fields:[],querySelector:()=>null};return{querySelectorAll:()=>[form],querySelector:()=>form}};
test('locale rerender restores by field identity when optional controls are inserted or absent',()=>{
 const old=[field('shift','radio','Ca ngày'),field('shift','radio','Chưa rõ',{checked:true}),field('area','select-one','Bắc Ninh',{tagName:'SELECT',selectedIndex:1}),field('name','text','Demo Name'),field('phone','tel','0900000000'),field('consent','checkbox','on',{checked:false})];
 const saved=api.captureForms(root(old));const next=[field('shift','radio','Ca ngày'),field('area','select-one','',{tagName:'SELECT',options:[{value:''},{value:'Bắc Giang'},{value:'Bắc Ninh'}],selectedIndex:0}),field('name','text',''),field('phone','tel',''),field('consent','checkbox','on'),field('new','text','extra')];api.restoreForms(saved,root(next));
 assert.equal(next[2].value,'Demo Name');assert.equal(next[3].value,'0900000000');assert.equal(next[4].checked,false);assert.equal(next[1].value,'Bắc Ninh');assert.equal(next[0].checked,false);assert.equal(next[5].value,'extra');
});
test('an unknown select option is not silently mapped to a different preference',()=>{
 const old=[field('area','select-one','Chưa rõ',{tagName:'SELECT',selectedIndex:4})];const saved=api.captureForms(root(old));const next=[field('area','select-one','',{tagName:'SELECT',options:[{value:''},{value:'Bắc Ninh'}],selectedIndex:1})];const freshRoot=root(next);api.restoreForms(saved,freshRoot);assert.equal(next[0].selectedIndex,0);assert.equal(freshRoot.querySelector().__mdPendingWorkerPreferences.area,'Chưa rõ');
});
