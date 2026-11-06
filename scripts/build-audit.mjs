import fs from 'node:fs';

// A small renderer for the deliberately limited report format used in this repo.
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const inline=s=>escape(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const markdown=fs.readFileSync('docs/AUDIT-V15.md','utf8');
const score=JSON.parse(fs.readFileSync('docs/v15-score.json','utf8'));
const lines=markdown.split('\n');
const output=[];
for(let i=0;i<lines.length;i++){
  const line=lines[i].trim();
  if(!line)continue;
  const heading=line.match(/^(#{1,3})\s+(.+)$/);
  if(heading){output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);continue;}
  if(line.startsWith('|')){
    const rows=[];while(i<lines.length&&lines[i].trim().startsWith('|'))rows.push(lines[i++].trim());i--;
    const cells=s=>s.slice(1,-1).split('|').map(x=>x.trim());
    output.push('<div class="table-wrap"><table><thead><tr>'+cells(rows[0]).map(c=>'<th scope="col">'+inline(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(2).map(r=>'<tr>'+cells(r).map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;
  }
  if(line.startsWith('- ')){
    const items=[];while(i<lines.length&&lines[i].trim().startsWith('- '))items.push(lines[i++].trim().slice(2));i--;
    output.push('<ul>'+items.map(item=>'<li>'+inline(item)+'</li>').join('')+'</ul>');continue;
  }
  const paragraph=[line];while(i+1<lines.length&&lines[i+1].trim()&&!/^(#|\||- )/.test(lines[i+1]))paragraph.push(lines[++i]);
  output.push('<p>'+inline(paragraph.join(' '))+'</p>');
}
fs.mkdirSync('public/audit-evidence',{recursive:true});
for(const file of ['v14-responsive-qa.json','v14-interaction-qa.json','v14-stress-qa.json','v14-comparison-desktop.jpg','v14-audit.json','v15-score.json','v14-static-checks.json','v15-preview-api.json','v15-preview-layout.json','v15-form-traces.json','v15-cv-error.json','v15-audit.json','v15-score.json','v15-receipt-desktop.jpg'])fs.copyFileSync('docs/'+file,'public/audit-evidence/'+file);
fs.writeFileSync('public/AUDIT-V15.md',markdown);
const body=output.join('\n').replace(/<code>(v14-[\w.-]+\.(?:json|jpg))<\/code>/g,'<a href="audit-evidence/$1">$1</a>');
const head=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Minh Đức V15 · Evaluator 2.0 · ${score.observed_score}/100 phần đã kiểm tra</title><link rel="icon" href="assets/logo-icon.png"><link rel="stylesheet" href="fonts.css?v=15"><style>*{box-sizing:border-box}body{margin:0;color:#152e45;background:#f7f6f2;font:15px/1.9 'Noto Sans',Arial,sans-serif}main{max-width:1040px;padding:32px 24px 80px;margin:auto}nav{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:32px}a{color:#a21c32;overflow-wrap:anywhere}nav a{display:inline-flex;align-items:center;min-height:48px;font-size:13px}h1,h2{font-family:'Noto Serif',Georgia,serif;line-height:1.5;font-weight:600}h1{font-size:clamp(28px,4vw,42px);letter-spacing:-.025em}h2{font-size:27px;margin:48px 0 22px;padding-top:25px;border-top:1px solid #ccd8df}h3{font-size:18px;margin-top:32px}p,li{max-width:940px}li{margin-bottom:12px}code{font-size:.9em;background:#e9eeee;padding:2px 5px;border-radius:3px;overflow-wrap:anywhere}.table-wrap{overflow:auto;border:1px solid #c7d3da;background:white;border-radius:8px}table{border-collapse:collapse;font-size:12px;width:100%;min-width:650px}th,td{text-align:left;vertical-align:top;padding:17px;border-bottom:1px solid #d5dfe4}th{background:#eaf0f2}th:nth-child(2),td:nth-child(2){white-space:nowrap}strong{font-weight:700}:focus-visible{outline:3px solid #1763a4;outline-offset:4px}@media(max-width:600px){main{padding-inline:18px}h2{font-size:23px}body{font-size:14px}}</style></head><body><main><nav aria-label="Điều hướng báo cáo"><a href="index.html">← Website Minh Đức V15</a><a href="quan-tri.html">CMS Studio</a><a href="AUDIT-V15.md" download>Tải báo cáo Markdown</a></nav>`;
fs.writeFileSync('public/10k-audit.html',head+body+'</main></body></html>');
fs.copyFileSync('docs/ROADMAP-FLAGSHIP-V15.md','public/ROADMAP-FLAGSHIP-V15.md');
console.log('Built V15 audit and supporting evidence.');
