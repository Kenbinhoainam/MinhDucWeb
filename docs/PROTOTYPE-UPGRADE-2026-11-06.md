# Bổ sung prototype theo báo giá 05/11

Phạm vi được xác nhận: bổ sung toàn bộ phần còn thiếu ở mức prototype. Các chức năng phụ thuộc máy chủ hoặc dịch vụ bên ngoài được trình diễn bằng dữ liệu mẫu, có nhãn demo. Tài liệu này ghi phần bổ sung ngày 06/11/2026; không thay thế nghiệm thu triển khai thật hoặc các điều khoản thương mại trong báo giá.

| Hạng mục | Công dụng và phần đã bổ sung | Nơi xem | Trạng thái / phần cần triển khai thật |
| --- | --- | --- | --- |
| AI1 — Soạn nội dung SEO | Tạo bản nháp tiêu đề, dàn ý, bài viết, mô tả tìm kiếm và gợi ý đường dẫn; xem, sửa rồi mới chép vào trình biên tập | CMS Demo → bài viết | Demo theo mẫu. Cần kết nối AI thật, quy trình duyệt và nội dung được kiểm chứng. Đường dẫn hiện là gợi ý xem trước. |
| AI2 — Hỗ trợ bản dịch | Đối chiếu nguồn tiếng Việt với bản dịch EN/ZH/KO, sửa trước khi áp dụng, kiểm tra nguồn đã thay đổi | CMS Demo → phần bản dịch | Chức năng nhập/sửa bản dịch đã có. Trợ lý mới chỉ gợi ý từ mẫu khớp nguồn; nội dung khác cần dịch thủ công hoặc AI thật. |
| AI3 — Soạn tin tuyển dụng | Tạo bản nháp từ các thông tin đã xác nhận, chỉnh sửa trước khi áp dụng | CMS Demo → tin tuyển dụng | Demo theo quy tắc; không tự bịa lương, ca làm hoặc quyền lợi chưa có. |
| AI4 — Chatbot | Tìm câu trả lời theo tin đang mở, đính kèm liên kết từng tin nguồn; chuyển sang liên hệ nếu không đủ dữ liệu | Trợ lý trên các trang công khai | Demo theo dữ liệu hiện tại và quy tắc. Chưa kết nối mô hình AI hoặc nhân viên trực tuyến. |
| AI5 — Tìm việc bằng câu tự nhiên | Đọc câu tiếng Việt thành địa bàn, KCN, thu nhập, ca, loại việc; cho chỉnh và xác nhận trước khi tìm | Việc làm / tuyển dụng nội bộ | Demo phân tích câu theo quy tắc. Điều kiện không hiểu được được đưa ra để kiểm tra; tin thiếu ca làm không được xem là đáp ứng ca đã chọn. |
| AI6 — Phác thảo nhu cầu doanh nghiệp | Đọc mô tả tiếng Việt thành số người, địa bàn, ngành, ca, thời điểm; xem và sửa trước khi chép vào biểu mẫu | Trang chủ / dịch vụ / liên hệ → phần lập nhu cầu | Demo theo quy tắc; không gửi yêu cầu thật. Giữ nội dung sửa tay và bản nháp khi đổi ngôn ngữ. |
| Google Sheets | Minh họa ánh xạ cột, hàng đợi, lỗi, thử lại, cập nhật phiên bản và tránh ghi trùng | CMS Demo → Đồng bộ Google Sheets | Một tệp và hai trang tính giả định. Chưa kết nối tài khoản Google hoặc đồng bộ hồ sơ thật. |
| M1 — So sánh việc | Bổ sung dòng ca làm vào bảng so sánh và hỗ trợ bốn ngôn ngữ | Chọn so sánh các tin việc làm | Hoạt động trong trình duyệt. Ca chưa có dữ liệu được ghi rõ cần xác nhận. |
| M3 — Báo cáo chuyển đổi | Lọc ngày, xem nguồn, các bước chuyển đổi và xuất CSV đúng phạm vi đã chọn | CMS Demo → Báo cáo chuyển đổi | Dữ liệu tổng hợp giả định ngày 01–06/11/2026; chưa phải số đo khách truy cập thật. |
| M4 — Cổng ứng viên | Đăng nhập OTP mẫu, lựa chọn hồ sơ mẫu, việc đã lưu, xem trước ứng tuyển và trạng thái | Việc làm → Cổng ứng viên | Demo trong trình duyệt; OTP không gửi thật, không tạo tài khoản hoặc hồ sơ ứng tuyển thật. |
| M5 — Cổng doanh nghiệp | Chọn doanh nghiệp mẫu, lập/xem trước yêu cầu, danh sách và trạng thái theo doanh nghiệp | Dịch vụ → Cổng doanh nghiệp | Demo trong trình duyệt; chưa có tài khoản, phân quyền và quản lý yêu cầu trên máy chủ. |

Các bản ghi mẫu của cổng ứng viên, cổng doanh nghiệp, Sheets và báo cáo là những bộ dữ liệu riêng để trình diễn từng luồng; không biểu thị một hệ thống đã đồng bộ hoàn chỉnh. Các biểu mẫu liên hệ/ứng tuyển hiện có vẫn giữ cơ chế prototype không gửi thật.

## Kiểm chứng và xuất bản

- Đã thực hiện quy trình gồm 2 agent lập kế hoạch, 12 worker và 8 agent kiểm thử/phản biện theo từng đợt, tối đa 3 subagent cùng lúc.
- Đã sửa các lỗi được phản biện: ghi đè bản nháp, nguồn bản dịch thay đổi, câu phủ định, nội dung nhu cầu cũ sau lần chép tiếp theo, giữ bản nháp khi đổi ngôn ngữ và dữ liệu mẫu khi dùng nhiều tab.
- Kiểm tra bao gồm bộ kiểm thử tự động, kiểm tra tích hợp trang/tài nguyên, sinh trang và bản dựng phát hành. Không coi các phép kiểm mã nguồn là kiểm chứng hình ảnh trên trình duyệt.
- Công cụ kiểm tra trình duyệt không khả dụng trong lượt này. Chưa xác nhận trực quan bố cục desktop/mobile của bản mới.
- Chỉ phát hành đến Site phụ `appgprj_6aeb62b7473c81918b158ac079784e38`, giữ quyền xem riêng tư. Không phát hành lên Site chính khi chưa có xác nhận riêng cho bản này.

Site phụ hiện tại: https://minh-duc-stgg.kenbinhoainam.chatgpt.site
