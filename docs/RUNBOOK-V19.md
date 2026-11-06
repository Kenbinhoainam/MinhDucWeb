<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Hướng dẫn cài đặt, demo và bàn giao — Minh Đức V19

Cập nhật ngày **02/11/2026**. Dùng cùng [phạm vi V19](PROTOTYPE-SCOPE-V19.md) và [quy ước phiên bản](VERSIONING.md). Hướng dẫn này thay vai trò hướng dẫn hiện hành của runbook staging V15; giữ runbook cũ làm hồ sơ lịch sử.

## 1. Chuẩn bị và chạy prototype tĩnh

Dùng đúng source có `package.json`, lockfile và thư mục `public/`. Node.js phải thỏa `engines` (`>=22.13.0`), pnpm theo `packageManager` (`11.25.0`). Giữ lockfile khi cài.

```bash
pnpm run install:ci
node scripts/build-static.mjs
node scripts/preview-static.mjs
```

Mở `http://127.0.0.1:4173/`. CMS demo tại `http://127.0.0.1:4173/cms-demo.html`. Ctrl+C dừng server. Không cần D1, R2, tài khoản quản trị hay API key cho luồng tĩnh này. Không chạy bằng cách nhấp đúp HTML qua `file://`.

Nếu port 4173 bận, đóng tiến trình preview cũ hoặc dùng một HTTP server khác cho **thư mục `public/`** và giữ nguyên các đường dẫn. Thay port/origin sẽ tạo một vùng lưu CMS khác.

Trong môi trường Sites được quản lý, dùng preview chính thức của Sites và URL mà môi trường trả về; không tự tạo thêm server song song.

## 2. Sử dụng CMS demo

1. Mở `cms-demo.html` cùng hostname/port với bản trình diễn.
2. Chọn Trang chủ, Tuyển dụng, Bài viết, Hồ sơ doanh nghiệp hoặc Cài đặt.
3. Biên tập nguồn, ảnh và bản dịch tại trường tương ứng; lưu nội dung demo rồi xem trước đúng viewport/locale.
4. Với doanh nghiệp: chọn hồ sơ, thay logo, kiểm preview và điều khiển bật/tắt. Logo local có thể dùng đường dẫn `assets/partners/samsung.svg`.
5. Trước khi reset hoặc chuyển máy: vào Cài đặt → Xuất nội dung để lưu JSON. Nhập lại JSON trên origin đích nếu muốn chuyển bản demo đã biên tập.

Lưu CMS chỉ thay dữ liệu trong trình duyệt hiện tại. Để khách khác nhận cùng bộ nội dung, cần bàn giao/nhập JSON hoặc cập nhật dữ liệu nguồn và build/phát hành. Không dùng CV hoặc thông tin cá nhân thật khi thử form.

## 3. Chỉnh nguồn và build tái lập

Nguồn trình bày là `public/flagship-content.js`, `flagship-editorial.js`, `locale-routing.js`, `design-system.css`, `app.js` và các script trong danh sách `sources` của `scripts/build-runtime.mjs`. Bộ CMS có CSS riêng.

```bash
node scripts/build-static.mjs
node scripts/verify-runtime.mjs
pnpm test
```

Lệnh đầu sinh `site-runtime.js`, hai bundle CSS, HTML, template quản trị riêng và `lib/content-seed.json`. Lệnh thứ hai đối chiếu hash nguồn/runtime và hành vi đại diện trước/sau gộp. Test Node bao gồm adapter demo, logo/media, API lưu trữ/quyền và locale; không thay cho kiểm thử hosted thực tế.

Khi đổi UI/hành trình, dùng harness tương ứng và ghi kết quả mới. Harness V19 là `scripts/v19-qa.html`; chỉ tạm đưa vào `public/__qa.html` để kiểm tra, sau đó gỡ khỏi gói. Không sửa JSON evidence cũ để ghi thành test mới. Không cần chạy lại toàn bộ 362 trường hợp chỉ vì sửa câu chữ tài liệu.

## 4. Worker/backend được giữ lại

```bash
pnpm dev
pnpm build
pnpm start
```

`pnpm dev` đi qua wrapper theo execution profile; chế độ portable đặt cổng 5173. `pnpm build` có prebuild sinh tài nguyên tĩnh rồi build Vinext/Vite; `pnpm start` cần `dist/server/wrangler.json` do build tạo và in URL thực tế khi khởi động. Không giả định nó luôn dùng port của preview tĩnh.

Schema ở `db/schema.ts`; migration SQL/journal/snapshot ở `drizzle/`. Giữ lịch sử migration đã áp dụng; chỉ tạo migration mới cho thay đổi schema. Lệnh `pnpm db:generate` sinh migration từ schema, không phải lệnh xuất dữ liệu D1 hay tự áp dụng lên production.

Bindings `DB`/`BUCKET` và danh tính quản trị thuộc hạ tầng server. `ADMIN_BOOTSTRAP_EMAIL`, nếu dùng cho owner bootstrap, phải cấu hình riêng trên server; không ghi giá trị thật vào repo, browser hoặc gói tài liệu. Không có API key bắt buộc cho demo. `SITE_MODE` hoặc nhãn health cũ không tự bật luồng vận hành thật.

## 5. Hosting riêng

### Chỉ cần trình diễn frontend/CMS demo

1. Cài dependencies và chạy `node scripts/build-static.mjs`.
2. Đưa **toàn bộ nội dung `public/`** lên document root của hosting tĩnh, giữ `.html` và mọi thư mục tài nguyên. Loại `__qa.html`, `__proof.html` nếu còn tệp thử.
3. Giữ các URL trang con được phục vụ như file thật; không dùng fallback SPA trả `index.html` cho mọi tài nguyên hỏng.
4. Nếu đổi domain, sửa origin trong `scripts/prerender.mjs` và `public/seo-preview.js`, rồi build lại. Rà policy domain trong `public/brand-rights.js` nếu triển khai cơ chế cấp quyền thật; không bật trạng thái quyền chỉ để chuyển hosting.
5. Kiểm trang chủ, chi tiết có ID hợp lệ/không hợp lệ, CMS, bốn locale, ảnh/logo và canonical/hreflang trên hostname mới. Tiếp tục noindex cho bản demo.

Cách này không triển khai backend, quản trị bảo vệ, database hoặc kho CV. Nội dung biên tập localStorage không tự được chuyển sang domain mới.

### Cần cả backend trên hosting riêng

Source có tích hợp với môi trường Sites/Cloudflare Workers. Không coi bản sao static hoặc `pnpm build` là đã thay thế SSO, bindings và dispatch của Sites. Cần cấu hình hoặc thay adapter hạ tầng, D1/R2, owner auth, migration và secret ở server đích; kiểm lại bằng môi trường đích trước khi nhận dữ liệu thật. Xem [kế hoạch tiếp theo](KE-HOACH-TIEP-THEO-V19.md).

## 6. Phát hành trên Sites và rollback

Giữ cùng project, quyền truy cập và nguồn của Site hiện hữu. Dùng workflow nguồn/build/package chính thức; commit đã push, artifact và saved version phải khớp nhau. Chỉ deploy một saved version đã xác định. Một bản lưu chưa chắc đã được deploy; kiểm trạng thái cuối của đúng deployment.

Nếu cần rollback giao diện: chọn một phiên bản đã lưu và kiểm tra deployment sau khi phát hành lại. Không rollback schema hoặc xóa dữ liệu cùng thao tác rollback giao diện. Không coi bảng đối chiếu phiên bản là bằng chứng đã diễn tập restore database.

## 7. Bàn giao và xử lý nhanh

- Ghi V19, commit nguồn, URL và phạm vi static/backend trong README của gói. Không dùng ZIP V12/V16 làm source mới nhất.
- Bàn giao source, lockfile, assets, schema/migration và dữ liệu mẫu; loại `.env`, `.dev.vars`, credential, dữ liệu khách hàng và trạng thái runtime cục bộ.
- Gửi kèm JSON CMS nếu bản trình diễn đang phụ thuộc vào nội dung được biên tập trong trình duyệt.
- Ảnh mất: kiểm đường dẫn, chữ hoa/thường và asset có trong gói; frontend có fallback, vẫn cần sửa URL ở CMS/nguồn.
- Nội dung khác giữa hai máy: kiểm hostname/port, localStorage và bản JSON đã nhập; không reset trước khi xuất bản sao.
- Runtime không khớp: chỉnh nguồn rồi chạy lại build và `verify-runtime`, không sửa file runtime sinh tự động.
