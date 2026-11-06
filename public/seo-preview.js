/* Preview metadata only. Real JobPosting schema remains explicitly gated in app.js. */
(()=>{
 // The prerendered canonical identifies this deployment, including its subpath.
 const siteBase=new URL('./',document.querySelector('link[rel=canonical]')?.href||'https://minh-duc-prototype.kenbinhoainam.chatgpt.site/');
 const origin=siteBase.origin;
 function update(){
  const lang=document.documentElement.lang||'vi';
  const page=document.body?.dataset.page;
  const jobs=page==='jobs'||page==='internal';
  const base=new URL(jobs?'viec-lam.html':location.pathname.split('/').pop()||'index.html',siteBase);
  const params=new URLSearchParams(location.search);
  if(jobs&&window.MDLocale.jobsState(location.href).tab==='internal')base.searchParams.set('tab','internal');
  if(!jobs&&params.has('id'))base.searchParams.set('id',params.get('id'));
  const url=new URL(base);
  url.searchParams.set('lang',lang==='zh-CN'?'zh':lang);
  const title=document.title;
  const summaryNode=document.querySelector('.v14-article-intro p,.v14-page-intro p,.md-hero-panel:not([hidden]) p,.detail-block li,.about-block p');
  const summary=summaryNode?.textContent?.trim().slice(0,165)||document.querySelector('meta[name=description]')?.content||'';
  const cover=document.querySelector('.v14-article-cover img,.video-poster img,.md-hero-img');
  document.querySelector('meta[name=description]')?.setAttribute('content',summary);
  if(cover){const image=new URL(cover.getAttribute('src'),siteBase);if(image.origin===origin)document.querySelector('meta[property="og:image"]')?.setAttribute('content',image.href);}
  document.querySelector('link[rel=canonical]')?.setAttribute('href',url.href);
  for(const [property,content] of [['og:title',title],['og:description',summary],['og:url',url.href],['og:locale',({vi:'vi_VN',en:'en_US','zh-CN':'zh_CN',zh:'zh_CN',ko:'ko_KR'})[lang]||'vi_VN']])document.querySelector('meta[property="'+property+'"]')?.setAttribute('content',content);
  document.querySelectorAll('link[rel=alternate][hreflang]').forEach(link=>{const target=new URL(base);if(link.hreflang!=='x-default')target.searchParams.set('lang',link.hreflang==='zh-CN'?'zh':link.hreflang);link.href=target.href;});
 }
 update();
 window.addEventListener('md:jobs-view-change',update);
 window.addEventListener('popstate',()=>queueMicrotask(update));
 document.addEventListener('change',e=>{if(e.target.id==='languageSelect')queueMicrotask(update);});
})();
