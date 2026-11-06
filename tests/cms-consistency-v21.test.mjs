import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function harness() {
  const saved=new Map(); const images=[];
  const context=vm.createContext({window:{},document:{body:{dataset:{page:'admin'}},documentElement:{style:{setProperty(){}}},querySelector:()=>null,querySelectorAll:selector=>selector==='img[data-media-key]'?images:[]},localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)},sessionStorage:{getItem:()=>null},structuredClone,Intl,Date,URL,URLSearchParams,location:{href:'https://example.test/cms-demo?lang=vi',search:'',hash:''},console});
  for(const file of ['demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),context);
  let source=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  source=source.replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();',`notify=()=>{};window.testCms={data:()=>db,setData:value=>{db=migrateEditorialData(value)},defaults,migrateEditorialData,legacyEditorialPosts,autoTranslate,localize,langStatuses,inlineTranslationFields,applyImageTransforms,cardJob,listingCard,cardPost,editorialMeta,setLang:lang=>{currentLang=lang}};`);
  vm.runInContext(source,context);
  return {api:context.window.testCms,editorial:context.window.MDEditorial,saved,images};
}

test('source edits retain human translations in all locales and mark only changed fields',async()=>{
  const {api}=harness();
  for(const [kind,id,field] of [['home','main','heroLine1'],['job','cn-dien-tu','title'],['post','xu-huong-kcn','title']]){
    const key=kind+':'+id;
    api.data().i18n[key]=Object.fromEntries(['en','zh','ko'].map(lang=>[lang,{[field]:lang+' human edit',status:'translated'}]));
    await api.autoTranslate(kind,id,{[field]:'Updated VI',body:'same'},{[field]:'Before',body:'same'});
    for(const lang of ['en','zh','ko']){
      const result=api.data().i18n[key][lang];
      assert.equal(result[field],lang+' human edit'); assert.equal(result.status,'needs-review');
      assert.deepEqual(Array.from(result.reviewFields),[field]);
    }
    assert.match(api.langStatuses(kind,id),/Cần rà lại/);
  }
});

test('JSON round-trip preserves translations, review state and crop values',async()=>{
  const {api}=harness();api.data().i18n['job:cn-dien-tu']={en:{title:'Editor EN',status:'translated'}};
  await api.autoTranslate('job','cn-dien-tu',{title:'VI changed'},{title:'VI before'});
  api.data().mediaTransforms['job:cn-dien-tu']={x:0,y:50,zoom:170,brightness:90,contrast:110};
  const snapshot=JSON.parse(JSON.stringify(api.data()));api.setData(snapshot);
  assert.equal(api.data().i18n['job:cn-dien-tu'].en.title,'Editor EN');
  assert.equal(api.data().i18n['job:cn-dien-tu'].en.status,'needs-review');
  assert.equal(api.data().mediaTransforms['job:cn-dien-tu'].x,0);
});

test('CMS fields and article view use the same canonical editorial content in four locales',()=>{
  const {api,editorial}=harness();
  for(const post of api.data().posts.filter(post=>post.type==='article')){
    const vi=editorial.articleRecord(post.id,'vi');assert.equal(post.title,vi.title);assert.equal(post.body,vi.body);assert.ok(post.body.length>1000);
    for(const lang of ['vi','en','zh','ko']){
      api.setLang(lang);const canonical=editorial.articleRecord(post.id,lang);
      for(const field of ['title','excerpt','body'])assert.equal(api.localize('post',post.id,field,post[field]),canonical[field]);
      assert.ok(api.editorialMeta(post));
    }
  }
});

test('migration upgrades unchanged old fields and preserves custom copy and translations',()=>{
  const {api,editorial}=harness();const data=api.defaults();data.posts=structuredClone(api.legacyEditorialPosts);delete data.editorialRevision;
  data.posts[0].title='Custom headline';data.i18n['post:xu-huong-kcn']={en:{body:'Custom body'}};
  api.setData(data);
  assert.equal(api.data().posts[0].title,'Custom headline');
  assert.equal(api.data().posts[0].body,editorial.articleRecord('xu-huong-kcn','vi').body);
  assert.equal(api.data().i18n['post:xu-huong-kcn'].en.body,'Custom body');
});

test('two jobs sharing an image retain independent crop after list rerender',()=>{
  const {api,images}=harness();const first=api.data().jobs.find(j=>j.id==='cn-dien-tu'),second=api.data().jobs.find(j=>j.id==='qc');second.image=first.image;assert.equal(first.image,second.image);
  api.data().mediaTransforms['job:'+first.id]={x:0,y:30,zoom:170,brightness:90,contrast:110};
  api.data().mediaTransforms['job:'+second.id]={x:100,y:80,zoom:110,brightness:120,contrast:90};
  for(const job of [first,second]){
    assert.match(api.listingCard(job),new RegExp('data-media-key="job:'+job.id+'"'));
    images.push({dataset:{mediaKey:'job:'+job.id},style:{}});
  }
  api.applyImageTransforms();assert.equal(images[0].style.objectPosition,'0% 30%');assert.equal(images[0].style.transform,'scale(1.7)');assert.equal(images[1].style.objectPosition,'100% 80%');
  images.splice(0,2,{dataset:{mediaKey:'job:'+second.id},style:{}});api.applyImageTransforms();assert.equal(images[0].style.transform,'scale(1.1)');
});

test('restoring the previous photo set upgrades stored real-photo defaults without changing the film',()=>{
  const {api}=harness(),data=api.defaults(),originalGallery=structuredClone(data.home.gallery);
  delete data.illustrationRevision;
  data.realMediaRevision=24;
  data.home.heroImg='assets/md-team-v24.webp';
  const retired={0:['md-community-v24.webp','Đội ngũ Minh Đức trong một hoạt động kết nối tại cộng đồng'],2:['md-culture-v24.webp','Khoảnh khắc tập thể của đội ngũ Minh Đức tại văn phòng'],3:['md-consultation-v24.webp','Hoạt động tư vấn tuyển dụng tại cộng đồng'],4:['md-team-v24.webp','Đội ngũ Minh Đức trong một hoạt động tập thể']};
  for(const [index,[src,caption]] of Object.entries(retired))data.home.gallery[index]={src:'assets/'+src,caption};
  const film={url:data.home.videoUrl,poster:data.home.videoPoster,post:structuredClone(data.posts.find(post=>post.id==='video-moi-truong'))};
  api.setData(data);
  assert.equal(api.data().home.heroImg,'hero-photo.webp');
  assert.deepEqual(api.data().home.gallery,originalGallery);
  assert.equal(api.data().home.videoUrl,film.url);assert.equal(api.data().home.videoPoster,film.poster);
  assert.deepEqual(api.data().posts.find(post=>post.id==='video-moi-truong'),film.post);
  assert.equal(api.data().illustrationRevision,26);
});

test('photo restoration preserves custom sources, captions, crops and later intentional choices',()=>{
  const {api}=harness(),data=api.defaults();delete data.illustrationRevision;
  data.home.heroImg='https://example.test/custom-hero.webp';
  data.home.gallery[0]={src:'https://example.test/custom-gallery.webp',caption:'Custom gallery'};
  data.home.gallery[3]={src:'md-consultation-v24.webp',caption:'Custom caption'};
  data.mediaTransforms.gallery3={x:25,y:70,zoom:120,brightness:95,contrast:110};
  const transform=structuredClone(data.mediaTransforms.gallery3);
  api.setData(data);
  assert.equal(api.data().home.heroImg,'https://example.test/custom-hero.webp');
  assert.equal(api.data().home.gallery[0].src,'https://example.test/custom-gallery.webp');
  assert.equal(api.data().home.gallery[3].src,'gallery-operator.webp');
  assert.equal(api.data().home.gallery[3].caption,'Custom caption');
  assert.deepEqual(api.data().mediaTransforms.gallery3,transform);
  api.data().home.heroImg='md-team-v24.webp';
  const once=structuredClone(api.data());api.setData(once);
  assert.equal(api.data().home.heroImg,'md-team-v24.webp');
});

test('pre-rollout data keeps illustrative photos and an unconfigured video',()=>{
  const {api}=harness(),data=api.defaults();delete data.illustrationRevision;delete data.realMediaRevision;
  const gallery=structuredClone(data.home.gallery);delete data.home.heroImg;
  api.setData(data);
  assert.equal(api.data().home.heroImg,'hero-photo.webp');
  assert.deepEqual(api.data().home.gallery,gallery);
  assert.equal(api.data().home.videoUrl,'');
});

test('stored Minh Duc footage and its default poster and copy revert to the previous video state',()=>{
  const {api}=harness(),data=api.defaults();delete data.videoIllustrationRevision;
  const originalHome=structuredClone(data.home),originalPost=structuredClone(data.posts.find(post=>post.id==='video-moi-truong'));
  data.home.videoUrl='assets/md-field-film-v24.mp4';
  data.home.videoPoster='assets/md-film-poster-v24.webp';
  data.home.videoTitle='Góc nhìn từ chuyến thăm nhà máy';
  data.home.videoIntro='Khu vực nhà ăn và không gian bên ngoài, qua những thước phim ghi lại tại hiện trường.';
  const post=data.posts.find(post=>post.id==='video-moi-truong');
  Object.assign(post,{video:data.home.videoUrl,cover:'md-film-poster-v24.webp',title:data.home.videoTitle,excerpt:data.home.videoIntro,body:'Phim ngắn với âm thanh gốc ghi lại khu vực nhà ăn và không gian bên ngoài trong một chuyến thăm nhà máy.',seoTitle:data.home.videoTitle,meta:data.home.videoIntro});
  data.i18n['post:video-moi-truong']={en:{title:'A glimpse from a factory visit',body:'Human-edited body'}};
  data.posts.push({id:'copied-video',video:data.home.videoUrl,cover:post.cover,title:'Human-edited title'});
  api.setData(data);
  for(const key of ['videoUrl','videoPoster','videoTitle','videoIntro'])assert.equal(api.data().home[key],originalHome[key]);
  assert.deepEqual(api.data().posts.find(post=>post.id==='video-moi-truong'),originalPost);
  assert.notEqual(api.data().i18n['post:video-moi-truong'].en.title,'A glimpse from a factory visit');
  assert.equal(api.data().i18n['post:video-moi-truong'].en.body,'Human-edited body');
  const copy=api.data().posts.find(post=>post.id==='copied-video');
  assert.equal(copy.video,'');assert.equal(copy.cover,'video-poster.webp');assert.equal(copy.title,'Human-edited title');
  assert.equal(api.data().videoIllustrationRevision,27);
  const once=JSON.stringify(api.data());api.setData(JSON.parse(once));assert.equal(JSON.stringify(api.data()),once);
});

test('video restoration preserves unrelated custom video sources and content',()=>{
  const {api}=harness(),data=api.defaults();delete data.videoIllustrationRevision;
  data.home.videoUrl='https://example.test/custom.mp4';data.home.videoTitle='Custom video title';
  data.home.videoPoster='https://example.test/custom-poster.webp';
  const post=data.posts.find(post=>post.id==='video-moi-truong');
  Object.assign(post,{video:'md-video:custom-123',title:'Custom post title',cover:'https://example.test/post-poster.webp'});
  const home=structuredClone(data.home),savedPost=structuredClone(post);
  api.setData(data);
  assert.deepEqual(api.data().home,home);assert.deepEqual(api.data().posts.find(post=>post.id==='video-moi-truong'),savedPost);
});

test('old unedited requirement samples migrate without replacing custom translation work',()=>{
  const {api}=harness();const data=api.defaults();
  data.i18n['job:ky-su-co-dien']={en:{requirements:'College/university education in electrical or mechanical engineering.\n1–3 years of relevant experience preferred.\nAbility to read technical drawings.\nResponsible with strong problem-solving skills.'},ko:{requirements:'Custom reviewed Korean text'}};
  api.setData(data);
  assert.match(api.data().i18n['job:ky-su-co-dien'].en.requirements,/experience required/);
  assert.equal(api.data().i18n['job:ky-su-co-dien'].ko.requirements,'Custom reviewed Korean text');
});

test('home canonical copy and manual translations use the same localization path',()=>{
  const {api}=harness();api.setLang('en');
  const home=api.data().home;assert.match(api.localize('home','main','heroIntro',home.heroIntro),/right people/);
  api.data().i18n['home:main']={en:{heroIntro:'A custom edited introduction',galleryTitle:'Custom gallery'}};
  assert.equal(api.localize('home','main','heroIntro',home.heroIntro),'A custom edited introduction');
  assert.equal(api.localize('home','main','galleryTitle',home.galleryTitle),'Custom gallery');
});
