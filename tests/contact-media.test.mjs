import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const scope=vm.createContext({window:{},URL,document:{documentElement:{lang:'vi'}}});
vm.runInContext(fs.readFileSync(new URL('../public/contact-media.js',import.meta.url),'utf8'),scope);
const api=scope.window.MDExperience;
test('contact configuration accepts official destinations and normalizes valid hotlines',()=>{
  for(const [kind,value,expected] of [['hotline','090 123 4567','tel:0901234567'],['hotline','+84 901 234 567','tel:+84901234567'],['hotline','1900 1234','tel:19001234'],['zalo','https://zalo.me/company','https://zalo.me/company'],['messenger','https://m.me/company','https://m.me/company'],['messenger','https://www.messenger.com/t/company','https://www.messenger.com/t/company']])assert.equal(api.channelUrl(kind,value),expected);
});
test('unsafe or unrelated contact destinations cannot become public links',()=>{
  for(const [kind,value] of [['hotline','0901234567?body=test'],['hotline','abc0901234567'],['hotline','123'],['zalo','https://zalo.me.evil.example/123'],['zalo','https://user:pass@zalo.me/123'],['zalo','javascript:alert(1)'],['zalo','http://zalo.me/123'],['messenger','https://facebook.com/login'],['messenger','https://m.me/'],['messenger','https://messenger.com/settings'],['messenger','https://m.me:444/123']])assert.equal(api.channelUrl(kind,value),'',value);
});
test('unconfigured widgets never contain fabricated phone or social destinations',()=>{
  const html=api.socialHtml({},'vi');assert.match(html,/Nhắn qua Zalo/);assert.match(html,/Nhắn Messenger/);assert.match(html,/Gọi hotline/);assert.match(html,/Chưa cấu hình/);assert.doesNotMatch(html,/href="(?:tel:|https:)/);assert.match(html,/aria-expanded="false"/);assert.equal(api.socialHtml({social:{enabled:false}},'vi'),'');
});
test('configured widgets escape values and maintain translated accessible labels',()=>{
  for(const lang of ['vi','en','zh','ko']){const html=api.socialHtml({social:{hotline:'090 123 4567',zalo:'https://zalo.me/company'}},lang);assert.match(html,/href="tel:0901234567"/);assert.match(html,/rel="noopener noreferrer"/);assert.ok(html.includes('lang='+lang));assert.match(html,/aria-controls="md-social-panel"/);}
});
test('video sources recognize exact YouTube hosts, signed HTTPS files and origin-local references',()=>{
  for(const [input,kind] of [['','empty'],['md-video:abc-123','local'],['https://youtu.be/dQw4w9WgXcQ','youtube'],['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5','youtube'],['https://www.youtube.com/shorts/dQw4w9WgXcQ','youtube'],['https://cdn.example/video.mp4?token=example','file'],['https://cdn.example/video.webm','file']])assert.equal(api.videoSource(input).kind,kind,input);
  for(const input of ['javascript:alert(1)','blob:https://example/123','data:video/mp4;base64,test','https://evil.example/youtube.com/watch?v=dQw4w9WgXcQ','https://user:pass@example/video.mp4','https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ','http://cdn.example/video.mp4','md-video:<script>','https://youtu.be/notvideo'])assert.equal(api.videoSource(input).kind,'invalid',input);
});
test('upload validation rejects empty, oversized, wrong extension and mismatched MIME files',()=>{
  assert.equal(api.validateFile({name:'movie.mp4',type:'video/mp4',size:100*1024*1024}),true);
  assert.equal(api.validateFile({name:'movie.WEBM',type:'',size:20}),true);
  for(const file of [{name:'movie.mp4',type:'video/mp4',size:0},{name:'movie.mp4',type:'video/mp4',size:100*1024*1024+1},{name:'movie.html',type:'video/mp4',size:20},{name:'movie.mp4',type:'text/html',size:20},{name:'movie.mp4.exe',type:'video/mp4',size:20}])assert.throws(()=>api.validateFile(file));
});

function playbackHarness({rejectPlay=false}={}){
  const nodes=[],calls=[];
  const document={documentElement:{lang:'vi'},body:{},createElement(tag){const node={tagName:tag.toUpperCase(),setAttribute(){},addEventListener(){},play(){calls.push({muted:this.muted,volume:this.volume,connected:nodes.includes(this)});return rejectPlay?Promise.reject(new Error('Playback declined')):Promise.resolve();}};return node;}};
  const ctx=vm.createContext({window:{},document,URL,MutationObserver:class{observe(){} disconnect(){}}});
  vm.runInContext(fs.readFileSync(new URL('../public/contact-media.js',import.meta.url),'utf8'),ctx);
  const container={isConnected:true,textContent:'',classList:{add(){}},replaceChildren(node){nodes.splice(0,nodes.length,node);}};
  return {api:ctx.window.MDExperience,container,nodes,calls};
}

test('opening a film starts connected playback immediately with sound and controls',async()=>{
  const {api,container,nodes,calls}=playbackHarness();
  const pending=api.player(container,'https://example.test/introduction.mp4',{autoplay:true});
  assert.deepEqual(calls,[{muted:false,volume:1,connected:true}]);
  await pending;
  assert.equal(nodes[0].controls,true);assert.equal(nodes[0].playsInline,true);assert.equal(nodes[0].autoplay,true);
});

test('a declined play request keeps the native player available for manual playback',async()=>{
  const {api,container,nodes,calls}=playbackHarness({rejectPlay:true});
  await api.player(container,'https://example.test/introduction.mp4',{autoplay:true});
  assert.equal(calls.length,1);assert.equal(nodes[0].controls,true);assert.equal(nodes[0].muted,false);
});

test('players stay idle without an opening action and YouTube opens with sound when requested',async()=>{
  const {api,container,nodes,calls}=playbackHarness();
  await api.player(container,'https://example.test/introduction.mp4');
  assert.equal(calls.length,0);assert.equal(nodes[0].autoplay,false);
  await api.player(container,'https://youtu.be/dQw4w9WgXcQ',{autoplay:true});
  const url=new URL(nodes[0].src);assert.equal(url.searchParams.get('autoplay'),'1');assert.equal(url.searchParams.get('mute'),'0');assert.match(nodes[0].allow,/autoplay/);
});
