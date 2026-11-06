# Minh Đức V21 — cải thiện từ hai bản đánh giá prototype

Ngày 04/11/2026. Baseline: V20 / Sites #14, được đánh giá 79,2/100 trong các chat “Đánh giá prototype flagship” và “Đánh giá prototype web”. V21 không tự nhận điểm mới hoặc trạng thái nghiệm thu flagship.

## Thay đổi

- CMS bảo toàn nội dung EN/ZH/KO khi sửa nguồn VI, đánh dấu trường cần rà lại; xuất/nhập JSON giữ trạng thái đó. Việc tạo lại bản dịch mẫu không tự ghi đè bản đã có.
- CMS và website dùng cùng nội dung bài viết chuẩn; chuyển đổi đúng các trường mẫu cũ, giữ nội dung người dùng đã sửa. Home ưu tiên bản dịch đã biên tập.
- Crop theo ID bản ghi, áp dụng cho thẻ trang chủ, danh sách, chi tiết và sau lọc. Hai việc dùng chung ảnh có cấu hình độc lập; studio xem trước theo tỷ lệ sử dụng.
- CTA mobile “Xem tất cả việc làm” mở đúng danh sách phổ thông/nội bộ. Liên hệ vẫn là hành động riêng.
- Menu mobile mở vào liên kết đầu, tự đóng khi focus ra ngoài; Escape trả focus về nút mở. Nhãn trợ năng được bản địa hóa.
- Pause dải logo dừng track thật; giữ nguyên logo demo và quy tắc giảm chuyển động.
- Tin tức lưu loại nội dung/từ khóa vào URL. Footer Video chọn sẵn Video; quay lại từ bài, đổi ngôn ngữ và tải lại giữ ngữ cảnh. Metadata không lặp Video.
- Video chưa có nguồn hiển thị poster/trạng thái rõ, không hứa phát. Nguồn hợp lệ và nguồn lỗi vẫn có đường xử lý riêng.
- Sửa nghĩa kinh nghiệm bắt buộc của kỹ sư cơ điện ở EN/ZH/KO. Chỉ chuyển đổi bản dịch mẫu cũ khớp nguyên văn; giữ bản người dùng sửa để rà lại.
- Form giữ dữ liệu đang nhập và bước hiện tại khi đổi ngôn ngữ, giữ nguyên phần tử chọn CV trong bộ nhớ. Không lưu thông tin liên hệ/CV. Tách nhãn dịch vụ tự sinh khỏi nội dung người dùng viết.
- Home/About theo ba nguyên tắc rõ công việc, rõ điều kiện, rõ người phụ trách. About có tình huống phối hợp và trách nhiệm ba bên được ghi rõ là minh họa; CTA dẫn đúng section. Không tạo lịch sử, thành tích hoặc khách hàng giả.
- Thu gọn phần mở đầu Services/Contact/Jobs/News; widget desktop gọn trong lề trang, panel cuộn được, lớp nổi tránh menu/modal.

## Kiểm chứng

- `pnpm test`: **47/47 đạt**, gồm bộ kiểm hiện có và regression CMS, tương tác, nghĩa tuyển dụng; log tại `v21-unit-tests.txt`.
- `node scripts/verify-runtime.mjs`: đối chiếu bundle/nguồn, API trình duyệt, bốn locale, ranh giới form mô phỏng và chống gửi lặp.
- `scripts/v21-qa.html`: 178 phép kiểm trình duyệt, gồm 112 tổ hợp 7 trang × 4 chiều rộng × 4 locale; menu, CTA, pause 5 giây, Video/filter/back và trạng thái thiếu video. Kết quả tại `v21-browser-regression.json`.
- Suite CMS: 21 phép kiểm qua DOM CMS thật, lưu bản dịch, sửa nguồn VI, tải lại/xem trước, crop độc lập cùng ảnh, lọc/đổi locale/mobile và JSON roundtrip. Kết quả tại `v21-cms-regression.json`.
- Kiểm trực tiếp bàn phím: mobile menu mở, Tab sang liên kết tiếp, Escape trả focus. Kiểm trực tiếp form doanh nghiệp: giữ nội dung tự nhập và bước 2 khi VI → EN, nhãn dịch vụ đổi sang EN.

Harness chỉ dùng cục bộ, sao lưu/khôi phục dữ liệu trình duyệt và không nằm trong gói phát hành. Muốn chạy lại: copy `scripts/v21-qa.html` sang `public/__qa.html`, mở qua preview cùng origin; gỡ file tạm trước build phát hành.

## Giới hạn và việc còn lại

Chưa nghiệm thu bằng điện thoại vật lý, bàn phím ảo, screen reader hoặc biên tập viên bản ngữ toàn diện. Bài video mặc định chưa có clip doanh nghiệp; trạng thái hiện rõ điều đó. Chưa thêm một clip mới chỉ để tăng điểm. Chưa chấm lại 50 tiêu chí P1.0.0; cần audit độc lập đúng bản đã phát hành. Form và CMS tiếp tục là mô phỏng; không bổ sung kết nối nhận lead/CV thật.

Hướng dẫn chạy/build/hosting ở `RUNBOOK-V20.md` tiếp tục áp dụng. Máy Windows hiện có bộ Node/pnpm riêng trong `.sites-runtime/tooling` (bị Git bỏ qua), không thay bản Node toàn máy.
