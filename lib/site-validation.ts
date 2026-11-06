export class ApiError extends Error {
  status: number; code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
export function fail(status: number, code: string, message: string): never { throw new ApiError(status, code, message); }
export const MAX_BODY = 6 * 1024 * 1024;
export const MAX_CV = 5 * 1024 * 1024;
export function isRecord(v: unknown): v is Record<string, any> { return !!v && typeof v === 'object' && !Array.isArray(v); }
export function text(v: unknown, max: number, min = 0) { if (typeof v !== 'string' || v.trim().length < min || v.length > max) fail(422, 'invalid_fields', 'Vui lòng kiểm tra các trường thông tin.'); return v.trim(); }
export function safeId(v: unknown) { const id = text(v, 120, 1); if (!/^[\w-]+$/.test(id)) fail(422, 'invalid_id', 'Mã nội dung không hợp lệ.'); return id; }
export async function sha(value: string | Uint8Array) { const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value); return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes.buffer)), v => v.toString(16).padStart(2, '0')).join(''); }
export function token() { return Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join(''); }
export function equalToken(a: string, b: string) { if (a.length !== b.length) return false; let n = 0; for (let i = 0; i < a.length; i++) n |= a.charCodeAt(i) ^ b.charCodeAt(i); return n === 0; }
export function cookieClient(req: Request) { return (req.headers.get('cookie') || '').match(/(?:^|;\s*)md_client=([a-f0-9]{64})(?:;|$)/)?.[1] || ''; }
export function sameOrigin(req: Request) { if (req.headers.get('origin') !== new URL(req.url).origin) fail(403, 'origin_rejected', 'Yêu cầu không đến từ website này.'); }
export async function limitedBody(req: Request, max = MAX_BODY) {
  if (Number(req.headers.get('content-length') || 0) > max) fail(413, 'body_too_large', 'Dữ liệu vượt dung lượng cho phép.');
  if (!req.body) return new Uint8Array();
  const reader = req.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > max) { await reader.cancel(); fail(413, 'body_too_large', 'Dữ liệu vượt dung lượng cho phép.'); } chunks.push(value); }
  const result = new Uint8Array(size); let offset = 0; for (const c of chunks) { result.set(c, offset); offset += c.length; } return result;
}
export async function bodyJson(req: Request, max = MAX_BODY): Promise<any> {
  if (!req.headers.get('content-type')?.includes('application/json')) fail(415, 'json_required', 'Định dạng dữ liệu không hợp lệ.');
  try { const value = JSON.parse(new TextDecoder().decode(await limitedBody(req, max))); if (!isRecord(value)) fail(422, 'invalid_fields', 'Dữ liệu phải là một đối tượng.'); return value; } catch (error) { if (error instanceof ApiError) throw error; fail(400, 'invalid_json', 'Không đọc được dữ liệu.'); }
}
function validMedia(v: unknown) {
  if (typeof v !== 'string' || v.length > 1_600_000) return false;
  if (!v || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) return true;
  if (/^(?:assets\/)?[\w./-]+\.(png|jpe?g|webp|svg)$/i.test(v) && !v.includes('..')) return true;
  try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}
function validDate(value: unknown) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const date = new Date(value + 'T00:00:00Z'); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value; }
export function validateContent(v: unknown): Record<string, any> {
  if (!isRecord(v) || !isRecord(v.home) || !Array.isArray(v.jobs) || !Array.isArray(v.posts) || !Array.isArray(v.partners)) fail(422, 'invalid_content', 'Cấu trúc nội dung không hợp lệ.');
  const d = v as Record<string, any>;
  if(!validCompanyContent(d))fail(422,'invalid_company','Hồ sơ doanh nghiệp hoặc chi nhánh không hợp lệ. Hãy kiểm tra nội dung và liên kết Google Maps.');
  if (d.jobs.length > 250 || d.posts.length > 250 || d.partners.length > 250 || !Array.isArray(d.home.gallery) || d.home.gallery.length > 20 || !Array.isArray(d.home.kpi) || !isRecord(d.home.sections)) fail(422, 'invalid_content', 'Số lượng nội dung hoặc cấu trúc trang chủ không hợp lệ.');
  if (d.home.kpi.length > 8 || d.home.kpi.some((x: unknown) => typeof x !== 'string' || x.length > 60) || Object.values(d.home.sections).some(x => typeof x !== 'boolean')) fail(422, 'invalid_content', 'Chỉ số hoặc trạng thái các khối không hợp lệ.');
  for (const [key, limit] of Object.entries({ heroLine1: 65, heroLine2: 65, heroIntro: 360, aboutTitle: 160, aboutIntro: 1100, galleryTitle: 120, videoTitle: 120, videoIntro: 500 })) text(d.home[key], limit);
  if (d.home.heroImg && !validMedia(d.home.heroImg) || d.home.videoPoster && !validMedia(d.home.videoPoster)) fail(422, 'invalid_media', 'Ảnh trang chủ không hợp lệ.');
  const ids = new Set<string>();
  for (const j of d.jobs) {
    if (!isRecord(j)) fail(422, 'invalid_job', 'Tin tuyển dụng không hợp lệ.');
    const id = safeId(j.id); if (ids.has(id)) fail(422, 'duplicate_id', 'Mã tin tuyển dụng bị trùng.'); ids.add(id);
    text(j.title, 140, 1); text(j.company, 160); text(j.location, 160, 1); text(j.park, 160);
    for (const key of ['description', 'requirements', 'benefits', 'apply']) text(j[key], 12000, j.open ? 1 : 0);
    if (!['worker', 'internal'].includes(j.type) || typeof j.open !== 'boolean' || !Number.isFinite(j.min) || !Number.isFinite(j.max) || j.min < 0 || j.max < j.min || j.max > 1000 || !Array.isArray(j.tags) || j.tags.length > 20 || j.tags.some((x: unknown) => typeof x !== 'string' || x.length > 90) || !validMedia(j.image)) fail(422, 'invalid_job', 'Khoảng lương, ảnh hoặc nhãn công việc không hợp lệ.');
    if (!validDate(j.posted)) fail(422, 'invalid_date', 'Ngày đăng không hợp lệ.');
    if (j.openings !== undefined && (!Number.isInteger(j.openings) || j.openings < 0 || j.openings > 100000)) fail(422, 'invalid_job', 'Số lượng tuyển dụng không hợp lệ.');
  }
  ids.clear();
  for (const p of d.posts) {
    if (!isRecord(p)) fail(422, 'invalid_post', 'Bài viết không hợp lệ.');
    const id = safeId(p.id); if (ids.has(id)) fail(422, 'duplicate_id', 'Mã bài viết bị trùng.'); ids.add(id);
    text(p.title, 140, 1); text(p.excerpt, 290); text(p.body, 12000); text(p.category, 100); text(p.seoTitle || '', 70); text(p.meta || '', 165);
    if (!validDate(p.date)) fail(422, 'invalid_date', 'Ngày bài viết không hợp lệ.');
    if (!['article', 'video'].includes(p.type) || typeof p.visible !== 'boolean' || !validMedia(p.cover)) fail(422, 'invalid_post', 'Nội dung hoặc ảnh bài viết không hợp lệ.');
  }
  for (const g of d.home.gallery) if (!isRecord(g) || !validMedia(g.src) || typeof g.caption !== 'string' || g.caption.length > 90) fail(422, 'invalid_gallery', 'Ảnh hoạt động không hợp lệ.');
  for (const p of d.partners) { if (!isRecord(p)) fail(422, 'invalid_partner', 'Hồ sơ doanh nghiệp không hợp lệ.'); safeId(p.id); text(p.name, 200, 1); if (p.logo && !validMedia(p.logo)) fail(422, 'invalid_media', 'Logo không hợp lệ.'); }
  const walk = (x: any, depth = 0): boolean => depth <= 10 && (typeof x === 'string' ? x.length <= (x.startsWith('data:image/') ? 1_600_000 : 12000) : x === null || typeof x !== 'object' ? true : Object.entries(x).every(([k, value]) => !['__proto__', 'constructor', 'prototype'].includes(k) && walk(value, depth + 1)));
  if (!walk(d)) fail(422, 'invalid_content', 'Nội dung có trường không được hỗ trợ.');
  if (new TextEncoder().encode(JSON.stringify(d)).byteLength > 1_800_000) fail(422, 'content_too_large', 'Bản nội dung vượt 1,8 MB. Hãy dùng ảnh WebP nhỏ hơn hoặc URL ảnh trước khi lưu.');
  if (d.mediaTransforms) { if (!isRecord(d.mediaTransforms)) fail(422, 'invalid_transform', 'Thông số căn ảnh không hợp lệ.'); for (const m of Object.values(d.mediaTransforms) as any[]) { if (!isRecord(m)) fail(422, 'invalid_transform', 'Thông số căn ảnh không hợp lệ.'); for (const [key, x] of Object.entries(m)) if (['x', 'y', 'zoom', 'brightness', 'contrast'].includes(key) && (typeof x !== 'number' || !Number.isFinite(x) || x < 0 || x > 300)) fail(422, 'invalid_transform', 'Thông số căn ảnh không hợp lệ.'); } }
  return d;
}
export function validateIntake(d: any, content: any): Record<string, any> {
  if (!isRecord(d) || !['application', 'enquiry'].includes(d.kind) || d.website) fail(422, 'invalid_fields', 'Loại yêu cầu không hợp lệ.');
  if (d.consent !== true || d.testOnly !== true) fail(422, 'consent_required', 'Bản thử nghiệm chỉ nhận dữ liệu mẫu có xác nhận.');
  const name = text(d.name, 100, 2), phone = text(d.phone, 24, 9).replace(/[\s.-]/g, '');
  if (!/^(0|\+84)[35789]\d{8}$/.test(phone)) fail(422, 'invalid_phone', 'Số điện thoại Việt Nam chưa đúng định dạng.');
  const common = { name, phone, locale: ['vi', 'en', 'zh', 'ko'].includes(d.locale) ? d.locale : 'vi', consent: true, testOnly: true, policyVersion: 'v15-staging-2026-10-31' };
  if (d.kind === 'enquiry') return { ...common, kind: 'enquiry', company: text(d.company || '', 160), message: text(d.message, 1500, 10) };
  const jobId = safeId(d.jobId), job = content.jobs.find((j: any) => j.id === jobId && j.open);
  if (!job) fail(422, 'job_unavailable', 'Tin tuyển dụng đã đóng hoặc không tồn tại.');
  const shift = text(d.shift || '', 40), shuttle = text(d.shuttle || '', 20), area = text(d.area || d.desired || job.location, 160, 1);
  if (job.type === 'worker' && (!['Ca ngày', 'Ca đêm', 'Linh hoạt'].includes(shift) || !['Có', 'Không'].includes(shuttle))) fail(422, 'preferences_required', 'Vui lòng chọn ca làm và nhu cầu xe đưa đón.');
  return { ...common, kind: 'application', jobId, jobTitle: job.title, jobType: job.type, shift, shuttle, area };
}
export async function validateCv(file: File | null) {
  if (!file) return null;
  if (file.size > MAX_CV) fail(413, 'cv_too_large', 'CV tối đa 5MB.');
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['pdf', 'doc', 'docx'].includes(ext || '')) fail(422, 'invalid_cv', 'CV phải là PDF, DOC hoặc DOCX.');
  const bytes = new Uint8Array(await file.arrayBuffer()), s = bytes.slice(0, 8);
  const pdf = new TextDecoder().decode(s.slice(0, 5)) === '%PDF-', doc = [208, 207, 17, 224, 161, 177, 26, 225].every((n, i) => s[i] === n), zip = s[0] === 80 && s[1] === 75 && s[2] === 3 && s[3] === 4;
  if (!(ext === 'pdf' && pdf || ext === 'doc' && doc || ext === 'docx' && zip)) fail(422, 'invalid_cv', 'Nội dung tệp không khớp định dạng CV.');
  return { bytes, hash: await sha(bytes), name: file.name.replace(/[^\p{L}\p{N}_. -]/gu, '_').slice(0, 100), mime: ext === 'pdf' ? 'application/pdf' : ext === 'doc' ? 'application/msword' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
}
import { validCompanyContent } from './company-profile-validation.ts';
