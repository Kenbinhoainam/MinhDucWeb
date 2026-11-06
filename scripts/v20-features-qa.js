function contactToggle(d){return [...d.querySelectorAll('[data-social-toggle]')].find(visible);}
/* Local-only browser acceptance. Uses synthetic video, never user files. */
const featureButton=document.createElement('button');featureButton.id='features';featureButton.textContent='Run V20 contact and video cases';document.querySelector('#status').before(featureButton);
async function until(predicate,label,timeout=14000){const start=performance.now();while(!predicate()){if(performance.now()-start>timeout)throw Error('Timed out: '+label);await new Promise(resolve=>setTimeout(resolve,40));}}
function changeInput(d,selector,value){const el=must(d,selector);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));return el;}
async function syntheticVideo(){
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;const ctx=canvas.getContext('2d'),stream=canvas.captureStream(12),recorder=new MediaRecorder(stream,{mimeType:'video/webm'}),chunks=[];
  const blob=new Promise(resolve=>{recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>resolve(new Blob(chunks,{type:'video/webm'}));});
  recorder.start();for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#1555b6':'#102b50';ctx.fillRect(0,0,320,180);ctx.fillStyle='#fff';ctx.font='24px sans-serif';ctx.fillText('MINH DUC / QA',50,95);await new Promise(resolve=>setTimeout(resolve,90));}recorder.stop();stream.getTracks().forEach(track=>track.stop());return blob;
}
async function sendFile(d,blob,name,type='video/webm'){
  const input=must(d,'[data-video-file]'),transfer=new frame.contentWindow.DataTransfer();transfer.items.add(new frame.contentWindow.File([blob],name,{type}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));await until(()=>!d.querySelector('[data-video-editor]')?.dataset.busy,'video upload');return must(d,'[data-video-status]').textContent;
}
async function features(results){
  let d=await load('index.html',390),data=frame.contentWindow.MD15.getData();data.social={enabled:true,zalo:'',messenger:'',hotline:''};localStorage.setItem(key,JSON.stringify(data));
  for(const width of [320,390,768,1440])for(const lang of locales){
    d=await load('index.html',width,lang);contactToggle(d).click();await settle(d);const panel=must(d,'.md-social-panel'),r=panel.getBoundingClientRect(),toggle=contactToggle(d).getBoundingClientRect();
    record(results,'social geometry / '+width+' / '+lang,!panel.hidden&&r.left>=0&&r.right<=d.documentElement.clientWidth+1&&r.top>=0&&toggle.height>=44&&toggle.width>=44&&panel.querySelectorAll('.is-pending').length===3,{left:r.left,right:r.right,top:r.top,viewport:d.documentElement.clientWidth,pending:panel.querySelectorAll('.is-pending').length});
    must(d,'[data-social-close]').dispatchEvent(new frame.contentWindow.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));record(results,'social keyboard / '+width+' / '+lang,panel.hidden&&d.activeElement===contactToggle(d),{hidden:panel.hidden,focus:d.activeElement?.getAttribute('data-social-toggle')});
  }
  d=await load('cms-demo.html',390);must(d,'[data-admin=settings]').click();await settle(d);
  record(results,'CMS settings mobile reflow',d.documentElement.scrollWidth<=d.documentElement.clientWidth+1&&!!d.querySelector('#socialSettingsForm'),inspect(d));
  changeInput(d,'#social-hotline','090 123 4567');changeInput(d,'#social-zalo','https://zalo.me/minhduc-qa');changeInput(d,'#social-messenger','https://m.me/minhduc-qa');must(d,'#socialSettingsForm').requestSubmit();
  record(results,'CMS social saved',JSON.parse(localStorage.getItem(key)).social.hotline==='090 123 4567',{status:must(d,'[data-social-status]').textContent});
  changeInput(d,'#social-zalo','https://zalo.me.evil.example/123');must(d,'#socialSettingsForm').requestSubmit();record(results,'CMS social rejects unrelated destination',JSON.parse(localStorage.getItem(key)).social.zalo==='https://zalo.me/minhduc-qa',{error:must(d,'#social-zalo').validationMessage});
  d=await load('index.html',390);contactToggle(d).click();record(results,'public configured links',must(d,'.md-social-panel a[href^="tel:"]').getAttribute('href')==='tel:0901234567'&&d.querySelectorAll('.md-social-channel[href]').length===3,{links:[...d.querySelectorAll('.md-social-channel[href]')].map(a=>a.getAttribute('href'))});
  const disabled=JSON.parse(localStorage.getItem(key));disabled.social.enabled=false;localStorage.setItem(key,JSON.stringify(disabled));d=await load('index.html',390);record(results,'disabled widget omitted',!d.querySelector('.md-social'),{});
  localStorage.setItem(key,JSON.stringify(data));d=await load('cms-demo.html',390);must(d,'[data-admin=home]').click();must(d,'[data-video-editor]').closest('details').open=true;await settle(d);
  record(results,'CMS upload mobile reflow',d.documentElement.scrollWidth<=d.documentElement.clientWidth+1&&visible(must(d,'[data-video-file]')),{width:d.documentElement.scrollWidth,viewport:d.documentElement.clientWidth});
  const invalid=await sendFile(d,'not a movie','bad.txt','text/plain');record(results,'reject nonvideo upload',/MP4/.test(invalid)&&!JSON.parse(localStorage.getItem(key)).home.videoUrl,{message:invalid});
  const corrupt=await sendFile(d,'not a movie','bad.mp4','video/mp4');record(results,'reject corrupt MP4',/Không đọc/.test(corrupt),{message:corrupt});
  const blob=await syntheticVideo(),message=await sendFile(d,blob,'minhduc-synthetic-qa.webm'),reference=JSON.parse(localStorage.getItem(key)).home.videoUrl;
  record(results,'save valid upload and preview',/^md-video:/.test(reference)&&!!d.querySelector('[data-video-preview] video')&&/Đã tải/.test(message),{message,size:blob.size,reference});
  if(!/^md-video:/.test(reference))throw Error('Video upload did not persist');
  try{
    d=await reload();must(d,'[data-admin=home]').click();must(d,'[data-video-editor]').closest('details').open=true;await until(()=>d.querySelector('[data-video-preview] video'),'saved preview after reload');record(results,'video survives CMS reload',must(d,'[data-video-value]').value===reference,{label:must(d,'[data-video-current-label]').textContent});
    d=await load('index.html',390);record(results,'uploaded video section becomes visible',!!d.querySelector('#video [data-video]'),{source:d.querySelector('#video [data-video]')?.dataset.video});must(d,'#video [data-video]').click();await until(()=>d.querySelector('.md-video-player video')?.readyState>=1,'public video metadata');record(results,'public player decodes saved video',must(d,'.md-video-player video').videoWidth===320&&must(d,'.md-video-player video').controls,{width:must(d,'.md-video-player video').videoWidth,controls:true});must(d,'.modal-close').click();await settle(d);record(results,'video dialog closes cleanly',!d.querySelector('.modal-layer')&&!d.querySelector('#app').inert,{});
    d=await load('cms-demo.html',390);must(d,'[data-admin=home]').click();must(d,'[data-video-editor]').closest('details').open=true;must(d,'[data-video-remove]').click();await settle(d);must(d,'#homeEditForm').requestSubmit();record(results,'remove and save never resurrects video',JSON.parse(localStorage.getItem(key)).home.videoUrl==='',{});
    changeInput(d,'[data-video-url]','https://cdn.example/video.mp4');must(d,'[data-video-link]').click();await settle(d);record(results,'apply remote video source',JSON.parse(localStorage.getItem(key)).home.videoUrl==='https://cdn.example/video.mp4',{});
    changeInput(d,'[data-video-url]','https://evil.example/youtube.com/watch?v=dQw4w9WgXcQ');must(d,'[data-video-link]').click();await settle(d);record(results,'invalid remote video preserves saved source',JSON.parse(localStorage.getItem(key)).home.videoUrl==='https://cdn.example/video.mp4',{message:must(d,'[data-video-status]').textContent});
    const missing=JSON.parse(localStorage.getItem(key));missing.home.videoUrl='md-video:missing-v20-qa';localStorage.setItem(key,JSON.stringify(missing));d=await load('index.html',390,'en');must(d,'#video [data-video]').click();await until(()=>d.querySelector('.md-video-player')?.textContent.includes('not available'),'missing video message');record(results,'missing local video has localized recovery',/Upload it again/.test(must(d,'.md-video-player').textContent),{message:must(d,'.md-video-player').textContent});must(d,'.modal-close').click();
    d=await load('cms-demo.html',390);must(d,'[data-admin=posts]').click();must(d,'[data-edit-post]').click();await settle(d);record(results,'article supports same upload control',!!d.querySelector('[data-video-editor^="post:"] [data-video-file]')&&d.documentElement.scrollWidth<=d.documentElement.clientWidth+1,{width:d.documentElement.scrollWidth,viewport:d.documentElement.clientWidth});
  }finally{
    // Delete only the synthetic record created by this run; never touch user media.
    const db=await new Promise((resolve,reject)=>{const q=indexedDB.open('md_prototype_media_v20',1);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});await new Promise(resolve=>{const tx=db.transaction('videos','readwrite');tx.objectStore('videos').delete(reference.slice(9));tx.oncomplete=resolve;});db.close();
  }
}
featureButton.onclick=()=>run('features',features);
