/* Isolated prototype adapter: browser-only CMS; forms never send contact/CV data. */
window.MD15=(()=>{
  const KEY='md_prototype_v16_content';let context,seed,lastError=false,resetting=false;
  const copy={
    vi:['Gửi thử','Đang kiểm tra…','Đã hoàn tất bản demo','Đây là bước xác nhận mô phỏng. Thông tin và CV không được gửi hoặc lưu.','Thử lại','Form mô phỏng · Không gửi thông tin hoặc CV.','Demo trên trình duyệt','Đặt lại demo'],
    en:['Try submission','Checking…','Demo complete','This is a simulated confirmation. Your details and CV are not sent or stored.','Try again','Simulated form · Details and CVs are not sent.','Browser demo','Reset demo'],
    zh:['模拟提交','正在检查…','演示已完成','此为模拟确认，不会发送或保存您的信息和简历。','再试一次','模拟表单 · 不发送信息或简历。','浏览器演示','重置演示'],
    ko:['제출 체험','확인 중…','데모 완료','모의 확인 화면입니다. 입력 정보와 이력서는 전송되거나 저장되지 않습니다.','다시 체험','모의 양식 · 정보와 이력서를 전송하지 않습니다.','브라우저 데모','데모 초기화']};
  const L=i=>(copy[document.documentElement.lang]||copy.vi)[i];
  function enhancePublic(){
    const lang=document.documentElement.lang;
    let reduced=false;try{reduced=localStorage.getItem('md_motion_preference')==='reduce';}catch{}
    document.documentElement.classList.toggle('md-reduce-motion',reduced);
    const motion=document.querySelector('[data-motion-toggle]');if(motion)motion.setAttribute('aria-pressed',String(reduced));
    const clean=p=>p.replace(/\.html$/,'').replace(/\/$/,'')||'/index';
    const isDetail=context?.page==='detail';
    const ancestorFile=isDetail?'viec-lam':context?.page==='article'?'tin-tuc':null;
    const ancestor=ancestorFile?location.pathname.replace(/[^/]*$/,ancestorFile):null;
    const current=clean(location.pathname);
    document.querySelectorAll('#mainNav a').forEach(a=>{
      const target=clean(new URL(a.href).pathname);
      if(current===target)a.setAttribute('aria-current','page');
      else if(ancestor===target)a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
      if(isDetail)a.classList.toggle('active',ancestor===target);
    });
    document.querySelectorAll('a[href*="chinh-sach-du-lieu"]').forEach(a=>{const url=new URL(a.href);url.searchParams.set('lang',lang);a.href=url.pathname+url.search;});
    // Give every standalone field a stable name, including the legacy internal CV input.
    document.querySelectorAll('form .field').forEach((field,i)=>{const input=field.querySelector('input:not([type=hidden]),select,textarea'),label=field.querySelector('label');if(input&&label&&!label.htmlFor){input.id ||= 'md-field-'+i;label.htmlFor=input.id;}});
    const skip=document.querySelector('.skip-link');if(skip)skip.textContent=({vi:'Bỏ qua điều hướng',en:'Skip to content',zh:'跳至正文',ko:'본문으로 건너뛰기'})[lang]||'Skip to content';
    const menu=document.querySelector('#mobileMenu');if(menu)menu.setAttribute('aria-label',({vi:'Menu điều hướng',en:'Navigation menu',zh:'导航菜单',ko:'탐색 메뉴'})[lang]||'Navigation menu');
    document.querySelectorAll('a.brand').forEach(a=>a.setAttribute('aria-label',({vi:'Về trang chủ Minh Đức',en:'Minh Đức home',zh:'明德首页',ko:'민득 홈'})[lang]||'Minh Đức home'));
    document.querySelectorAll('[data-image]').forEach(a=>a.setAttribute('aria-label',({vi:'Mở ảnh hoạt động',en:'Open gallery image',zh:'打开活动图片',ko:'활동 이미지 열기'})[lang]||'Open gallery image'));
    for(const form of document.querySelectorAll('#applyForm,#contactForm')){
      if(form.dataset.prototypeReady)continue;form.dataset.prototypeReady='1';
      form.querySelectorAll('.form-note,.v14-form-demo,.v15-form-note').forEach(x=>x.remove());
      const note=document.createElement('p');note.className='prototype-form-note';note.textContent=L(5);form.append(note);
      const button=form.querySelector('[type=submit]');if(button)button.textContent=L(0);
    }
    document.querySelectorAll('.mobile-action-dock').forEach(dock=>{dock.setAttribute('aria-label',{vi:'Hành động nhanh',en:'Quick actions',zh:'快捷操作',ko:'빠른 작업'}[lang]||'Hành động nhanh');dock.querySelectorAll('a').forEach(a=>{const href=window.MDLocale?.withLocale(a.getAttribute('href'),lang,location.href);if(href)a.setAttribute('href',href);});});
  }
  function enhanceCms(root=document.querySelector('#adminContent')){
    if(!root||root.querySelector('.prototype-toolbar'))return;
    const bar=document.createElement('div');bar.className='prototype-toolbar';
    bar.innerHTML='<span><i aria-hidden="true"></i> Demo · Lưu trên trình duyệt</span><button type="button" data-prototype-reset>Đặt lại demo</button>';
    root.prepend(bar);
  }
  function saveDraft(data){
    try{localStorage.setItem(KEY,JSON.stringify(data));lastError=false;context.notify('Đã lưu nội dung demo. Mở xem trước để kiểm tra.');return true;}
    catch{lastError=true;context.notify('Chưa lưu được. Hãy giảm dung lượng ảnh hoặc xuất nội dung trước khi rời trang.');return false;}
  }
  function reset(){if(!confirm('Đặt nội dung demo trên trình duyệt này về dữ liệu mẫu?'))return;try{localStorage.removeItem(KEY);}catch{}context.setData(structuredClone(seed));lastError=false;resetting=true;context.render();resetting=false;context.notify('Đã đặt lại bản demo.');}
  async function submit(event){
    const form=event.target;if(!['applyForm','contactForm'].includes(form.id))return;
    event.preventDefault();event.stopImmediatePropagation();if(form.dataset.sending||!context.validateForm(form))return;
    form.dataset.sending='1';const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent=L(1);
    // A short visible state demonstrates feedback; no request, file read or contact storage.
    await new Promise(resolve=>setTimeout(resolve,220));
    const result=document.createElement('div');result.className='prototype-success';result.tabIndex=-1;result.setAttribute('role','status');
    result.innerHTML=`<span aria-hidden="true">✓</span><h3>${L(2)}</h3><p>${L(3)}</p><button type="button" class="btn light" data-form-again>${L(4)}</button>`;
    form.replaceWith(result);result.focus();
  }
  const api={connected:false,boot(ctx){context=ctx;api.connected=true;seed=structuredClone(ctx.getData());try{const data=JSON.parse(localStorage.getItem(KEY)||'null');if(data&&data.home&&Array.isArray(data.jobs)&&Array.isArray(data.posts)&&Array.isArray(data.partners)){const migrated=window.MDBrandRights?.restoreDemoProfiles(data,seed);ctx.setData(data,{seedMissing:true});if(migrated)try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}}}catch{}
    document.addEventListener('submit',submit,true);
    document.addEventListener('click',e=>{if(e.target.closest('[data-prototype-reset]'))reset();
      const motion=e.target.closest('[data-motion-toggle]');if(motion){const reduced=!document.documentElement.classList.contains('md-reduce-motion');document.documentElement.classList.toggle('md-reduce-motion',reduced);motion.setAttribute('aria-pressed',String(reduced));try{localStorage.setItem('md_motion_preference',reduced?'reduce':'system');}catch{}}});
    ctx.render();
  },saveDraft,enhancePublic,enhanceCms,shouldSuppressNotice(message){return context?.page==='admin'&&((lastError&&/^Đã /.test(message))||(!resetting&&/^Đã (lưu|cập nhật)/.test(message)&&!message.includes('demo')));},getData(){return structuredClone(context.getData());}};
  return api;
})();
