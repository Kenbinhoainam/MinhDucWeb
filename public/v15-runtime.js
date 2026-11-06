/* Server-backed staging runtime. No credentials or owner identifiers live here. */
window.MD15 = (() => {
  'use strict';
  let context=null, revision=0, publishedRevision=0, saveState='loading', timer=null, pendingData=null, saving=false;
  let committed='', booted=false, sessionPromise=null, lastError='';
  const qs=(s,root=document)=>root.querySelector(s);
  const requestId=()=>{if(crypto.randomUUID)return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;return [...bytes].map((b,i)=>([4,6,8,10].includes(i)?'-':'')+b.toString(16).padStart(2,'0')).join('');};
  const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={
    vi:{submit:'Gửi dữ liệu thử',pending:'Đang gửi…',success:'Đã tiếp nhận dữ liệu thử',stored:'Dữ liệu mẫu đã được lưu trên máy chủ. Mã tiếp nhận:',retry:'Thử gửi lại',error:'Chưa gửi được. Thông tin bạn nhập vẫn được giữ để thử lại.',note:'Chỉ dùng dữ liệu giả. Thông tin mẫu được lưu để quản trị viên kiểm tra.',test:'Tôi xác nhận đây là dữ liệu giả phục vụ kiểm thử.',policy:'Chính sách bản thử nghiệm',again:'Thử biểu mẫu khác',verify:'Đã đối soát mã tiếp nhận với máy chủ.',fallback:'Đang dùng nội dung dự phòng. Hãy tải lại nếu cần bản mới nhất.'},
    en:{submit:'Send test data',pending:'Sending…',success:'Test data received',stored:'Sample data has been saved on the server. Receipt:',retry:'Retry submission',error:'Not submitted. Your input is kept so you can retry.',note:'Use fictional data only. Samples are stored for the administrator to review.',test:'I confirm this is fictional data for testing.',policy:'Staging data policy',again:'Try another form',verify:'Receipt verified against server storage.',fallback:'Fallback content is shown. Reload for the latest version.'},
    zh:{submit:'提交测试数据',pending:'正在提交…',success:'已接收测试数据',stored:'示例数据已保存在服务器。回执：',retry:'重试提交',error:'尚未提交，已保留输入内容以便重试。',note:'仅使用虚构数据。示例信息将保存供管理员检查。',test:'我确认以上信息为测试用虚构数据。',policy:'测试版数据政策',again:'再次测试表单',verify:'已与服务器记录核对回执。',fallback:'当前显示备用内容，可刷新获取最新版本。'},
    ko:{submit:'테스트 데이터 제출',pending:'전송 중…',success:'테스트 데이터가 접수되었습니다',stored:'예시 데이터가 서버에 저장되었습니다. 접수 번호:',retry:'다시 제출',error:'제출되지 않았습니다. 다시 시도할 수 있도록 입력 내용이 유지됩니다.',note:'가상의 정보만 입력하세요. 관리자가 확인할 예시 정보가 저장됩니다.',test:'테스트를 위한 가상 정보임을 확인합니다.',policy:'체험판 데이터 정책',again:'다른 양식 테스트',verify:'서버 기록과 접수 번호를 대조했습니다.',fallback:'임시 콘텐츠가 표시됩니다. 최신 내용을 보려면 새로고침하세요.'}
  };
  const L=k=>(labels[document.documentElement.lang]||labels.vi)[k]||labels.vi[k];
  async function api(path,options={}) {
    const headers={...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers};
    const res=await fetch(path,{credentials:'same-origin',cache:'no-store',...options,headers});
    const value=await res.json().catch(()=>({message:'Máy chủ chưa trả về dữ liệu hợp lệ.'}));
    if(!res.ok){const error=new Error(value.message||'Chưa hoàn tất được thao tác.');error.status=res.status;error.code=value.error;throw error;}
    return value;
  }
  function preparePublic() {
    for(const form of document.querySelectorAll('#applyForm,#contactForm')){
      if(form.dataset.v15Prepared)continue;form.dataset.v15Prepared='1';
      for(const old of form.querySelectorAll('.form-note,.v14-form-demo'))old.remove();
      const step=form.querySelector('[data-step="2"],[data-contact-step="2"]')||form;
      const label=document.createElement('label');label.className='checkbox-line v15-test-check';
      label.innerHTML=`<input type="checkbox" name="testOnly" required id="testOnly-${form.id}"><span>${L('test')}</span>`;
      const actions=step.querySelector('.apply-form-actions,.v14-contact-actions,button[type=submit]');if(actions)actions.before(label);else step.append(label);
      const honey=document.createElement('div');honey.className='v15-honeypot';honey.setAttribute('aria-hidden','true');honey.innerHTML='<label>Website<input name="website" tabindex="-1" autocomplete="off"></label>';form.append(honey);
      const note=document.createElement('p');note.className='v15-form-note';note.innerHTML=`${L('note')} <a href="chinh-sach-du-lieu.html">${L('policy')}</a>`;form.append(note);
      const submit=form.querySelector('button[type=submit]');if(submit)submit.textContent=L('submit');
      sessionPromise=api('/api/session').catch(error=>{sessionPromise=null;throw error;});
      // Do not leave an unhandled promise if a visitor never submits the form.
      sessionPromise.catch(()=>{});
    }
  }
  async function submitForm(event) {
    const form=event.target;if(!['applyForm','contactForm'].includes(form.id))return;
    event.preventDefault();event.stopImmediatePropagation();if(form.dataset.sending==='1'||!context.validateForm(form))return;
    const data=Object.fromEntries(new FormData(form));
    const payload={...data,kind:form.id==='applyForm'?'application':'enquiry',jobId:new URLSearchParams(location.search).get('id'),locale:document.documentElement.lang,consent:form.elements.consent?.checked===true,testOnly:form.elements.testOnly?.checked===true};
    delete payload.cv;delete payload.job;
    const submit=form.querySelector('button[type=submit]'),oldLabel=submit.textContent;form.dataset.sending='1';submit.disabled=true;submit.textContent=L('pending');
    form.querySelector('.v15-submit-error')?.remove();form.dataset.requestKey||=requestId();
    try{
      await (sessionPromise||api('/api/session'));
      const body=new FormData();body.set('payload',JSON.stringify(payload));const cv=form.elements.cv?.files?.[0];if(cv)body.set('cv',cv);
      const result=await api('/api/intake',{method:'POST',headers:{'Idempotency-Key':form.dataset.requestKey},body});
      const proof=await api('/api/receipt',{method:'POST',body:JSON.stringify({id:result.id,receiptToken:result.receiptToken})});
      if(!proof.stored||proof.id!==result.id)throw new Error(L('error'));
      const box=document.createElement('div');box.className='md-form-success v15-receipt';box.tabIndex=-1;box.setAttribute('role','status');
      box.innerHTML=`<span class="v15-receipt-check" aria-hidden="true">✓</span><h3>${L('success')}</h3><p>${L('stored')}</p><code>${escape(result.id)}</code><p class="v15-verified">${L('verify')}</p><button type="button" class="btn light" data-form-again>${L('again')}</button>`;
      form.replaceWith(box);box.focus();
    }catch(error){
      if(error.code==='session_required'){sessionPromise=null;await api('/api/session').catch(()=>{});}
      if(error.code==='request_conflict')delete form.dataset.requestKey;
      const message=document.createElement('div');message.className='v15-submit-error';message.setAttribute('role','alert');message.innerHTML=`<strong>${L('error')}</strong><p>${escape(error.message)}</p>`;message.tabIndex=-1;form.append(message);message.focus();
    }finally{form.dataset.sending='0';submit.disabled=false;submit.textContent=oldLabel;}
  }
  function statusToolbar(root=qs('#adminContent')) {
    if(!root)return;let bar=qs('#v15ServerBar',root);
    if(!bar){bar=document.createElement('section');bar.id='v15ServerBar';bar.className='v15-server-bar';root.prepend(bar);}
    bar.dataset.state=saveState;
    const messages={loading:'Đang tải bản nháp máy chủ…',pending:'Đang lưu bản nháp máy chủ…',saved:'Bản nháp đã lưu trên máy chủ',error:'Chưa lưu được — nội dung nhập vẫn được giữ'};
    bar.innerHTML=`<div role="status" aria-live="polite"><strong>${messages[saveState]||messages.saved}</strong><span>Nháp #${revision} · Bản công khai #${publishedRevision}</span>${lastError?`<p>${escape(lastError)}</p>`:''}</div><div class="v15-server-actions">${saveState==='error'?'<button class="btn light sm" type="button" data-v15-retry-save>Thử lưu lại</button><button class="btn light sm" type="button" data-export>Xuất bản sao JSON</button><button class="btn light sm" type="button" data-v15-refresh>Tải bản máy chủ</button>':''}<button class="btn red sm" type="button" data-v15-publish ${saveState!=='saved'||revision===0?'disabled':''}>Xuất bản bản nháp</button><button class="btn light sm" type="button" data-v15-history>Lịch sử & khôi phục</button><a class="link" href="/signout-with-chatgpt?return_to=%2F">Đăng xuất</a></div>`;
    for(const control of root.querySelectorAll('form input,form textarea,form select,button[form],form button[type=submit]')){
      if(['loading','pending'].includes(saveState)){if(!control.disabled){control.dataset.v15Disabled='1';control.disabled=true;}}
      else if(control.dataset.v15Disabled){control.disabled=false;delete control.dataset.v15Disabled;}
    }
    const nav=qs('.admin-nav');if(nav&&!qs('[data-admin="intakes"]',nav)){const b=document.createElement('button');b.dataset.admin='intakes';b.textContent='Hồ sơ & yêu cầu thử';nav.insertBefore(b,nav.querySelector('.nav-brand'));}
  }
  function saveDraft(data) {pendingData=data;saveState='pending';lastError='';statusToolbar();clearTimeout(timer);timer=setTimeout(flushDraft,60);}
  async function flushDraft(){
    if(saving||!pendingData)return;saving=true;const data=pendingData;pendingData=null;
    try{const result=await api('/api/admin/content',{method:'PUT',body:JSON.stringify({data,expectedRevision:revision})});revision=result.revision;committed=JSON.stringify(data);saveState=pendingData?'pending':'saved';lastError='';context.notify('Máy chủ đã lưu bản nháp #'+revision+'. Chưa thay đổi bản công khai.');}
    catch(error){saveState='error';lastError=error.message;pendingData=null;context.notify('Lưu máy chủ chưa thành công. Nội dung trên màn hình vẫn được giữ.');}
    finally{saving=false;statusToolbar();if(pendingData)flushDraft();}
  }
  function showDialog(title,inner){const layer=document.createElement('div');layer.className='modal-layer';layer.innerHTML=`<div class="modal-card v15-dialog"><button type="button" class="modal-close" aria-label="Đóng">×</button><h2>${escape(title)}</h2>${inner}</div>`;document.body.append(layer);context.focusDialog(layer);layer.addEventListener('click',e=>{if(e.target===layer||e.target.closest('.modal-close'))layer.remove();});return layer;}
  async function historyDialog(){
    const layer=showDialog('Lịch sử nội dung','<p role="status">Đang đọc lịch sử máy chủ…</p>');
    try{const [history,content,events]=await Promise.all([api('/api/admin/versions'),api('/api/admin/content'),api('/api/admin/audit')]);publishedRevision=content.publishedRevision;
      layer.querySelector('.modal-card').innerHTML=`<button type="button" class="modal-close" aria-label="Đóng">×</button><h2>Lịch sử nội dung</h2><p>Khôi phục chỉ đổi nội dung công khai. Bản nháp đang biên tập được giữ nguyên.</p><div class="v15-history-list">${history.versions.map(v=>`<div><span><b>${escape(v.id)}</b><small>${new Date(v.created_at).toLocaleString('vi-VN')}</small></span><button type="button" class="btn light sm" data-v15-restore="${escape(v.id)}">Khôi phục bản này</button></div>`).join('')||'<p>Chưa có bản xuất bản. Lưu bản nháp rồi xuất bản lần đầu để tạo lịch sử.</p>'}</div><h3>Nhật ký gần đây</h3><ul class="v15-audit-list">${events.events.slice(0,12).map(x=>`<li><time>${new Date(x.created_at).toLocaleString('vi-VN')}</time><span>${escape(x.action)}</span></li>`).join('')||'<li>Chưa có sự kiện.</li>'}</ul>`;
      layer.querySelector('.modal-close').focus();layer.addEventListener('click',async e=>{const b=e.target.closest('[data-v15-restore]');if(!b)return;if(!confirm('Đổi nội dung công khai về '+b.dataset.v15Restore+'? Bản nháp không đổi.'))return;b.disabled=true;try{const result=await api('/api/admin/rollback',{method:'POST',body:JSON.stringify({versionId:b.dataset.v15Restore,expectedPublishedRevision:publishedRevision})});publishedRevision=result.revision;statusToolbar();context.notify('Máy chủ đã khôi phục nội dung công khai.');layer.remove();}catch(error){context.notify(error.message);b.disabled=false;}});
    }catch(error){layer.querySelector('.modal-card p').textContent=error.message;}
  }
  function inboxShell(){return '<div class="admin-heading"><div><div class="eyebrow">MINH ĐỨC / HỒ SƠ THỬ NGHIỆM</div><h1>Hồ sơ & yêu cầu</h1><p class="muted">Dữ liệu giả đã lưu từ biểu mẫu. Chưa gửi telesales hoặc Google Sheets.</p></div></div><section id="v15Inbox" class="admin-card"><p role="status">Đang đọc hộp thư máy chủ…</p></section>';}
  async function loadInbox(){const box=qs('#v15Inbox');if(!box||box.dataset.loaded)return;box.dataset.loaded='1';try{const {items}=await api('/api/admin/intakes');box.innerHTML=`<div class="v15-inbox-title"><h2>${items.length} lượt tiếp nhận</h2><button type="button" class="btn light sm" data-v15-reload-inbox>Làm mới</button></div><p class="notice">CV nằm trong kho riêng tư, chỉ tải dưới dạng tệp đính kèm. Chưa có tích hợp quét mã độc; chỉ dùng tệp mẫu trong bản này.</p><div class="v15-inbox-list">${items.map(item=>`<article><div class="v15-inbox-meta"><span class="pill">${item.kind==='application'?'Ứng viên thử':'Doanh nghiệp thử'}</span><time>${new Date(item.created_at).toLocaleString('vi-VN')}</time></div><h3>${escape(item.payload.name)}</h3><p>${escape(item.payload.phone)}${item.payload.company?' · '+escape(item.payload.company):''}</p><p>${escape(item.payload.jobTitle||item.payload.message||'')}</p><small>${escape(item.id)}</small>${item.cv_name?`<a class="link" href="/api/admin/cv/${encodeURIComponent(item.id)}">Tải CV mẫu · ${escape(item.cv_name)} (${Math.ceil(item.cv_size/1024)} KB)</a>`:''}</article>`).join('')||'<p>Chưa có dữ liệu thử. Gửi thử từ trang việc làm hoặc liên hệ để kiểm tra.</p>'}</div>`;}catch(error){box.innerHTML=`<p role="alert">${escape(error.message)}</p><button type="button" class="btn light" data-v15-reload-inbox>Thử lại</button>`;}}
  async function boot(ctx){
    if(booted)return;booted=true;apiObject.connected=true;context=ctx;
    document.addEventListener('click',event=>{if(context.page!=='admin'||saveState!=='loading')return;const target=event.target.closest('button,label,a');if(target&&!target.matches('[data-admin],a')){event.preventDefault();event.stopImmediatePropagation();}},true);
    document.addEventListener('submit',submitForm,true);
    window.addEventListener('beforeunload',event=>{if(context.page==='admin'&&['pending','error'].includes(saveState)){event.preventDefault();event.returnValue='';}});
    document.addEventListener('click',async e=>{
      if(e.target.closest('[data-v15-retry-save]')){saveDraft(context.getData());return;}
      if(e.target.closest('[data-v15-refresh]')){if(!confirm('Tải bản nháp máy chủ thay nội dung đang mở? Hãy xuất bản sao JSON trước nếu cần giữ thay đổi chưa lưu.'))return;try{const result=await api('/api/admin/content');revision=result.revision;publishedRevision=result.publishedRevision;context.setData(result.data);saveState='saved';lastError='';context.renderAdmin();}catch(error){context.notify(error.message);}return;}
      if(e.target.closest('[data-v15-history]')){historyDialog();return;}
      if(e.target.closest('[data-v15-reload-inbox]')){const box=qs('#v15Inbox');if(box)delete box.dataset.loaded;loadInbox();return;}
      const publish=e.target.closest('[data-v15-publish]');if(publish){if(saveState!=='saved'||saving)return;publish.disabled=true;try{const result=await api('/api/admin/publish',{method:'POST',body:JSON.stringify({expectedRevision:revision,expectedPublishedRevision:publishedRevision})});publishedRevision=result.revision;context.notify('Máy chủ đã xuất bản bản nháp #'+revision+'.');}catch(error){context.notify(error.message);}finally{statusToolbar();}return;}
    });
    context.render();
    try{
      const preview=new URLSearchParams(location.search).get('preview')==='1';
      let result;if(ctx.page==='admin'||preview){try{result=await api('/api/admin/content');}catch(error){if(ctx.page==='admin')throw error;result=await api('/api/content');}}else result=await api('/api/content');
      if(ctx.page==='admin'){revision=result.revision;publishedRevision=result.publishedRevision;saveState='saved';committed=JSON.stringify(result.data);}
      if(JSON.stringify(context.getData())!==JSON.stringify(result.data)||ctx.page==='admin'){context.setData(result.data);context.render();}
      statusToolbar();preparePublic();
    }catch(error){if(ctx.page==='admin'){saveState='error';lastError=error.message;statusToolbar();}else context.notify(L('fallback'));}
  }
  const apiObject={connected:false,boot,saveDraft,enhancePublic:preparePublic,enhanceCms(root){statusToolbar(root);loadInbox();},inboxShell,shouldSuppressNotice(message){return context?.page==='admin'&&['pending','loading'].includes(saveState)&&/^Đã (lưu|cập nhật|nhập|khôi phục|thêm|tải|tạo)/.test(message);}};
  return apiObject;
})();
