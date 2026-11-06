import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff':'font/woff','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let relative;
  try{relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(relative==='/__review.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v23-review.html')).pipe(res);return;}
  if(relative==='/__features.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v25-qa.html')).pipe(res);return;}
  if(relative==='/__v26.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v26-qa.html')).pipe(res);return;}
  if(relative==='/__v27.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v27-qa.html')).pipe(res);return;}
  if(relative==='/__assistant-tests'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v25-assistant-qa.html')).pipe(res);return;}
  if(relative==='/__qa.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v23-qa.html')).pipe(res);return;}
  if(relative==='/__accessibility.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('scripts/v23-accessibility.html')).pipe(res);return;}
  if(relative==='/__axe.js'){const dependency=fs.readdirSync('node_modules/.pnpm').find(name=>name.startsWith('axe-core@'));if(!dependency){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.resolve('node_modules/.pnpm',dependency,'node_modules/axe-core/axe.min.js')).pipe(res);return;}
  const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){res.writeHead(404).end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  });
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
