# V25 — nâng cấp prototype, mục tiêu 95+

## Tiêu chí cố định

Giữ nguyên rubric prototype V23 để so sánh trung thực: định hướng nghệ thuật 20; bố cục/chữ/chi tiết 20; cấu trúc/kể chuyện 15; hành trình 20; mobile 15; tiếp cận/kiểm chứng 10. Baseline V23 91/100; nguồn hiện tại còn có ảnh/video V24 chưa chấm lại.

Mục tiêu ≥95/100, mọi nhóm ≥8/10, không lỗi chặn luồng chính. Không tăng điểm vì số lượng tính năng/test; chấm từ chất lượng quan sát được. Dữ liệu mẫu và dịch vụ mô phỏng không bị trừ chỉ vì là prototype, nhưng luồng phải trung thực và sử dụng được. Không quy đổi thành chứng nhận WCAG hay readiness sản xuất.

## Tham chiếu và hướng thực hiện

- [Randstad](https://www.randstad.com/): phân luồng người tìm việc/doanh nghiệp, đường vào tác vụ rõ.
- [Robert Half](https://www.roberthalf.com/us/en): kết hợp tìm việc, hỗ trợ tuyển dụng và nội dung thu nhập theo ngữ cảnh.
- [Apple Accessibility](https://www.apple.com/accessibility/): lấy khả năng tiếp cận làm phần của trải nghiệm, có đường nhập thay thế cho giọng nói.

Tham khảo cấu trúc, không sao chép nội dung/hình ảnh/thương hiệu. Giữ navy–đỏ, font và ảnh/video Minh Đức mới nhất. Công cụ xuất hiện gần việc làm/ứng tuyển, CMS tách khỏi hành trình công khai. Không dồn tất cả vào hero.

## Kiểm chứng và điểm

Các kiểm tra đã thực chạy trên nháp V25 (04/11/2026):

- Node: 115/115, gồm phép tính/xếp hạng, xác nhận điền form, Unicode/typed Korean, dữ liệu vận hành/không lưu PII, xung đột storage, vòng đời KCN, thử lại/chống trùng và các hồi quy API/quyền truy cập cũ. Lệnh `pnpm test` hiện dùng glob để bao phủ các suite mới.
- Hồi quy public: 342/342 dùng harness V23 chạy trên V25, gồm 168 tổ hợp trang/locale/chiều rộng và hành trình cũ. Đây là lượt chạy mới, không phải tái sử dụng báo cáo V23.
- Feature suite vòng đầu: 260/260; vòng hai: 280/280, thêm xác minh focus/lối tiếp theo, chiều rộng công cụ mở và bộ chọn CMS gọn. Gồm 64 tổ hợp layout 4 trang × 4 locale × 4 kích thước; tính lương, lỗi/reset, match/empty, chat/voice review/confirm, hồ sơ/FDI/KCN/thông báo/training và layout mở rộng.
- Trợ lý: 299/299 DOM assertions trong trình duyệt qua harness cục bộ, có mock SpeechRecognition cho lỗi/quyền/timeout/đóng/chuyển locale. Không bật micro thật, không ghi âm hay chứng nhận nhận dạng giọng nói trên thiết bị vật lý.
- CMS: 21/21. Fixture cố tình đặt hai tin chung một ảnh để kiểm tra crop độc lập; phát hiện và sửa migration ảnh QC chạy lại sau mọi reload. V25 dùng cờ imagery revision để giữ lựa chọn CMS về sau.
- Axe: 20/20 scan trạng thái công cụ mở, trợ lý chat và bàn vận hành ở mobile/desktop, bốn locale cho công cụ công khai. Không còn violations trong tập rule WCAG A/AA đã chọn; incomplete vẫn được ghi trong báo cáo, không phải chứng nhận WCAG toàn diện.
- Native Enter: mở disclosure tính lương, tính kết quả, chọn KCN và mở khớp việc; đi qua 5 trường mẫu đến màn hình duyệt trước khi điền. Không tự nộp form hoặc chọn consent.
- Build Worker và runtime parity đạt; không đổi backend/auth/bindings/audience. Bản công khai đang chạy không bị thay đổi.

Bằng chứng: `outputs/v25-regression.json`, `v25-features.json`, `v25-assistant.json`, `v25-cms.json`, `v25-accessibility-features.json` và ảnh Home/công cụ/giọng nói/bàn vận hành. Ảnh mobile phần lớn dùng iframe 390px (nội dung có thể 375px vì scrollbar), không phải điện thoại vật lý. Ảnh QA có thanh chọn kích thước ngoài website.

Chưa kiểm tra với người dùng thật, trình đọc màn hình, thiết bị vật lý, micro thật hay tài khoản Zalo/OpenAI/Google Voice thật. Bảng tính dùng giả định sửa được, không phải phép tư vấn thuế hoặc bảng lương pháp lý.

## Vòng đánh giá

Vòng một: **92/100** do agent rà soát riêng chấm từ ảnh và báo cáo thực chạy (arts 19, craft 18, story 14, journeys 19, mobile 13, accessibility 9). Không đạt mục tiêu nên tiếp tục chỉnh:

1. Công cụ mở chiếm đủ chiều ngang desktop, nhập liệu và kết quả cạnh nhau, không còn cột trống lớn; cả hai disclosure rộng 1280px ở frame1440 được xác minh bằng DOM.
2. CMS demo mobile dùng bộ chọn mục gọn thay vùng navy cuộn dài, giữ đầy đủ cả CMS cũ và năm mục vận hành. Chỉ ẩn menu cũ khi bộ chọn đã có; template quản trị được bảo vệ vẫn giữ menu của nó.
3. Submit khớp việc đưa focus/scroll đến kết quả; lời giải thích đủ bốn locale tách rõ gợi ý với bộ lọc danh sách, có liên kết tiếp tục duyệt tin.
4. Caption ảnh cộng đồng rộng cả hàng mobile; bài cẩm nang chính nổi bật, khoảng meta/tiêu đề bài phụ gọn hơn.

Ảnh vòng hai có hậu tố `-r2.jpg`. Agent rà soát riêng chốt **95/100**, tăng từ baseline V23 91 và vòng một V25 92. Không đổi rubric để đạt mục tiêu.

| Nhóm | Điểm cuối |
| --- | ---: |
| Định hướng nghệ thuật | 19/20 |
| Bố cục, chữ và chi tiết | 19/20 |
| Cấu trúc và kể chuyện | 14/15 |
| Hành trình prototype | 20/20 |
| Mobile | 14/15 |
| Tiếp cận và kiểm chứng | 9/10 |
| Tổng | **95/100** |

Reviewer tự chạy thêm 37/37 kiểm tra trọng điểm; không thấy lỗi chặn mới. Đây là đánh giá của agent tách vai trò, không phải nghiên cứu người dùng hoặc đánh giá độc lập bởi con người. Đạt mục tiêu prototype, chưa thay thế nghiệm thu hệ thống vận hành thật.
