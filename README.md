# Website Minh Đức — Prototype V27 (bản nháp)

Tài liệu hiện hành cập nhật ngày **05/11/2026**. V27 cá nhân hóa theo thông tin Minh Đức cung cấp: hồ sơ doanh nghiệp, các kênh liên hệ và chi nhánh có Google Maps quản lý trong CMS. Xem [kế hoạch, phản biện và kiểm chứng V27](docs/PERSONALIZATION-PLAN-V27.md). CMS demo lưu theo trình duyệt; biểu mẫu không gửi thông tin/CV. Bản V26 đã xuất bản được giữ nguyên trong lúc V27 còn là nháp. Các báo cáo V25/V26 là lịch sử, không phải điểm chấm mới V27. Số phiên bản Sites là bộ đếm riêng.

Địa chỉ GitHub Pages dự kiến: https://kenbinhoainam.github.io/MinhDucWeb/

Bản Sites hiện tại: https://minh-duc-prototype.kenbinhoainam.chatgpt.site

## Xuất bản trên GitHub Pages

Kho này được chuyển từ mã nguồn site chính đang xuất bản, commit `cedb74597c54391150d485fdd95d84f3d7fd910e` (Sites version 27). URL GitHub Pages chỉ hoạt động sau khi bật Pages và workflow triển khai thành công.

1. Mở **Settings → Pages** của kho `Kenbinhoainam/MinhDucWeb`, chọn **Source: GitHub Actions**. Kho hiện riêng tư; cần gói GitHub hỗ trợ Pages cho kho riêng tư. Không tự đổi quyền riêng tư chỉ để triển khai.
2. Trong **Actions → Deploy GitHub Pages**, chọn **Run workflow** trên nhánh `main` nếu lần chạy đầu xảy ra trước khi bật Pages.
3. Kiểm tra workflow thành công và mở URL trên. Các lần push tiếp theo lên `main` sẽ tự triển khai.

Xuất bản tĩnh chỉ cần Node.js 22.13 trở lên, không cần cài dependency:

```bash
npm run export:pages
```

Thư mục triển khai là `dist/pages/`. Build tạo HTML, CSS và JavaScript từ nguồn, đặt canonical/Open Graph theo URL mới và giữ điều hướng trong `/MinhDucWeb/`. Có thể đặt `MD_PUBLIC_SITE_URL` để đổi URL khi triển khai ở đường dẫn khác; workflow lấy URL từ cấu hình Pages.

GitHub Pages chỉ chạy prototype tĩnh. CMS demo và các biểu mẫu mô phỏng tiếp tục hoạt động trong trình duyệt; Worker, D1/R2, API và trang quản trị có đăng nhập không nằm trong gói Pages. Bản Sites chưa được chuyển hướng trong khi URL mới chưa được xác minh hoạt động.

Dữ liệu CMS demo và video gắn với từng domain: xuất JSON từ miền cũ, nhập lại ở miền mới và tải lại video từ tệp gốc nếu cần. Việc chuyển mã nguồn không sao chép dữ liệu trình duyệt.

V21 giữ giao diện navy–đỏ, Noto Sans và hai hành trình doanh nghiệp/người tìm việc; sửa tính nhất quán CMS, điều hướng, bàn phím, bản dịch và trạng thái video. Home/About phát triển nội dung “Rõ công việc — Rõ điều kiện — Rõ người phụ trách”. Đây chưa phải kết luận nghiệm thu flagship hoặc điểm chấm mới.

Đây là prototype nhiều trang, phục vụ duyệt thiết kế và hành trình người tìm việc, khách hàng doanh nghiệp, biên tập viên. Form mô phỏng hoàn tất, không gửi hoặc lưu thông tin liên hệ/CV. CMS demo lưu nội dung trong trình duyệt, tách biệt với API quản trị được giữ lại.

## Bắt đầu

Máy cần Node.js đáp ứng `engines` trong [package.json](package.json) (`>=22.13.0`); dùng pnpm `11.25.0` theo trường `packageManager`. Chạy tại thư mục gốc có `package.json`:

```bash
pnpm run install:ci
node scripts/build-static.mjs
node scripts/preview-static.mjs
```

Mở `http://127.0.0.1:4173/` và `/cms-demo.html`. Dừng server bằng Ctrl+C. Không mở HTML bằng `file://`; dùng cùng origin/trình duyệt để nội dung CMS được chia sẻ giữa các trang. Prototype tĩnh không yêu cầu API key hoặc database.

Trong môi trường Sites được quản lý, dùng preview do Sites cung cấp thay vì tự chạy thêm server. Hướng dẫn chạy Worker/backend và hosting riêng: [RUNBOOK-V20.md](docs/RUNBOOK-V20.md).

## Tài liệu hiện hành

| Tài liệu | Mục đích |
| --- | --- |
| [Mục lục](docs/README.md) | Phân biệt hướng dẫn hiện hành và báo cáo lịch sử |
| [Phiên bản và nguồn](docs/VERSIONING.md) | V20, số xuất bản Sites, commit, runtime và nhãn tương thích cũ |
| [Phạm vi prototype](docs/PROTOTYPE-SCOPE-V20.md) | Trang, ngôn ngữ, dữ liệu, form, CMS và giới hạn |
| [Hướng dẫn vận hành](docs/RUNBOOK-V20.md) | Cài đặt, preview, CMS, build, hosting và bàn giao |
| [Bàn giao V20](docs/PROTOTYPE-HANDOFF-V20.md) | Thay đổi và bằng chứng kiểm chứng của V20 |
| [Ảnh và logo](docs/IMAGERY-GUIDE.md) | Tài nguyên, nguồn gốc, thay ảnh và logo demo |
| [Công việc tiếp theo](docs/KE-HOACH-TIEP-THEO-V20.md) | Baseline V20 và phần còn lại trước vận hành thật |

## Nguồn cần chỉnh và đầu ra sinh tự động

| Nguồn | Trách nhiệm |
| --- | --- |
| `public/contact-media.js`, `public/contact-media.css` | Kênh liên hệ, cấu hình CMS, video IndexedDB và trình phát |
| `public/flagship-content.js` | Bố cục/nội dung và hành trình công khai |
| `public/flagship-editorial.js` | Nội dung dịch vụ, cẩm nang mẫu và locale |
| `public/locale-routing.js` | Chọn/giữ locale và ngữ cảnh điều hướng |
| `public/design-system.css` | Hệ thiết kế công khai; font ở `public/fonts.css` |
| `public/app.js`, các file copy và `public/prototype-v17.js` | Dữ liệu mẫu, thao tác ứng dụng và adapter demo tương thích |
| `public/cms-theme.css`, nguồn CSS CMS trong `scripts/build-static.mjs` | Giao diện biên tập |
| `scripts/build-runtime.mjs`, `scripts/build-static.mjs`, `scripts/prerender.mjs` | Gộp runtime, sinh CSS, HTML và seed |

**Không sửa trực tiếp** `public/site-runtime.js`, `public/site.css`, `public/cms.css`, HTML được prerender hoặc `lib/content-seed.json`. Chỉnh nguồn rồi chạy lại build. `private-pages/quan-tri.html` là template có bảo vệ; không tạo `public/quan-tri.html`.

## Liên hệ nhanh và video

- **CMS → Cài đặt → Social Chat Widget:** bật/tắt, điền hotline, URL Zalo và Messenger. Kênh chưa có để trống. Desktop dùng nút nổi; mobile mở từ thanh hành động dưới. Đây là bảng liên hệ, không phải chat trực tiếp hay thông báo tự động.
- **CMS → Trang chủ → 05 Video giới thiệu** hoặc trình sửa bài viết: chọn/kéo thả MP4/WebM ≤100 MB, xem trước, lưu, gỡ hoặc áp dụng liên kết YouTube/HTTPS.
- Cấu hình và video tải lên thuộc trình duyệt/origin hiện tại. JSON chỉ chứa tham chiếu video; người xem trên thiết bị khác cần tệp gốc được tải lại hoặc URL phù hợp.

## Kiểm tra và phát hành

```bash
node scripts/build-static.mjs
node scripts/verify-runtime.mjs
pnpm test
```

Build Worker đầy đủ dùng `pnpm build`; trên Sites dùng helper build/phát hành chính thức, giữ đúng project và audience hiện có. Không đưa `public/__qa.html`, `public/__proof.html`, secret hoặc dữ liệu vận hành vào gói phát hành.

Bằng chứng **đã ghi nhận cho V20**: 412 trường hợp trình duyệt, 30 Node tests, runtime parity và build đầy đủ đạt. Chi tiết và giới hạn ở [bàn giao V20](docs/PROTOTYPE-HANDOFF-V20.md), không phải các phép kiểm mới được chạy lại chỉ vì cập nhật tài liệu.

Đánh giá FQ1 tham khảo của V20: **89,25/100** (làm tròn 89), từ 86,25 của V19. Điểm P1.0.0 96,6 của V17 thuộc rubric/phạm vi khác, không phải điểm V20 và không thể so trực tiếp. Lượt cập nhật tài liệu này không chấm lại website.

## Dữ liệu và phần backend được giữ lại

CMS demo dùng localStorage, có xuất/nhập JSON. Video MP4/WebM ≤100 MB được lưu riêng trong IndexedDB, không chứa trong JSON xuất. Trước khi chuyển máy/domain hoặc xóa dữ liệu website, xuất JSON và giữ tệp video gốc/URL để phục hồi. Logo doanh nghiệp hiển thị để trình bày demo theo yêu cầu chủ dự án; trạng thái hiển thị không xác nhận quan hệ hợp tác hoặc quyền thương hiệu.

Vinext/Worker, D1/R2, schema và migration vẫn nằm trong repo để tiếp tục phát triển. Giao diện prototype chưa được nối thành luồng nhận hồ sơ/CV và xử lý lead thật. Xem [phạm vi](docs/PROTOTYPE-SCOPE-V20.md) trước khi triển khai backend hoặc dùng hướng dẫn staging lịch sử.
