> **Lưu trữ V9–V14.** Bản sao mục lục cũ được giữ nguyên. Các phiên bản gọi là “hiện tại” bên dưới chỉ đúng tại thời điểm tài liệu cũ được lập. Hướng dẫn hiện hành: [mục lục V20](README.md).

# Current version: Minh Đức V14

See [AUDIT-V14.md](AUDIT-V14.md) for the current audit, evidence and operating limits. The material below is historical.

---

# Việc làm Minh Đức — Premium V9 · $10K Quality Pass

Bản nâng cấp từ prototype V8. **File 10k-audit.html** là phiếu thẩm định theo PDF *The $10K Checklist*, ghi **50/80 (V8) → 60/80 (V9; chấm tạm)**. Đây không phải điểm Lighthouse hay cam kết website trị giá 10.000 USD. Đọc đầy đủ trong trang đánh giá.

## Các cải tiến mới
- Đồng nhất typography Noto Sans / Noto Serif, cải thiện tiếng Việt và phân cấp tiêu đề.
- Hệ màu xanh–đỏ tiết chế, tăng khoảng trắng, tăng độ dễ đọc của thông tin quan trọng.
- Bản Hero WebP 1600×902 giảm từ ~219KB JPG còn ~82KB; poster video WebP nhẹ hơn. Vẫn giữ ảnh gốc để CMS chỉnh sửa.
- Menu mobile có aria-expanded, ESC đóng menu, skip-to-content, nút chạm tối thiểu 48px, thanh hành động dưới mobile; hỗ trợ reduced-motion.
- Hover và marquee điều chỉnh nhẹ, tránh animation nặng; ưu tiên mobile và mức dễ đọc ngoài trời.
- Metadata mô tả riêng cho 10 trang, title động cho trang bài viết và chi tiết việc làm. Bản demo có noindex/nofollow để không lập chỉ mục dữ liệu minh họa.
- CMS thêm **$10K Quality Gate** trong Tổng quan: nội dung 4 mục, SEO, ảnh, đối tác, bản dịch, form và kiểm thử production.
- Giữ cấu trúc **10 file HTML** + báo cáo `10k-audit.html`, không mất các chức năng quản trị V8.

## Giới hạn thực tế
**Chưa thể đạt 80/80 chỉ bằng CSS/HTML.** Ảnh hiện là minh họa, chưa có bộ ảnh thật Minh Đức, chưa có CRM/backend hồ sơ thật, chưa kiểm thử production Core Web Vitals/WCAG và chưa chứng thực đối tác. Mục tiêu 72+/80 chỉ có thể đặt sau giai đoạn triển khai nội dung, hạ tầng và QA thực tế.

# Việc làm Minh Đức — Premium V9

Bản prototype đa trang, được nâng cấp trực tiếp từ V7. Ngày cập nhật: 30/10/2026. **Chỉ để trình diễn giao diện và luồng CMS, chưa phải bản production.**

## Chạy trên Windows

1. Giải nén ZIP, giữ nguyên toàn bộ thư mục và các tệp `assets/`, `app.js`, `demo-translations.js`, `styles.css`.
2. Chạy `START-WINDOWS.bat` (máy cần Python). Hoặc mở Command Prompt trong thư mục dự án và gõ `python -m http.server 8000`.
3. Mở `http://localhost:8000/index.html` để xem website; `http://localhost:8000/quan-tri.html` để thử CMS.
4. Sử dụng cùng địa chỉ localhost/trình duyệt để các trang đọc chung dữ liệu mẫu đã sửa trong `localStorage`.

## Các trang HTML độc lập

- `index.html`: Trang chủ / Hero / tìm việc / đối tác / gallery / video.
- `viec-lam.html`: Việc làm phổ thông, bộ lọc và sắp xếp.
- `tuyen-dung-noi-bo.html`: Tuyển dụng nội bộ, bắt buộc CV khi ứng tuyển.
- `chi-tiet-viec-lam.html`: Mô tả / yêu cầu / quyền lợi / cách ứng tuyển.
- `ve-minh-duc.html`, `dich-vu.html`: Giới thiệu và dịch vụ.
- `tin-tuc.html`, `bai-viet.html`: Danh sách và chi tiết tin tức/video.
- `lien-he.html`: Biểu mẫu liên hệ demo.
- `quan-tri.html`: CMS Premium V9.

## Nâng cấp quan trọng của V9

### 1. Quản lý theo ngữ cảnh, không còn các mục menu rời

Sidebar CMS chỉ còn: Tổng quan, Trang chủ, Tuyển dụng, Bài viết/Tin tức · AI & SEO, Doanh nghiệp hợp tác, Báo cáo và Cài đặt.

- **Media Studio** được gọi bằng nút *Thay ảnh & căn chỉnh* ở ngay khu vực có ảnh trong Trang chủ, tin tuyển dụng, bài viết, hồ sơ doanh nghiệp.
- **Đa ngôn ngữ** được quản lý ngay trong form nội dung, có trạng thái VI/EN/ZH/KO và ô hiệu đính từng trường.
- **SEO Assistant** nằm ngay trong trình biên tập bài viết, giúp điền SEO Title và Meta Description theo quy tắc. Trình theo dõi điểm SEO theo quy tắc nằm trong danh sách bài viết.
- **Trang chủ** chia thành 7 nhóm thu gọn: Hero, Giới thiệu, KPI, Gallery, Video, Ẩn/hiện, Ngôn ngữ. Không thể kéo thả tự do hoặc thay đổi lưới giao diện.
- **Tin tuyển dụng** có 4 nhóm nội dung thu gọn (Mô tả, Yêu cầu, Quyền lợi, Cách ứng tuyển); có khu vực hiệu đính ngôn ngữ ngay trong bài.
- **Địa điểm làm việc** từ `select` đổi thành ô nhập văn bản tự do có gợi ý tỉnh/khu vực. Bộ lọc việc làm tìm theo tên tỉnh có trong chuỗi địa điểm.

### 2. Bản dịch demo

- Mở website, chọn **VI / EN / ZH / KO** ở header. Bổ sung hơn 90 cụm bản dịch mới cho các trang công khai; giữ bản dịch có sẵn cho các bài đăng, thông tin tuyển dụng và nội dung trang chủ mặc định.
- Từ ngữ, thông báo, form và nhãn trạng thái phổ biến được dịch. Tên riêng doanh nghiệp/khu công nghiệp giữ nguyên hoặc phiên âm theo ngữ cảnh.
- Nội dung nhân viên tự nhập mới: nếu có backend/token sẽ yêu cầu dịch khi lưu; **nếu chưa cấu hình hoặc dịch lỗi, hiển thị bản nguồn tiếng Việt**. Trình duyệt không tự gọi AI một cách không an toàn.
- Các nút hiệu đính trong form cho phép lưu văn bản EN/ZH/KO thủ công trên trình duyệt. Không cần một menu đa ngôn ngữ riêng.

### 3. 14 hồ sơ doanh nghiệp mẫu

Danh sách từ yêu cầu được giữ trong **`doanh-nghiep-mau.json`** với đầy đủ 6 trường đầu vào (`companyName`, `industry`, `region`, `marqueeOrder`, `websiteUrl`, `logoUrl`). Trong CMS có hồ sơ tương ứng, nhận diện tên, ngành, quốc gia, URL website, URL logo và thứ tự marquee **1 → 14**.

Danh sách mặc định: Samsung, LG Electronics, Canon Việt Nam, Foxconn, ASICS, SEV, Goertek Vina, Luxshare-ICT, Amkor Technology, Pegatron, Compal Electronics, Wistron Infocomm, Quanta Computer và Inventec.

**Quan trọng:** Đây là dữ liệu do người dùng cung cấp để làm mẫu; không chứng minh quan hệ hợp tác với Minh Đức. Logo được giữ trong hồ sơ nhưng **không hiện công khai khi chưa tích trạng thái đã xác nhận quyền sử dụng**. Tên các công ty có thể chạy trong dải tham khảo, kèm cảnh báo rõ ràng. Các logo URL trên Wikimedia Commons chưa được xác minh tình trạng truy cập hoặc giấy phép.

Nếu người dùng đã mở V7 trước đó, V9 tiếp tục dùng khóa localStorage cũ để giữ dữ liệu thay đổi; sẽ tự bổ sung các hồ sơ mẫu bị thiếu và loại các placeholder demo mặc định. Để xem dữ liệu mẫu thuần mới có thể dùng profile trình duyệt khác hoặc thực hiện khôi phục dữ liệu mẫu từ CMS sau khi sao lưu.

## Kiểm thử đã thực hiện

- Kiểm tra cú pháp `app.js` và `demo-translations.js` bằng Node.js.
- Khởi tạo/render cả **10 trang HTML** trong Chromium không ghi nhận lỗi JavaScript.
- Tại CMS: mở 7 module Trang chủ, lưu bản dịch trực tiếp, nhập tự do địa điểm làm việc, lưu tuyển dụng, chạy gợi ý SEO, xem đủ 14 hồ sơ doanh nghiệp.
- Kiểm tra Home mobile 390px: không bị tràn ngang trong bài thử. Ảnh chụp CMS/Desktop được tạo từ bản V9.

Không nên hiểu các bài kiểm tra trên là bảo đảm mọi trình duyệt hay toàn bộ hệ thống backend hoạt động.

## Những gì chưa phải tính năng thật

- CMS demo lưu cục bộ bằng `localStorage`, chưa có tài khoản nhân viên và phân quyền.
- Dịch tự động AI và soạn content AI thật chỉ hoạt động sau khi tích hợp backend/bảo mật API key; hiện tại có dịch demo và gợi ý SEO theo quy tắc.
- Hồ sơ ứng viên và CV **không được gửi/lưu vào hệ thống thực**; chưa có kết nối telesale hoặc Google Sheets.
- Upload và chỉnh ảnh trong Image Studio là mô phỏng trên trình duyệt, chưa có kho media server/CDN.
- Số liệu KPI, doanh nghiệp, tuyển dụng, ảnh/videoclip là dữ liệu minh họa; không dùng làm bằng chứng năng lực hoặc quan hệ hợp tác khi chào thầu.
- Khi sản xuất thật cần bảo mật thông tin ứng viên, kiểm duyệt bản dịch, quyền dùng logo/hình ảnh, cấu trúc SEO và kiểm thử responsive/accessibility đầy đủ.

## Tệp kỹ thuật

`app.js` vận hành giao diện, `demo-translations.js` chứa bản dịch demo, `styles.css` là design system, `assets/` chứa logo và ảnh mẫu. `server.mjs` và `.env.example` là backend AI **mẫu**, cần cấu hình riêng và rà bảo mật trước khi chạy công khai.


## Nâng cấp hình ảnh V10

Đã đưa 8 ảnh AI minh họa vào các khối trực tiếp; xem `IMAGERY-GUIDE.md` và `assets/imagery-manifest.json`. Tất cả trang vẫn riêng lẻ, HTML + CSS + JS và CMS như V9. Ảnh không phải bằng chứng hoạt động doanh nghiệp.
