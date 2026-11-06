# Minh Đức V27 — kế hoạch cá nhân hóa và phản biện

Nguồn: Google Sheet MDxGenZ_Website, INDEX, đọc ngày 05/11/2026; các hàng có dữ liệu 2–24. Giữ nguyên bảng tính nguồn. Bản nền Sites #23, commit 363034aa503b7ea5ec20185b2240d7e68effe48d.

## Dữ kiện và giới hạn

- Tên pháp lý: CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA.
- Dịch vụ: cung ứng nguồn nhân lực, tư vấn/giới thiệu việc làm, lao động phổ thông nhà máy.
- Hotline 0364562868; Zalo https://zalo.me/0329138082; Facebook https://www.facebook.com/md668.com.vn.
- Chi nhánh Vôi và Bắc Ninh có liên kết Google Maps; Quảng Ninh chưa có link/địa chỉ. Chuẩn hóa lỗi gõ “Quàng Ninh” thành “Quảng Ninh”, không tự điền địa chỉ.
- Liên kết Vôi trỏ địa điểm Công ty TNHH Nhân Lực Minh Đức Vina; link Bắc Ninh trỏ “Cty TNHH MD668 VINA, Nếnh, Bắc Ninh”. Không suy ra quan hệ pháp lý khác từ tên Maps.
- Nguồn chỉ có 5 dòng đối tác: Luxshare–ICT, Foxconn, Samsung, Jeiltech–Vina, TACU. Không sử dụng con số 51 như danh sách đã xác minh. Không suy ra quyền sử dụng logo từ tên đối tác trong Sheet.
- Email telesale ghi cho cấu hình Sheets: không tự công khai như email CSKH.
- Logo là tệp JPEG được cung cấp; đối chiếu trước khi sử dụng. Không đổi ảnh minh họa thành ảnh thực.

## Phương án đưa ra phản biện

1. Giữ luồng tìm việc B2C đầu tiên và tab doanh nghiệp V26. Cá nhân hóa tên, mô tả dịch vụ và kênh liên hệ; không bổ sung thành tích hoặc cam kết chưa có.
2. Thêm hồ sơ doanh nghiệp và bộ sưu tập chi nhánh riêng với đối tác. CMS sửa tên, địa chỉ, link Maps, URL nhúng, hiển thị và thứ tự; thêm/xóa chi nhánh; lưu cùng nội dung CMS để import/export, draft/publish và rollback giữ được dữ liệu. Dữ liệu cũ thiếu trường mới vẫn đọc được.
3. Trang liên hệ có thẻ chi nhánh, chọn chi nhánh, gọi hotline/Zalo và chỉ đường đúng link nguồn; Quảng Ninh có trạng thái chờ địa chỉ và không có nút Maps giả. Trang giới thiệu có tóm tắt mạng lưới; trang chủ có điểm vào gọn, không đẩy danh sách việc xuống sâu.
4. Bản đồ nhúng chỉ tải sau thao tác xem bản đồ. Chỉ nhận URL Google Maps nhúng được kiểm tra; không nhận HTML iframe tùy ý. Luôn giữ link Maps dự phòng. Không tự xin định vị, không dùng khóa API giả, không tự đo khoảng cách hoặc hứa “gần nhất”.
5. Thay danh sách doanh nghiệp tham khảo mặc định bằng 5 tên nguồn theo kiểu chữ, chưa xác nhận quyền logo. Giữ các chỉnh sửa CMS hiện có, thêm migration có phiên bản; không tự xóa hồ sơ do người dùng sửa.
6. Biên soạn giao diện mới đủ VI/EN/ZH/KO; tên pháp lý, hotline và địa chỉ giữ nguyên dữ kiện. Giữ form no-send và dữ liệu biểu mẫu khi đổi ngôn ngữ.

## Tiêu chí chấp nhận

- Nội dung pháp lý và kênh liên hệ khớp nguồn; email nội bộ không xuất hiện công khai.
- Cả hai nhóm người dùng tìm thấy hỗ trợ và chi nhánh mà không phải qua biểu mẫu.
- Chỉnh sửa/thêm/xóa/ẩn/sắp xếp chi nhánh trong CMS cập nhật trang công khai cùng trình duyệt; JSON round-trip và backend validation bảo toàn dữ liệu, chặn URL/giá trị sai.
- Bản đồ không tạo iframe trước khi bấm; chỉ đường luôn đúng link chi nhánh; thiếu dữ liệu hiển thị trung thực; không tự gắn tọa độ dự đoán.
- Không tràn ngang ở 320/390/768/1440; hoạt động bằng bàn phím; 4 ngôn ngữ; không trùng ID/nhãn form; trạng thái chưa có/ẩn/xóa đều hữu ích.
- Kiểm tra hồi quy B2C/B2B, CMS và quyền máy chủ. Phản biện độc lập sau triển khai; sửa phát hiện có căn cứ rồi kiểm tra lại.

Bản cập nhật được chuẩn bị thành nháp có thể duyệt. Xuất bản là bước riêng sau khi hoàn tất kiểm chứng.

## Điều chỉnh sau phản biện vòng 1 — hợp đồng triển khai

- `company`: legalName (160), description (700), facebook (300). Hotline/Zalo dùng trường social hiện có; không suy từ Facebook sang Messenger. `branches`: tối đa 20, mỗi bản ghi id ổn định duy nhất (slug 1–80), name (100), address (250, được trống), mapsUrl (500, được trống), embedUrl (2500, được trống), visible boolean; thứ tự mảng là thứ tự hiển thị. Có thể xóa hết chi nhánh.
- Thiếu dữ liệu ở lần đầu nâng cấp dữ liệu V26 được thêm qua migration một lần. Có trường rỗng/collection rỗng là lựa chọn có chủ ý, không ghi đè. Reset demo dùng seed mới; snapshot V27 import/export/rollback giữ nguyên toàn bộ dữ liệu. Snapshot máy chủ cũ thiếu trường mới vẫn hợp lệ và không tự thêm chi nhánh trong đường setData/rollback máy chủ.
- Không còn vòng lặp tự thêm mọi default partner khi khởi động. Fresh seed có đúng 5 tên nguồn, logo rỗng. Khi nâng cấp V26, so sánh hồ sơ với bản seed cũ: chỉ các hồ sơ mẫu chưa đổi được thay bằng bộ 5 nguồn; hồ sơ đã sửa/ẩn giữ được, gắn loại tham khảo, không biến thành đối tác nguồn. Collection đối tác rỗng giữ rỗng. Sau migration không tự thêm lại khi xóa. Logo nguồn không kế thừa logo minh họa cũ.
- CMS hiện hành là bản demo lưu theo trình duyệt, không đồng bộ Google Sheet và không tự đẩy lên máy chủ. Cùng cấu trúc JSON được kiểm tra ở backend hiện có; giữ quyền, revision, draft/publish/rollback riêng, không tuyên bố CMS demo đã trở thành CMS live.
- Maps navigation chỉ dùng HTTPS host/path Google Maps allowlist; giữ đúng hai short link nguồn. Nhúng chỉ nhận `https://www.google.com/maps/embed?pb=…` từ Share → Embed a map đã quan sát trực tiếp cho đúng địa điểm. Không nhận iframe HTML; không tự dựng URL từ tọa độ. Chặn credentials/port/host giả/path không đúng và URL quá dài. CMS để trống nhúng thì link chỉ đường vẫn dùng được.
- Vôi chưa có địa chỉ chữ do doanh nghiệp cung cấp nên để trống; Bắc Ninh cũng không tự điền địa chỉ từ Google. Tên trên Maps và sai khác MD668 ghi ở hồ sơ kiểm chứng, không dùng làm tên pháp lý hay bằng chứng quan hệ doanh nghiệp. Giữ hotline theo Sheet, không lấy số điện thoại khác trên Maps.
- Bộ chọn chi nhánh có nhãn; nút và iframe mang tên chi nhánh; status aria-live; chọn/đổi chi nhánh không chạm vào biểu mẫu; đổi locale giữ form. Khi chi nhánh bị ẩn/xóa, chọn bản ghi khả dụng đầu tiên và hiển thị status; hết chi nhánh thì hiện trạng thái rỗng và kênh liên hệ.
- Logo JPEG đã xem trực tiếp: cùng biểu tượng đỏ/xanh hiện có. Lưu tài sản nguồn nguyên vẹn để dùng ở hồ sơ giới thiệu; giữ header gọn, không kéo méo ảnh hoặc tự chế biến logo.

## Triển khai và các vòng sửa sau phản biện

Đã triển khai hồ sơ công ty và ba chi nhánh, CMS thêm/xóa/ẩn/sắp xếp, hai bản đồ từ URL Share → Embed thực tế, widget Facebook riêng, footer/tóm tắt trang chủ/giới thiệu cá nhân hóa. Ngành và KCN của năm doanh nghiệp được lấy từ INDEX hàng 20–24; không suy đoán địa chỉ, logo, quyền sử dụng hoặc số lượng 51.

Các sửa lỗi thực tế qua tích hợp và phản biện:

1. Bỏ vòng lặp tự thêm lại mọi đối tác mẫu cũ. So sánh toàn bộ bản ghi mẫu để bảo toàn chỉnh sửa/ẩn; danh sách rỗng và xóa có chủ ý không tái sinh.
2. Tách khôi phục bản sao cũ khỏi giá trị mặc định mới; không để revision mới che mất việc cần nâng cấp dữ liệu cũ. Bản V27 thiếu collection đối tác bị từ chối; đường phục hồi dự phòng chuẩn hóa thành rỗng thay vì làm hỏng render.
3. Nhãn “Theo hồ sơ Minh Đức” chỉ dùng khi ID và các trường nội dung vẫn khớp nguồn; đổi tên/nội dung thì thành hồ sơ tham khảo. Không kế thừa logo mẫu vào bản ghi nguồn.
4. Widget chỉ còn Facebook vẫn mở đúng Fanpage và không báo nhầm rằng mọi kênh đều chưa có. Không biến Fanpage thành URL Messenger.
5. Khi đến từ brief (`wb=1`) hoặc dịch vụ đã chọn, biểu mẫu B2B nằm trước phần bản đồ. Người mở trang liên hệ thông thường thấy các kênh và chi nhánh trước. Không nhân đôi section hoặc thay đổi dữ liệu form khi chọn chi nhánh.

## Kiểm chứng ngày 05/11/2026

- 202/202 kiểm tra Node đạt; bao gồm URL parsing/host giả/credentials, schema phía trình duyệt và máy chủ, migration/import, thất bại lưu vẫn giữ bản đang nhập, source attribution, draft isolation/publish/rollback và no-send.
- Agent cuối độc lập chạy 75 kiểm tra tập trung/hồi quy đạt và 24 trường hợp render liên hệ ở bốn ngôn ngữ đạt. Không còn phát hiện P1/P2 cần sửa trong phạm vi rà soát. Agent không tự chạy lại trình duyệt.
- Bản dựng Worker và verify-runtime đạt trên nguồn cuối. Không thay quyền truy cập hoặc thiết lập máy chủ.
- QA trình duyệt mới gồm 138/138 kiểm tra: 48 bố cục ba trang/bốn locale/bốn kích thước, chuyển/mở/thiếu bản đồ, giữ form, thứ tự theo ý định B2B, thao tác CMS, nhập JSON cũ/sai và cấu hình chỉ có Facebook. Kiểm tra hồi quy V26 trên V27 đạt 232/232 trước sửa nhỏ cuối về thứ tự và widget; không coi đó là lượt chạy riêng cho thay đổi cuối.
- 24 lượt axe cuối trên home/about/contact ở bốn locale và khung 390/1440 không có vi phạm tự động; kết quả được lưu riêng trong báo cáo giao diện. Các mục cần kiểm tra thủ công được giữ, không chứng nhận WCAG.
- Đã thấy Google Maps hiển thị địa điểm thực trong khung nhúng và thử mở bằng Enter. Kiểm tra mobile bằng khung trình duyệt, không phải thiết bị vật lý. Chưa có phỏng vấn người dùng hoặc kiểm tra trình đọc màn hình đầy đủ.

Ảnh, JSON kiểm tra và báo cáo bàn giao lưu tại thư mục outputs của chat. Không chấm tăng điểm flagship chỉ vì số lượng kiểm tra tăng. Bản V27 lưu nháp, không triển khai công khai trong lượt này.
