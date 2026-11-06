// Company/branch content is optional in legacy snapshots. Empty arrays remain empty.
const record=(value:unknown):value is Record<string,any>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const string=(value:unknown,max:number,min=0)=>typeof value==='string'&&value.trim().length>=min&&value.length<=max;
function allowedUrl(value:unknown,kind:'map'|'embed'|'facebook'){
  if(typeof value!=='string')return false;if(!value)return true;
  if(value.length>(kind==='embed'?2500:kind==='map'?500:300)||/[\s\\<>"'\u0000-\u001f\u007f]/.test(value)||/%(?![0-9a-f]{2})|%(?:0[0-9a-f]|1[0-9a-f]|7f|3c|3e|22|27|5c)/i.test(value))return false;
  const raw=/^https:\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?$/.exec(value);
  const hosts=kind==='embed'?['www.google.com']:kind==='map'?['maps.app.goo.gl','www.google.com']:['facebook.com','www.facebook.com'];
  if(!raw||!hosts.includes(raw[1]))return false;
  try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!==(raw[2]||'/'))return false;
    if(kind==='embed'){const entries=[...u.searchParams];return u.pathname==='/maps/embed'&&entries.length===1&&entries[0][0]==='pb'&&!!entries[0][1].trim();}
    if(kind==='facebook')return /^\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(u.pathname)&&u.pathname!=='/';
    return u.hostname==='maps.app.goo.gl'?/^\/[A-Za-z0-9_-]+\/?$/.test(u.pathname):/^\/maps(?:\/|$)/.test(u.pathname)&&!/%(?:2e|2f)/i.test(u.pathname);
  }catch{return false;}
}
export function validCompanyContent(data:unknown){
  if(!record(data))return false;
  if(Object.hasOwn(data,'companyProfileRevision')&&data.companyProfileRevision!==27)return false;
  if(Object.hasOwn(data,'company')){
    const c=data.company;if(!record(c)||Object.keys(c).some(k=>!['legalName','description','facebook'].includes(k))||!string(c.legalName,160,1)||!string(c.description,700)||!allowedUrl(c.facebook,'facebook'))return false;
  }
  if(Object.hasOwn(data,'branches')){
    if(!Array.isArray(data.branches)||data.branches.length>20)return false;
    const ids=new Set<string>();
    for(const b of data.branches){
      if(!record(b)||Object.keys(b).some(k=>!['id','name','address','mapsUrl','embedUrl','visible'].includes(k))||!string(b.id,80,1)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.id)||ids.has(b.id)||!string(b.name,100,1)||!string(b.address,250)||typeof b.visible!=='boolean'||!allowedUrl(b.mapsUrl,'map')||!allowedUrl(b.embedUrl,'embed'))return false;
      ids.add(b.id);
    }
  }
  if(Object.hasOwn(data,'partners')&&(!Array.isArray(data.partners)||data.partners.some(p=>!record(p)||(Object.hasOwn(p,'sourceListed')&&typeof p.sourceListed!=='boolean'))))return false;
  return true;
}
