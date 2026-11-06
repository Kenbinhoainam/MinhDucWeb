import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/operations-demo.js',import.meta.url),'utf8');
function harness(initial) {
  const saved=new Map(initial?[["md_ops_v24",JSON.stringify(initial)]]:[]), writes=[];
  const storage={getItem:key=>saved.get(key)||null,setItem(key,value){writes.push(key);saved.set(key,value);}};
  const window={};vm.runInNewContext(source,{window,console});
  let now=1000;const model=window.MDOpsV24.createModel(storage,()=>++now);
  return {model,storage,saved,writes,api:window.MDOpsV24};
}

test('initialization never writes; public form fields cannot enter fictional dossiers',()=>{
  const {model,writes}=harness();assert.equal(writes.length,0);
  assert.throws(()=>model.update('candidates','C-001',{phone:'0901234567'}));
  assert.throws(()=>model.create('candidates','real-person'));assert.equal(writes.length,0);
  const state=model.snapshot();state.candidates[0].name='Changed outside';assert.equal(model.snapshot().candidates[0].name,'Ứng viên Mẫu 01');
});
test('candidate status creates exactly one outbox event per channel and preserves notes',()=>{
  const {model,writes}=harness();model.update('candidates','C-001',{status:'screening',owner:'teamB'});
  assert.equal(model.snapshot().outbox.length,4);model.update('candidates','C-001',{status:'screening'});assert.equal(model.snapshot().outbox.length,4);
  model.note('candidates','C-001','checked');assert.equal(model.snapshot().candidates[0].notes[0].code,'checked');
  assert.equal(model.snapshot().outbox.length,4);assert.ok(writes.every(key=>key==='md_ops_v24'));
});
test('pipeline filtering, structured lead edits and invalid values are atomic',()=>{
  const {model}=harness();model.update('leads','L-001',{status:'qualified',headcount:240,priority:'high'});
  assert.equal(model.list('leads','L-001','qualified').length,1);assert.equal(model.list('leads','MISSING').length,0);
  const before=JSON.stringify(model.snapshot());for(const headcount of [0,-1,1.5,10001,NaN])assert.throws(()=>model.update('leads','L-001',{headcount}));
  assert.throws(()=>model.update('leads','L-001',{status:'invented'}));assert.equal(JSON.stringify(model.snapshot()),before);
});
test('KCN create/read/update/delete enforces references and active assignment',()=>{
  const {model}=harness();model.create('parks','P-003',{capacity:800});assert.equal(model.list('parks','P-003')[0].capacity,800);
  assert.throws(()=>model.update('candidates','C-001',{parkId:'P-003'}));model.update('parks','P-003',{status:'active'});
  model.update('candidates','C-001',{parkId:'P-003'});assert.throws(()=>model.removePark('P-003'));
  model.update('parks','P-003',{status:'archived'});assert.equal(model.list('parks','P-003')[0].status,'archived');
  model.update('candidates','C-001',{parkId:'P-001'});model.removePark('P-003');assert.equal(model.list('parks','P-003').length,0);
  assert.throws(()=>model.removePark('P-001'));assert.throws(()=>model.create('parks','P-002'));
});
test('outbox failure/retry/success records real model history and rejects duplicates',()=>{
  const {model}=harness();model.attempt('N-001');let n=model.snapshot().outbox[0];assert.equal(n.status,'failed');assert.equal(n.attempts,1);assert.equal(n.history[0].code,'failure');
  model.configure('zalo',{outcome:'success',target:'business-demo'});model.attempt('N-001');n=model.snapshot().outbox[0];assert.equal(n.status,'simulated');assert.equal(n.attempts,2);assert.equal(n.history[1].code,'success');assert.ok(n.history[1].at>n.history[0].at);
  assert.throws(()=>model.attempt('N-001'));assert.equal(model.snapshot().outbox[0].attempts,2);
});
test('disabled channels, retry ceiling and secret configuration are enforced',()=>{
  const {model}=harness();model.configure('zalo',{enabled:false});assert.throws(()=>model.attempt('N-001'));assert.equal(model.snapshot().outbox[0].attempts,0);
  model.configure('zalo',{enabled:true});for(let i=0;i<3;i++)model.attempt('N-001');assert.throws(()=>model.attempt('N-001'));assert.equal(model.snapshot().outbox[0].history.length,3);
  assert.throws(()=>model.configure('telegram',{token:'secret'}));assert.throws(()=>model.configure('telegram',{target:'https://example.com'}));
});
test('only known note templates persist; hostile stored labels/contact fields are discarded',()=>{
  const {model,api}=harness();assert.throws(()=>model.note('leads','L-001','<img src=x onerror=alert(1)>'));
  const raw=model.snapshot();raw.candidates[0].name='<script>bad</script>';raw.candidates[0].phone='0901234567';raw.config.zalo.token='secret';
  const restored=api.createModel({getItem:()=>JSON.stringify(raw),setItem(){}}).snapshot();assert.equal(restored.candidates[0].name,'Ứng viên Mẫu 01');assert.equal(restored.candidates[0].phone,undefined);assert.equal(restored.config.zalo.token,undefined);
});
test('corrupt storage recovers with a warning; write failures retain last committed state',()=>{
  const {api,model}=harness();const broken=api.createModel({getItem:()=>'{broken',setItem(){throw Error('quota');}});assert.ok(broken.warning());
  const before=JSON.stringify(broken.snapshot());assert.throws(()=>broken.update('candidates','C-001',{status:'interview'}),/Chưa lưu/);assert.equal(JSON.stringify(broken.snapshot()),before);assert.throws(()=>broken.reset());
  const raw=model.snapshot();raw.candidates[0].parkId='P-999';assert.ok(api.createModel({getItem:()=>JSON.stringify(raw),setItem(){}}).warning());
});
test('reload retains operational state and reset is limited to its own storage key',()=>{
  const {model,storage,saved,api}=harness();saved.set('md_prototype_v16_content','untouched');model.train(0,true);model.train(0,true);model.train(1,true);model.create('candidates','C-004');model.note('candidates','C-004','handoff');
  const reloaded=api.createModel(storage);assert.equal(reloaded.snapshot().training.length,2);assert.equal(reloaded.snapshot().candidates.length,4);assert.equal(reloaded.snapshot().candidates[3].notes.length,1);
  reloaded.train(0,false);assert.equal(reloaded.snapshot().training.length,1);reloaded.reset();assert.equal(reloaded.snapshot().candidates.length,3);assert.equal(reloaded.snapshot().outbox.length,2);assert.equal(saved.get('md_prototype_v16_content'),'untouched');
});
test('two tabs cannot silently overwrite a newer saved revision',()=>{
  const {model,storage,api}=harness();const second=api.createModel(storage);model.update('leads','L-001',{status:'qualified'});
  const committed=storage.getItem(api.key);assert.throws(()=>second.update('candidates','C-001',{status:'screening'}),/tab khác/);assert.throws(()=>second.reset(),/tab khác/);
  assert.equal(storage.getItem(api.key),committed);assert.equal(second.snapshot().candidates[0].status,'new');
  const reloaded=api.createModel(storage);reloaded.update('candidates','C-001',{status:'screening'});assert.equal(reloaded.snapshot().leads[0].status,'qualified');
});
