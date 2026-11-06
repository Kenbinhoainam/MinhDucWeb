<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Kết quả kiểm tra V14

Build: V14 từ baseline a4c0d7c7ab85dcce4707c45902f1862c2a5c4f59 · Chromium preview · 31/10/2026.

| ID | Tác vụ/template | Input/viewport/locale | Expected | Actual | Evidence | Kết quả |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Reflow/ảnh/heading | 168 cấu hình; VI/EN/ZH/KO; 320–2560px theo ma trận | Không tràn/cắt, ảnh decode, một H1 | 0 lỗi assertion hình học | v14-responsive-qa.json | pass trong phạm vi |
| T02 | Find/save/sort/compare/context/forms/news/CMS | 29 assertion trên dữ liệu thử | Kết quả đúng, demo không gửi thật | 29 passed | v14-interaction-qa.json | pass trong phạm vi |
| T03 | Text/portrait stress | 6 trường hợp chữ dài gấp đôi, có ảnh dọc sáng | Giữ layout | 6 passed | v14-stress-qa.json | pass trong phạm vi |
| T04 | Glyph/SVG/token contrast | 3 weight CJK và toàn SVG đi kèm | Không thiếu glyph demo hoặc SVG invalid | Passed; contrast cặp chính đã ghi | v14-static-checks.json | pass trong phạm vi |
| T05 | Keyboard/dialog | Service ArrowDown, compare thứ 4, Escape | Đổi tab, giữ 3, trả focus | Qua thao tác trực tiếp | v14-audit.json E11 | pass chọn mẫu |
| T06 | Dữ liệu lead/CV tới nơi lưu | Chưa có backend | Xác nhận record và file thật | Chưa kiểm | MD14-01 | untested |
| T07 | A11y/zoom/device/media | Thiếu AT/zoom/runtime media preference | Task trace đầy đủ | Chưa đủ bằng chứng | MD14-05 | untested phần còn lại |
| T08 | Lab/field performance | Diagnostic iframe, thiếu cấu hình đại diện | Lab ba lượt/trace, field riêng | Chưa đủ kết luận | MD14-04 | untested |

Bàn giao theo mode prototype. Giữ Site project và audience hiện tại. Nguồn, archive và saved version cùng commit; phục hồi qua phiên bản Sites trước đó nếu cần. Chưa diễn tập rollback thực. Không công bố ngưỡng Flagship 90+ khi evaluator 2.0 chưa thỏa điều kiện.
