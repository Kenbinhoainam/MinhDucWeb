import { env } from 'cloudflare:workers';
import { authorizeAdmin, ApiError } from '../../lib/site-api';
import html from '../../private-pages/quan-tri.html?raw';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await authorizeAdmin(request, env); return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
  catch(error) {
    if(error instanceof ApiError && error.status===401) return new Response(null,{status:302,headers:{Location:'/signin-with-chatgpt?return_to=%2Fquan-tri.html','Cache-Control':'no-store'}});
    const status=error instanceof ApiError?error.status:503;
    return new Response(`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Quản trị Minh Đức</title><body style="margin:0;padding:64px 24px;font:16px/1.8 system-ui;background:#f7f6f2;color:#152e45"><main style="max-width:650px;margin:auto"><h1>${status===403?'Tài khoản chưa có quyền quản trị':'CMS tạm thời chưa sẵn sàng'}</h1><p>${status===403?'Đăng nhập bằng tài khoản chủ website hoặc liên hệ người quản trị.':'Vui lòng thử lại sau. Không có dữ liệu nào được xuất bản bởi thao tác này.'}</p><a href="/">Về website</a> · <a href="/signout-with-chatgpt?return_to=%2Fquan-tri.html">Đổi tài khoản</a></main></body></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  }
}
