# Minh Đức V23 — nâng cấp và đánh giá prototype

Ngày 04/11/2026. Nguồn V22: 82f47c9fbff4997c3b49794e617862c79f06a47a. Baseline prototype 84/100. Chỉ làm bản nháp, chưa xuất bản.

## Rubric cố định trước khi chỉnh sửa

| Tiêu chí | Trọng số | Bằng chứng đánh giá |
| --- | ---: | --- |
| Định hướng nghệ thuật và dấu ấn | 20 | Mô-típ riêng phù hợp ngành, tính nhất quán, ảnh có chủ đích, khác biệt với template |
| Bố cục, chữ và chi tiết | 20 | Thứ bậc, nhịp khoảng cách, căn chỉnh, trạng thái tương tác |
| Cấu trúc và kể chuyện | 15 | Mỗi chương bổ sung ý mới, phân luồng rõ, dịch vụ trực quan, lời dẫn cụ thể |
| Hành trình prototype | 20 | Tìm/lọc, lưu/so sánh, dịch vụ/brief, form mô phỏng và điều hướng |
| Mobile | 15 | Bố cục và thứ tự đọc, vùng chạm, focus không bị che, không tràn ở bốn locale |
| Tiếp cận và kiểm chứng | 10 | Tên/semantics, bàn phím, tương phản, giảm chuyển động/chữ lớn; công bố giới hạn |

Mỗi nhóm chấm 0–10 rồi nhân trọng số/10, kèm nhận xét và bằng chứng. Không lấy số lượng test làm điểm thiết kế. Không phạt dữ liệu minh họa, ảnh prototype hoặc backend/form mô phỏng; vẫn yêu cầu chúng có chủ đích và ghi nhãn phù hợp. Không dùng rubric production V22 để so sánh.

Mục tiêu ≥90/100, không nhóm nào dưới 8/10, không lỗi chặn hành trình chính. Giữ rubric trong tất cả vòng; agent rà soát riêng chấm dựa trên ảnh và báo cáo, không được yêu cầu nâng điểm để đạt mục tiêu.

## Kế hoạch

1. Tham chiếu Randstad (phân luồng), Robert Half (lời hứa đi cùng cấu trúc chứng minh), Maersk (chương biên tập theo bối cảnh vận hành).
2. Mô-típ hai đầu mối và đường nối navy–đỏ; giữ nhận diện và font có sẵn.
3. Đưa tìm kiếm sát danh sách việc; gộp story và gallery thành một chương, giảm lặp và chiều dài trang.
4. Dịch vụ có sơ đồ tình huống → cách phối hợp → điểm cần chốt, đủ bốn locale; giữ chi tiết vận hành trong disclosure.
5. Điều chỉnh ảnh minh họa theo từng nhóm công việc, bảo toàn nội dung CMS đã sửa.
6. Build, kiểm tra Node/trình duyệt/CMS/tiếp cận/chữ lớn, kiểm tra bàn phím và ảnh desktop/mobile; sửa theo kết quả thực đo.
7. Chấm lại độc lập với cùng rubric, lặp những điểm chưa đạt và bàn giao bản nháp cùng điểm thực tế.

Tham chiếu: https://www.randstad.com/ ; https://www.roberthalf.com/us/en ; https://www.maersk.com/insights .

## Các vòng thực hiện và điểm đánh giá riêng

| Vòng | Điểm | Thay đổi và phản hồi |
| --- | ---: | --- |
| Baseline V22 | 84 | Dấu ấn chưa mạnh, Home lặp, dịch vụ nhiều chữ |
| V23 vòng 1 | 87 | Mô-típ nối, gộp story/gallery, search cạnh jobs, ảnh cơ khí, blueprint; còn chật ở tablet và dịch vụ dài |
| V23 vòng 2 | 89 | Sửa tiêu đề story, đưa blueprint lên trước, inline brief cuối Solutions, cân thẻ tablet và giữ CMS; CTA dịch vụ còn muộn |
| V23 vòng 3 | **91** | CTA ngay sau blueprint, đầu ra trong disclosure, bỏ quy trình lặp, brief mobile một cột, thumbnail không chứa chữ |

Điểm do agent rà soát riêng xem ảnh và bằng chứng thực hiện; không phải người dùng thật hoặc đánh giá con người độc lập. Không yêu cầu agent nâng điểm để đạt mục tiêu. Khác rubric production/evidence-only V22 83,75; không so hai điểm đó.

| Hạng mục | Điểm cuối | Quy đổi /10 |
| --- | ---: | ---: |
| Định hướng nghệ thuật | 18/20 | 9,0 |
| Bố cục và chi tiết | 18/20 | 9,0 |
| Cấu trúc và kể chuyện | 14/15 | 9,33 |
| Hành trình prototype | 19/20 | 9,5 |
| Mobile | 14/15 | 9,33 |
| Tiếp cận và kiểm chứng | 8/10 | 8,0 |
| Tổng | **91/100** | 9,1 |

Đạt ngưỡng prototype đã chốt (≥90, mọi nhóm ≥8/10); không đồng nghĩa 100/100, chứng nhận WCAG hoặc sẵn sàng vận hành thật.

## Kiểm chứng cuối

- Node: **75/75**. Thêm 18 kiểm tra blueprint, 9 kiểm tra CMS/editorial/migration; bản dịch biên tập, toggles và ảnh tùy chỉnh được giữ.
- Browser: **342/342**, gồm ma trận 168 tổ hợp 7 trang × 6 chiều rộng iframe × 4 locale, và 64 tổ hợp blueprint kiểm tra bố cục/CTA service/locale. Chiều rộng nội dung có thể nhỏ hơn chiều rộng iframe do thanh cuộn; báo cáo ghi số đo thực tế.
- CMS browser: **21/21**. JSON roundtrip, dịch và crop không bị hồi quy.
- Axe: **14/14** lượt không phát hiện violation trong bộ rule được chọn. Incomplete vẫn cần kiểm tra thủ công; không coi là chứng nhận toàn bộ tương phản.
- Chữ lớn: **14/14** lượt tăng gấp đôi computed font size không tràn. Không thay thế native browser zoom hoặc trình đọc màn hình.
- Native browser key API: menu Enter/Escape giữ focus; CTA tư vấn Enter rồi Tab vào ngành; tìm QC trả một việc đúng; CTA dịch vụ mở contact có ngữ cảnh Cung ứng lao động.
- Mobile brief: hai select đo rộng 304px ở khung 390px; nhãn mặc định khác/chưa xác định nhìn đủ. Gallery đủ mọi slot trong disclosure và caption tùy chỉnh được giữ.
- Build Worker, runtime parity và git diff whitespace check đạt. Chưa thay backend/D1/R2 hoặc audience; chưa deploy.
- Ảnh screenshot dùng khung QA 1440/390 để ghi đúng breakpoint. Bộ chụp buộc eager loading ở trang QA, không đổi lazy loading của website. Ba ảnh việc làm desktop xác nhận complete/naturalWidth > 0; Services mobile ghi đủ biểu mẫu.

Bằng chứng tại thư mục `outputs/`: `v23-browser-qa.json`, `v23-cms-qa.json`, `v23-accessibility.json`, `v23-text-resize.json`, ảnh Home/Services desktop/mobile. Ảnh cơ khí và prompt: [IMAGERY-V23.md](IMAGERY-V23.md).

## Phần còn có thể nâng thêm

Home mobile còn dài; có thể gọn cẩm nang thành một bài chính và hai liên kết. Đồ họa cẩm nang chưa có dấu ấn mạnh bằng chương ảnh. Chưa thử với người dùng thật, thiết bị vật lý hoặc trình đọc màn hình; không dùng dữ liệu mẫu/backend mô phỏng để trừ điểm prototype.
