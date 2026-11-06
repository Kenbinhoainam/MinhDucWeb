import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { handleApi } from '../lib/site-api.ts';
import { validateContent } from '../lib/site-validation.ts';
import seed from '../lib/content-seed.json' with { type: 'json' };

// Exercise the actual API against SQLite's constraints and atomic transactions.
// Identity headers model Sites' trusted dispatch, never a production bypass.
class Statement {
  db: DatabaseSync; sql: string; args: any[]=[];
  constructor(db: DatabaseSync, sql: string){this.db=db;this.sql=sql;}
  bind(...args: any[]){const s=new Statement(this.db,this.sql);s.args=args;return s;}
  async first(){return this.db.prepare(this.sql).get(...this.args)||null;}
  async all(){return {results:this.db.prepare(this.sql).all(...this.args)};}
  async run(){const r=this.db.prepare(this.sql).run(...this.args);return {success:true,meta:{changes:Number(r.changes)}};}
}
function fixture(){
  const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../drizzle/0000_brainy_crystal.sql',import.meta.url),'utf8'));
  const DB={prepare:(sql:string)=>new Statement(sqlite,sql),async batch(statements:Statement[]){sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
  const files=new Map<string,Uint8Array>();const BUCKET={async put(key:string,bytes:Uint8Array){files.set(key,bytes);},async get(key:string){return files.has(key)?{body:files.get(key)}:null;},async delete(key:string){files.delete(key);}};
  const env={DB,BUCKET,ADMIN_BOOTSTRAP_EMAIL:'owner@example.invalid'} as any;
  const origin='https://test.example.invalid', client='a'.repeat(64);
  async function request(path:string,options:any={}):Promise<any>{
    const {owner=false,userId='owner-id',email='owner@example.invalid',...init}=options;
    const headers=new Headers({'Origin':origin,'Cookie':'md_client='+client,...(init.headers||{})});
    if(owner){headers.set('oai-authenticated-user-id',userId);headers.set('oai-authenticated-user-email',email);}
    if(init.body&&!(init.body instanceof FormData)&&typeof init.body!=='string'){headers.set('Content-Type','application/json');init.body=JSON.stringify(init.body);}
    return handleApi(new Request(origin+path,{...init,headers}),env);
  }
  return {sqlite,files,request,env};
}
const enquiry={kind:'enquiry',name:'Người thử A',phone:'0900000000',company:'Doanh nghiệp mẫu',message:'Kiểm tra dữ liệu giả trên staging.',consent:true,testOnly:true,locale:'vi',website:''};
const post=(body:any,headers:any={})=>({method:'POST',body,headers});
const intake=(body:any=structuredClone(enquiry),key=crypto.randomUUID())=>post(body,{'Idempotency-Key':key});

test('seed passes server contract and both storage bindings are checked',async()=>{
  assert.equal(validateContent(structuredClone(seed)).jobs.length,8);
  const f=fixture(),r=await f.request('/api/health');assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true,version:'V15',mode:'staging',database:true,files:true});
});
test('admin authorization rejects anonymous and non-owner, binds first verified owner ID',async()=>{
  const f=fixture();for(const path of ['/api/admin/content','/api/admin/intakes','/api/admin/audit','/api/admin/cv/MD-test'])assert.equal((await f.request(path)).status,401);
  assert.equal((await f.request('/api/admin/session',{owner:true,email:'stranger@example.invalid'})).status,403);
  assert.equal((await f.request('/api/admin/session',{owner:true})).status,200);
  assert.equal((await f.request('/api/admin/session',{owner:true,userId:'new-id'})).status,403);
  assert.equal((await f.request('/api/admin/session',{owner:true,email:'renamed@example.invalid'})).status,200);
  assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM admin_members').get()!.n,1);
});
test('company branches remain draft-isolated and round-trip through publish/rollback with empty deletion',async()=>{
  const f=fixture(),data=structuredClone(seed) as any;
  data.company={legalName:'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA',description:'Cung ứng nguồn nhân lực',facebook:'https://www.facebook.com/md668.com.vn'};
  data.branches=[{id:'voi',name:'Chi nhánh Vôi',address:'',mapsUrl:'https://maps.app.goo.gl/2hj5gqjuaLS4t6hk8',embedUrl:'',visible:true}];
  const put=(d:any,revision:number)=>f.request('/api/admin/content',{owner:true,method:'PUT',body:{data:d,expectedRevision:revision}});
  const publish=(revision:number,publishedRevision:number)=>f.request('/api/admin/publish',{owner:true,...post({expectedRevision:revision,expectedPublishedRevision:publishedRevision})});
  assert.equal((await f.request('/api/admin/content',{method:'PUT',body:{data,expectedRevision:0}})).status,401);
  assert.equal((await put(data,0)).status,200);assert.notDeepEqual((await(await f.request('/api/content')).json()).data.branches,data.branches);
  const first=await(await publish(1,0)).json();assert.ok(first.versionId);
  assert.deepEqual((await(await f.request('/api/content')).json()).data.branches,data.branches);
  data.branches=[];assert.equal((await put(data,1)).status,200);assert.equal((await publish(2,1)).status,200);
  assert.deepEqual((await(await f.request('/api/content')).json()).data.branches,[]);
  assert.equal((await f.request('/api/admin/rollback',{owner:true,...post({versionId:first.versionId,expectedPublishedRevision:2})})).status,200);
  assert.equal((await(await f.request('/api/content')).json()).data.branches[0].id,'voi');
  assert.deepEqual((await(await f.request('/api/admin/content',{owner:true})).json()).data.branches,[]);
});

test('draft isolation, stale-write conflict, publish replay and rollback preserve draft',async()=>{
  const f=fixture(),data=structuredClone(seed);data.home.heroLine1='Bản thử A';
  const put=(d:any,revision:number)=>f.request('/api/admin/content',{owner:true,method:'PUT',body:{data:d,expectedRevision:revision}});
  assert.equal((await put(data,0)).status,200);
  assert.equal((await(await f.request('/api/content')).json()).data.home.heroLine1,seed.home.heroLine1);
  assert.equal((await put(data,0)).status,409);
  const publish=(revision:number,publishedRevision:number)=>f.request('/api/admin/publish',{owner:true,...post({expectedRevision:revision,expectedPublishedRevision:publishedRevision})});
  assert.equal((await publish(1,0)).status,200);
  assert.equal((await(await f.request('/api/content')).json()).data.home.heroLine1,'Bản thử A');
  const replay=await(await publish(1,1)).json();assert.equal(replay.replayed,true);assert.equal(replay.revision,1);
  data.home.heroLine1='Bản thử B';assert.equal((await put(data,1)).status,200);
  assert.equal((await publish(1,1)).status,409);assert.equal((await publish(2,0)).status,409);assert.equal((await publish(2,1)).status,200);
  const versions=await(await f.request('/api/admin/versions',{owner:true})).json();assert.equal(versions.versions.length,3);
  const restore=()=>f.request('/api/admin/rollback',{owner:true,...post({versionId:'baseline-v15',expectedPublishedRevision:2})});
  assert.equal((await restore()).status,200);assert.equal((await restore()).status,409);
  assert.equal((await(await f.request('/api/content')).json()).data.home.heroLine1,seed.home.heroLine1);
  assert.equal((await(await f.request('/api/admin/content',{owner:true})).json()).data.home.heroLine1,'Bản thử B');
  const log=await(await f.request('/api/admin/audit',{owner:true})).json();assert.ok(log.events.some((e:any)=>e.action==='content.restored'));
});
test('server rejects invalid content, origin and malformed bodies without writing',async()=>{
  const f=fixture(),data=structuredClone(seed);data.jobs[0].min=99;
  assert.equal((await f.request('/api/admin/content',{owner:true,method:'PUT',body:{data,expectedRevision:0}})).status,422);
  assert.equal((await f.request('/api/admin/content',{owner:true,method:'PUT',body:{data:seed,expectedRevision:0},headers:{Origin:'https://other.invalid'}})).status,403);
  assert.equal((await f.request('/api/admin/content',{owner:true,method:'PUT',body:'null',headers:{'Content-Type':'application/json'}})).status,422);
  assert.equal((await f.request('/api/admin/content',{owner:true,method:'PUT',body:'{',headers:{'Content-Type':'application/json'}})).status,400);
  const oversized:any=structuredClone(seed);oversized.i18n={bulky:Array(170).fill('x'.repeat(12000))};
  assert.equal((await(await f.request('/api/admin/content',{owner:true,method:'PUT',body:{data:oversized,expectedRevision:0}})).json()).error,'content_too_large');
  const invalidDate=structuredClone(seed);invalidDate.posts[0].date='2026-02-30';
  assert.equal((await(await f.request('/api/admin/content',{owner:true,method:'PUT',body:{data:invalidDate,expectedRevision:0}})).json()).error,'invalid_date');
  assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM content_records').get()!.n,0);
});
test('intake validates consent, phone, job, origin, session, honeypot and body cap',async()=>{
  const f=fixture();
  for(const patch of [{consent:false},{testOnly:false},{phone:'111111111'},{website:'spam'},{kind:'application',jobId:'not-a-job'}])assert.equal((await f.request('/api/intake',intake({...enquiry,...patch}))).status,422);
  assert.equal((await f.request('/api/intake',{...intake(),headers:{Origin:'https://other.invalid'}})).status,403);
  assert.equal((await f.request('/api/intake',{...intake(),headers:{Cookie:''}})).status,403);
  assert.equal((await f.request('/api/intake',{...intake(),headers:{'Idempotency-Key':crypto.randomUUID(),'Content-Length':'9999999'}})).status,413);
  assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM intakes').get()!.n,0);
});
test('receipt proves stored intake, repeated send has no duplicate and altered payload conflicts',async()=>{
  const f=fixture(),key=crypto.randomUUID(),response=await f.request('/api/intake',intake(enquiry,key));assert.equal(response.status,201);const receipt=await response.json();
  assert.equal(receipt.stored,true);assert.equal((await(await f.request('/api/intake',intake(enquiry,key))).json()).id,receipt.id);
  assert.equal((await f.request('/api/intake',intake({...enquiry,name:'Người khác'},key))).status,409);
  assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM intakes').get()!.n,1);
  const verified=await(await f.request('/api/receipt',post({id:receipt.id,receiptToken:receipt.receiptToken}))).json();assert.equal(verified.stored,true);assert.equal(verified.phone,undefined);assert.equal(verified.receiptToken,undefined);
  assert.equal((await f.request('/api/receipt',post({id:receipt.id,receiptToken:'b'.repeat(64)}))).status,404);
  assert.equal((await f.request('/api/admin/intakes')).status,401);
  const inbox=await(await f.request('/api/admin/intakes',{owner:true})).json();assert.equal(inbox.items[0].payload.phone,enquiry.phone);assert.equal(inbox.items[0].receipt_token,undefined);
});
test('internal application requires signature-checked private CV and owner-only attachment',async()=>{
  const f=fixture(),payload={...enquiry,kind:'application',jobId:'ky-su-co-dien',area:'Hà Nội'};
  assert.equal((await f.request('/api/intake',intake(payload))).status,422);
  function withFile(file:File){const form=new FormData();form.set('payload',JSON.stringify(payload));form.set('cv',file);return intake(form);}
  assert.equal((await f.request('/api/intake',withFile(new File(['fake'],'cv.pdf',{type:'application/pdf'})))).status,422);
  assert.equal((await f.request('/api/intake',withFile(new File([new Uint8Array(5*1024*1024+1)],'cv.pdf')))).status,413);
  const bytes='%PDF-1.4\nSTAGING FICTIONAL CV\n%%EOF',r=await f.request('/api/intake',withFile(new File([bytes],'test-cv.pdf',{type:'application/pdf'})));assert.equal(r.status,201);const receipt=await r.json();assert.equal(f.files.size,1);
  assert.equal((await f.request('/api/admin/cv/'+receipt.id)).status,401);
  const download=await f.request('/api/admin/cv/'+receipt.id,{owner:true});assert.equal(download.status,200);assert.match(download.headers.get('Content-Disposition')!,/^attachment/);assert.equal(await download.text(),bytes);
});
test('worker application stores preferences; rate limit and storage outage return errors',async()=>{
  const f=fixture(),payload={...enquiry,kind:'application',jobId:'cn-dien-tu',shift:'Ca ngày',shuttle:'Có',area:'Bắc Ninh'};
  assert.equal((await f.request('/api/intake',intake({...payload,shift:'invalid'}))).status,422);
  assert.equal((await f.request('/api/intake',intake(payload))).status,201);
  for(let i=0;i<7;i++)assert.equal((await f.request('/api/intake',intake())).status,201);
  assert.equal((await f.request('/api/intake',intake())).status,429);
  const bad=await handleApi(new Request('https://test.invalid/api/content'),{});assert.equal(bad.status,503);
});
