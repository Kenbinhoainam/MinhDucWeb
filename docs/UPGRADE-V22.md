# Minh Đức V22 — kế hoạch và nghiệm thu

Ngày 04/11/2026. Baseline mã nguồn V21, commit debdb80e72c220709e0858ce7b12355f632e083e, Sites #15. Phạm vi là prototype: form vẫn mô phỏng, không nhận hồ sơ thật.

## Tham chiếu và nguyên tắc

- https://www.randstad.com/ — phân luồng doanh nghiệp/người tìm việc rõ ràng.
- https://www.michaelpage.com/ — tìm kiếm theo vai trò và địa điểm, nội dung hỗ trợ quyết định.
- https://www.roberthalf.com/us/en/hire-talent — hành trình doanh nghiệp có bước tiếp theo cụ thể.
- https://www.w3.org/TR/WCAG22/ — tiêu chí tiếp cận, không phải chứng nhận website này đã đạt WCAG.

Giữ thương hiệu navy–đỏ và Noto Sans. Ưu tiên sự rõ ràng, tính nhất quán và hành động có kết quả; không thêm số liệu, khách hàng hoặc chứng thực chưa được xác minh.

## Rubric chốt trước nghiệm thu

| Nhóm | Trọng số | Điều kiện |
| --- | ---: | --- |
| Định vị và phân luồng | 15 | Hai đối tượng, thông điệp rõ, CTA đúng, vào tác vụ trong tối đa hai lần nhấp |
| Thị giác | 20 | Phân cấp chữ, dấu Việt, khoảng cách, hình ảnh nhất quán |
| Nội dung và tin cậy | 15 | Nội dung có căn cứ, ghi rõ tin mẫu, không giả số liệu/đối tác, ranh giới demo rõ |
| Tương tác | 20 | Tìm/lọc, CTA, form mô phỏng và menu/modal hoạt động |
| Tiếp cận | 20 | Tương phản, bàn phím/focus, label/heading/alt, zoom và thông báo trạng thái |
| Responsive | 10 | Không tràn ngang, không chồng nội dung, CTA không bị che, vùng chạm rõ |

Mỗi nhóm có bốn mục đồng trọng số. Chưa kiểm chứng không tính là đạt. Mục tiêu tổng ≥90/100 và mỗi nhóm ≥80% trọng số; không được có lỗi chặn tìm việc hoặc tư vấn bằng bàn phím. Đây là điểm nội bộ theo rubric, không phải đánh giá độc lập hoặc chứng nhận.

## Hiện trạng và thứ tự nâng cấp

1. V21 đã có hai persona, tìm/lọc việc, bốn ngôn ngữ, CMS demo và form mô phỏng. Không coi số phiên bản hoặc kiểm tra cũ là bằng chứng nghiệm thu mới.
2. Phần tìm việc chỉ có form; bổ sung lối vào theo địa bàn lấy trực tiếp từ việc mẫu đang mở, giữ locale và ghi rõ dữ liệu mẫu.
3. CTA tư vấn trỏ tới khu vực có biểu mẫu đang thu gọn; tự mở khi kích hoạt để bước tiếp theo hiện rõ, đưa focus về summary.
4. Tinh chỉnh hero, màu caption, thẻ việc và vùng tìm kiếm trong nguồn design-system.css; không thêm lớp CSS phiên bản mới.
5. Build lại toàn bộ nguồn sinh tự động, chạy hồi quy Node và trình duyệt, sửa các lỗi quan sát được, rồi đóng gói đúng Worker hiện có và xuất bản với audience hiện tại.

## Bằng chứng

- Node: 48/48, gồm kiểm tra mới về địa bàn chỉ lấy việc phổ thông đang mở, loại trùng, escaping và giữ bốn locale.
- Trình duyệt: 262/262, gồm 168 tổ hợp 7 trang × 6 chiều rộng iframe (320, 375, 390, 768, 1024, 1440) × 4 locale. Chiều rộng nội dung thực tế trừ thanh cuộn; số thực đo có trong JSON. Bổ sung CTA mở/focus, deep-link, reload, đổi locale, địa bàn chưa xác định.
- CMS: 21/21, bảo toàn bản dịch và crop độc lập sau chỉnh sửa/JSON roundtrip.
- Axe-core: 14/14 lượt 7 trang × 2 chiều rộng (390/1440), không phát hiện violation trong các rule WCAG A/AA đã chọn. Còn 32 lượt nút ở nhóm incomplete cần kiểm tra tương phản thủ công; không coi incomplete là đạt.
- Tăng gấp đôi computed font size của từng phần tử: 14/14 lượt không tràn ngang. Phép thử này không thay thế native browser zoom; phím tắt zoom trong trình duyệt tích hợp không thay đổi kích thước nên không được ghi nhận là đã kiểm tra native zoom.
- Bàn phím thật qua browser key API: Enter mở menu và focus liên kết đầu, Escape trả focus về nút menu; Enter CTA tư vấn focus summary, Tab vào ngành; Enter tìm QC cho một kết quả đúng; Space chọn đồng ý và Enter hoàn tất form mô phỏng, status nhận focus.
- Đo focus mobile: trường khu vực và nút tìm việc nằm phía trên thanh cố định (497/570 so với dockTop 771 ở lượt đo). Chưa xác minh tất cả trạng thái ở mọi trang hoặc thiết bị thật.
- Build Worker hoàn chỉnh và runtime parity đạt. D1/R2, project ID và audience hiện có được giữ nguyên. Trang kiểm tra chỉ được server nội bộ phục vụ, không có trong public/ hoặc gói hosting.

## Các vòng sửa có bằng chứng

1. Mở đầu và tìm việc: phân cấp hero, trường tìm kiếm, liên kết địa bàn, ghi rõ tin mẫu; sửa CTA mở brief.
2. Hồi quy phát hiện focus bị hành vi anchor mặc định trả về BODY ở bốn locale; sửa điều hướng fragment và focus. Chỉnh nút mobile bị xuống dòng, bỏ giới hạn tiêu đề desktop quá hẹp.
3. Rà soát độc lập phát hiện deep-link/reload/đổi locale đóng brief, hover vẫn dịch chuyển khi giảm chuyển động, và địa bàn bị mặc định sai. Đã sửa và bổ sung kiểm tra.
4. Axe phát hiện màu eyebrow CTA, số bước không đủ tương phản, logo không cuộn bằng bàn phím và nhãn nhóm bộ lọc không hợp lệ. Sửa màu, điểm focus và vai trò ARIA; thêm vai trò cho thanh hành động và nhóm tiến trình.
5. Stress chữ lớn phát hiện header desktop tràn ngang; cho phép header/menu xuống hàng, kiểm tra lại 14/14 đạt.

## Điểm và giới hạn nghiệm thu

Đánh giá bằng agent rà soát riêng, dựa trên mã, ảnh Home/Services toàn trang, Jobs mobile, trạng thái hoàn tất Contact, JSON và quan sát bàn phím của agent thực hiện. Không phải đánh giá con người độc lập. Mỗi nhóm có bốn mục đồng trọng số; chưa có bằng chứng không tính đạt.

| Nhóm | Điểm có bằng chứng |
| --- | ---: |
| Định vị và phân luồng | 15/15 |
| Thị giác | 20/20 |
| Nội dung và tin cậy | 11,25/15 |
| Tương tác prototype | 20/20 |
| Tiếp cận | 10/20 |
| Responsive | 7,5/10 |
| Tổng | **83,75/100** |

**Chưa đạt mục tiêu ≥90 và chưa đạt yêu cầu mỗi nhóm ≥80%.** Không giảm tiêu chí để tuyên bố thành công. Phần còn thiếu là xác minh thông tin doanh nghiệp/nguồn nội dung và kiểm tra tiếp cận thủ công (các mục tương phản incomplete, native zoom, trình đọc màn hình, trạng thái thanh mobile ở toàn bộ luồng). Các dữ kiện công ty không thể được tạo thay cho xác nhận của chủ dự án. Không có kết quả kiểm tra trình đọc màn hình trong lượt này.

Đây là bản nâng cấp prototype có thể bàn giao; không phải nghiệm thu flagship/production, không chứng nhận WCAG, không tiếp nhận lead/CV thật. Điểm lịch sử ở tài liệu V20/V21 thuộc rubric khác, không dùng để tính mức tăng.
