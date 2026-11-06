<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Việc làm Minh Đức — Flagship V12 (Prototype)

**Đã nâng cấp trên mã nguồn V11**, bảo toàn các trang, CMS demo, thư viện ảnh và nội dung quản trị trước đó. Đây là bản chạy thử, **không phải hệ thống tuyển dụng production**.

## Chạy thử

**Windows:** giải nén, nhấn đúp `START-WINDOWS.bat` (cần Python cài sẵn), mở `http://localhost:8000/index.html`. Trang CMS: `http://localhost:8000/quan-tri.html`.

**Linux / macOS:** chạy `./START-LINUX.sh` rồi mở `http://localhost:8000/index.html`.

**Node.js (có API AI tùy chọn):** chạy `node server.mjs` (Node 20+), truy cập `http://127.0.0.1:4173/`. `server.mjs` đã sửa danh sách tệp static và MIME types để phục vụ các ảnh `.webp`, đồ họa `.svg`, `flagship-v12.css` và `demo-translations.js`. AI vẫn tắt nếu chưa cấu hình và chỉ dành cho môi trường phát triển.

## Các nâng cấp thực hiện

- **Art direction:** loại bỏ CSS `@import` font chồng chéo; sử dụng `Noto Serif` + `Noto Sans`; tạo tệp `flagship-v12.css` tổ chức Primitive → Semantic → Component tokens, cải thiện typography, nút bấm, layout, trạng thái focus và breakpoint.
- **Dual Persona Hero:** hai tab doanh nghiệp và người tìm việc; chuyển nội dung/CTA theo đối tượng, hỗ trợ nhãn mới VI/EN/ZH/KO.
- **B2B staffing planner:** widget tương tác ngành sản xuất, quy mô, địa bàn; tự tính khoảng thời gian **minh họa**; CTA mang thông tin tổng quan sang form liên hệ (chưa gửi API).
- **B2C micro-step:** tuyển dụng lao động phổ thông có 2 bước — lựa chọn ca/xe/khu vực, sau đó họ tên/số điện thoại/Zalo/đồng ý liên hệ. **Không thu thập dữ liệu thật.** Tuyển dụng nội bộ vẫn giữ form kèm CV của bản cũ.
- **Hình ảnh:** bổ sung 5 minh họa SVG biên tập (không giả vờ là ảnh hoạt động thực tế), tái sử dụng ảnh WebP phù hợp và tránh trùng URL ảnh trên trang chủ theo dữ liệu mẫu.
- **Motion & mobile:** bật lại hover vật lý, reveal theo cuộn, tôn trọng `prefers-reduced-motion`, giữ dock hành động mobile với vùng chạm >=48px.
- **CMS guardrails:** giới hạn ký tự khi biên tập nội dung, bộ đếm trực tiếp và bảo vệ layout với `overflow-wrap`, aspect/focal CSS, smart grid `:has()`. Dữ liệu demo cũ vẫn dùng localStorage.
- **SEO:** sẵn sàng sinh `Organization` / `FAQPage` / `JobPosting` JSON-LD trong điều kiện **production đã được xác minh**, tránh gắn Schema việc làm giả. Bản prototype vẫn `noindex,nofollow`.
- **Bảo trì:** giữ nguyên code gốc V11 trong `styles.css` để tránh phá tính tương thích; V12 là semantic CSS layer bổ sung. **Chưa loại bỏ toàn bộ CSS vá cũ**, vẫn cần tái cấu trúc stylesheet sâu ở giai đoạn sản phẩm thật.

## Những chức năng KHÔNG tự động trở thành production

1. CMS hiện chạy phía trình duyệt; chưa có phân quyền, cơ sở dữ liệu, workflow duyệt và nhật ký server.
2. Form ứng tuyển, yêu cầu tư vấn và file CV **chưa gửi lên backend/Google Sheets**, không được dùng để nhận dữ liệu cá nhân thật.
3. Ước tính của công cụ B2B mang tính minh họa, không phải SLA hay cam kết nguồn lực.
4. Các doanh nghiệp đối tác, số liệu KPI, ảnh AI và tin tuyển dụng mẫu **chưa xác minh**, không nên đăng công khai như dữ kiện thật.
5. Chưa làm kiểm thử thiết bị thực tế, Pentest, Lighthouse/INP/LCP/CLS hoặc chứng nhận WCAG; các ngưỡng trong roadmap là **mục tiêu**, không phải kết quả đo.
6. **Không bỏ `noindex`** khi chưa có thông tin pháp lý/chính sách riêng tư và tin tuyển dụng thật.

## Cách kích hoạt SEO production (sau khi xác minh)

1. Thay nội dung demo bằng dữ kiện đã được Minh Đức phê duyệt; hoàn tất phân quyền, backend, canonical và privacy.
2. Trước `app.js`, khai báo (sau khi đã xác minh môi trường):

```html
<script>
window.MD_PRODUCTION = {
  verified: true,
  canonicalOrigin: 'https://your-verified-domain.example',
  organizationName: 'Tên pháp lý đã xác minh'
};
</script>
```

3. Chỉ đặt `job.verified === true` khi **từng tin tuyển dụng** đã được kiểm duyệt. Sau đó mới thay robots production, thêm sitemap/canonical, gắn URL chính thức.
4. Cập nhật FAQ để đúng nội dung chính sách thực tế trước khi xuất bản Schema FAQPage.

## Kiểm tra đã thực hiện

- `node --check app.js` và `node --check server.mjs` không báo lỗi.
- Trình duyệt Chromium đã dựng thử `home`, `jobs`, `internal`, `detail`, `about`, `services`, `news`, `article`, `contact`, `admin` ở viewport 390px; không có lỗi JavaScript hoặc tràn ngang trong thử nghiệm.
- Trang chủ cũng được thử tại 768px và 1440px; việc chuyển persona và tính toán quy mô hoạt động.
- Form lao động phổ thông được kiểm tra cả trường hợp thiếu lựa chọn, chuyển bước và submit mẫu.
- Trang CMS có bộ đếm ký tự sau khi mở phần quản lý trang chủ.
- Ảnh trang chủ không trùng URL trong bộ dữ liệu mặc định; tùy chỉnh CMS về sau vẫn cần kiểm soát.

Đối chiếu thay đổi chi tiết tại `CHANGELOG-V12.md`.
