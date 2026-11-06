# Công việc tiếp theo từ baseline V20

Cập nhật ngày **04/11/2026**. Đây là kế hoạch sau V20, không phải xác nhận đã triển khai vận hành thật hoặc cam kết tiến độ. Kế hoạch V17, kế hoạch V19 và các đánh giá trước nâng cấp được giữ làm hồ sơ lịch sử.

## Baseline đã có

V20 đã bổ sung Social Chat Widget, tải/lưu/phát video cục bộ trong CMS, giao diện trắng–xanh–đỏ và Noto Sans; kế thừa locale, mobile tìm việc, nội dung mẫu và runtime của V19. Bộ logo demo và trình biên tập doanh nghiệp tiếp tục có trong bản trình diễn. Bàn giao V20 ghi 412 trường hợp trình duyệt và 30 Node tests; không coi việc cập nhật tài liệu là lần chạy lại các bộ kiểm này.

Baseline đang được đối chiếu là **V20, bản Sites #13**, commit `95105f351f9264336ae01ba5daea1eb6cd259d5a`, đã deploy thành công lúc 02:04 ngày 04/11/2026, giờ Việt Nam. Số Sites có thể tăng do lần đồng bộ tài liệu này mà không đổi phiên bản sản phẩm.

## Thứ tự ưu tiên

| Việc | Trạng thái ở V20 | Kết quả cần có trước khi coi là hoàn tất |
| --- | --- | --- |
| Duyệt bản trình diễn với khách hàng | Sẵn bản demo; chưa có biên bản duyệt cuối | Ghi URL/commit, màn hình được duyệt và phản hồi cụ thể |
| Nội dung thương hiệu/liên hệ | Dữ liệu/tình huống còn phục vụ demo | Chủ nội dung cung cấp và duyệt dữ kiện sẽ công bố |
| Ảnh và hồ sơ doanh nghiệp | Logo demo được giữ theo yêu cầu; provenance có lưu | Chỉ xác minh quyền/quan hệ khi có tài liệu thực, không suy từ hiển thị demo |
| Hiệu đính VI/EN/ZH/KO | Đã có locale và kiểm giao diện; chưa hiệu đính bản ngữ toàn bộ | Nội dung và thuật ngữ được người có năng lực duyệt |
| Thử tác vụ thực tế | Kiểm trình duyệt nội bộ có bằng chứng | Người tìm việc và khách B2B thử tác vụ; ghi lỗi và sửa theo mức ảnh hưởng |
| Thiết bị/tiếp cận/hiệu năng | Có mẫu viewport, keyboard và phóng chữ; chưa là chứng nhận | Kiểm thiết bị thật, AT và cấu hình lab cụ thể; tách dữ liệu field khi có |
| Cấu hình kênh liên hệ | Widget đã có; hotline/Zalo/Messenger để trống theo lựa chọn chủ dự án | Điền và duyệt kênh thật trong CMS; thử gọi/nhắn tin có phạm vi được cho phép |
| Kho video dùng chung | Upload và IndexedDB đã có trong demo | Bàn giao tệp gốc/URL; nối media server và quyền truy cập nếu cần nội dung dùng chung |
| Nối CMS với backend | CMS công khai vẫn lưu trong trình duyệt | Nháp/xuất bản/khôi phục, quyền và xung đột revision được kiểm trên hosting đích |
| Form và xử lý lead thật | Form vẫn mô phỏng | Lưu thành công rồi mới xác nhận, có người xử lý, gửi lại không trùng, lỗi không mất hồ sơ |
| CV, dữ liệu và vận hành | Backend/migration giữ lại; chưa nghiệm thu production | Hoàn thiện pipeline tệp, quyền tải, retention, backup/restore và giám sát theo phạm vi được duyệt |
| Phát hành bản thật | Chưa thực hiện | Kiểm hosted, nội dung/SEO được duyệt, hướng dẫn vận hành và rollback được thử |

## Điểm đánh giá

Bản bàn giao V20 ghi **FQ1 89,25/100**, từ 86,25/100 của V19. Lượt chỉnh tài liệu không chấm lại. Chưa đủ bằng chứng xác nhận 92+, 100/100, WCAG đầy đủ hoặc Core Web Vitals thực địa. Các điểm P1.0.0 cũ thuộc bộ tiêu chí khác và không dùng để bù điểm FQ1.

Tiếp tục cải thiện từ vấn đề có bằng chứng và đúng phạm vi prototype; không tăng điểm bằng việc thêm thông báo kiểm định lên giao diện hoặc biến tình huống/khách hàng mẫu thành dữ kiện thật. Thời lượng triển khai production cần được ước lượng lại theo phạm vi, hạ tầng và nội dung đã chốt; không tái dùng nguyên ước lượng của kế hoạch V17 như cam kết mới.
