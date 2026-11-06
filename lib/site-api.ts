import seed from './content-seed.json' with { type: 'json' };
import { ApiError, fail, bodyJson, limitedBody, cookieClient, sameOrigin, safeId, text, token, sha, equalToken, validateContent, validateIntake, validateCv } from './site-validation.ts';
export { ApiError } from './site-validation.ts';
export type SiteEnv = { DB?: D1Database; BUCKET?: R2Bucket; ADMIN_BOOTSTRAP_EMAIL?: string; SITE_MODE?: string };
type ContentRow = { content: string; revision: number; version_id: string | null; updated_at: number };
type IntakeRow = { id: string; kind: string; client_id: string; payload_hash: string; receipt_token: string; created_at: number };
const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
function reply(value: unknown, status = 200, headers: Record<string, string> = {}) { return new Response(JSON.stringify(value), { status, headers: { ...jsonHeaders, ...headers } }); }
function database(env: SiteEnv) { if (!env.DB) fail(503, 'storage_unavailable', 'Kho dữ liệu tạm thời chưa sẵn sàng.'); return env.DB!; }
const uuid = () => crypto.randomUUID();
async function contentRow(env: SiteEnv, key: string) { return database(env).prepare('SELECT content, revision, version_id, updated_at FROM content_records WHERE key = ?').bind(key).first<ContentRow>(); }
async function published(env: SiteEnv) { const row = await contentRow(env, 'published'); return { data: row ? JSON.parse(row.content) : structuredClone(seed), revision: row?.revision || 0, versionId: row?.version_id || null, updatedAt: row?.updated_at || null }; }
export async function authorizeAdmin(req: Request, env: SiteEnv) {
  const userId = req.headers.get('oai-authenticated-user-id'), email = req.headers.get('oai-authenticated-user-email');
  if (!userId || !email) fail(401, 'signin_required', 'Vui lòng đăng nhập ChatGPT để quản trị.');
  const db = database(env);
  let member = await db.prepare('SELECT user_id, role FROM admin_members WHERE user_id = ?').bind(userId).first<{ user_id: string; role: string }>();
  if (!member) {
    const owner = await db.prepare("SELECT user_id FROM admin_members WHERE role = 'owner' LIMIT 1").first<{ user_id: string }>();
    if (!owner && env.ADMIN_BOOTSTRAP_EMAIL && email.toLowerCase() === env.ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) {
      await db.prepare("INSERT OR IGNORE INTO admin_members (user_id, role, created_at) VALUES (?, 'owner', ?)").bind(userId, Date.now()).run();
      member = await db.prepare('SELECT user_id, role FROM admin_members WHERE user_id = ?').bind(userId).first<{ user_id: string; role: string }>();
    }
  }
  if (!member || member.role !== 'owner') fail(403, 'forbidden', 'Tài khoản này chưa có quyền quản trị website.');
  return { userId: userId!, role: member.role };
}
function auditStatement(env: SiteEnv, actor: string, action: string, subject: string) { return database(env).prepare('INSERT INTO audit_events (id, actor_id, action, subject_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(uuid(), actor, action, subject, Date.now()); }
async function rateLimit(req: Request, env: SiteEnv, client: string) {
  const now = Date.now(), window = Math.floor(now / 900000) * 900000;
  const ip = req.headers.get('cf-connecting-ip') || client, key = (await sha('intake:' + ip)) + ':' + window;
  const row = await database(env).prepare('INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count').bind(key, window).first<{ count: number }>();
  if ((row?.count || 0) > 8) fail(429, 'rate_limited', 'Bạn đã gửi nhiều lần. Vui lòng thử lại sau.');
  await database(env).prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(now - 86400000).run();
}
async function parseIntake(req: Request) {
  if (req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    const bytes = await limitedBody(req); const form = await new Response(bytes, { headers: { 'Content-Type': req.headers.get('content-type')! } }).formData();
    let data: any; try { data = JSON.parse(String(form.get('payload') || '')); } catch { fail(400, 'invalid_json', 'Không đọc được biểu mẫu.'); }
    const file = form.get('cv'); return { data, file: file instanceof File && file.size > 0 ? file : null };
  }
  return { data: await bodyJson(req, 32768), file: null as File | null };
}
function receiptResponse(row: IntakeRow, replayed = false) { return { id: row.id, receiptToken: row.receipt_token, receivedAt: row.created_at, kind: row.kind, stored: true, testOnly: true, replayed }; }
async function intake(req: Request, env: SiteEnv) {
  sameOrigin(req); const client = cookieClient(req); if (!client) fail(403, 'session_required', 'Phiên biểu mẫu hết hạn. Vui lòng tải lại rồi gửi lại.');
  const requestKey = req.headers.get('idempotency-key') || ''; if (!/^[a-f0-9-]{36}$/.test(requestKey)) fail(422, 'request_key_required', 'Mã lượt gửi không hợp lệ.');
  const { data, file } = await parseIntake(req), content = await published(env), payload = validateIntake(data, content.data), cv = await validateCv(file);
  if (payload.kind === 'application' && payload.jobType === 'internal' && !cv) fail(422, 'cv_required', 'Vị trí nội bộ yêu cầu CV.');
  const hash = await sha(JSON.stringify(payload) + ':' + (cv?.hash || '')), db = database(env);
  const prior = await db.prepare('SELECT id, kind, client_id, payload_hash, receipt_token, created_at FROM intakes WHERE idempotency_key = ?').bind(requestKey).first<IntakeRow>();
  if (prior) { if (prior.client_id !== client || prior.payload_hash !== hash) fail(409, 'request_conflict', 'Mã lượt gửi đã được dùng cho dữ liệu khác.'); return reply(receiptResponse(prior, true)); }
  await rateLimit(req, env, client);
  if (cv && !env.BUCKET) fail(503, 'files_unavailable', 'Kho CV tạm thời chưa sẵn sàng.');
  const id = 'MD-' + uuid(), receiptToken = token(), createdAt = Date.now(), cvKey = cv ? 'quarantine/' + id : null;
  if (cv && cvKey) await env.BUCKET!.put(cvKey, cv.bytes, { httpMetadata: { contentType: 'application/octet-stream' }, customMetadata: { intakeId: id, scanStatus: 'unscanned' } });
  try {
    await db.batch([
      db.prepare('INSERT INTO intakes (id, kind, job_id, payload, payload_hash, receipt_token, client_id, idempotency_key, is_test, created_at, cv_key, cv_name, cv_mime, cv_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)').bind(id, payload.kind, payload.jobId || null, JSON.stringify(payload), hash, receiptToken, client, requestKey, createdAt, cvKey, cv?.name || null, cv?.mime || null, cv?.bytes.length || 0),
      auditStatement(env, 'public', 'intake.received.test', id),
    ]);
  } catch (error) {
    if (cvKey) await env.BUCKET!.delete(cvKey);
    const existing = await db.prepare('SELECT id, kind, client_id, payload_hash, receipt_token, created_at FROM intakes WHERE idempotency_key = ?').bind(requestKey).first<IntakeRow>();
    if (existing && existing.client_id === client && existing.payload_hash === hash) return reply(receiptResponse(existing, true));
    throw error;
  }
  const saved = await db.prepare('SELECT id, kind, client_id, payload_hash, receipt_token, created_at FROM intakes WHERE id = ?').bind(id).first<IntakeRow>();
  if (!saved) fail(503, 'storage_unconfirmed', 'Chưa xác nhận được việc lưu. Hãy thử lại cùng lượt gửi.');
  return reply(receiptResponse(saved!), 201);
}
async function adminApi(req: Request, env: SiteEnv, path: string) {
  const actor = await authorizeAdmin(req, env), db = database(env);
  if (!['GET', 'HEAD'].includes(req.method)) sameOrigin(req);
  if (path === '/api/admin/session' && req.method === 'GET') return reply({ authenticated: true, role: actor.role, mode: 'staging' });
  if (path === '/api/admin/content' && req.method === 'GET') { const draft = await contentRow(env, 'draft'), live = await published(env); return reply({ data: draft ? JSON.parse(draft.content) : live.data, revision: draft?.revision || 0, publishedRevision: live.revision, updatedAt: draft?.updated_at || null, versionId: live.versionId }); }
  if (path === '/api/admin/content' && req.method === 'PUT') {
    const body = await bodyJson(req), data = validateContent(body.data), expected = body.expectedRevision;
    if (!Number.isInteger(expected) || expected < 0) fail(422, 'revision_required', 'Thiếu phiên bản nội dung.');
    const current = await contentRow(env, 'draft');
    if ((current?.revision || 0) !== expected) fail(409, 'revision_conflict', 'Nội dung đã được sửa ở phiên khác. Hãy tải bản máy chủ hoặc xuất bản sao trước khi hợp nhất.');
    const result = current ? await db.prepare("UPDATE content_records SET content = ?, revision = revision + 1, updated_at = ?, updated_by = ? WHERE key = 'draft' AND revision = ?").bind(JSON.stringify(data), Date.now(), actor.userId, expected).run() : await db.prepare("INSERT OR IGNORE INTO content_records (key, content, revision, updated_at, updated_by) VALUES ('draft', ?, 1, ?, ?)").bind(JSON.stringify(data), Date.now(), actor.userId).run();
    if (result.meta.changes !== 1) fail(409, 'revision_conflict', 'Có phiên khác vừa lưu nội dung. Dữ liệu của bạn chưa bị xóa.');
    await auditStatement(env, actor.userId, 'content.draft.saved', String(expected + 1)).run(); return reply({ saved: true, revision: expected + 1 });
  }
  if (path === '/api/admin/publish' && req.method === 'POST') {
    const body = await bodyJson(req, 2048), draft = await contentRow(env, 'draft'), before = await published(env);
    if (!draft || draft.revision !== body.expectedRevision) fail(409, 'revision_conflict', 'Bản nháp đã thay đổi. Hãy lưu/đọc lại trước khi xuất bản.');
    if (!Number.isInteger(body.expectedPublishedRevision) || body.expectedPublishedRevision !== before.revision) fail(409, 'revision_conflict', 'Bản công khai đã thay đổi. Hãy tải lại trước khi xuất bản.');
    const versionId = 'content-' + draft.revision;
    if (before.versionId === versionId) return reply({ published: true, replayed: true, ...before });
    validateContent(JSON.parse(draft.content)); const baselineId = 'baseline-v15', now = Date.now();
    const results = await db.batch([
      db.prepare('INSERT OR IGNORE INTO content_versions (id, content, draft_revision, created_at, created_by) VALUES (?, ?, 0, ?, ?)').bind(baselineId, JSON.stringify(seed), now, actor.userId),
      db.prepare("INSERT OR IGNORE INTO content_versions (id, content, draft_revision, created_at, created_by) SELECT ?, content, revision, ?, ? FROM content_records WHERE key = 'draft' AND revision = ?").bind(versionId, now, actor.userId, draft.revision),
      db.prepare("INSERT INTO content_records (key, content, revision, version_id, updated_at, updated_by) SELECT 'published', content, 1, id, ?, ? FROM content_versions WHERE id = ? AND EXISTS (SELECT 1 FROM content_records WHERE key = 'draft' AND revision = ?) AND COALESCE((SELECT revision FROM content_records WHERE key = 'published'), 0) = ? ON CONFLICT(key) DO UPDATE SET content = excluded.content, revision = content_records.revision + 1, version_id = excluded.version_id, updated_at = excluded.updated_at, updated_by = excluded.updated_by").bind(now, actor.userId, versionId, draft.revision, body.expectedPublishedRevision),
      db.prepare("INSERT INTO audit_events (id, actor_id, action, subject_id, created_at) SELECT ?, ?, 'content.published', ?, ? WHERE changes() = 1").bind(uuid(), actor.userId, versionId, now),
    ]);
    if (results[2].meta.changes !== 1) fail(409, 'revision_conflict', 'Nội dung vừa thay đổi ở phiên khác. Hãy tải lại; bản nháp vẫn được giữ.');
    return reply({ published: true, ...(await published(env)) });
  }
  if (path === '/api/admin/versions' && req.method === 'GET') { const result = await db.prepare('SELECT id, draft_revision, created_at FROM content_versions ORDER BY created_at DESC, draft_revision DESC LIMIT 30').all(); return reply({ versions: result.results }); }
  if (path === '/api/admin/rollback' && req.method === 'POST') {
    const body = await bodyJson(req, 2048), id = safeId(body.versionId), live = await contentRow(env, 'published');
    if (!Number.isInteger(body.expectedPublishedRevision) || (live?.revision || 0) !== body.expectedPublishedRevision) fail(409, 'revision_conflict', 'Bản công khai đã thay đổi. Hãy tải lại lịch sử.');
    const version = await db.prepare('SELECT content FROM content_versions WHERE id = ?').bind(id).first<{ content: string }>(); if (!version) fail(404, 'version_missing', 'Không tìm thấy phiên bản.');
    const result = await db.prepare("UPDATE content_records SET content = ?, revision = revision + 1, version_id = ?, updated_at = ?, updated_by = ? WHERE key = 'published' AND revision = ?").bind(version!.content, id, Date.now(), actor.userId, body.expectedPublishedRevision).run();
    if (result.meta.changes !== 1) fail(409, 'revision_conflict', 'Bản công khai vừa thay đổi. Hãy tải lại.');
    await auditStatement(env, actor.userId, 'content.restored', id).run(); return reply({ restored: true, ...(await published(env)) });
  }
  if (path === '/api/admin/intakes' && req.method === 'GET') { const result = await db.prepare('SELECT id, kind, job_id, payload, created_at, cv_name, cv_size, is_test FROM intakes ORDER BY created_at DESC LIMIT 100').all<any>(); return reply({ items: result.results.map((row: any) => ({ ...row, payload: JSON.parse(row.payload) })) }); }
  if (path.startsWith('/api/admin/cv/') && req.method === 'GET') {
    const id = safeId(decodeURIComponent(path.slice('/api/admin/cv/'.length))), row = await db.prepare('SELECT cv_key, cv_name FROM intakes WHERE id = ?').bind(id).first<{ cv_key: string; cv_name: string }>();
    if (!row?.cv_key || !env.BUCKET) fail(404, 'file_missing', 'Không tìm thấy CV.'); const file = await env.BUCKET!.get(row!.cv_key); if (!file) fail(404, 'file_missing', 'Không tìm thấy CV.');
    await auditStatement(env, actor.userId, 'intake.cv.downloaded', id).run();
    return new Response(file!.body, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(row!.cv_name || 'cv')}`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' } });
  }
  if (path === '/api/admin/audit' && req.method === 'GET') { const result = await db.prepare('SELECT action, subject_id, created_at FROM audit_events ORDER BY created_at DESC LIMIT 100').all(); return reply({ events: result.results }); }
  fail(404, 'not_found', 'Không tìm thấy chức năng.');
}
export async function handleApi(req: Request, env: SiteEnv) {
  try {
    const path = new URL(req.url).pathname.replace(/\/$/, '');
    if (path.startsWith('/api/admin/')) return await adminApi(req, env, path);
    if (path === '/api/health' && req.method === 'GET') { await database(env).prepare('SELECT key FROM content_records LIMIT 1').first(); return reply({ ok: true, version: 'V15', mode: 'staging', database: true, files: !!env.BUCKET }); }
    if (path === '/api/content' && req.method === 'GET') return reply(await published(env), 200, { 'Cache-Control': 'no-cache' });
    if (path === '/api/session' && req.method === 'GET') { const client = cookieClient(req) || token(), secure = new URL(req.url).protocol === 'https:' ? '; Secure' : ''; return reply({ ready: true, testOnly: true }, 200, { 'Set-Cookie': `md_client=${client}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${secure}` }); }
    if (path === '/api/intake' && req.method === 'POST') return await intake(req, env);
    if (path === '/api/receipt' && req.method === 'POST') {
      sameOrigin(req); const body = await bodyJson(req, 2048), id = safeId(body.id), supplied = text(body.receiptToken, 64, 64);
      const row = await database(env).prepare('SELECT id, kind, created_at, receipt_token FROM intakes WHERE id = ?').bind(id).first<IntakeRow>();
      if (!row || !equalToken(row.receipt_token, supplied)) fail(404, 'receipt_missing', 'Không tìm thấy mã tiếp nhận.');
      return reply({ id: row!.id, kind: row!.kind, receivedAt: row!.created_at, stored: true, testOnly: true });
    }
    fail(404, 'not_found', 'Không tìm thấy chức năng.');
  } catch (error) {
    if (error instanceof ApiError) return reply({ error: error.code, message: error.message }, error.status);
    console.error('site_api_failure', { path: new URL(req.url).pathname, name: error instanceof Error ? error.name : 'UnknownError' });
    return reply({ error: 'server_error', message: 'Chưa hoàn tất được thao tác. Dữ liệu nhập của bạn vẫn được giữ để thử lại.' }, 503);
  }
}
