# V26 — cao cấp, dễ dùng và đúng nhu cầu B2C/B2B

Nguồn nền: bản Sites mới nhất b6182d3 (mở 04/11/2026). Bảo toàn thay đổi sau V25, ảnh/video và thiết lập hiện có. Bản mới giữ dạng nháp, chờ người dùng duyệt.

## Nhu cầu và quan sát

Đối tượng chính do chủ dự án xác nhận: lao động phổ thông B2C và doanh nghiệp B2B. Chưa có khảo sát người dùng thật; các nhu cầu dưới đây là giả thuyết nghiệp vụ để kiểm tra thiết kế, không phải số liệu nghiên cứu.

| Nhóm | Cần làm được | Ma sát quan sát ở nguồn hiện tại | Quyết định |
| --- | --- | --- | --- |
| Người tìm việc | Tìm nơi làm, đọc mức thu nhập, biết ca/đi lại trước khi chọn | Hero mặc định B2B; search sau chương doanh nghiệp; công cụ nâng cao trước danh sách | Hero B2C mặc định cho người mới, search và tin trước B2B; công cụ tùy chọn sau danh sách |
| Người ít quen biểu mẫu | Biết đang chọn việc gì và được sửa trước khi hoàn tất | Các lựa chọn bước đầu cách xa tin; thiếu bản tóm tắt lúc nhập liên hệ | Quick facts và tóm tắt lựa chọn ở bước hai; giữ tên/phone/consent, không tự chọn đồng ý |
| Người còn phân vân | Biết thông tin nào chưa được xác nhận, có chỗ hỏi | Tin chưa có giờ ca/điểm đón xác thực; lọc theo trần thu nhập dễ hiểu nhầm là tối thiểu | Đánh dấu chưa xác nhận; nhãn “có thể đạt”; không suy diễn giờ ca/điểm đón từ tag |
| Doanh nghiệp | Mô tả số lượng, địa bàn, ca và mốc cần người; kiểm tra nội dung chuyển bước | Brief chỉ có ngành/quy mô/địa bàn, phần còn lại nhập tự do | Bổ sung cấu trúc gọn, chấp nhận chưa rõ, mang ngữ cảnh sang liên hệ, giữ lời nhắn tự soạn |
| Cả hai | Giao diện rõ, có dấu ấn, dễ chạm/đọc trên mobile, giữ ngôn ngữ | Độ bóng thị giác không đồng nghĩa phù hợp tác vụ | Giữ nhận diện navy–đỏ/ảnh thực; kiểm tra tác vụ, trạng thái lỗi và bàn phím thay vì chỉ chấm ảnh |

## Tham chiếu

[Randstad](https://www.randstad.com/) tách đường vào “for talent” và “for clients”, đặt tìm việc thành hành động trực tiếp. Chỉ tham khảo cách phân luồng; không sao chép nội dung hoặc coi đó là bằng chứng nhu cầu của người dùng Minh Đức. Tham chiếu Robert Half không tải được trong lượt này nên không dùng làm bằng chứng mới.

## Kế hoạch và phản biện trước tích hợp

1. Main xử lý kiến trúc trang chủ, nội dung trung thực và nguồn sinh HTML.
2. Agent B2C xử lý thứ tự công cụ, facts và review ứng tuyển; agent B2B xử lý brief có cấu trúc. Phạm vi tệp tách biệt.
3. Agent thứ ba phản biện: tránh ưu tiên B2C làm B2B khó tìm; không thêm biểu mẫu làm tăng tải; không đưa thông tin chưa xác nhận thành cam kết; không phá locale/CMS/voice/form no-send.
4. Tích hợp, kiểm tra Node + trình duyệt 320/390/768/1440, bốn locale và trạng thái mở/rỗng/lỗi/quay lại. Chạy kiểm tra phù hợp, sửa lỗi thực tìm được rồi đánh giá lại.

## Điều kiện đánh giá phù hợp

- Người mới thấy đường tìm việc ngay ở hero; search/tin nằm trước nội dung B2B.
- Doanh nghiệp có tab riêng và CTA đến đúng brief, không phải đoán đường tìm.
- Danh sách việc là tác vụ chính; matching/lương/voice vẫn có nhưng tùy chọn.
- Thu nhập tiềm năng khác mức tối thiểu; ca/đón xe chưa xác nhận không được bịa.
- Người ứng tuyển xem lại việc và lựa chọn, sửa được; consent không được tự đánh dấu.
- Brief B2B giữ dữ liệu nghiệp vụ qua bước tiếp theo, không ghi đè lời nhắn người dùng.
- Locale, dữ liệu CMS tự sửa và quyền quản trị được bảo toàn; form không gửi thật.
- Không tràn ngang/chồng nút ở kích thước kiểm tra, lỗi và focus được thông báo rõ.

Giữ rubric flagship V23: nghệ thuật20, chi tiết20, cấu trúc15, hành trình20, mobile15, tiếp cận10. Đánh giá phù hợp tác vụ được báo riêng, không dùng số lượng test để tự động tăng điểm. Mục tiêu giữ chất lượng cao cấp đồng thời xử lý đủ các điều kiện trên; điểm phải dựa vào bằng chứng cuối.

## Phản biện và các vòng chỉnh sửa thực hiện

Agent rà soát riêng xác nhận phương án hợp lý nhưng yêu cầu kiểm tra thêm: khoảng cách mobile tới kết quả, B2B vẫn mở brief/focus được, thu nhập không hiểu thành lương bảo đảm, nguyện vọng khác điều kiện đã xác nhận, số lượng là tổng hay mỗi ca, thời điểm mong muốn khác cam kết cung ứng, công cụ không lấn danh sách, và bảo toàn CMS/locale.

Các vấn đề thực tìm được và đã xử lý:

1. Persona/search/tin việc: đổi mặc định cho người mới sang B2C, đưa tìm kiếm và tin lên trước chương B2B; giữ nội dung hero doanh nghiệp do CMS sửa và lựa chọn persona gần nhất.
2. Công cụ: đưa sau danh sách và phân trang, thu gọn, có liên kết mở gần bộ lọc. Bộ lọc lương nói rõ “có thể đạt” vì truy vấn dùng cận trên khoảng thu nhập.
3. Ứng tuyển: facts công việc không suy diễn giờ ca/tuyến xe; có “chưa rõ/cần tư vấn”, không chọn sẵn. Review phân biệt nguyện vọng với điều kiện nhà tuyển dụng đã xác nhận, quay lại sửa được.
4. Khôi phục locale: thêm radio động làm các chỉ số vị trí trường thay đổi. Chuyển capture/restore sang định danh name/type/value cho radio và giá trị option cho select, giữ đúng tên, phone, consent và input CV gốc trong bộ nhớ.
5. Brief: sửa ID dịch vụ supply, chuẩn hóa zh-CN, số người chính xác tổng cộng tự quyết định khoảng quy mô để không còn hai con số mâu thuẫn. Chi tiết chỉ đi qua URL enum/số an toàn, không kèm liên hệ.
6. Liên hệ: tạo nội dung nháp một lần khi đến từ brief để không bắt nhập lại; người dùng sửa được. Nháp chưa sửa theo kế hoạch mới, nhưng tự soạn/xóa lời nhắn thì không bị ghi đè. Màn hình review hiển thị kế hoạch gọn, nội dung auto-draft ở disclosure để không lặp.
7. Hiệu năng: career tools chỉ tải trên jobs/detail; facts chỉ detail; brief chỉ home/services/contact. Không thay auth, backend hoặc audience.

8. Khi trình duyệt chặn sessionStorage, lựa chọn “Chưa rõ” được chuyển qua bản chụp biểu mẫu trong bộ nhớ và khôi phục sau khi tạo lựa chọn động; không thêm lưu trữ dữ liệu liên hệ. Có kiểm tra tích hợp và 8 tình huống trình duyệt theo ngôn ngữ/kích thước.
9. Khi đã sửa lời nhắn B2B, cờ trong bộ nhớ ngăn cập nhật tự động trở lại kể cả nếu người dùng nhập lại đúng nội dung ban đầu. Nội dung này vẫn hiển thị mở trong bước xem lại, qua cả đổi ngôn ngữ. Kiểm tra hồi quy dùng module thực.

## Kiểm chứng

Kết quả và điểm cuối chỉ ghi từ lượt chạy mới trên V26; báo cáo V25 giữ vai trò lịch sử. Bằng chứng ở `outputs/v26-*.json` và ảnh `v26-*.jpg`; ảnh QA mobile dùng khung iframe 390px (nội dung có thể 375px do thanh cuộn), không phải điện thoại vật lý. Các thao tác DOM giả lập không thay thế kiểm tra người dùng, trình đọc màn hình hoặc micro thật.

Các lượt chạy mới V26: 162 kiểm tra Node đạt; 232/232 kiểm tra hành trình và bố cục, 342/342 hồi quy công khai, 21/21 CMS, 280/280 tính năng cũ, 299/299 trợ lý; 24 lượt axe không có violation, vẫn có mục cần kiểm tra thủ công. Bản dựng Worker và kiểm tra runtime đạt. Chỉnh sửa cuối về hiển thị lời nhắn được xác nhận bằng 17/17 kiểm tra module B2B sau lượt trình duyệt; không coi các báo cáo trình duyệt trước đó là kiểm chứng riêng cho điều kiện mới này.

Không sửa cấu hình xuất bản hoặc quyền truy cập. Hình ảnh hiện có được giữ, các ảnh minh họa vẫn là minh họa. Chưa có dữ liệu người dùng thực để kết luận tỷ lệ hoàn tất hoặc mức hài lòng.

## Kết luận phản biện độc lập

Sau khi sửa lỗi cuối, agent đánh giá độc lập chấm **95/100** và xác nhận **8/8 tiêu chí phù hợp** trong phạm vi prototype. Điểm theo rubric giữ nguyên: nghệ thuật 19/20, chi tiết 19/20, cấu trúc 14/15, hành trình 20/20, mobile 14/15, tiếp cận 9/10. Agent tự chạy 56 kiểm tra tập trung đạt; kết quả trình duyệt do main chạy và agent đọc đối chiếu, không nhận là tự chạy lại.

Không còn phát hiện mã cần xử lý trong phạm vi đã rà soát. Điểm là đánh giá chuyên gia nội bộ cho prototype, không phải chứng nhận flagship bên ngoài hoặc bằng chứng hài lòng người dùng. Phần điểm còn thiếu liên quan khả năng tinh gọn nội dung/mobile và kiểm chứng tiếp cận/người dùng thực. Để đánh giá vận hành thật cần tin tuyển dụng, bảng lương/ca/xe, kênh hỗ trợ và bằng chứng doanh nghiệp do Minh Đức xác nhận; không tự tạo các dữ kiện này.
