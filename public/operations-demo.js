/* V25 operations prototype. Fictional catalog only; no form interception or network transport. */
(() => {
  'use strict';
  const KEY = 'md_ops_v24';
  const clone = value => JSON.parse(JSON.stringify(value));
  const E = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {
    candidates: 'Hồ sơ ứng viên', leads: 'Pipeline FDI', parks: 'Danh mục KCN', notifications: 'Thông báo demo', training: 'Hướng dẫn vận hành',
    new: 'Mới tiếp nhận', screening: 'Đang sàng lọc', interview: 'Hẹn phỏng vấn', placed: 'Đã nhận việc', closed: 'Đã đóng',
    qualified: 'Đã xác định nhu cầu', proposal: 'Đã gửi đề xuất', won: 'Đã chốt', lost: 'Tạm dừng',
    active: 'Đang hoạt động', planning: 'Đang chuẩn bị', archived: 'Lưu trữ',
    queued: 'Chờ mô phỏng', failed: 'Mô phỏng lỗi', simulated: 'Hoàn tất mô phỏng',
    normal: 'Thông thường', high: 'Ưu tiên cao', teamA: 'Nhóm Tuyển dụng A · mẫu', teamB: 'Nhóm Doanh nghiệp B · mẫu',
    north: 'Khu vực Bắc · mẫu', central: 'Khu vực Trung · mẫu', south: 'Khu vực Nam · mẫu',
    electronics: 'Điện tử · mẫu', logistics: 'Kho vận · mẫu', mixed: 'Đa ngành · mẫu',
    checked: 'Đã rà soát hồ sơ mẫu; cần xác nhận điều kiện làm việc.',
    followup: 'Lên lịch trao đổi tiếp theo trong buổi diễn tập.',
    confirmed: 'Đã xác nhận nhu cầu và đầu mối giả lập.',
    handoff: 'Bàn giao cho nhóm phụ trách trong buổi diễn tập.',
    blocked: 'Đang chờ bổ sung thông tin mẫu.',
    created: 'Tạo bản ghi mẫu', updated: 'Cập nhật thông tin mẫu', status: 'Đổi trạng thái', note: 'Thêm ghi chú mẫu',
    enqueued: 'Đưa vào hàng đợi demo', success: 'Mô phỏng thành công · không gửi ra ngoài', failure: 'Mô phỏng lỗi kênh · có thể thử lại',
    reset: 'Khởi tạo dữ liệu mẫu',
  };
  const candidateStages = ['new','screening','interview','placed','closed'];
  const leadStages = ['new','qualified','proposal','won','lost'];
  const parkStages = ['active','planning','archived'];
  const noteCodes = ['checked','followup','confirmed','handoff','blocked'];
  const owners = ['teamA','teamB'];
  const channels = ['zalo','telegram'];
  const targets = ['recruitment-demo','business-demo','operations-demo'];
  const parkCatalog = [
    {id:'P-001',name:'KCN Mẫu Hoa Sao',region:'north',sector:'electronics'},
    {id:'P-002',name:'KCN Mẫu Mây Xanh',region:'central',sector:'logistics'},
    {id:'P-003',name:'KCN Mẫu Vườn Nắng',region:'south',sector:'mixed'},
    {id:'P-004',name:'KCN Mẫu Đồi Gió',region:'north',sector:'mixed'},
    {id:'P-005',name:'KCN Mẫu Sông Ánh',region:'south',sector:'electronics'},
    {id:'P-006',name:'KCN Mẫu Trăng Non',region:'central',sector:'logistics'},
  ];
  const candidateCatalog = [
    {id:'C-001',name:'Ứng viên Mẫu 01',job:'Lắp ráp điện tử · mẫu',shift:'Ca ngày',cv:'Không yêu cầu CV',parkId:'P-001'},
    {id:'C-002',name:'Ứng viên Mẫu 02',job:'Kỹ thuật bảo trì · mẫu',shift:'Linh hoạt',cv:'CV giả lập · chỉ có bản tóm tắt',parkId:'P-002'},
    {id:'C-003',name:'Ứng viên Mẫu 03',job:'Kiểm tra chất lượng · mẫu',shift:'Ca ngày',cv:'Không yêu cầu CV',parkId:'P-001'},
    {id:'C-004',name:'Ứng viên Mẫu 04',job:'Kho vận · mẫu',shift:'Ca đêm',cv:'Không yêu cầu CV',parkId:'P-002'},
    {id:'C-005',name:'Ứng viên Mẫu 05',job:'Đóng gói · mẫu',shift:'Ca ngày',cv:'Không yêu cầu CV',parkId:'P-001'},
  ];
  const leadCatalog = [
    {id:'L-001',name:'FDI Mẫu Sao Bắc',sector:'electronics',locale:'VI / EN',parkId:'P-001',headcount:120},
    {id:'L-002',name:'FDI Mẫu Ánh Dương',sector:'logistics',locale:'VI / KO',parkId:'P-002',headcount:60},
    {id:'L-003',name:'FDI Mẫu Hạt Mầm',sector:'mixed',locale:'VI / ZH',parkId:'P-001',headcount:200},
    {id:'L-004',name:'FDI Mẫu Cánh Buồm',sector:'electronics',locale:'VI / EN',parkId:'P-002',headcount:80},
  ];
  const trainingSteps = [
    ['candidates','1. Tiếp nhận hồ sơ mẫu','Mở C-001, chọn người phụ trách, đổi sang Đang sàng lọc và thêm ghi chú mẫu. Không nhập tên, số điện thoại hoặc CV thật.'],
    ['leads','2. Xử lý nhu cầu FDI','Mở L-001, điều chỉnh số lượng, gán KCN và chuyển sang Đã xác định nhu cầu. Các thẻ phía trên lọc từng giai đoạn pipeline.'],
    ['parks','3. Quản lý KCN','Tạo KCN từ danh mục hư cấu, sửa công suất/trạng thái. KCN đang gắn hồ sơ hoặc lead không được xóa; có thể lưu trữ.'],
    ['notifications','4. Diễn tập thông báo lỗi','Trong cấu hình, chọn kênh, bật kênh và chọn Mô phỏng lỗi. Xử lý một thông báo chờ; xem lịch sử lần thử.'],
    ['notifications','5. Thử lại và bàn giao','Đổi kết quả kênh sang Thành công rồi thử lại thông báo lỗi. Tối đa 3 lần thử; hoàn tất chỉ là mô phỏng, không có tin nhắn thật.'],
    ['training','6. Kết thúc buổi hướng dẫn','Đánh dấu các bước đã diễn tập. Có thể đặt lại riêng dữ liệu vận hành; nội dung CMS, media và biểu mẫu công khai giữ nguyên.'],
  ];
  function ensure(ok, message = 'Dữ liệu mẫu không hợp lệ.') { if (!ok) throw Error(message); }
  function one(value, allowed) { ensure(allowed.includes(value)); return value; }
  function integer(value, min, max) { ensure(Number.isSafeInteger(value) && value >= min && value <= max); return value; }
  const timestamp = value => integer(value, 0, 8640000000000000);
  function fresh() {
    const record = (item, owner) => ({...item,status:'new',owner,notes:[],history:[]});
    return {
      version:24, sequence:2,
      candidates:candidateCatalog.slice(0,3).map(c => record(c,'teamA')),
      leads:leadCatalog.slice(0,2).map(c => ({...record(c,'teamB'),priority:'normal'})),
      parks:parkCatalog.slice(0,2).map(p => ({...p,status:'active',capacity:500,notes:[],history:[]})),
      config:{zalo:{enabled:true,target:'recruitment-demo',outcome:'failure'},telegram:{enabled:true,target:'operations-demo',outcome:'success'}},
      outbox:channels.map((channel,i) => ({id:'N-00'+(i+1),channel,kind:'candidates',recordId:'C-001',event:'created',stage:'new',status:'queued',attempts:0,history:[],createdAt:0})),
      training:[],
    };
  }
  const recordCatalog = kind => kind==='candidates'?candidateCatalog:kind==='leads'?leadCatalog:parkCatalog;
  const stageList = kind => kind==='candidates'?candidateStages:kind==='leads'?leadStages:parkStages;
  const eventValues = [...candidateStages,...leadStages,...parkStages,...noteCodes,''];
  function cleanHistory(items) {
    ensure(Array.isArray(items) && items.length<=100);
    return items.map(h => ({at:timestamp(h.at),code:one(h.code,['created','updated','status','note','enqueued','success','failure']),value:one(h.value,eventValues)}));
  }
  // Reconstruct from finite catalogs. Unknown properties (including contact fields) never enter state.
  function sanitize(raw) {
    ensure(raw && raw.version===24); const clean=fresh();
    clean.sequence=integer(raw.sequence,2,1000000);
    for (const kind of ['candidates','leads','parks']) {
      ensure(Array.isArray(raw[kind]) && raw[kind].length<=recordCatalog(kind).length);
      const ids=new Set();
      clean[kind]=raw[kind].map(row => {
        const base=recordCatalog(kind).find(r=>r.id===row.id); ensure(base && !ids.has(row.id));ids.add(row.id);
        ensure(Array.isArray(row.notes) && row.notes.length<=50);
        const item={...base,status:one(row.status,stageList(kind)),notes:row.notes.map(n=>({code:one(n.code,noteCodes),at:timestamp(n.at)})),history:cleanHistory(row.history)};
        if(kind==='parks') {item.capacity=integer(row.capacity,1,100000);item.region=one(row.region,['north','central','south']);item.sector=one(row.sector,['electronics','logistics','mixed']);}
        else {item.owner=one(row.owner,owners);item.parkId=one(row.parkId,raw.parks.map(p=>p.id));}
        if(kind==='leads') {item.headcount=integer(row.headcount,1,10000);item.priority=one(row.priority,['normal','high']);}
        return item;
      });
    }
    for(const channel of channels) {
      const cfg=raw.config?.[channel];ensure(cfg && typeof cfg.enabled==='boolean');
      clean.config[channel]={enabled:cfg.enabled,target:one(cfg.target,targets),outcome:one(cfg.outcome,['success','failure'])};
    }
    ensure(Array.isArray(raw.outbox) && raw.outbox.length<=200);const seen=new Set();
    clean.outbox=raw.outbox.map(n=>{
      ensure(/^N-\d{3,7}$/.test(n.id) && !seen.has(n.id) && Number(n.id.slice(2))<=clean.sequence);seen.add(n.id);
      const kind=one(n.kind,['candidates','leads']);one(n.recordId,recordCatalog(kind).map(r=>r.id));
      const item={id:n.id,channel:one(n.channel,channels),kind,recordId:n.recordId,event:one(n.event,['created','status']),stage:one(n.stage,stageList(kind)),status:one(n.status,['queued','failed','simulated']),attempts:integer(n.attempts,0,3),createdAt:timestamp(n.createdAt),history:cleanHistory(n.history)};
      ensure(item.history.length===item.attempts && item.history.every(h=>['success','failure'].includes(h.code)));
      ensure((item.status==='queued' && item.attempts===0) || (item.status==='failed' && item.attempts>0 && item.history.at(-1).code==='failure') || (item.status==='simulated' && item.attempts>0 && item.history.at(-1).code==='success'));
      return item;
    });
    ensure(Array.isArray(raw.training) && raw.training.length<=trainingSteps.length);
    clean.training=[...new Set(raw.training.map(i=>integer(i,0,trainingSteps.length-1)))];
    return clean;
  }
  function createModel(storage, clock = () => Date.now()) {
    let state=fresh(),warning='',baseline=null;
    try {baseline=storage.getItem(KEY);if(baseline){ensure(baseline.length<=300000);state=sanitize(JSON.parse(baseline));}}
    catch {warning='Không đọc được dữ liệu vận hành đã lưu. Đang dùng bộ mẫu; hãy đặt lại nếu cần.';}
    const history = (row,code,value='') => {row.history.push({at:clock(),code,value});row.history=row.history.slice(-100);};
    function commit(next) {
      let current;try{current=storage.getItem(KEY);}catch{throw Error('Không đọc được kho vận hành. Kiểm tra quyền lưu của trình duyệt.');}
      ensure(current===baseline,'Dữ liệu đã thay đổi ở tab khác. Tải lại trang trước khi lưu để tránh ghi đè.');
      const encoded=JSON.stringify(next);try{storage.setItem(KEY,encoded);}catch{throw Error('Chưa lưu được dữ liệu vận hành. Kiểm tra dung lượng/quyền lưu của trình duyệt rồi thử lại.');}
      baseline=encoded;state=next;warning='';return clone(state);
    }
    const change = fn => {const draft=clone(state);fn(draft);return commit(sanitize(draft));};
    function find(d,kind,id) {one(kind,['candidates','leads','parks']);const row=d[kind].find(r=>r.id===id);ensure(row,'Không tìm thấy bản ghi mẫu.');return row;}
    function enqueue(d,kind,row,event) {
      ensure(d.outbox.length<=198,'Hàng đợi demo đầy (200). Đặt lại dữ liệu để diễn tập tiếp.');
      for(const channel of channels) d.outbox.push({id:'N-'+String(++d.sequence).padStart(3,'0'),channel,kind,recordId:row.id,event,stage:row.status,status:'queued',attempts:0,createdAt:clock(),history:[]});
    }
    return {
      snapshot:()=>clone(state), warning:()=>warning,
      list(kind,query='',status='') {one(kind,['candidates','leads','parks','outbox']);ensure(typeof query==='string' && query.length<=100);const q=query.trim().toLocaleLowerCase('vi');return clone(state[kind].filter(r=>(!status||r.status===status)&&(!q||[r.id,r.name,r.job,r.recordId,r.channel,labels[r.status]].filter(Boolean).join(' ').toLocaleLowerCase('vi').includes(q))));},
      create(kind,id,fields={}) {return change(d=>{one(kind,['candidates','leads','parks']);const base=recordCatalog(kind).find(r=>r.id===id);ensure(base && !d[kind].some(r=>r.id===id),'Chọn bản ghi mẫu chưa có trong danh sách.');const row={...base,status:kind==='parks'?'planning':'new',notes:[],history:[]};if(kind==='parks') {row.capacity=fields.capacity??500;row.region=fields.region??base.region;row.sector=fields.sector??base.sector;row.status=fields.status??'planning';}else {row.owner=kind==='candidates'?'teamA':'teamB';ensure(d.parks.some(p=>p.id===base.parkId),'Hãy tạo lại KCN mặc định của bản ghi mẫu trước.');if(kind==='leads')row.priority='normal';}d[kind].push(row);history(row,'created');if(kind!=='parks')enqueue(d,kind,row,'created');});},
      update(kind,id,fields) {return change(d=>{const row=find(d,kind,id),before=row.status;
        const allowed=kind==='parks'?['capacity','region','sector','status']:kind==='leads'?['status','owner','parkId','headcount','priority']:['status','owner','parkId'];
        ensure(Object.keys(fields).every(k=>allowed.includes(k)),'Chỉ hỗ trợ trường dữ liệu mẫu.');
        if(fields.parkId && fields.parkId!==row.parkId)ensure(d.parks.some(p=>p.id===fields.parkId && p.status==='active'),'Chỉ gán mới vào KCN đang hoạt động.');
        const changed=Object.entries(fields).some(([k,v])=>row[k]!==v);if(!changed)return;
        Object.assign(row,fields);history(row,before!==row.status?'status':'updated',before!==row.status?row.status:'');
        if(kind!=='parks' && before!==row.status)enqueue(d,kind,row,'status');
      });},
      note(kind,id,code) {one(code,noteCodes);return change(d=>{const row=find(d,kind,id);ensure(row.notes.length<50,'Đã đủ 50 ghi chú mẫu.');row.notes.push({code,at:clock()});history(row,'note',code);});},
      removePark(id) {return change(d=>{find(d,'parks',id);ensure(![...d.candidates,...d.leads].some(r=>r.parkId===id),'KCN đang gắn với hồ sơ/lead. Hãy chuyển liên kết hoặc lưu trữ KCN.');d.parks=d.parks.filter(p=>p.id!==id);});},
      configure(channel,fields) {one(channel,channels);ensure(Object.keys(fields).every(k=>['enabled','target','outcome'].includes(k)));return change(d=>{Object.assign(d.config[channel],fields);});},
      attempt(id) {return change(d=>{const row=d.outbox.find(n=>n.id===id);ensure(row,'Không tìm thấy thông báo.');ensure(row.status!=='simulated','Thông báo đã hoàn tất mô phỏng; không tạo lần thử trùng.');ensure(row.attempts<3,'Đã đạt giới hạn 3 lần thử.');const cfg=d.config[row.channel];ensure(cfg.enabled,'Kênh đang tắt. Bật trong cấu hình trước khi mô phỏng.');row.attempts++;const ok=cfg.outcome==='success';row.status=ok?'simulated':'failed';history(row,ok?'success':'failure');});},
      train(index,complete) {integer(index,0,trainingSteps.length-1);ensure(typeof complete==='boolean');return change(d=>{d.training=d.training.filter(i=>i!==index);if(complete)d.training.push(index);});},
      reset() {return commit(fresh());},
    };
  }
  const api={key:KEY,createModel,catalog:clone({candidates:candidateCatalog,leads:leadCatalog,parks:parkCatalog}),labels:clone(labels)};
  window.MDOpsV24=api;
  // Never attach to protected CMS or public forms. This module belongs to the local CMS demo only.
  if(typeof document==='undefined')return;
  function boot() {
    if(!/\/cms-demo(?:\.html)?\/?$/.test(location.pathname) || document.body.dataset.page!=='admin' || window.__mdOpsMounted)return;
    window.__mdOpsMounted=true;
    let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
    const model=createModel(storage);api.model=model;
    let active=null,detail=null,query='',filter='',message=model.warning(),error=false,confirmAction=null,trainingIndex=0;
    const tabKeys=['candidates','leads','parks','notifications','training'];
    const button=(action,text,extra='')=>`<button type="button" data-ops-action="${E(action)}" ${extra}>${E(text)}</button>`;
    const option=(value,text,selected)=>`<option value="${E(value)}" ${selected===value?'selected':''}>${E(text)}</option>`;
    const select=(name,title,items,value)=>`<label>${E(title)}<select name="${E(name)}">${items.map(x=>option(Array.isArray(x)?x[0]:x,Array.isArray(x)?x[1]:labels[x]||x,value)).join('')}</select></label>`;
    const when=value=>value?new Date(value).toLocaleString('vi-VN'):'Dữ liệu khởi tạo';
    const parkName=id=>model.snapshot().parks.find(p=>p.id===id)?.name||'KCN mẫu đã xóa';
    const badge=value=>`<span class="ops-badge ops-${E(value)}">${E(labels[value]||value)}</span>`;
    const timeline=items=>items.length?`<ol class="ops-history">${items.slice().reverse().map(h=>`<li><time>${E(when(h.at))}</time><span>${E(labels[h.code])}${h.value?' · '+E(labels[h.value]||h.value):''}</span></li>`).join('')}</ol>`:'<p>Chưa có thao tác. Hãy cập nhật bản ghi mẫu để bắt đầu.</p>';
    function available(kind) {const s=model.snapshot();return recordCatalog(kind).filter(c=>!s[kind].some(r=>r.id===c.id));}
    function filters(kind) {
      const states=kind==='outbox'?['queued','failed','simulated']:stageList(kind);
      return `<form data-ops-form="filter" class="ops-filters"><label>Tìm mã hoặc tên mẫu<input name="query" type="search" maxlength="100" value="${E(query)}" placeholder="Ví dụ: C-001"></label>${select('filter','Trạng thái',[['','Tất cả'],...states],filter)}<button type="submit">Lọc danh sách</button>${button('clear-filter','Xóa lọc')}</form>`;
    }
    function recordList(kind) {
      const s=model.snapshot(),rows=model.list(kind,query,filter),pool=available(kind);
      const pipeline=kind==='leads'?`<div class="ops-pipeline" aria-label="Các giai đoạn FDI">${leadStages.map(stage=>button('stage',`${labels[stage]} · ${s.leads.filter(r=>r.status===stage).length}`,`data-stage="${stage}" aria-pressed="${filter===stage}"`)).join('')}</div>`:'';
      return `${pipeline}${filters(kind)}<div class="ops-toolbar"><p>${rows.length} / ${s[kind].length} bản ghi hư cấu</p>${kind==='parks'?button('new-park','Thêm KCN mẫu'):pool.length?`<form data-ops-form="create">${select('id','Tiếp nhận bản ghi có sẵn',pool.map(r=>[r.id,r.name]),pool[0]?.id)}<button type="submit">Tạo lượt tiếp nhận mẫu</button></form>`:'<p>Đã tiếp nhận toàn bộ bộ mẫu. Đặt lại để diễn tập từ đầu.</p>'}</div>
        <div class="ops-records">${rows.map(r=>`<article class="ops-record"><div><small>${E(r.id)}</small><h2>${E(r.name)}</h2>${badge(r.status)}<p>${E(kind==='candidates'?r.job:kind==='leads'?labels[r.sector]+' · '+r.headcount+' nhân sự':labels[r.region]+' · Công suất '+r.capacity)}</p><p>${E(kind==='parks'?labels[r.sector]:parkName(r.parkId)+' · '+labels[r.owner])}</p></div>${button('detail','Mở '+r.id,`data-id="${E(r.id)}"`)}</article>`).join('')||'<p class="ops-empty">Không có kết quả phù hợp. Xóa bộ lọc để xem lại dữ liệu.</p>'}</div>`;
    }
    function recordDetail(kind,id) {
      const s=model.snapshot(),r=s[kind].find(item=>item.id===id);if(!r)return recordList(kind);
      const isPark=kind==='parks';
      const parkOptions=s.parks.filter(p=>p.status==='active'||p.id===r.parkId).map(p=>[p.id,p.name+(p.status!=='active'?' · '+labels[p.status]:'')]);
      return `${button('back','← Về danh sách')}<article class="ops-detail"><header><small>${E(r.id)} · HƯ CẤU</small><h2 tabindex="-1" data-ops-detail-heading>${E(r.name)}</h2>${badge(r.status)}</header>
        ${kind==='candidates'?`<dl><dt>Vị trí</dt><dd>${E(r.job)}</dd><dt>Ca làm</dt><dd>${E(r.shift)}</dd><dt>Hồ sơ</dt><dd>${E(r.cv)}. Không có tệp hoặc thông tin liên hệ thật.</dd><dt>Nguồn</dt><dd>Bộ dữ liệu huấn luyện có sẵn; độc lập với form công khai.</dd></dl>`:''}
        ${kind==='leads'?`<p>Nhu cầu ${E(labels[r.sector])} · ${E(r.locale)}. Không có đầu mối liên hệ thật.</p>`:''}
        <form data-ops-form="record" class="ops-form" data-id="${E(id)}">${select('status','Trạng thái',stageList(kind),r.status)}${!isPark?select('owner','Người phụ trách',owners,r.owner)+select('parkId','Khu công nghiệp',parkOptions,r.parkId):select('region','Khu vực mẫu',['north','central','south'],r.region)+select('sector','Ngành mẫu',['electronics','logistics','mixed'],r.sector)}
        ${isPark||kind==='leads'?`<label>${isPark?'Công suất nhân lực':'Số lượng cần tuyển'}<input type="number" name="${isPark?'capacity':'headcount'}" required min="1" max="${isPark?100000:10000}" step="1" value="${isPark?r.capacity:r.headcount}"></label>`:''}${kind==='leads'?select('priority','Mức ưu tiên',['normal','high'],r.priority):''}<button type="submit">Lưu thay đổi mẫu</button></form>
        ${isPark?button('delete-park','Xóa KCN mẫu',`data-id="${E(id)}" class="ops-danger"`):'<p class="ops-hint">Đổi trạng thái sẽ tạo 2 thông báo chờ mô phỏng (Zalo và Telegram). Ghi chú hoặc lưu lại cùng trạng thái không tạo trùng.</p>'}
        <section><h3>Ghi chú diễn tập</h3><form data-ops-form="note" data-id="${E(id)}">${select('code','Chọn nội dung hư cấu',noteCodes,r.notes.at(-1)?.code||'checked')}<button type="submit">Thêm ghi chú mẫu</button></form><ul>${r.notes.map(n=>`<li>${E(labels[n.code])} <small>${E(when(n.at))}</small></li>`).join('')||'<li>Chưa có ghi chú.</li>'}</ul></section><section><h3>Lịch sử xử lý</h3>${timeline(r.history)}</section></article>`;
    }
    function parkCreate() {
      const pool=available('parks');
      return `${button('back','← Về danh sách')}<h2 tabindex="-1" data-ops-detail-heading>Thêm KCN hư cấu</h2>${pool.length?`<form data-ops-form="park-create" class="ops-form">${select('id','Tên từ danh mục mẫu',pool.map(p=>[p.id,p.name]),pool[0].id)}${select('region','Khu vực',['north','central','south'],pool[0].region)}${select('sector','Ngành',['electronics','logistics','mixed'],pool[0].sector)}${select('status','Trạng thái',parkStages,'planning')}<label>Công suất nhân lực<input name="capacity" type="number" min="1" max="100000" step="1" required value="500"></label><button type="submit">Tạo KCN mẫu</button></form>`:'<p>Đã có toàn bộ 6 KCN hư cấu. Xóa một KCN chưa liên kết hoặc đặt lại dữ liệu.</p>'}`;
    }
    function notifications() {
      const s=model.snapshot();
      if(detail) {const n=s.outbox.find(r=>r.id===detail);if(n)return `${button('back','← Về hàng đợi')}<h2 tabindex="-1" data-ops-detail-heading>${E(n.id)} · ${E(n.channel==='zalo'?'Zalo OA':'Telegram')}</h2>${badge(n.status)}<p>Nội dung xem trước: [DEMO] ${E(n.recordId)} · ${E(labels[n.event])} · ${E(labels[n.stage])}. Không chứa thông tin liên hệ/CV.</p><p>Đích mô phỏng hiện tại: ${E(s.config[n.channel].target)} · ${n.attempts}/3 lần thử.</p>${attemptButton(n)}<h3>Lịch sử từng lần thử</h3>${timeline(n.history)}<p>Không gọi API hoặc webhook. Alias nhận tin chỉ để diễn tập, không phải địa chỉ nhận thật.</p>`;}
      return `<details class="ops-config" open><summary>Cấu hình kênh · chỉ mô phỏng, không nhập token</summary><div class="ops-config-grid">${channels.map(channel=>{const c=s.config[channel];return `<form data-ops-form="config" data-channel="${channel}" class="ops-form"><h2>${channel==='zalo'?'Zalo OA':'Telegram'}</h2><label class="ops-check"><input type="checkbox" name="enabled" ${c.enabled?'checked':''}> Bật kênh giả lập</label>${select('target','Nhóm nhận giả lập',targets.map(t=>[t,t]),c.target)}${select('outcome','Kết quả lần thử',['success','failure'].map(code=>[code,code==='success'?'Thành công mô phỏng':'Mô phỏng lỗi']),c.outcome)}<button type="submit">Lưu cấu hình ${channel==='zalo'?'Zalo':'Telegram'}</button></form>`;}).join('')}</div></details>${filters('outbox')}<p>${s.outbox.filter(n=>n.status==='queued').length} chờ · ${s.outbox.filter(n=>n.status==='failed').length} lỗi · ${s.outbox.filter(n=>n.status==='simulated').length} hoàn tất mô phỏng. Mỗi thông báo tối đa 3 lần thử thủ công.</p><div class="ops-records">${model.list('outbox',query,filter).slice().reverse().map(n=>`<article class="ops-record"><div><small>${E(n.id)} · ${E(n.channel==='zalo'?'Zalo OA':'Telegram')}</small><h2>${E(n.recordId)} · ${E(labels[n.event])}</h2>${badge(n.status)}<p>${E(labels[n.stage])} · ${n.attempts}/3 lần thử</p></div><div class="ops-actions">${button('detail','Chi tiết '+n.id,`data-id="${E(n.id)}"`)}${attemptButton(n)}</div></article>`).join('')||'<p class="ops-empty">Không có thông báo phù hợp.</p>'}</div>`;
    }
    function attemptButton(n) {return n.status==='simulated'?'<p>Không gửi thật · Đã hoàn tất</p>':n.attempts>=3?'<p>Đã đủ 3 lần thử · Đặt lại để diễn tập lại</p>':button('attempt',n.status==='failed'?'Thử lại '+n.id:'Mô phỏng '+n.id,`data-id="${E(n.id)}" ${!model.snapshot().config[n.channel].enabled?'disabled':''}`)+(!model.snapshot().config[n.channel].enabled?'<small>Kênh đang tắt; bật trong cấu hình.</small>':'');}
    function training() {
      const s=model.snapshot(),step=trainingSteps[trainingIndex];
      return `<p>Checklist ${s.training.length}/${trainingSteps.length} bước đã đánh dấu. Người hướng dẫn tự xác nhận sau khi diễn tập.</p><ol class="ops-training">${trainingSteps.map((t,i)=>`<li>${button('training-step',`${s.training.includes(i)?'✓ ':''}${t[1]}`,`data-step="${i}" aria-current="${i===trainingIndex?'step':'false'}"`)}</li>`).join('')}</ol><article class="ops-detail"><h2>${E(step[1])}</h2><p>${E(step[2])}</p><div class="ops-actions">${button('training-open','Mở màn hình diễn tập',`data-tab="${step[0]}"`)}${button('training-complete',s.training.includes(trainingIndex)?'Bỏ đánh dấu bước này':'Đánh dấu đã diễn tập')}</div></article><p>Phạm vi: danh sách, chi tiết, phân công, trạng thái, ghi chú, KCN và lịch sử thông báo trên trình duyệt. Đào tạo vận hành thật, phân quyền và kết nối API cần được hoàn thiện riêng.</p>`;
    }
    function render(focus=false) {
      const host=document.querySelector('#adminContent');if(!host||!active)return;
      const content=active==='notifications'?notifications():active==='training'?training():detail==='new'?parkCreate():detail?recordDetail(active,detail):recordList(active);
      host.innerHTML=`<section class="md-ops" data-ops-root lang="vi"><header class="ops-header"><div><small>MINH ĐỨC · V25 · VẬN HÀNH MẪU</small><h1 tabindex="-1" data-ops-heading>${E(labels[active])}</h1><p>Dữ liệu hư cấu · Lưu riêng trên trình duyệt · Không gửi tin thật</p></div>${button('reset','Đặt lại vận hành')}</header><div class="ops-notice">Bộ mẫu độc lập với nội dung CMS và form công khai. Chỉ chọn bản ghi/ghi chú mẫu; không nhập thông tin cá nhân hoặc khóa API.</div><p class="ops-message" data-ops-message tabindex="-1" role="${error?'alert':'status'}" aria-live="polite">${E(message)}</p>${confirmAction?`<div class="ops-confirm" role="group" aria-label="Xác nhận thao tác"><p>${confirmAction==='reset'?'Đặt lại toàn bộ hồ sơ, lead, KCN, cấu hình, hàng đợi và checklist vận hành về mẫu ban đầu?':'Xóa KCN chưa liên kết này khỏi danh mục mẫu?'}</p>${button('confirm','Xác nhận', 'data-ops-confirm')}${button('cancel','Hủy')}</div>`:''}<div data-ops-content>${content}</div></section>`;
      updateNav();
      if(focus)(host.querySelector(confirmAction?'[data-ops-confirm]':detail?'[data-ops-detail-heading]':'[data-ops-heading]')||host.querySelector('[data-ops-heading]'))?.focus();
    }
    function updateNav() {
      document.querySelectorAll('[data-ops-tab]').forEach(b=>{const on=b.dataset.opsTab===active;b.classList.toggle('selected',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
      if(active)document.querySelectorAll('.admin-nav [data-admin]').forEach(b=>{b.classList.remove('selected');b.removeAttribute('aria-current');});
      const chooser=document.querySelector('#ops-section');if(chooser)chooser.value=active?'ops:'+active:'admin:'+(document.querySelector('.admin-nav [data-admin].selected')?.dataset.admin||'overview');
    }
    function navigate(tab) {
      one(tab,tabKeys);active=tab;detail=null;query='';filter='';message='';error=false;confirmAction=null;
      if(location.hash!=='#ops-'+tab)history.replaceState(null,'','#ops-'+tab);
      render(true);
    }
    api.open=navigate;
    function mount() {
      const nav=document.querySelector('.admin-nav');if(!nav)return;
      if(!document.querySelector('#ops-section')){
        const mobile=document.createElement('div');mobile.className='ops-mobile-nav';
        mobile.innerHTML='<label for="ops-section">Chuyển mục quản trị</label><select id="ops-section"><optgroup label="Nội dung website">'+[...nav.querySelectorAll('[data-admin]')].map(b=>`<option value="admin:${E(b.dataset.admin)}">${E(b.textContent.trim())}</option>`).join('')+'</optgroup><optgroup label="Vận hành mẫu">'+tabKeys.map(tab=>`<option value="ops:${tab}">${E(labels[tab])}</option>`).join('')+'</optgroup></select>';
        nav.before(mobile);
        mobile.querySelector('select').addEventListener('change',event=>{const [kind,id]=event.target.value.split(':');if(kind==='ops')navigate(id);else nav.querySelector(`[data-admin="${id}"]`)?.click();});
      }
      if(!nav.querySelector('[data-ops-nav]')) {const section=document.createElement('div');section.dataset.opsNav='';section.innerHTML='<div class="nav-group">VẬN HÀNH · DỮ LIỆU MẪU</div>'+tabKeys.map(tab=>`<button type="button" data-ops-tab="${tab}">${E(labels[tab])}</button>`).join('');nav.insertBefore(section,nav.querySelector('.nav-brand'));updateNav();}
      if(active && !document.querySelector('#adminContent [data-ops-root]'))render();
      updateNav();
    }
    function run(action,focus=true) {try{action();error=false;message='Đã lưu thao tác diễn tập trên trình duyệt. Không gửi dữ liệu ra ngoài.';}catch(e){error=true;message=e.message;}render(focus);if(error)document.querySelector('[data-ops-message]')?.focus();}
    document.addEventListener('click',event=>{
      const tab=event.target.closest('[data-ops-tab]');if(tab){event.preventDefault();event.stopImmediatePropagation();navigate(tab.dataset.opsTab);return;}
      if(event.target.closest('[data-admin]')){active=null;detail=null;confirmAction=null;updateNav();if(location.hash.startsWith('#ops-'))history.replaceState(null,'',location.pathname+location.search);return;}
      const b=event.target.closest('[data-ops-action]');if(!b||!b.closest('[data-ops-root]'))return;event.preventDefault();event.stopImmediatePropagation();
      const action=b.dataset.opsAction;
      if(action==='detail'){detail=b.dataset.id;message='';error=false;render(true);}
      else if(action==='back'){detail=null;confirmAction=null;render(true);}
      else if(action==='new-park'){detail='new';render(true);}
      else if(action==='clear-filter'){query='';filter='';render(true);}
      else if(action==='stage'){filter=filter===b.dataset.stage?'':b.dataset.stage;render(true);}
      else if(action==='attempt'){run(()=>model.attempt(b.dataset.id));}
      else if(action==='reset'||action==='delete-park'){confirmAction=action==='reset'?'reset':b.dataset.id;render(true);}
      else if(action==='cancel'){confirmAction=null;render(true);}
      else if(action==='confirm'){run(()=>{if(confirmAction==='reset'){model.reset();detail=null;query='';filter='';}else{model.removePark(confirmAction);detail=null;}confirmAction=null;});}
      else if(action==='training-step'){trainingIndex=Number(b.dataset.step);render(true);}
      else if(action==='training-open'){navigate(b.dataset.tab);}
      else if(action==='training-complete'){run(()=>model.train(trainingIndex,!model.snapshot().training.includes(trainingIndex)));}
    },true);
    document.addEventListener('submit',event=>{
      const form=event.target;if(!form.matches('[data-ops-form]')||!form.closest('[data-ops-root]'))return;event.preventDefault();event.stopImmediatePropagation();
      if(!form.reportValidity())return;
      const values=Object.fromEntries(new FormData(form)),type=form.dataset.opsForm;
      if(type==='filter'){query=String(values.query||'').slice(0,100);filter=String(values.filter||'');render(true);return;}
      run(()=>{
        if(type==='create'){model.create(active,values.id);detail=values.id;query='';filter='';}
        else if(type==='record'){for(const key of ['capacity','headcount'])if(key in values)values[key]=Number(values[key]);model.update(active,form.dataset.id,values);}
        else if(type==='note'){model.note(active,form.dataset.id,values.code);}
        else if(type==='park-create'){const {id,...fields}=values;fields.capacity=Number(fields.capacity);model.create('parks',id,fields);detail=id;query='';filter='';}
        else if(type==='config'){model.configure(form.dataset.channel,{enabled:values.enabled==='on',target:values.target,outcome:values.outcome});}
      });
    },true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&event.target.closest('[data-ops-root]')){if(confirmAction){confirmAction=null;render(true);}else if(detail){detail=null;render(true);}}});
    window.addEventListener('hashchange',()=>{const tab=location.hash.slice(5);if(location.hash.startsWith('#ops-') && tabKeys.includes(tab))navigate(tab);else if(active){active=null;document.querySelector('.admin-nav [data-admin]')?.click();}});
    window.addEventListener('storage',event=>{if(event.key===KEY){message='Dữ liệu vận hành đã thay đổi ở tab khác. Tải lại trang trước khi tiếp tục để tránh ghi đè.';error=true;render();}});
    const initial=location.hash.startsWith('#ops-')?location.hash.slice(5):null;
    if(tabKeys.includes(initial))active=initial;
    new MutationObserver(mount).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
    mount();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
