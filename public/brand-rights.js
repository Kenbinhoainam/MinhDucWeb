/* Reviewed publication grants only. CMS checkboxes/imports cannot grant trademark rights.
   Empty until an actual permission document AND partnership evidence are reviewed.
   Record the exact logo URL, permitted origin and validity dates in a source revision. */
window.MDBrandRights=(()=>{
 const reviewedGrants=Object.freeze([]);
 // Demo visibility is an editorial choice, independent from a reviewed legal grant.
 function canDisplayDemo(partner){return !!(partner?.visible&&partner.demoLogoVisible===true&&String(partner.logo||'').trim());}
 function restoreDemoProfiles(data,seed){
  if(data.companyDemoRevision>=1)return false;
  for(const partner of data.partners||[]){
   const sample=seed.partners?.find(item=>item.sample&&item.id===partner.id);
   if(!sample)continue;
   if(!partner.logo||/^https:\/\/(?:commons|upload)\.wikimedia\.org\//.test(partner.logo))partner.logo=sample.logo;
   partner.visible=true;partner.demoLogoVisible=true;partner.featured=sample.featured;partner.approved=false;
   if(partner.note==='Hồ sơ tham khảo nội bộ. Chưa có bằng chứng cấp quyền logo hoặc quan hệ hợp tác với Minh Đức.')partner.note=sample.note;
  }
  data.companyDemoRevision=1;return true;
 }
 function matches(partner,grant,origin,now=Date.now()){
  if(!partner?.visible||!grant||grant.partnerId!==partner.id||grant.logo!==partner.logo)return false;
  if(!grant.permissionDocument||!grant.partnershipDocument||!grant.issuer||!grant.reviewer||!grant.reviewedAt)return false;
  try{if(new URL(grant.origin).origin!==new URL(origin).origin)return false;const logo=new URL(grant.logo);if(logo.protocol!=='https:'||logo.username||logo.password)return false;}catch{return false;}
  const start=Date.parse(grant.validFrom),end=Date.parse(grant.validUntil);
  return Number.isFinite(start)&&Number.isFinite(end)&&start<=now&&now<=end;
 }
 return Object.freeze({canDisplayDemo,restoreDemoProfiles,canDisplay(partner,origin='https://minh-duc-prototype.kenbinhoainam.chatgpt.site'){return reviewedGrants.some(grant=>matches(partner,grant,origin));},matches,reviewedCount:reviewedGrants.length});
})();
