<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Công việc tiếp theo từ baseline V19

Cập nhật ngày **02/11/2026**. Đây là kế hoạch sau V19, không phải xác nhận đã triển khai vận hành thật hoặc cam kết tiến độ. Kế hoạch V17 và đánh giá trước V18 được giữ làm hồ sơ lịch sử.

## Baseline đã có

V19 đã cải thiện locale/điều hướng, mobile tìm việc, nội dung dịch vụ và cẩm nang mẫu, xử lý bản ghi không tồn tại và gộp runtime tái lập. Giữ nguyên bộ logo để demo với khách hàng và trình biên tập doanh nghiệp. Có 362 trường hợp trình duyệt và 24 Node tests được ghi trong [bàn giao V19](PROTOTYPE-HANDOFF-V19.md).

Nguồn/UI đã được đối chiếu với bản Sites #11, commit `848425392ec54e9aafe70922a0de203b5b862222`. Không còn cần lấy việc “xác định V16 hay V17” làm mốc bắt đầu của dự án.

## Thứ tự ưu tiên

| Việc | Trạng thái ở V19 | Kết quả cần có trước khi coi là hoàn tất |
| --- | --- | --- |
| Duyệt bản trình diễn với khách hàng | Sẵn bản demo; chưa có biên bản duyệt cuối | Ghi URL/commit, màn hình được duyệt và phản hồi cụ thể |
| Nội dung thương hiệu/liên hệ | Dữ liệu/tình huống còn phục vụ demo | Chủ nội dung cung cấp và duyệt dữ kiện sẽ công bố |
| Ảnh và hồ sơ doanh nghiệp | Logo demo được giữ theo yêu cầu; provenance có lưu | Chỉ xác minh quyền/quan hệ khi có tài liệu thực, không suy từ hiển thị demo |
| Hiệu đính VI/EN/ZH/KO | Đã có locale và kiểm giao diện; chưa hiệu đính bản ngữ toàn bộ | Nội dung và thuật ngữ được người có năng lực duyệt |
| Thử tác vụ thực tế | Kiểm trình duyệt nội bộ có bằng chứng | Người tìm việc và khách B2B thử tác vụ; ghi lỗi và sửa theo mức ảnh hưởng |
| Thiết bị/tiếp cận/hiệu năng | Có mẫu viewport, keyboard và phóng chữ; chưa là chứng nhận | Kiểm thiết bị thật, AT và cấu hình lab cụ thể; tách dữ liệu field khi có |
| Nối CMS với backend | CMS công khai vẫn lưu trong trình duyệt | Nháp/xuất bản/khôi phục, quyền và xung đột revision được kiểm trên hosting đích |
| Form và xử lý lead thật | Form vẫn mô phỏng | Lưu thành công rồi mới xác nhận, có người xử lý, gửi lại không trùng, lỗi không mất hồ sơ |
| CV, dữ liệu và vận hành | Backend/migration giữ lại; chưa nghiệm thu production | Hoàn thiện pipeline tệp, quyền tải, retention, backup/restore và giám sát theo phạm vi được duyệt |
| Phát hành bản thật | Chưa thực hiện | Kiểm hosted, nội dung/SEO được duyệt, hướng dẫn vận hành và rollback được thử |

## Điểm đánh giá

Bản bàn giao V19 ghi **FQ1 86,25/100**, từ 82/100 của V18. Lượt chỉnh tài liệu không chấm lại. Chưa đủ bằng chứng xác nhận 92+, 100/100, WCAG đầy đủ hoặc Core Web Vitals thực địa. Các điểm P1.0.0 cũ thuộc bộ tiêu chí khác và không dùng để bù điểm FQ1.

Tiếp tục cải thiện từ vấn đề có bằng chứng và đúng phạm vi prototype; không tăng điểm bằng việc thêm thông báo kiểm định lên giao diện hoặc biến tình huống/khách hàng mẫu thành dữ kiện thật. Thời lượng triển khai production cần được ước lượng lại theo phạm vi, hạ tầng và nội dung đã chốt; không tái dùng nguyên ước lượng của kế hoạch V17 như cam kết mới.
