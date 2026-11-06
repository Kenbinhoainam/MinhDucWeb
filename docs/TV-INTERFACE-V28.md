# Giao diện TV Minh Đức V28

## Đối tượng và quyết định sau phản biện

- Dùng tại sảnh, phòng chờ hoặc điểm tư vấn. Người lao động xem cách chọn khu vực, ca và đọc tin việc làm. Đại diện doanh nghiệp xem cách chuẩn bị vị trí, số người và ngày cần nhân lực. Nhân viên có thể bật trình chiếu minh họa cho màn hình dùng chung.
- Mở `/tv.html` ở màn hình chào với hai lựa chọn theo nhu cầu. Mỗi nhánh có ba bước ngắn và liên kết sang trang hiện có. Trình chiếu là lựa chọn riêng gồm bốn trang minh họa, hai cho mỗi nhóm.
- V28 loại khỏi phạm vi tìm kiếm hoặc nộp hồ sơ ngay trên TV, biểu mẫu và thu thập dữ liệu, tài khoản, dữ liệu trực tiếp, video, âm thanh, mã QR và cơ chế khóa kiosk hay tự vào toàn màn hình.

## Cấu trúc và nội dung

| Tệp | Trách nhiệm |
| --- | --- |
| `public/tv.html` | Bốn màn hình tiếng Việt, logo có sẵn, nội dung và nhãn ngữ nghĩa, liên kết tương đối tới `index.html`, `viec-lam.html` và `dich-vu.html`. Khi tắt JavaScript, màn hình chào vẫn dẫn đến các trang đó và ẩn nút trình chiếu. |
| `public/tv.css` | Kiểu dáng giới hạn trong giao diện TV, dùng phông Noto Sans có sẵn, chữ co giãn theo khung nhìn, lề an toàn tối thiểu 5% mỗi cạnh ở hai kích thước TV và viền focus rõ. |
| `public/tv.js` | Điều khiển màn hình và focus, trạng thái phát, bộ hẹn giờ và tiến độ. Màn hình và trang chiếu không hoạt động có cả `hidden` và `inert`. Trang chạy độc lập với ứng dụng chính, không gọi API hoặc lưu dữ liệu. |

Giữ nhãn **Bản demo** trên cả bốn màn hình. Dùng hướng dẫn chung và gọi tin việc làm là tin mẫu. Chỉ đưa thông tin tuyển dụng, số liệu, thu nhập, cam kết hoặc thông tin liên hệ cụ thể khi có nguồn xác minh và được phép công bố.

Site phụ dùng để duyệt có quyền truy cập riêng tư. Nếu mã QR trỏ vào site này, điện thoại của người quét vẫn phải có quyền truy cập riêng.

## Bàn phím và trình chiếu

- Tab và Shift+Tab đi theo thứ tự tự nhiên. Mũi tên trái và phải chuyển focus qua các điều khiển theo vòng trong màn hình đang hiện. Khi nội dung vừa khung nhìn, mũi tên lên và xuống cũng chuyển focus. Khi nội dung dài hơn khung nhìn, hai phím này cuộn trang ngay cả khi một nút hoặc liên kết đang nhận focus. Enter kích hoạt liên kết hoặc nút, Space kích hoạt nút theo hành vi trình duyệt.
- Khi vào màn hình người lao động, doanh nghiệp hoặc trình chiếu, focus vào tiêu đề và trang cuộn về đầu. Escape quay về màn hình chào. Khi trở lại màn hình chào, focus trở về điều khiển đã dùng nếu còn khả dụng, hoặc về tiêu đề.
- **Bắt đầu trình chiếu** mở trang 1 và tự phát nếu tab đang hiện và hệ điều hành hoặc trình duyệt không yêu cầu giảm chuyển động. Mở trực tiếp `/tv.html#display` bắt đầu ở trang 1 và tạm dừng. Nút **Phát trình chiếu** vẫn cho phép chủ động phát khi bật giảm chuyển động.
- Khi phát, cứ 20 giây chuyển sang trang tiếp theo và quay từ trang 4 về trang 1. Nút trước/sau chuyển trang theo vòng và tạm dừng phát. Phím điều hướng như Tab và mũi tên cũng tạm dừng, còn Enter hoặc Space trên nút phát/tạm dừng thực hiện thao tác của nút. Khi tab bị ẩn, bộ đếm dừng. Khi tab hiện lại, bắt đầu một chu kỳ 20 giây mới trên trang hiện tại nếu chế độ phát vẫn được bật.

## Tiêu chí nghiệm thu và danh sách kiểm tra

- [ ] Ở 1920 × 1080 và 4K UHD 3840 × 2160, xem đủ bốn màn hình và bốn trang chiếu ở tỷ lệ 16:9. Tiêu đề, tiếng Việt có dấu, nhãn demo, trạng thái và nút phải đọc được từ vị trí xem dự kiến. Toàn bộ nội dung và viền focus nằm trong vùng an toàn, không bị cắt, chồng lấn hoặc cần cuộn. Kiểm tra ở 100% với khung nhìn CSS tương ứng và ghi lại tỷ lệ hiển thị thực tế của thiết bị 4K.
- [ ] Thử chuột, bàn phím và điều khiển TV trên thiết bị đích. Kiểm tra thứ tự Tab, vòng lặp mũi tên, kích hoạt nút/liên kết, Escape và khôi phục focus. Kiểm tra màn hình ẩn không nhận focus và trạng thái trình chiếu thông báo đúng trang và chế độ.
- [ ] Ở 320 × 568, dùng mũi tên xuống để đọc nội dung và dùng mũi tên trái/phải hoặc Tab để đến các nút cuối trang. Từ một nút cuối trang, dùng mũi tên lên để đọc lại phần đầu. Quay về màn hình chào rồi mở lại mỗi nhánh để kiểm tra focus ở tiêu đề và vị trí cuộn ở đầu trang.
- [ ] Kiểm tra tự phát, nhịp 20 giây, vòng lặp, trước/sau, phát/tạm dừng, ẩn/hiện tab, giảm chuyển động và mở trực tiếp `#display`.
- [ ] Tắt JavaScript để kiểm tra đường dẫn sang trang chủ, việc làm và dịch vụ. Kiểm tra các đích liên kết, tài nguyên cục bộ, nhãn demo, nội dung minh họa và quyền truy cập site duyệt bằng phiên riêng trên điện thoại.

Các mục nghiệm thu trên đang chờ kiểm tra thực tế.
