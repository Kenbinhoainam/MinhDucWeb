import { env } from 'cloudflare:workers';
import { handleApi } from '../../../lib/site-api';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => handleApi(request, env);
export const POST = GET;
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
