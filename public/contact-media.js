/* V20: configurable contact channels and origin-local prototype video storage. */
window.MDExperience = (() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy = {
    help:['Liên hệ Minh Đức','Contact Minh Đức','联系明德','민득에 문의'],
    title:['Bạn cần hỗ trợ gì?','How can we help?','您需要什么帮助？','무엇을 도와드릴까요?'],
    intro:['Tìm việc hoặc trao đổi nhu cầu nhân lực.','Find a job or discuss your workforce needs.','找工作或沟通用工需求。','일자리를 찾거나 인력 수요를 상담하세요.'],
    zalo:['Nhắn qua Zalo','Chat on Zalo','通过 Zalo 咨询','Zalo 상담'],
    messenger:['Nhắn Messenger','Chat on Messenger','通过 Messenger 咨询','Messenger 상담'],
    hotline:['Gọi hotline','Call our hotline','拨打热线','전화 상담'],
    facebook:['Trang Facebook','Facebook page','Facebook 页面','Facebook 페이지'],
    pending:['Chưa cấu hình · Bản demo','Not configured · Demo','未配置 · 演示','미설정 · 데모'],
    demo:['Các kênh liên hệ đang chờ cập nhật. Bạn có thể xem thử biểu mẫu bên dưới.','Contact channels are being added. You can explore the demo form below.','联系方式正在更新。您可体验下方的演示表单。','연락 채널을 준비 중입니다. 아래 데모 양식을 살펴보세요.'],
    form:['Xem biểu mẫu tư vấn','Open enquiry form','查看咨询表单','문의 양식 보기'],
    close:['Đóng hỗ trợ','Close contact panel','关闭联系窗口','문의창 닫기'],
    videoMissing:['Video chưa có trên trình duyệt này. Vui lòng tải lại video trong CMS hoặc dùng liên kết video.','This video is not available in this browser. Upload it again in the CMS or use a video link.','此浏览器中没有该视频。请在 CMS 中重新上传或使用视频链接。','이 브라우저에 동영상이 없습니다. CMS에서 다시 업로드하거나 동영상 링크를 사용하세요.'],
    videoError:['Không phát được video. Hãy kiểm tra định dạng hoặc liên kết trong CMS.','Unable to play this video. Check its format or link in the CMS.','无法播放视频，请在 CMS 中检查格式或链接。','동영상을 재생할 수 없습니다. CMS에서 형식이나 링크를 확인하세요.'],
    loading:['Đang mở video…','Loading video…','正在加载视频…','동영상 불러오는 중…'],
    videoEmpty:['Video đang được chuẩn bị','Video coming soon','视频准备中','동영상 준비 중'],
    videoEmptyDescription:['Nội dung giới thiệu sẽ xuất hiện tại đây khi video được cập nhật.','The introduction will be available here when a video is added.','添加视频后，您可在此观看介绍。','동영상이 추가되면 여기에서 소개를 볼 수 있습니다.'],
    videoPlay:['Phát video giới thiệu','Play introduction video','播放介绍视频','소개 동영상 재생'],
    videoPoster:['Ảnh đại diện video giới thiệu','Introduction video poster','介绍视频封面','소개 동영상 표지'],
  };
  const t=(key,lang=document.documentElement.lang)=>copy[key]?.[{vi:0,en:1,zh:2,ko:3}[lang]||0]||key;
  const videoLabel=(value,lang)=>({empty:t('videoEmpty',lang),description:t('videoEmptyDescription',lang),play:t('videoPlay',lang),poster:t('videoPoster',lang)});
  const phone = value => {
    const v=String(value||'').trim();
    if(!/^[+\d\s().-]+$/.test(v))return '';
    const compact=v.replace(/[\s().-]/g,'');
    return /^(?:0\d{9,10}|\+84\d{9,10}|1800\d{4,6}|1900\d{4,6})$/.test(compact)?compact:'';
  };
  function channelUrl(kind,value){
    if(kind==='facebook')return window.MDCompanyProfile?.facebookUrl(value)||'';
    if(kind==='hotline')return phone(value)?'tel:'+phone(value):'';
    try{const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||u.username||u.password||u.port)return '';
      const allowed=kind==='zalo'?['zalo.me']:['m.me','www.messenger.com','messenger.com'];
      if(!allowed.includes(u.hostname)||u.pathname==='/'||/[<>"']/.test(u.href))return '';
      if(kind==='messenger'&&u.hostname!=='m.me'&&!/^\/t\/[^/]+\/?$/.test(u.pathname))return '';
      return u.href;
    }catch{return '';}
  }
  function videoSource(value){
    const v=String(value||'').trim();if(!v)return {kind:'empty'};
    if(/^md-video:[a-z0-9-]+$/.test(v))return {kind:'local',id:v.slice(9)};
    try{const u=new URL(v);if(u.protocol!=='https:'||u.username||u.password||u.port)return {kind:'invalid'};
      let id='';if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname))id=u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})\/?$/)?.[1];
      if(u.hostname==='youtu.be')id=u.pathname.slice(1);
      if(/^[\w-]{11}$/.test(id||''))return {kind:'youtube',url:'https://www.youtube-nocookie.com/embed/'+id};
      if(/\.(mp4|webm)$/i.test(u.pathname))return {kind:'file',url:u.href};
    }catch{}
    return {kind:'invalid'};
  }
  function validateFile(file){
    if(!file||!file.size)throw Error('Tệp video đang trống. Hãy chọn tệp khác.');
    if(file.size>100*1024*1024)throw Error('Video vượt quá 100 MB. Hãy nén video hoặc dùng liên kết.');
    const ext=String(file.name||'').toLowerCase().match(/\.(mp4|webm)$/)?.[1];
    if(!ext||(file.type&&file.type!==(ext==='mp4'?'video/mp4':'video/webm')))throw Error('Chọn video MP4 hoặc WebM, tối đa 100 MB.');
    return true;
  }
  let database,context,lastContactToggle;
  function openStore(){
    if(database)return database;
    database=new Promise((resolve,reject)=>{
      const request=indexedDB.open('md_prototype_media_v20',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('videos',{keyPath:'id'});
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();database=null;};resolve(db);};
      request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Kho video đang bận. Đóng tab CMS khác rồi thử lại.'));
    }).catch(error=>{database=null;throw error;});
    return database;
  }
  async function storeAction(mode,action){
    const db=await openStore();return new Promise((resolve,reject)=>{
      const tx=db.transaction('videos',mode),request=action(tx.objectStore('videos'));
      tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Không lưu được video.'));
    });
  }
  const getVideo=id=>storeAction('readonly',store=>store.get(id));
  const deleteVideo=id=>storeAction('readwrite',store=>store.delete(id));
  function inspectVideo(file){
    return new Promise((resolve,reject)=>{
      const media=document.createElement('video'),url=URL.createObjectURL(file);
      const end=(error)=>{clearTimeout(timer);media.onloadedmetadata=null;media.onerror=null;media.removeAttribute('src');media.load();URL.revokeObjectURL(url);error?reject(error):resolve();};
      const timer=setTimeout(()=>end(Error('Không đọc được video. Hãy thử MP4 H.264 hoặc WebM.')),12000);
      media.preload='metadata';media.onloadedmetadata=()=>end(media.videoWidth>0?null:Error('Tệp này không có hình ảnh video.'));
      media.onerror=()=>end(Error('Không đọc được video. Hãy thử MP4 H.264 hoặc WebM.'));media.src=url;
    });
  }
  const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${name==='phone'?'<path d="M6 2 3 5c-3 5 10 18 15 16l4-4-6-5-3 3c-2-1-4-3-5-5l3-3-5-5Z"/>':'<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 14h4v7H5a2 2 0 0 1-2-2v-5Zm18 0h-4v7h2a2 2 0 0 0 2-2v-5Z"/>'}</svg>`;
  const contactIcon=(kind)=>kind==='facebook'?'<span class="md-social-mark facebook" aria-hidden="true">f</span>':kind==='zalo'?'<span class="md-social-mark zalo" aria-hidden="true">Zalo</span>':kind==='messenger'?'<span class="md-social-mark messenger" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.2S17.5 2 12 2Zm1 12-2.6-2.8-5.1 2.8 5.6-6 2.7 2.8 5-2.8Z"/></svg></span>':'<span class="md-social-mark hotline" aria-hidden="true">'+icon('phone')+'</span>';
  function socialHtml(data,lang='vi'){
    const social=data.social||{};if(social.enabled===false)return '';
    const rows=['zalo',!social.messenger&&data.company?.facebook?'facebook':'messenger','hotline'].map(kind=>{
      const url=channelUrl(kind,kind==='facebook'?data.company?.facebook:social[kind]),label=escape(t(kind,lang)),icon=contactIcon(kind);
      const inside=icon+`<span><b>${label}</b><small>${escape(url?(kind==='hotline'?social.hotline:kind==='zalo'?'Zalo':kind==='facebook'?'Facebook':'Messenger'):t('pending',lang))}</small></span><span aria-hidden="true">↗</span>`;
      return url?`<a class="md-social-channel" href="${escape(url)}" ${kind==='hotline'?'':'target="_blank" rel="noopener noreferrer"'}>${inside}</a>`:`<div class="md-social-channel is-pending" aria-disabled="true">${inside}</div>`;
    }).join('');
    const none=!['zalo',!social.messenger&&data.company?.facebook?'facebook':'messenger','hotline'].some(k=>channelUrl(k,k==='facebook'?data.company?.facebook:social[k]));
    return `<aside class="md-social" aria-label="${escape(t('help',lang))}"><section class="md-social-panel" id="md-social-panel" aria-labelledby="md-social-title" hidden><div class="md-social-heading"><span class="md-social-avatar" aria-hidden="true">m<span>đ</span></span><div><b>MINH ĐỨC</b><p>${escape(t('intro',lang))}</p></div><button type="button" data-social-close aria-label="${escape(t('close',lang))}">×</button></div><div class="md-social-body"><h2 id="md-social-title">${escape(t('title',lang))}</h2>${rows}${none?`<p class="md-social-note">${escape(t('demo',lang))}</p>`:''}<a class="md-social-form" href="lien-he.html?lang=${lang}">${escape(t('form',lang))} <span aria-hidden="true">→</span></a></div></section><button type="button" class="md-social-toggle" aria-controls="md-social-panel" aria-expanded="false" data-social-toggle>${icon('help')}<span>${escape(t('help',lang))}</span></button></aside>`;
  }
  function settingsHtml(data){
    const s=data.social||{};
    return `<form id="socialSettingsForm" class="admin-card md-social-settings"><div class="eyebrow">KÊNH LIÊN HỆ</div><h2>Social Chat Widget</h2><p>Giúp người tìm việc và doanh nghiệp liên hệ từ bất kỳ trang nào.</p><label class="checkbox-line"><input type="checkbox" name="enabled" ${s.enabled!==false?'checked':''}> Hiển thị tiện ích liên hệ</label><div class="form-grid"><div class="field"><label for="social-hotline">Số hotline</label><input id="social-hotline" name="hotline" type="tel" value="${escape(s.hotline)}" placeholder="Số điện thoại doanh nghiệp" maxlength="24"><small>Hỗ trợ đầu số 0, +84, 1800 và 1900.</small></div><div class="field"><label for="social-zalo">Liên kết Zalo</label><input id="social-zalo" name="zalo" type="url" value="${escape(s.zalo)}" placeholder="https://zalo.me/…" maxlength="300"><small>Liên kết Zalo cá nhân hoặc trang OA.</small></div><div class="field wide"><label for="social-messenger">Liên kết Messenger</label><input id="social-messenger" name="messenger" type="url" value="${escape(s.messenger)}" placeholder="https://m.me/…" maxlength="300"><small>Dùng m.me hoặc messenger.com/t/… của doanh nghiệp.</small></div></div><p class="md-editor-note">Để trống kênh chưa có. Bản demo hiển thị “Chưa cấu hình” và không mở liên kết giả. Cài đặt chỉ lưu trên trình duyệt này.</p><p data-social-status role="status" aria-live="polite"></p><div class="cms-toolbar"><button class="btn blue" type="submit">Lưu kênh liên hệ</button><a class="btn light" href="index.html" target="_blank" rel="noopener">Xem trên trang chủ ↗</a></div></form>`;
  }
  function editorHtml(target,value,name){
    return `<div class="md-video-editor" data-video-editor="${escape(target)}"><input type="hidden" name="${name}" data-video-value value="${escape(value)}"><div class="md-video-current"><div><b>Video đang dùng</b><p data-video-current-label>${value?'Đang kiểm tra video…':'Chưa thêm video'}</p></div><button class="btn light sm" type="button" data-video-remove ${value?'':'hidden'}>Gỡ video</button></div><div data-video-preview></div><div class="md-video-drop" data-video-drop><span class="round-ico">${context.I('upload')}</span><b>Thêm video từ máy tính</b><p>Kéo thả video vào đây hoặc chọn tệp bên dưới.</p><label class="md-video-file-label">Chọn video MP4 / WebM<input data-video-file type="file" accept="video/mp4,video/webm,.mp4,.webm"></label><small>Tối đa 100 MB · Lưu ngay sau khi kiểm tra</small></div><div class="md-video-url-row"><div class="field"><label>Hoặc dùng liên kết video</label><input type="text" inputmode="url" data-video-url value="${escape(videoSource(value).kind==='local'?'':value)}" placeholder="https://youtu.be/… hoặc https://…/video.mp4"></div><button type="button" class="btn light" data-video-link>Áp dụng liên kết</button></div><p class="md-video-status" data-video-status role="status" aria-live="polite"></p><p class="md-editor-note">Video tải lên chỉ lưu trong trình duyệt này, không nằm trong bản xuất JSON và không tự xuất bản cho người khác. Dùng liên kết HTTPS để xem trên nhiều thiết bị. Khi chuyển nguồn, video cũ vẫn được giữ trong kho cục bộ.</p></div>`;
  }
  function record(target){return target==='home'?context.getData().home:context.getData().posts.find(p=>'post:'+p.id===target);}
  const videoField=target=>target==='home'?'videoUrl':'video';
  function setSource(target,value){
    const item=record(target);if(!item)throw Error('Không tìm thấy nội dung cần cập nhật.');
    const field=videoField(target),old=item[field];item[field]=value;
    if(!context.persist()){item[field]=old;throw Error('Chưa lưu được nội dung. Video cũ vẫn được giữ.');}
  }
  function status(editor,message,error=false){const el=editor.querySelector('[data-video-status]');el.textContent=message;el.classList.toggle('is-error',error);}
  function releasePreview(editor){const box=editor.querySelector('[data-video-preview]'),video=box.querySelector('video');video?.pause();if(box.dataset.objectUrl)URL.revokeObjectURL(box.dataset.objectUrl);delete box.dataset.objectUrl;box.replaceChildren();}
  async function renderEditor(editor){
    const value=editor.querySelector('[data-video-value]').value,source=videoSource(value),label=editor.querySelector('[data-video-current-label]');
    releasePreview(editor);editor.querySelector('[data-video-remove]').hidden=!value;
    if(source.kind==='empty'){label.textContent='Chưa thêm video';return;}
    if(source.kind!=='local'){label.textContent=source.kind==='invalid'?'Liên kết chưa hợp lệ':source.kind==='youtube'?'Video YouTube': 'Video từ liên kết HTTPS';return;}
    try{const saved=await getVideo(source.id);if(!editor.isConnected||editor.querySelector('[data-video-value]').value!==value)return;
      if(!saved){label.textContent='Không tìm thấy tệp trên trình duyệt này';status(editor,'Tải lại video gốc hoặc dùng liên kết video.',true);return;}
      label.textContent=saved.name+' · '+(saved.size/1024/1024).toFixed(1)+' MB · Đã lưu trên trình duyệt';
      const video=document.createElement('video'),box=editor.querySelector('[data-video-preview]');video.controls=true;video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','Xem trước video đã tải lên');box.dataset.objectUrl=URL.createObjectURL(saved.blob);video.src=box.dataset.objectUrl;box.append(video);
    }catch{label.textContent='Chưa mở được kho video';status(editor,'Trình duyệt không cho phép đọc kho video. Hãy dùng liên kết HTTPS.',true);}
  }
  async function upload(editor,file){
    if(editor.dataset.busy)return;
    editor.dataset.busy='true';editor.setAttribute('aria-busy','true');editor.querySelectorAll('button,input').forEach(el=>el.disabled=true);
    let id,committed=false;
    try{validateFile(file);status(editor,'Đang kiểm tra video…');await inspectVideo(file);
      status(editor,'Đang lưu video trên trình duyệt…');id=crypto.randomUUID();
      await storeAction('readwrite',store=>store.put({id,name:file.name,size:file.size,type:file.type,blob:file,createdAt:Date.now()}));
      setSource(editor.dataset.videoEditor,'md-video:'+id);committed=true;
      editor.querySelector('[data-video-value]').value='md-video:'+id;editor.querySelector('[data-video-url]').value='';
      await renderEditor(editor);status(editor,'Đã tải và lưu video. Mở trang chủ hoặc bài viết để xem.');
    }catch(error){if(id&&!committed)await deleteVideo(id).catch(()=>{});status(editor,error.name==='QuotaExceededError'?'Kho trình duyệt không đủ chỗ. Hãy chọn tệp nhỏ hơn hoặc dùng liên kết video.':error.message||'Không lưu được video. Hãy thử lại.',true);}
    finally{delete editor.dataset.busy;editor.removeAttribute('aria-busy');editor.querySelectorAll('button,input').forEach(el=>el.disabled=false);editor.querySelector('[data-video-file]').value='';}
  }
  const editors=new Set();
  function releaseEditors(){for(const editor of editors)releasePreview(editor);editors.clear();}
  function mountEditors(root){
    root.querySelectorAll('[data-video-editor]').forEach(editor=>{if(editor.dataset.mounted)return;editor.dataset.mounted='1';editors.add(editor);renderEditor(editor);});
  }
  async function player(container,value,{autoplay=false}={}){
    const source=videoSource(value);let objectUrl;
    container.textContent=t('loading');
    try{
      let url=source.url;
      if(source.kind==='local'){const saved=await getVideo(source.id);if(!saved)throw Error(t('videoMissing'));url=objectUrl=URL.createObjectURL(saved.blob);}
      if(!container.isConnected){if(objectUrl)URL.revokeObjectURL(objectUrl);return;}
      if(!url)throw Error(t(source.kind==='empty'?'videoEmpty':'videoError'));
      const node=document.createElement(source.kind==='youtube'?'iframe':'video');
      if(node.tagName==='IFRAME'){node.title='Video Minh Đức';node.allow='autoplay; fullscreen; picture-in-picture';node.referrerPolicy='strict-origin-when-cross-origin';node.allowFullscreen=true;if(autoplay)url+='?autoplay=1&mute=0&playsinline=1';}
      else{node.controls=true;node.playsInline=true;node.preload='metadata';node.autoplay=autoplay;node.defaultMuted=false;node.muted=false;node.volume=1;node.setAttribute('aria-label','Video Minh Đức');node.addEventListener('error',()=>{container.textContent=t('videoError');});}
      node.src=url;container.replaceChildren(node);
      // Start within the opening click so browsers allow playback with sound.
      // Keep native controls available if a browser declines the play request.
      if(autoplay&&node.tagName!=='IFRAME')node.play().catch(()=>{});
      const observer=new MutationObserver(()=>{if(!container.isConnected){node.pause?.();node.removeAttribute('src');node.load?.();if(objectUrl)URL.revokeObjectURL(objectUrl);observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});
    }catch(error){container.textContent=error.message||t('videoError');container.setAttribute('role','status');}
  }
  function mountPublic(){
    const dock=document.querySelector('.mobile-action-dock'),social=document.querySelector('.md-social');
    if(!social)return;
    // Only a contact action may open the contact panel. Listing/apply links retain their destinations.
    const link=dock?.querySelector('a[data-action="contact"]');
    if(link&&!dock.querySelector('[data-social-toggle]')){
      const button=document.createElement('button');button.type='button';button.className='btn light';button.textContent=link.textContent;button.dataset.socialToggle='';button.setAttribute('aria-controls','md-social-panel');button.setAttribute('aria-expanded','false');link.replaceWith(button);
    }
    social.classList.toggle('has-dock-contact',!!dock?.querySelector('[data-social-toggle]'));
  }
  function closeSocial(focus=false){const panel=document.getElementById('md-social-panel');if(!panel||panel.hidden)return;panel.hidden=true;document.querySelectorAll('[data-social-toggle]').forEach(toggle=>toggle.setAttribute('aria-expanded','false'));if(focus)lastContactToggle?.focus();}
  // Keep an unfinished form only for the synchronous locale rerender. Never write it to storage.
  function captureForms(root=document){
    return [...root.querySelectorAll('#contactForm,#applyForm')].map(form=>({
      id:form.id,
      fields:[...form.querySelectorAll('input:not([type="hidden"]),select,textarea')].map((field,index)=>({
          index,name:field.name||'',id:field.id||'',type:field.type,value:field.value,checked:field.checked,selectedIndex:field.selectedIndex,
        file:field.type==='file'?field:null,
      })),
      steps:[...form.querySelectorAll('[data-step],[data-contact-step]')].map(step=>({kind:step.hasAttribute('data-step')?'data-step':'data-contact-step',value:step.getAttribute('data-step')||step.getAttribute('data-contact-step'),hidden:step.hidden})),
      progress:[...form.querySelectorAll('[data-apply-progress],[data-contact-progress]')].map(step=>({kind:step.hasAttribute('data-apply-progress')?'data-apply-progress':'data-contact-progress',value:step.getAttribute('data-apply-progress')||step.getAttribute('data-contact-progress'),active:step.classList.contains('is-active'),current:step.classList.contains('is-current')})),
      alerts:[...form.querySelectorAll('[role="alert"][id]')].map(alert=>({id:alert.id,hidden:alert.hidden})),
      hadErrors:!!form.querySelector('[aria-invalid="true"]'),
    }));
  }
  function restoreForms(snapshots,root=document){
    for(const saved of snapshots){
      const form=root.querySelector('#'+saved.id);if(!form)continue;
      const fields=[...form.querySelectorAll('input:not([type="hidden"]),select,textarea')];
        const deferPreference=field=>{if(saved.id==='applyForm'&&['shift','shuttle','area'].includes(field.name)&&field.value==='Chưa rõ'&&(field.type!=='radio'||field.checked))(form.__mdPendingWorkerPreferences||={})[field.name]=field.value;};
      for(const field of saved.fields){
          // Dynamic helper controls may not yet exist after a locale rerender. Never
          // restore contact data into a different field just because its index shifted.
          const fresh=field.name?fields.find(candidate=>candidate.name===field.name&&candidate.type===field.type&&(field.type!=='radio'||candidate.value===field.value)):field.id?fields.find(candidate=>candidate.id===field.id&&candidate.type===field.type):fields[field.index];if(!fresh||fresh.type!==field.type){deferPreference(field);continue;}
        if(field.file){fresh.replaceWith(field.file);continue;}
          if(fresh.tagName==='SELECT'){if([...fresh.options].some(option=>option.value===field.value))fresh.value=field.value;else{fresh.selectedIndex=0;deferPreference(field);}}
        else if(['radio','checkbox'].includes(field.type))fresh.checked=field.checked;
        else fresh.value=field.value;
      }
      for(const step of saved.steps){const target=form.querySelector('['+step.kind+'="'+step.value+'"]');if(target)target.hidden=step.hidden;}
      for(const step of saved.progress){const target=form.querySelector('['+step.kind+'="'+step.value+'"]');if(target){target.classList.toggle('is-active',step.active);target.classList.toggle('is-current',step.current);}}
      for(const alert of saved.alerts){const target=form.querySelector('#'+alert.id);if(target)target.hidden=alert.hidden;}
      if(saved.id==='contactForm'){
        const message=form.querySelector('[name="message"]')?.value||'',count=form.querySelector('#briefCharCount'),review=form.querySelector('#contactReview');
        if(count)count.textContent=message.length;if(review)review.textContent=message.trim();
      }
    }
  }
  function init(api){
    if(context)return;context=api;
    document.addEventListener('submit',event=>{
      if(event.target.id!=='socialSettingsForm')return;
      event.preventDefault();const form=event.target,values=new FormData(form),next={enabled:values.get('enabled')==='on'};
      const output=form.querySelector('[data-social-status]');
      for(const kind of ['hotline','zalo','messenger']){const input=form.elements.namedItem(kind);input.setCustomValidity('');const value=String(values.get(kind)||'').trim();if(value&&!channelUrl(kind,value)){const message=kind==='hotline'?'Nhập số hotline hợp lệ.':'Nhập liên kết HTTPS đúng của '+(kind==='zalo'?'zalo.me':'m.me hoặc messenger.com/t/…')+'.';input.setCustomValidity(message);input.reportValidity();output.textContent=message;return;}next[kind]=value;}
      const data=context.getData(),old=data.social;data.social=next;if(!context.persist()){data.social=old;output.textContent='Chưa lưu được. Cài đặt cũ vẫn được giữ.';return;}output.textContent='Đã lưu kênh liên hệ trên trình duyệt này.';
    });
    document.addEventListener('input',event=>{if(event.target.closest('#socialSettingsForm'))event.target.setCustomValidity?.('');});
    document.addEventListener('click',async event=>{
      if(event.target.closest('[data-social-toggle]')){const panel=document.getElementById('md-social-panel');lastContactToggle=event.target.closest('[data-social-toggle]');panel.hidden=!panel.hidden;document.querySelectorAll('[data-social-toggle]').forEach(toggle=>toggle.setAttribute('aria-expanded',String(!panel.hidden)));if(!panel.hidden)panel.querySelector('button')?.focus();return;}
      if(event.target.closest('[data-social-close]')){closeSocial(true);return;}
      if(!event.target.closest('.md-social'))closeSocial();
      const editor=event.target.closest('[data-video-editor]');if(!editor||editor.dataset.busy)return;
      if(event.target.closest('[data-video-link]')||event.target.closest('[data-video-remove]')){
        const value=event.target.closest('[data-video-remove]')?'':editor.querySelector('[data-video-url]').value.trim(),kind=videoSource(value).kind;
        if(!event.target.closest('[data-video-remove]')&&!['youtube','file'].includes(kind)){status(editor,'Dùng liên kết YouTube hoặc tệp MP4/WebM qua HTTPS.',true);return;}
        try{setSource(editor.dataset.videoEditor,value);editor.querySelector('[data-video-value]').value=value;if(!value)editor.querySelector('[data-video-url]').value='';await renderEditor(editor);status(editor,value?'Đã áp dụng liên kết video.':'Đã gỡ video khỏi nội dung. Tệp cũ vẫn được giữ trong kho cục bộ.');}catch(error){status(editor,error.message,true);}
      }
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.getElementById('md-social-panel')?.hidden){closeSocial(true);}});
    document.addEventListener('focusin',event=>{if(!event.target.closest('.md-social,[data-social-toggle]'))closeSocial();});
    document.addEventListener('change',event=>{if(event.target.matches('[data-video-file]')&&event.target.files?.[0])upload(event.target.closest('[data-video-editor]'),event.target.files[0]);});
    for(const type of ['dragover','dragleave','drop'])document.addEventListener(type,event=>{const zone=event.target.closest('[data-video-drop]');if(!zone)return;event.preventDefault();zone.classList.toggle('is-dragging',type==='dragover');if(type==='drop'){const files=event.dataTransfer.files,editor=zone.closest('[data-video-editor]');if(files.length!==1){status(editor,'Vui lòng chọn một video mỗi lần.',true);return;}upload(editor,files[0]);}});
  }
  return {init,socialHtml,settingsHtml,editorHtml,mountEditors,releaseEditors,mountPublic,player,channelUrl,videoSource,videoLabel,validateFile,captureForms,restoreForms};
})();
