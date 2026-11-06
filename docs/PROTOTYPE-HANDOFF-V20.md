# Minh Đức — Flagship Prototype V20

Ngày cập nhật: **04/11/2026**. Phạm vi: nâng cấp landing page, liên hệ nhanh và biên tập video trên prototype. Giữ Site và quyền truy cập hiện có. V20 là phiên bản sản phẩm, tách biệt bộ đếm bản xuất bản Sites.

## Thay đổi theo yêu cầu

### 1. Social Chat Widget

- Ba kênh Zalo, Messenger và hotline, cấu hình tại **CMS → Cài đặt → Social Chat Widget**. Có bật/tắt toàn bộ widget.
- Để trống mặc định theo lựa chọn của chủ dự án. Kênh chưa có thông tin hiện “Chưa cấu hình · Bản demo”, không tạo số điện thoại hoặc tài khoản giả. Có đường đến biểu mẫu tư vấn.
- Khi cấu hình hợp lệ: số điện thoại dùng `tel:`, Zalo/Messenger mở liên kết chính thức trong tab mới. Kiểm định dạng và host; không nạp SDK chat, theo dõi hoặc kết nối nhắn tin tự động.
- Desktop dùng nút nổi; mobile mở từ **Liên hệ tư vấn** trong thanh hành động dưới. Đã sửa sau vòng xem trực tiếp vì nút nổi trên mobile có thể che ô khu vực tìm việc.
- Bàn phím: trạng thái mở/đóng, nút đóng, Escape trả focus về nút mở, đóng khi chuyển focus ra ngoài. Nhãn công khai có VI/EN/ZH/KO. Đây là bảng liên hệ, không phải cửa sổ hội thoại trực tiếp với nhân viên.

### 2. Màu sắc và typography

- Trắng / xanh rất nhạt `#F2F7FF`, xanh thương hiệu `#1555B6`, đỏ hành động `#D52642`, chữ đậm `#102B50`, chữ phụ `#4B5E78`.
- Thay kiểu tiêu đề serif bằng **Noto Sans** ở cả tiêu đề và nội dung, dùng các weight 400/600/700 đang được đóng gói tại chỗ. Không thêm phụ thuộc font bên ngoài. Font ZH/KO hiện có được giữ cho đúng bộ ký tự.
- Nội dung chính và ô nhập 16–17px; metadata việc làm quan trọng 14px; nút chính 48–54px trở lên. Nhãn ngắn, tương phản rõ, khoảng dòng thoáng cho người lao động phổ thông, vẫn nhất quán khi trình bày B2B.
- Hai CTA ở màn hình đầu: **Tư vấn nhân lực** và **Tìm việc ngay**. Giữ lựa chọn hai nhóm khách và ô tìm việc đặt trước ảnh trên mobile.
- Rút chiều cao hero desktop, làm sáng khối dịch vụ/công việc và đồng bộ bề mặt CMS.

Tương phản màu tính trên các cặp màu phẳng chính: chữ chính/trắng **14,16:1**, chữ phụ/nền nhạt **6,16:1**, chữ trắng/nút đỏ **5,02:1**, chữ trắng/nút xanh **6,98:1**. Các số này không thay thế kiểm toàn bộ trạng thái hay chứng nhận WCAG.

### 3. Upload video

**CMS → Trang chủ → 05 Video giới thiệu** hoặc trình sửa bài viết có cùng bộ điều khiển:

1. Chọn tệp hoặc kéo thả một video **MP4/WebM, tối đa 100 MB**.
2. Kiểm dung lượng, phần mở rộng, MIME và khả năng đọc hình ảnh của video. Hiện trạng thái kiểm tra/lưu, lỗi rõ ràng.
3. Lưu tệp vào kho trình duyệt IndexedDB, hiển thị tên/dung lượng và trình phát xem trước. Video còn sau reload, không nhét tệp lớn vào localStorage.
4. Video trang chủ xuất hiện khi có nguồn và khối Video được bật. Trình phát công khai có controls, `playsinline`, không tự phát. Đóng dialog sẽ dừng phát và giải phóng URL tạm.
5. Có **Gỡ video** và **Áp dụng liên kết** YouTube/MP4/WebM HTTPS. Tệp bị lỗi hoặc lưu không thành công không thay nguồn đang dùng. Gỡ nguồn không xóa tệp gốc hay các tệp đã giữ trong kho cục bộ.

**Phạm vi prototype:** video tải từ máy và cấu hình CMS chỉ thuộc trình duyệt/origin hiện tại. Chúng không tự xuất bản hoặc đồng bộ sang máy khác. JSON có tham chiếu video nhưng không chứa tệp video; cần giữ tệp gốc để tải lại. Nếu tham chiếu không còn tệp, trình phát hướng dẫn tải lại/dùng liên kết. R2 và backend vận hành thật chưa được nối trong lượt này.

## Kiểm chứng

Kết quả trình duyệt **412/412 đạt**, lưu theo suite trong `v20-*.json`. Bộ kiểm thử sử dụng khung 320/390/768/1440px, bốn ngôn ngữ, dữ liệu video tổng hợp do canvas tạo; không dùng hoặc gửi video của khách. Bản build phát hành thành công; 8 tài nguyên chính được đối chiếu trùng nguồn/bản phát hành và không chứa trang QA.

| Nhóm | Bằng chứng |
| --- | --- |
| Bố cục trang / kích thước / ngôn ngữ | `v20-matrix.json` |
| Phóng chữ CSS 200% | `v20-reflow.json` |
| Ngôn ngữ và giữ ngữ cảnh | `v20-locales.json` |
| Tác vụ tìm việc trên mobile | `v20-mobile.json` |
| Hành trình / CMS / dữ liệu rỗng | `v20-interactions.json` |
| Widget, cấu hình, upload, reload, phát, gỡ và lỗi video | `v20-features.json` |
| Kiểm tổng và bản phát hành | `v20-acceptance.json` |

Bộ Node **30/30 đạt**: thêm kiểm whitelist kênh liên hệ, URL video, tệp rỗng/sai loại/vượt dung lượng và trạng thái widget chưa cấu hình; giữ kiểm API/locale và nguyên tắc form không gửi thông tin/CV. Runtime được kiểm giữa nguồn và bản gộp qua 9 API công khai. Ảnh kiểm tra trực tiếp: [desktop](v20-desktop.png), [liên hệ trên mobile](v20-mobile-contact.png).

Đây là kiểm trình duyệt desktop với kích thước mô phỏng; chưa phải thử trên điện thoại vật lý, với người dùng mục tiêu, công nghệ hỗ trợ hoặc đo Core Web Vitals ngoài thực tế. Chưa kiểm cuộc gọi/tin nhắn tới kênh doanh nghiệp vì chủ dự án chọn tự cấu hình trong CMS.

## Chấm lại theo FQ1

**89,25/100, trình bày làm tròn 89/100**, so với **86,25/100** của V19. Đây là đánh giá chuyên gia theo cùng rubric và trọng số, không phải điểm Lighthouse, kết quả nghiên cứu người dùng hay chứng nhận quốc tế. Chênh lệch nhỏ không nên hiểu là phép đo chính xác về chuyển đổi.

| Nhóm | Trọng số | V19 /10 | V20 /10 | V20 quy đổi |
| --- | ---: | ---: | ---: | ---: |
| Định vị và bản sắc | 15 | 8 | 8,5 | 12,75 |
| Mỹ thuật, typography và bố cục | 20 | 9 | 9,5 | 19 |
| Nội dung và sức thuyết phục | 15 | 8 | 8 | 12 |
| Hành trình và chuyển đổi | 20 | 9 | 9,5 | 19 |
| Mobile và tiếp cận | 10 | 9 | 9 | 9 |
| Bản địa hóa | 5 | 8,5 | 8,5 | 4,25 |
| Trạng thái và chuyển động | 5 | 9 | 9,5 | 4,75 |
| Hệ thiết kế và khả năng bảo trì | 10 | 8,5 | 8,5 | 8,5 |
| **Tổng** | **100** | | | **89,25** |

**Đạt tốt cho bản flagship prototype trình khách:** nhận diện sáng và rõ hơn, chữ phù hợp đối tượng, liên hệ nhanh không cản ô tìm việc, quy trình upload thực sự lưu và xem lại được trong phạm vi demo.

**Chưa có cơ sở chấm 95–100:** tư liệu thật/case đã xác minh và khác biệt thương hiệu vẫn thiếu; chưa có vòng thử với người lao động và người mua B2B; bản dịch chưa được người bản ngữ nghiệm thu. Mobile được giữ 9 vì chưa có bằng chứng thiết bị/thử tác vụ mới ngoài môi trường mô phỏng. Điểm bảo trì không tăng: module mới tách riêng nhưng runtime công khai vẫn mang một phần CMS.

Để tiến tới flagship vận hành: bổ sung ảnh và video thật được duyệt; dữ kiện năng lực/case có nguồn; hoàn thiện kênh liên hệ chính thức; thử tác vụ tìm việc/liên hệ với nhóm khách mục tiêu; triển khai kho media và quản trị có xác thực nếu cần nội dung dùng chung. Không lấy điểm prototype làm nghiệm thu production.

## Tiếp tục chỉnh sửa

- Widget, video và validation: `public/contact-media.js`; giao diện tương ứng: `public/contact-media.css`.
- Hệ thiết kế: `public/design-system.css`; giao diện CMS: `public/cms-theme.css`.
- Tích hợp và nội dung: `public/app.js`, `public/flagship-content.js`.
- Sinh lại bằng `node scripts/build-static.mjs`; kiểm bằng `node scripts/verify-runtime.mjs` và script `test`.
- `scripts/v20-qa.html` là harness cục bộ; phải bỏ `public/__qa.html` trước build/phát hành. Không đưa `output/`, `outputs/`, `tmp/` hoặc video thử nghiệm vào nguồn/phần tài nguyên công khai.

## Đối chiếu phiên bản và tài liệu ngày 04/11/2026

Đã đối chiếu bản Sites #13 có trạng thái deploy thành công, commit `95105f351f9264336ae01ba5daea1eb6cd259d5a`, hoàn tất lúc 02:04 ngày 04/11/2026 theo giờ Việt Nam. Đây là mốc UI trước lượt đồng bộ tài liệu; số xuất bản có thể tăng sau khi cập nhật tài liệu mà không đổi nhãn V20.

Hướng dẫn hiện hành: [mục lục](README.md), [phiên bản](VERSIONING.md), [phạm vi V20](PROTOTYPE-SCOPE-V20.md), [runbook V20](RUNBOOK-V20.md), [ảnh/video/logo](IMAGERY-GUIDE.md), [công việc tiếp theo](KE-HOACH-TIEP-THEO-V20.md). Các hướng dẫn V19 đã được đánh dấu lịch sử.

412 kiểm tra trình duyệt, 30 Node tests và điểm FQ1 89,25/100 bên trên là bằng chứng của lượt phát triển V20. Không chạy lại toàn bộ hoặc chấm lại trong lượt chỉ sửa tài liệu này. Biên bản kiểm tài liệu: `DOCUMENTATION-UPDATE-V20-2026-11-04.json`.
