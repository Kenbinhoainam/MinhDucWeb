# Hướng dẫn ảnh và logo — Minh Đức V20

Cập nhật ngày **04/11/2026**. Hướng dẫn tài nguyên hiện hành; nhãn AI lặp đã được bỏ khỏi phần trình bày theo yêu cầu, nhưng nguồn gốc tài nguyên vẫn được lưu trong hồ sơ. Không thay đổi nguồn gốc hoặc trạng thái quyền chỉ để đồng bộ tên phiên bản.

## Nguồn cần tra cứu

- [Manifest ảnh minh họa](../public/assets/imagery-manifest.json).
- [Manifest logo doanh nghiệp](../public/assets/partners/manifest.json).
- Các tài nguyên cẩm nang `editorial-*.svg` trong `public/assets/` là đồ họa cho nội dung prototype; chỉnh ở nguồn SVG hoặc nguồn bài tương ứng.

Ảnh minh họa định hướng thiết kế, không phải bằng chứng về nhân sự, nhà máy hoặc trụ sở thực tế của Minh Đức. Logo trong demo không xác nhận quan hệ hợp tác hoặc quyền thương hiệu đã được kiểm tra.

## Tài nguyên ảnh chính

Kích thước đối chiếu từ file trong nguồn V20 ngày 04/11/2026:

| Tài nguyên trong `public/assets/` | Kích thước pixel | Vai trò |
| --- | ---: | --- |
| `hero-photo.webp` | 1672 × 941 | Hero / ảnh chủ đạo |
| `gallery-facility.webp` | 1448 × 1086 | Không gian doanh nghiệp |
| `gallery-line.webp` | 1448 × 1086 | Dây chuyền / công việc |
| `gallery-group.webp` | 1448 × 1086 | Hoạt động tập thể |
| `gallery-operator.webp` | 1448 × 1086 | Công việc sản xuất |
| `gallery-meeting.webp` | 1448 × 1086 | Làm việc / đào tạo |
| `video-poster.webp` | 1672 × 941 | Poster nội dung video |

Kích thước file không chứng minh chất lượng trên mọi bố cục hoặc quyền sử dụng. Khi thay ảnh, kiểm tỷ lệ, điểm nhìn và preview ở viewport thật; không kéo giãn ảnh/logo để lấp khung.

## Bộ doanh nghiệp demo

14 hồ sơ, 13 logo riêng trong `public/assets/partners/`: Samsung, LG, Canon, Foxconn, ASICS, Goertek, Luxshare, Amkor, Pegatron, Compal, Wistron, Quanta và Inventec. Hồ sơ Samsung và SEV dùng chung tài nguyên Samsung. File được lưu cùng website để tránh phụ thuộc đường dẫn ngoài khi trình diễn.

`demoLogoVisible` điều khiển hiển thị; `approved` hoặc hồ sơ quyền là vấn đề riêng. Giữ yêu cầu hiển thị logo demo của chủ dự án. Bản đánh giá quyền V17 là ảnh chụp trạng thái của V17, không phải chỉ dẫn ẩn lại logo trong V20.

Nguồn, định dạng gốc/bản render và trạng thái chưa xác minh nằm trong manifest. Logo không được vẽ lại hoặc dùng tên giả để thay đổi chủ thể doanh nghiệp.

## Thao tác CMS

1. Trong Trang chủ/Tuyển dụng/Bài viết, mở phần thay ảnh theo ngữ cảnh. Với logo, chọn Hồ sơ doanh nghiệp → Đổi logo & xem trước.
2. Chọn tệp raster được bộ tải lên hỗ trợ hoặc dùng URL HTTPS/đường dẫn assets; ví dụ logo có sẵn: `assets/partners/samsung.svg`.
3. Kiểm desktop/mobile và giữ tỷ lệ logo. Lưu ảnh rồi kiểm lại trường nguồn, preview và ảnh thu nhỏ.
4. Lưu nội dung form và xem trước trang. CMS chỉ lưu ở trình duyệt; muốn bàn giao bản đã biên tập, xuất JSON trước khi reset/chuyển máy.

Bộ tải lên ảnh hiện nhận JPG/PNG/WebP tối đa 8 MB. SVG được dùng qua tài nguyên/URL phù hợp, không đồng nghĩa có thể tải mọi tệp SVG vào bộ chọn ảnh. Khi đường dẫn logo lỗi, tên doanh nghiệp là fallback; vẫn cần sửa nguồn thay vì coi fallback là tài nguyên hợp lệ.

## Video V20 và bàn giao tệp

Tải video ở Trang chủ → 05 Video giới thiệu hoặc trình sửa bài viết. Bộ video nhận MP4/WebM tối đa **100 MB**, kiểm MIME/phần mở rộng/dung lượng/khả năng đọc, lưu IndexedDB rồi cho xem trước. Đây là bộ điều khiển khác với tải ảnh JPG/PNG/WebP 8 MB ở trên.

Video tải từ máy thuộc origin/trình duyệt hiện tại; JSON chỉ giữ tham chiếu và không chứa tệp. Giữ tệp gốc, kèm khi bàn giao hoặc dùng liên kết YouTube/HTTPS có thể xem ở môi trường đích. Xóa dữ liệu website có thể xóa kho video cục bộ. Gỡ nguồn đang hiển thị không đồng nghĩa xóa tệp gốc hoặc dọn tất cả tệp đã giữ.

Nguồn triển khai: `public/contact-media.js`, `public/contact-media.css`; hướng dẫn thao tác và hosting: [RUNBOOK-V20.md](RUNBOOK-V20.md). Nội dung video thật/quyền công bố cần được chủ nội dung cung cấp; lượt đồng bộ tài liệu không tự bổ sung hoặc gửi video của khách.
