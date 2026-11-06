<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức — Flagship Prototype V18

Ngày hoàn thiện: 01/11/2026. Bản nâng cấp phát triển tiếp trên nguồn V17.2; giữ Site hiện tại và phạm vi prototype.

## Thay đổi chính

- Hệ thống thiết kế công khai thống nhất: nền ngà, xanh đậm, đỏ thương hiệu, Noto Serif cho tiêu đề, Noto Sans cho nội dung; khoảng cách, nút, trường nhập và trạng thái focus dùng chung.
- Trang chủ tổ chức lại theo hai nhóm người dùng: doanh nghiệp và người tìm việc. Hero có ảnh chân dung, khung vòm, thông điệp và hai hướng hành động rõ ràng.
- Bốn giải pháp có liên kết mở đúng dịch vụ tương ứng; công cụ phác thảo nhu cầu chuyển ngành, quy mô và địa bàn sang bước liên hệ, giữ ngôn ngữ đã chọn.
- Các trang giới thiệu, dịch vụ, việc làm, chi tiết tuyển dụng, tin tức, bài viết và liên hệ dùng cùng hệ thống thị giác. Bố cục điện thoại giữ thanh hành động nhanh và bộ lọc thu gọn.
- Nội dung trình bày mới có VI/EN/ZH/KO. Giữ dữ liệu CMS, sửa nội dung tại chỗ, lựa chọn ẩn/hiện module, thư viện ảnh và danh mục doanh nghiệp của V17.2.
- Tách CSS công khai và CSS quản trị: `site.css` giảm từ 169.752 xuống 62.877 byte, tương đương 63,0% trước nén. Đây là số đo dung lượng tệp, không phải điểm tốc độ hoặc Core Web Vitals.
- Bộ cài đặt hiện chạy được trên Windows portable; giữ lockfile và đường cài managed Linux. Không thêm dependency ứng dụng.

## Kiểm chứng

| Nhóm | Kết quả | Bằng chứng |
| --- | --- | --- |
| Kích thước / ngôn ngữ | 180/180 | `v18-viewport-locales.json`: 11 tuyến trang × 4 ngôn ngữ × 4 chiều rộng, cộng 4 kích thước CMS |
| Phóng to chữ CSS 200% | 21/21 | `v18-reflow.json`: mẫu tại khung 640px, gồm 5 tuyến công khai ở 4 ngôn ngữ và CMS tiếng Việt |
| Tương tác / nội dung | 45/45 | `v18-interactions.json`: chuyển persona, giữ locale tìm việc, brief → liên hệ, tab dịch vụ, danh mục doanh nghiệp, dữ liệu rỗng/ít/nhiều và toggle nguyên tắc |
| Node regression | 16/16 | `node --test tests/prototype-v16.test.mjs tests/brand-rights-v17.test.mjs tests/site-api.test.ts` |
| Build phát hành | Thành công | Helper `build-site.mjs`: Vinext/Vite hoàn thành cả client, RSC và SSR |
| Tệp phát hành | Trùng nguồn | Đối chiếu SHA-256 HTML/CSS/JS chính giữa `public` và `dist/client`; không có QA HTML hoặc asset quản trị công khai |

Ma trận kiểm tra gồm độ rộng toàn trang, ảnh tải được, một H1 hiển thị, ngôn ngữ tài liệu, ID không trùng và nhãn trường nhập. Chiều rộng khung là 320/390/768/1440px; vùng nội dung có thể nhỏ hơn 15px do thanh cuộn của trình duyệt Windows.

Kiểm tra trực tiếp bổ sung: màn hình lớn và điện thoại; lưu một việc làm; so sánh hai công việc; Escape đóng hộp thoại và trả focus đúng nút; ứng tuyển báo lỗi khi chưa chọn điều kiện, chuyển bước và hoàn tất bằng dữ liệu giả; CMS sửa tiêu đề, lưu, xem trước và khôi phục nội dung gốc. Không ghi nhận lỗi JavaScript trong các phiên kiểm tra trực tiếp. Các thao tác thử đã được khôi phục.

Một điều kiện trong harness ban đầu so sánh `zh` với `zh-CN` quá chặt; đã sửa để chấp nhận đúng mã ngôn ngữ gốc và chạy lại ma trận, đạt 180/180. Các báo cáo JSON lưu kết quả cuối cùng.

## Phạm vi và giới hạn

Đây là prototype để duyệt thiết kế và trải nghiệm. Form hoàn tất mô phỏng, không gửi hay lưu thông tin liên hệ/CV. CMS lưu trên trình duyệt. Nội dung tuyển dụng, ảnh và doanh nghiệp tiếp tục là dữ liệu trình bày; không bổ sung số liệu kinh doanh hoặc xác nhận quan hệ hợp tác mới.

Chưa có đánh giá người dùng thực, thử nghiệm thiết bị vật lý, kiểm định bằng công nghệ hỗ trợ, chứng nhận WCAG hoặc dữ liệu tốc độ ngoài thực tế. Không tái sử dụng điểm đánh giá lịch sử để chấm V18. Backend Vinext/D1/R2 vẫn được giữ nhưng các luồng công khai chưa được chuyển sang thu nhận hồ sơ thật.

## Tiếp tục phát triển

Chỉnh `flagship-content.js` cho cấu trúc/nội dung trình bày và `design-system.css` cho giao diện công khai. Chạy `node scripts/build-static.mjs` để cập nhật HTML/CSS sinh tự động. Quy trình build/publish tiếp tục dùng helper Sites và cùng project ID trong `.openai/hosting.json`. Giữ các báo cáo đánh giá trong `docs/`, không đưa vào giao diện người dùng.
