import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.env.MD_STATIC_OUTPUT_DIR || 'public');
const origin=(process.env.MD_PUBLIC_SITE_URL || 'https://minh-duc-prototype.kenbinhoainam.chatgpt.site').replace(/\/+$/, '');
const internalJobsHref='viec-lam.html?tab=internal';
const pages={ 'index.html':'home','viec-lam.html':'jobs','chi-tiet-viec-lam.html':'detail','ve-minh-duc.html':'about','dich-vu.html':'services','tin-tuc.html':'news','bai-viet.html':'article','lien-he.html':'contact','quan-tri.html':'admin'};
const app=fs.readFileSync(path.join(root,'app.js'),'utf8').replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();',`globalThis.staticSeed=()=>db;globalThis.staticRender=()=>({html:page==='admin'?adminShell():header()+'<main id="main">'+(page==='home'?home():page==='jobs'?listing():page==='detail'?details():page==='news'?news():page==='article'?article():page==='about'?about():page==='services'?services():contact())+'</main>'+footer()+window.MDExperience.socialHtml(db,currentLang)+mobileActionDock()});`);
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

const legacyJobsRedirect=`<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Tuyển dụng nội bộ | Minh Đức</title>
<link rel="canonical" href="${origin}/${internalJobsHref}">
<script>
  (() => {
    const destination = new URL('${internalJobsHref}', location.href);
    for (const [key, value] of new URLSearchParams(location.search)) {
      if (key !== 'tab') destination.searchParams.append(key, value);
    }
    destination.hash = location.hash;
    location.replace(destination.href);
  })();
</script></head>
<body><main><h1>Tuyển dụng nội bộ</h1><p>Danh sách tuyển dụng nội bộ đã chuyển sang trang Việc làm.</p>
<p><a href="${internalJobsHref}">Xem danh sách tuyển dụng nội bộ</a></p></main></body></html>`;

for(const [file,page] of Object.entries(pages)){
 const context=vm.createContext({window:{},document:{body:{dataset:{page}}},sessionStorage:{getItem:()=>null},localStorage:{getItem:()=>null},structuredClone,Intl,Date,URL,URLSearchParams,location:{search:'',hash:''},console});
 for(const f of ['brand-rights.js','demo-translations.js','v13-copy.js','v14-copy.js','locale-routing.js','contact-media.js','company-profile.js','company-locations.js','flagship-content.js','flagship-editorial.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context);
 vm.runInContext(app,context);if(page==='home'&&!process.env.MD_STATIC_OUTPUT_DIR)fs.writeFileSync('lib/content-seed.json',JSON.stringify(context.staticSeed(),null,2)+'\n');let html=context.staticRender().html;
 if(['detail','article'].includes(page)){const start=html.indexOf('<main id="main">'),end=html.indexOf('</main>',start);if(start>=0&&end>=0)html=html.slice(0,start)+'<main id="main"><section class="container md-loading-content" aria-busy="true"><p role="status">Đang mở nội dung…</p><div aria-hidden="true"></div><noscript>Vui lòng bật JavaScript để xem nội dung của bản prototype.</noscript></section></main>'+html.slice(end+7);}

 const heading=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'Quản trị nội dung').replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();const title=(page==='detail'?'Chi tiết việc làm':page==='article'?'Bài viết':heading)+' | Minh Đức';
 const desc=page==='home'?'Giải pháp nhân lực cho doanh nghiệp và cơ hội việc làm phù hợp cho người lao động. Bản trải nghiệm V27 với dữ liệu minh họa.':'Khám phá '+title.replace(' | Minh Đức','')+'. Bản trải nghiệm Minh Đức V27 với dữ liệu minh họa.';
 const url=origin+'/'+file;
 let head=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#1248a0"><title>${escape(title)}</title><meta name="description" content="${escape(desc)}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/hero-photo.webp"><meta property="og:locale" content="vi_VN"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/logo-icon.png">`;
 for(const lang of ['vi','en','zh','ko'])head+=`<link rel="alternate" hreflang="${lang==='zh'?'zh-CN':lang}" href="${url}?lang=${lang}">`;
 head+=`<link rel="alternate" hreflang="x-default" href="${url}"><link rel="preload" href="assets/fonts/noto-sans-400.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="assets/fonts/noto-sans-700.woff" as="font" type="font/woff" crossorigin>`;
 if(page==='home')head+='<link rel="preload" as="image" href="assets/hero-photo.webp" fetchpriority="high">';
 if(page==='jobs'){
  // The runtime replaces this prerendered main after reading the actual route.
  head+=`<style>[data-prerender-internal],html[data-initial-job-tab="internal"] [data-prerender-internal] ~ *{display:none}html[data-initial-job-tab="internal"] [data-prerender-internal]{display:block}</style>
<script>(()=>{
 const params=new URLSearchParams(location.search);if(params.get('tab')!=='internal')return;
 document.documentElement.dataset.initialJobTab='internal';
 const lang=['vi','en','zh','ko'].includes(params.get('lang'))?params.get('lang'):'vi';
 const text={vi:['Tuyển dụng nội bộ','Đang mở danh sách tuyển dụng nội bộ…','Chưa tải được danh sách việc làm. Vui lòng thử lại.','Thử tải lại','Liên hệ Minh Đức'],en:['Jobs at Minh Đức','Opening jobs at Minh Đức…','The job list could not load. Please try again.','Try again','Contact Minh Đức'],zh:['明德招聘','正在加载明德招聘信息…','暂时无法加载职位，请重试。','重新加载','联系明德'],ko:['민득 채용','민득 채용 정보를 여는 중…','채용 목록을 불러오지 못했습니다. 다시 시도해 주세요.','다시 시도','민득에 문의']}[lang];
 let failed=false;
 const update=()=>{const guard=document.querySelector('[data-prerender-internal]');if(!guard)return;guard.lang=lang;guard.querySelector('h1').textContent=text[0];guard.querySelector('[role=status]').textContent=text[failed?2:1];const retry=guard.querySelector('[data-jobs-retry]');retry.textContent=text[3];retry.hidden=!failed;retry.onclick=()=>location.reload();const contact=guard.querySelector('a');contact.textContent=text[4];contact.href='lien-he.html?lang='+lang;};
 const fail=()=>{failed=true;update();};
 window.addEventListener('error',event=>{if(event.target?.src?.includes('site-runtime.js'))fail();},true);
 document.addEventListener('DOMContentLoaded',()=>{update();setTimeout(fail,10000);},{once:true});
})();</script>`;
  html=html.replace('<main id="main">','<main id="main"><section class="container md-loading-content" data-prerender-internal><h1>Tuyển dụng nội bộ</h1><p role="status">Đang mở danh sách tuyển dụng nội bộ…</p><button type="button" class="btn blue" data-jobs-retry hidden>Thử tải lại</button><p><a href="lien-he.html">Liên hệ Minh Đức</a></p></section>');
 }
 head+='<style>html,body{margin:0;min-height:100%}img{max-width:100%}[hidden]{display:none!important}</style><link rel="stylesheet" href="'+(page==='admin'?'cms.css':'site.css')+'?v=35"></head>';
 const originalTail='<script src="brand-rights.js?v=35" defer></script><script src="demo-translations.js" defer></script><script src="v13-copy.js?v=35" defer></script><script src="v14-copy.js?v=35" defer></script><script src="prototype-v17.js?v=35" defer></script><script src="locale-routing.js?v=35" defer></script><script src="flagship-editorial.js?v=35" defer></script><script src="flagship-content.js?v=35" defer></script><script src="contact-media.js?v=35" defer></script><script src="company-profile.js?v=35" defer></script><script src="company-locations.js?v=35" defer></script><script src="app.js?v=35" defer></script><script src="seo-preview.js?v=35" defer></script>';
 const featureAssets=page==='admin'?['operations-demo']:[
  ...(['jobs','detail'].includes(page)?['career-tools']:[]),
  ...(page==='jobs'?['natural-job-search']:[]),
  'ai-assistant','comparison-shifts',
  ...(page==='detail'?['worker-journey']:[]),
  ...(['home','services','contact'].includes(page)?['workforce-brief','ai-business-brief']:[]),
  ...(page==='jobs'?['candidate-portal-demo','feature-navigation']:[]),
  ...(page==='services'?['business-portal-demo','feature-navigation']:[]),
 ];
 const stylesFor=names=>names.map(name=>`<link rel="stylesheet" href="${name}.css?v=35">`).join('');
 const scriptsFor=names=>names.map(name=>`<script src="${name}.js?v=35" defer></script>`).join('');
 head=head.replace('</head>',stylesFor(featureAssets)+'</head>');
 const tail=(page==='admin'?originalTail:'<script src="site-runtime.js?v=35" defer></script>')+scriptsFor(featureAssets);
 const render=(markup,documentHead=head,documentTail=tail)=>documentHead+`<body data-page="${page}"${page==='admin'?' class="admin-body"':''}><div id="app">${markup}</div>${documentTail}</body></html>`;
 if(page==='admin'){
  const demoAssistants=['ai-seo-drafts','ai-translation-drafts','ai-job-drafts'];
  context.location.pathname='/cms-demo.html';
  const demoHtml=context.staticRender().html;
  const demoHead=head.replaceAll(origin+'/quan-tri.html',origin+'/cms-demo.html');
  fs.writeFileSync(path.join(root,'cms-demo.html'),render(demoHtml,demoHead.replace('</head>',stylesFor([...demoAssistants,'feature-navigation'])+'</head>'),tail+scriptsFor(demoAssistants)));
 }
 if(page!=='admin'||!process.env.MD_STATIC_OUTPUT_DIR)fs.writeFileSync(page==='admin'?path.resolve('private-pages/quan-tri.html'):path.join(root,file),render(html));
}
fs.writeFileSync(path.join(root,'tuyen-dung-noi-bo.html'),legacyJobsRedirect);
const publicAdmin=path.join(root,'quan-tri.html');if(fs.existsSync(publicAdmin))fs.unlinkSync(publicAdmin);
console.log(process.env.MD_STATIC_OUTPUT_DIR?'Prerendered public pages for static export; protected CMS and server seed excluded.':'Prerendered 9 public pages and one protected CMS template; wrote server seed.');
