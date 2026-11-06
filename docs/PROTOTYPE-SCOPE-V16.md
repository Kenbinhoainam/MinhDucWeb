<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Phạm vi prototype Minh Đức — P1.0.0

Khóa ngày 31/10/2026 trước khi chấm lại. Browser HTML, high fidelity, expert review, production_readiness=not_assessed. Giữ cùng scope cho baseline V15 và V16; điểm runtime2.0.0 trước đây không so trực tiếp với điểm prototype này.

Đối tượng: lao động phổ thông; người phụ trách nhân lực doanh nghiệp FDI; nhân viên biên tập nội dung demo.

Tác vụ: tìm/lọc/sắp xếp việc và mở tin; đọc điều kiện rồi ứng tuyển demo và sửa lỗi; chọn dịch vụ/gửi nhu cầu demo; tìm/đọc cẩm nang; sửa Home/ảnh/tin/bản dịch trong CMS rồi lưu, preview và reset demo.

Template: Home, About, Services, worker/internal lists, worker/internal detail và form, knowledge hub/article/video placeholder, contact hai bước, CMS overview/Home/job/post/partner/settings, dialogs, empty/not-found/error/success.

Public locales VI/EN/ZH/KO. CMS giao diện tiếng Việt, biên tập/xem trước nội dung bốn ngôn ngữ. Width samples320/390/768/1440 CSSpx; stress320/640 chữ phóng200% trong iframe tương đương reflow, ghi rõ không thay thử Safari/thiết bị/bàn phím ảo thực. CMS mobile/tablet/desktop cùng phạm vi. Không N/A tiêu chí nào.

V16: form mô phỏng tại trình duyệt, không gửi/lưu tên, điện thoại hoặc CV. CV chỉ chọn tệp để minh họa; AI/SEO gợi ý theo quy tắc; bản dịch demo có sẵn và có thể sửa thủ công. CMS demo lưu nội dung trong localStorage riêng; không đọc draft, hộp thư hoặc hồ sơ thật từ API quản trị. V15 backend và route quản trị thật vẫn giữ quyền riêng; không nằm trong điểm prototype và không nối từ UI demo.

Chỉ giữ một nhãn prototype gọn, ghi chú ngay form và thông tin demo. Bỏ quality gate, điểm audit, preflight, cảnh báo production, inbox và lịch sử xuất bản máy chủ khỏi trải nghiệm trình diễn. Giữ label, validation, lỗi và nhãn dữ liệu mẫu cần để người xem hiểu đúng.

Điểm0–5 theo50 tiêu chí P1.0.0; evidence nguồn/ảnh không thay thao tác. Bằng chứng V14/V15 được ghi rõ là kế thừa khi source/behavior liên quan chưa đổi. Không có user research hay tuyên bố WCAG/production.
