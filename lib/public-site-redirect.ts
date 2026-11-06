const LEGACY_HOST = "minh-duc-prototype.kenbinhoainam.chatgpt.site";
const DESTINATION_BASE = "https://kenbinhoainam.github.io/MinhDucWeb/";

// Only public HTML pages move. APIs, authentication, administration, and static
// assets continue through the existing Sites handler.
const publicPages = [
  "index.html",
  "viec-lam.html",
  "chi-tiet-viec-lam.html",
  "tuyen-dung-noi-bo.html",
  "tin-tuc.html",
  "bai-viet.html",
  "dich-vu.html",
  "ve-minh-duc.html",
  "lien-he.html",
  "chinh-sach-du-lieu.html",
  "tv.html",
  "cms-demo.html",
  "sheets-sync-demo.html",
  "conversion-reports-demo.html",
];

const destinations = new Map<string, string>([["/", ""]]);
for (const page of publicPages) {
  const stem = page.slice(0, -".html".length);
  destinations.set(`/${page}`, page);
  destinations.set(`/${stem}`, page);
  destinations.set(`/${stem}/`, page);
}

// Cloudflare must run the worker before serving matching public HTML assets.
export const publicSiteRedirectPaths = Object.freeze([...destinations.keys()]);

export function isPublicSitePageRequest(request: Request): boolean {
  return (request.method === "GET" || request.method === "HEAD") &&
    destinations.has(new URL(request.url).pathname);
}

export function redirectPublicSiteRequest(request: Request): Response | null {
  if (!isPublicSitePageRequest(request)) return null;

  const url = new URL(request.url);
  if (url.host !== LEGACY_HOST) return null;

  const page = destinations.get(url.pathname);
  if (page === undefined) return null;

  // Build from a fixed base and allowlisted filename so input cannot replace
  // the host or duplicate the GitHub project prefix. Keep the raw query intact.
  // URL fragments are carried by browsers across this 308 response.
  const destination = new URL(page, DESTINATION_BASE);
  destination.search = url.search;
  return Response.redirect(destination.href, 308);
}
