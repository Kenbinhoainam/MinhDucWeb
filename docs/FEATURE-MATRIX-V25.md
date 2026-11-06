# V25 — đối chiếu báo giá MD-2611-01

Nguồn: bảng báo giá 2 trang do người dùng cung cấp, ghi ngày 10/11/2026. Ngày triển khai prototype: 04/11/2026. Không coi ngày ghi trên báo giá là ngày hiện tại.

| Yêu cầu | Baseline nguồn 705fe8d | Đích prototype V25 |
| --- | --- | --- |
| Responsive Mobile/Desktop, VI/EN/ZH/KO | Có | Giữ, kiểm tra cả tính năng mới |
| Tốc độ và SEO cơ bản | Runtime gộp/minify, ảnh WebP, metadata, hreflang; noindex cho demo | Giữ; không quảng bá xếp hạng SEO |
| Tin tuyển dụng/bài viết | CMS demo và API quản trị được bảo vệ có sẵn | Giữ và kiểm tra hồi quy |
| KCN | Có trong tin và bộ lọc, thiếu màn hình quản lý riêng | Quản lý danh mục KCN mô phỏng |
| Hồ sơ ứng viên B2C | Form hoàn tất mô phỏng; không lưu PII | Danh sách/hồ sơ/trạng thái/ghi chú với dữ liệu hư cấu |
| Yêu cầu FDI B2B | Brief và liên hệ có sẵn; thiếu bàn vận hành | Pipeline yêu cầu, chi tiết và cập nhật trạng thái mẫu |
| Lương thực lĩnh/tăng ca | Chưa có công cụ hoàn chỉnh | Bảng tính giả định, cấu phần minh bạch và có thể sửa |
| Form nhu cầu B2B | Có, giữ ngữ cảnh dịch vụ/quy mô/địa bàn | Giữ và liên kết hành trình demo |
| Zalo OA/Telegram | Có liên kết liên hệ, chưa có thông báo tự động | Hộp thư đi giả lập, trạng thái/thử lại/lịch sử; không gửi thật |
| Chatbot VI/EN/ZH/KO | Chưa có | Hội thoại kịch bản có nhãn demo và chuyển sang tác vụ thật trong prototype |
| AI Voice Apply | Chưa có | Nhận dạng trên thiết bị do người xem chủ động bật nếu hỗ trợ và đã có gói ngôn ngữ; xem/sửa/xác nhận trước điền form, fallback nhập mẫu; không upload âm thanh |
| Smart Matching | Có lọc/tìm/so sánh, chưa có xếp hạng giải thích | Xếp hạng theo ưu tiên công việc, giải thích điểm và điều kiện |
| Hosting/SSL | Site đang chạy HTTPS | Giữ bản công khai hiện tại; V25 là nháp chờ xem trước |
| Kiểm thử/đào tạo | Runbook và báo cáo V23/V24 có sẵn | Kiểm tra phần mới + hồi quy; walkthrough vận hành |
| Bảo hành 12 tháng | Điều khoản thương mại | Không phải tính năng có thể hiện thực bằng prototype; cần hợp đồng nhà cung cấp |

Prototype không dùng API trả phí, không cấu hình khóa bí mật, không gửi thông báo hay hồ sơ thật. Backend quản trị sẵn có không được mở quyền truy cập. CMS vận hành mới dùng dữ liệu mẫu riêng trong trình duyệt, không phải backend lưu hồ sơ dùng chung giữa thiết bị.
