# Phạm vi bản trải nghiệm — Minh Đức V20

Cập nhật tài liệu ngày **04/11/2026**, theo nguồn V20 và [bàn giao](PROTOTYPE-HANDOFF-V20.md). Website dùng để duyệt giao diện, nội dung và hành trình mô phỏng.

## Trang và người dùng

| Trang / điểm vào | Phạm vi |
| --- | --- |
| `index.html` | Doanh nghiệp/người tìm việc, tìm nhanh, dịch vụ, brief, ảnh, logo doanh nghiệp và cẩm nang |
| `ve-minh-duc.html`, `dich-vu.html` | Giới thiệu và phạm vi dịch vụ mẫu |
| `viec-lam.html`, `tuyen-dung-noi-bo.html` | Tìm/lọc/sắp xếp, lưu và so sánh việc làm |
| `chi-tiet-viec-lam.html?id=…` | Đọc thông tin, quyền lợi và trải nghiệm ứng tuyển demo |
| `tin-tuc.html`, `bai-viet.html?id=…` | Danh sách và nội dung cẩm nang/bài mẫu |
| `lien-he.html` | Nhu cầu tư vấn có ngữ cảnh và xác nhận mô phỏng |
| `chinh-sach-du-lieu.html` | Giải thích phạm vi dữ liệu và cách trải nghiệm |
| `cms-demo.html` | Biên tập nội dung mẫu trên trình duyệt, ảnh/logo, bản dịch và JSON |

Nội dung công khai có VI/EN/ZH/KO; CMS thao tác bằng tiếng Việt và có trường biên tập nhiều ngôn ngữ. V20 kế thừa điều hướng và fallback từng trường của V19, bổ sung giao diện sáng, Noto Sans, bảng liên hệ nhanh và video trong CMS. Bản dịch vẫn chưa được coi là đã hiệu đính bản ngữ toàn phạm vi.

## Dữ liệu và form

- Thông tin tuyển dụng, dịch vụ, tình huống và doanh nghiệp được dùng cho demo; không tự trở thành dữ kiện doanh nghiệp đã xác minh.
- Form có trạng thái kiểm tra/hoàn tất mô phỏng. Giao diện hiện hành không gửi hay lưu tên, số điện thoại hoặc CV qua luồng demo.
- CMS lưu cục bộ, có xuất/nhập JSON. Lưu trong CMS demo không đồng nghĩa cập nhật nguồn website cho mọi khách truy cập hoặc xuất bản lên server.
- Dữ liệu localStorage theo origin/trình duyệt. Hai hostname, hai port hoặc hai trình duyệt có thể hiển thị dữ liệu chỉnh sửa khác nhau.
- Khóa nội dung `md_prototype_v16_content` là khóa tương thích được giữ lại ở V20. Không xóa chỉ vì có tên V16; hãy xuất JSON trước.

## Liên hệ nhanh và video

Social Chat Widget cung cấp Zalo, Messenger và hotline. Kênh được cấu hình tại **CMS → Cài đặt → Social Chat Widget**; mặc định để trống theo lựa chọn chủ dự án. Chỉ kênh hợp lệ mới mở `tel:` hoặc liên kết Zalo/Messenger. Không có SDK hội thoại trực tiếp, tự gửi tin nhắn hoặc thông báo hồ sơ trong prototype.

Desktop có nút nổi; mobile mở bảng liên hệ từ thanh hành động dưới để không che tìm việc. Nhãn công khai có bốn ngôn ngữ và hỗ trợ bàn phím/đóng bằng Escape.

Video MP4/WebM tối đa **100 MB** có thể tải/chọn/kéo thả trong CMS tại Trang chủ → 05 Video giới thiệu hoặc trình sửa bài viết. Video được lưu trong **IndexedDB của trình duyệt/origin hiện tại**, có xem trước, phát lại sau reload, gỡ hoặc thay bằng liên kết YouTube/HTTPS. Trình phát không tự phát.

JSON CMS chỉ mang tham chiếu, **không chứa tệp video**. Sao chép JSON hoặc deploy source không làm video tải từ máy xuất hiện trên trình duyệt/máy khác. Cần giữ tệp gốc để tải lại hoặc dùng URL video truy cập được. Backend media dùng chung/R2 và thông báo Zalo/đồng bộ Google Sheets vẫn chưa được nối trong bản prototype.

## Ảnh và doanh nghiệp

Theo yêu cầu chủ dự án, logo được hiển thị để dựng giao diện demo với khách hàng. Có 14 hồ sơ mẫu, 13 tài nguyên logo riêng (hai hồ sơ dùng Samsung). Có thể bật/tắt logo, thay ảnh và xem danh sách đầy đủ. `demoLogoVisible` là trạng thái hiển thị demo, tách khỏi xác minh quyền sử dụng/quan hệ hợp tác.

Nguồn ảnh và logo: [IMAGERY-GUIDE.md](IMAGERY-GUIDE.md). Nhãn AI lặp đã được bỏ khỏi phần trình bày; provenance vẫn được giữ trong hồ sơ tài nguyên. Không phục hồi các thông báo kiểm định nội bộ lên giao diện chỉ để đồng bộ tài liệu.

## Backend và hosting

Mã Vinext/Worker, D1/R2, migration và API quản trị được giữ lại để phát triển tiếp. `/quan-tri.html` là route được bảo vệ; không thay thế nó bằng một file HTML công khai. Backend đang có ràng buộc thử nghiệm và không tự kết nối với form/CMS demo chỉ bằng việc đổi biến môi trường.

Bản public tiếp tục `noindex`/chặn index theo phạm vi prototype. Triển khai static chỉ phục vụ trải nghiệm công khai và CMS demo; không mang theo API, D1/R2 hoặc SSO quản trị được bảo vệ.

## Những điều chưa được xác nhận

Chưa phải bản tiếp nhận lead/CV thật, chưa có bàn giao vận hành production. Không tuyên bố đạt WCAG đầy đủ, Core Web Vitals thực địa, hiệu đính bản ngữ hoặc thử nghiệm trên toàn bộ thiết bị vật lý. Bằng chứng kiểm thử và điểm tham khảo phải đọc đúng phạm vi trong [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).
