import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
function scope(){const window={},context=vm.createContext({window,document:{documentElement:{lang:'vi'}},URL});for(const file of ['contact-media.js','company-profile.js'])vm.runInContext(fs.readFileSync('public/'+file,'utf8'),context);return window;}
test('Facebook-only widget uses the supplied page and does not report all channels missing',()=>{
 const window=scope();for(const lang of ['vi','en','zh','ko']){const html=window.MDExperience.socialHtml({social:{enabled:true,hotline:'',zalo:'',messenger:''},company:{facebook:'https://www.facebook.com/md668.com.vn'}},lang);assert.match(html,/href="https:\/\/www.facebook.com\/md668.com.vn"/);assert.doesNotMatch(html,/md-social-note/);assert.doesNotMatch(html,/href="https:\/\/m\.me/);}
});
test('configured Messenger stays separate and unsafe Facebook destinations are never actions',()=>{
 const window=scope();let html=window.MDExperience.socialHtml({social:{enabled:true,messenger:'https://m.me/custom-company'},company:{facebook:'https://www.facebook.com/md668.com.vn'}},'vi');assert.match(html,/href="https:\/\/m.me\/custom-company"/);assert.doesNotMatch(html,/href="https:\/\/www.facebook.com/);
 html=window.MDExperience.socialHtml({social:{enabled:true},company:{facebook:'https://www.facebook.com.evil.test/md'}},'vi');assert.doesNotMatch(html,/href="https:\/\/www.facebook.com.evil/);assert.match(html,/md-social-note/);
});
