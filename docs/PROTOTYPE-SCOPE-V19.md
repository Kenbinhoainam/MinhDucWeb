<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Phạm vi bản trải nghiệm — Minh Đức V19

Cập nhật tài liệu ngày **02/11/2026**, theo nguồn V19 và [bàn giao](PROTOTYPE-HANDOFF-V19.md). Website dùng để duyệt giao diện, nội dung và hành trình mô phỏng.

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

Nội dung công khai có VI/EN/ZH/KO; CMS thao tác bằng tiếng Việt và có trường biên tập nhiều ngôn ngữ. V19 sửa giữ locale, điều hướng/lịch sử, tiêu đề và fallback từng trường. Bản dịch vẫn chưa được coi là đã hiệu đính bản ngữ toàn phạm vi.

## Dữ liệu và form

- Thông tin tuyển dụng, dịch vụ, tình huống và doanh nghiệp được dùng cho demo; không tự trở thành dữ kiện doanh nghiệp đã xác minh.
- Form có trạng thái kiểm tra/hoàn tất mô phỏng. Giao diện hiện hành không gửi hay lưu tên, số điện thoại hoặc CV qua luồng demo.
- CMS lưu cục bộ, có xuất/nhập JSON. Lưu trong CMS demo không đồng nghĩa cập nhật nguồn website cho mọi khách truy cập hoặc xuất bản lên server.
- Dữ liệu localStorage theo origin/trình duyệt. Hai hostname, hai port hoặc hai trình duyệt có thể hiển thị dữ liệu chỉnh sửa khác nhau.
- Khóa nội dung `md_prototype_v16_content` là khóa tương thích được giữ lại ở V19. Không xóa chỉ vì có tên V16; hãy xuất JSON trước.

## Ảnh và doanh nghiệp

Theo yêu cầu chủ dự án, logo được hiển thị để dựng giao diện demo với khách hàng. Có 14 hồ sơ mẫu, 13 tài nguyên logo riêng (hai hồ sơ dùng Samsung). Có thể bật/tắt logo, thay ảnh và xem danh sách đầy đủ. `demoLogoVisible` là trạng thái hiển thị demo, tách khỏi xác minh quyền sử dụng/quan hệ hợp tác.

Nguồn ảnh và logo: [IMAGERY-GUIDE.md](IMAGERY-GUIDE.md). Nhãn AI lặp đã được bỏ khỏi phần trình bày; provenance vẫn được giữ trong hồ sơ tài nguyên. Không phục hồi các thông báo kiểm định nội bộ lên giao diện chỉ để đồng bộ tài liệu.

## Backend và hosting

Mã Vinext/Worker, D1/R2, migration và API quản trị được giữ lại để phát triển tiếp. `/quan-tri.html` là route được bảo vệ; không thay thế nó bằng một file HTML công khai. Backend đang có ràng buộc thử nghiệm và không tự kết nối với form/CMS demo chỉ bằng việc đổi biến môi trường.

Bản public tiếp tục `noindex`/chặn index theo phạm vi prototype. Triển khai static chỉ phục vụ trải nghiệm công khai và CMS demo; không mang theo API, D1/R2 hoặc SSO quản trị được bảo vệ.

## Những điều chưa được xác nhận

Chưa phải bản tiếp nhận lead/CV thật, chưa có bàn giao vận hành production. Không tuyên bố đạt WCAG đầy đủ, Core Web Vitals thực địa, hiệu đính bản ngữ hoặc thử nghiệm trên toàn bộ thiết bị vật lý. Bằng chứng kiểm thử và điểm tham khảo phải đọc đúng phạm vi trong [bàn giao V19](PROTOTYPE-HANDOFF-V19.md).
