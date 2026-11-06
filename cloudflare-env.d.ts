declare namespace Cloudflare {
  interface Env {
    ASSETS: Fetcher;
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_BOOTSTRAP_EMAIL?: string;
    SITE_MODE?: string;
  }
}
