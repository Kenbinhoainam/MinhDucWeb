# Hướng dẫn cài đặt, demo và bàn giao — Minh Đức V20

Cập nhật ngày **04/11/2026**. Dùng cùng [phạm vi V20](PROTOTYPE-SCOPE-V20.md) và [quy ước phiên bản](VERSIONING.md). Đây là hướng dẫn hiện hành của V20; runbook V19 và staging V15 được giữ làm hồ sơ lịch sử.

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

### 2.1. Cấu hình liên hệ nhanh

Mở **Cài đặt → Social Chat Widget**. Bật/tắt widget; điền hotline, URL Zalo và Messenger thực tế đã được duyệt, rồi lưu. Để trống kênh chưa có. Kiểm trên desktop bằng nút nổi và trên mobile bằng **Liên hệ tư vấn** trong thanh dưới.

Kênh chưa cấu hình hiển thị trạng thái demo. Kênh hợp lệ mở liên kết gọi/nhắn tin ở ứng dụng hoặc tab tương ứng; đây không phải chatbot hay tích hợp tự gửi thông báo hồ sơ. Không dùng kênh của bên thứ ba để thử gửi thật nếu chưa được yêu cầu.

### 2.2. Video trong CMS

1. Mở **Trang chủ → 05 Video giới thiệu** hoặc bài viết cần sửa.
2. Chọn/kéo thả MP4 hoặc WebM, tối đa **100 MB**; chờ kiểm tệp và lưu thành công trước khi rời trang.
3. Xem trước, lưu nội dung và kiểm lại trình phát công khai; bật khối Video nếu cần hiển thị trên trang chủ.
4. Để thay/gỡ, dùng điều khiển tại cùng module. Có thể áp dụng liên kết YouTube hoặc MP4/WebM HTTPS thay cho tệp.
5. Giữ **tệp video gốc** ngoài trình duyệt. Video tải lên lưu ở IndexedDB cùng origin, không nằm trong JSON xuất và không tự đồng bộ qua thiết bị/domain. Xóa dữ liệu website có thể làm mất video cục bộ.

Khi bàn giao: kèm JSON nội dung **và tệp video gốc**, hoặc dùng liên kết video có thể truy cập ở môi trường đích. Nhập JSON có tham chiếu nhưng thiếu tệp thì cần tải lại hoặc chọn URL. Gỡ video trong nội dung không xóa tệp gốc và không đồng nghĩa dọn toàn bộ kho cục bộ.

## 3. Chỉnh nguồn và build tái lập

Nguồn trình bày là `public/flagship-content.js`, `flagship-editorial.js`, `locale-routing.js`, `contact-media.js`, `contact-media.css`, `design-system.css`, `app.js` và các script trong danh sách `sources` của `scripts/build-runtime.mjs`. Bộ CMS có CSS riêng.

```bash
node scripts/build-static.mjs
node scripts/verify-runtime.mjs
pnpm test
```

Lệnh đầu sinh `site-runtime.js`, hai bundle CSS, HTML, template quản trị riêng và `lib/content-seed.json`. Lệnh thứ hai đối chiếu hash nguồn/runtime và hành vi đại diện trước/sau gộp. Test Node bao gồm adapter demo, logo/media, kênh liên hệ/video, API lưu trữ/quyền và locale; không thay cho kiểm thử hosted thực tế.

Khi đổi UI/hành trình, dùng harness tương ứng và ghi kết quả mới. Harness V20 là `scripts/v20-qa.html`; chỉ tạm đưa vào `public/__qa.html` để kiểm tra, sau đó gỡ khỏi gói. Không sửa JSON evidence cũ để ghi thành test mới. Không cần chạy lại toàn bộ 412 trường hợp chỉ vì sửa câu chữ tài liệu.

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

Cách này không triển khai backend, quản trị bảo vệ, database hoặc kho CV. Nội dung biên tập localStorage và video IndexedDB không tự được chuyển sang domain mới.

### Cần cả backend trên hosting riêng

Source có tích hợp với môi trường Sites/Cloudflare Workers. Không coi bản sao static hoặc `pnpm build` là đã thay thế SSO, bindings và dispatch của Sites. Cần cấu hình hoặc thay adapter hạ tầng, D1/R2, owner auth, migration và secret ở server đích; kiểm lại bằng môi trường đích trước khi nhận dữ liệu thật. Xem [kế hoạch tiếp theo](KE-HOACH-TIEP-THEO-V20.md).

## 6. Phát hành trên Sites và rollback

Giữ cùng project, quyền truy cập và nguồn của Site hiện hữu. Dùng workflow nguồn/build/package chính thức; commit đã push, artifact và saved version phải khớp nhau. Chỉ deploy một saved version đã xác định. Một bản lưu chưa chắc đã được deploy; kiểm trạng thái cuối của đúng deployment.

Nếu cần rollback giao diện: chọn một phiên bản đã lưu và kiểm tra deployment sau khi phát hành lại. Không rollback schema hoặc xóa dữ liệu cùng thao tác rollback giao diện. Không coi bảng đối chiếu phiên bản là bằng chứng đã diễn tập restore database.

## 7. Bàn giao và xử lý nhanh

- Ghi V20, commit nguồn, URL và phạm vi static/backend trong README của gói. Không dùng ZIP V12/V16 làm source mới nhất.
- Bàn giao source, lockfile, assets, schema/migration và dữ liệu mẫu; loại `.env`, `.dev.vars`, credential, dữ liệu khách hàng và trạng thái runtime cục bộ.
- Gửi kèm JSON CMS nếu bản trình diễn phụ thuộc vào nội dung biên tập trong trình duyệt. Với video cục bộ, bàn giao thêm tệp gốc; JSON không chứa video.
- Ảnh mất: kiểm đường dẫn, chữ hoa/thường và asset có trong gói; frontend có fallback, vẫn cần sửa URL ở CMS/nguồn.
- Nội dung khác giữa hai máy: kiểm hostname/port, localStorage và bản JSON đã nhập; không reset trước khi xuất bản sao.
- Runtime không khớp: chỉnh nguồn rồi chạy lại build và `verify-runtime`, không sửa file runtime sinh tự động.
