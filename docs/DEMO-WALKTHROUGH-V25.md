# Kịch bản duyệt prototype V25

Chỉ dùng dữ liệu giả. Bản nháp không thay đổi dữ liệu của website công khai hiện tại.

## Người tìm việc

1. Chọn ngôn ngữ VI/EN/ZH/KO ở đầu trang. Từ trang chủ đi vào Việc làm.
2. Mở công cụ khớp việc, chọn các ưu tiên. Đọc giải thích điểm; sửa tiêu chí và thử trường hợp không có kết quả. Đây là gợi ý công việc, không phải quyết định tuyển dụng.
3. Mở một tin mẫu. Đọc lương, ca làm, quyền lợi và địa bàn. Lưu hoặc so sánh hai tin.
4. Mở bảng tính thu nhập. Nhập giả định lương, phụ cấp, số giờ và hệ số tăng ca, các khoản trừ. Kiểm tra tổng cùng bảng phân rã; thay đổi một yếu tố và đặt lại. Con số không thay thế thỏa thuận với nhà tuyển dụng.
5. Mở trợ lý. Chọn câu hỏi gợi ý hoặc nhập câu hỏi ngắn; theo liên kết sang công việc/liên hệ. Trợ lý chạy kịch bản mẫu, không dùng LLM bên ngoài.
6. Ở form ứng tuyển, mở điền bằng giọng nói. Có thể dùng nội dung mẫu/nhập bằng bàn phím mà không cần bật micro. Nếu chọn nhận dạng thật, xem thông báo trước khi cấp quyền. Đọc, sửa và xác nhận các trường; form không tự nộp, không tự chọn đồng ý dữ liệu.
7. Hoàn tất form mô phỏng. Màn hình xác nhận không phải biên nhận hồ sơ thật. Không nhập CV/thông tin riêng tư thật.

## Doanh nghiệp

1. Chọn một trong bốn dịch vụ, đọc sơ đồ tình huống và đầu ra.
2. Phác thảo ngành, quy mô, địa bàn; chuyển sang Liên hệ và kiểm tra ngữ cảnh đã được giữ.
3. Đi qua các bước biểu mẫu bằng thông tin hư cấu. Thử quay lại sửa lựa chọn và xem trạng thái lỗi trước khi hoàn tất mô phỏng.

## Người vận hành

1. Mở CMS demo từ footer. Biên tập tin/bài viết/ảnh như trước; kiểm tra bản công khai cùng trình duyệt và locale. Không nhầm CMS demo với tài khoản quản trị thật.
2. Vào bàn vận hành mới, xem hồ sơ và yêu cầu FDI hư cấu; lọc, đọc chi tiết, đổi trạng thái và ghi chú mẫu. Tải lại để kiểm tra trạng thái trong trình duyệt.
3. Quản lý danh mục KCN mẫu: thêm/sửa, kiểm tra đầu vào không hợp lệ và trạng thái liên quan. Không coi danh mục riêng này là cơ sở dữ liệu địa bàn sản xuất.
4. Xem thông báo giả lập Zalo OA/Telegram. Thử lỗi, thử lại, đọc lịch sử. Các trạng thái không có nghĩa tin đã đến nền tảng thật; không nhập token/API key.
5. Đặt lại dữ liệu mẫu khi kết thúc. Xóa dữ liệu site trong trình duyệt cũng xóa thay đổi demo; không có đồng bộ/backup máy chủ cho bàn vận hành này.

## Cần triển khai riêng trước vận hành thật

Tài khoản và phân quyền nhân viên; lưu hồ sơ/CV có kiểm soát; đồng ý, thời hạn lưu và xóa dữ liệu; hàng đợi thông báo cùng retry/idempotency; tài khoản và chi phí API; giám sát và hỗ trợ; nghiệm thu/training với doanh nghiệp; hợp đồng bảo hành. Các phần này không được giả vờ hoàn tất bằng trạng thái giao diện prototype.
