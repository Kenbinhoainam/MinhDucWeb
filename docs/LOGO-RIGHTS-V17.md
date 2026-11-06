<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Rà soát logo doanh nghiệp — V17

Ngày rà soát: 01/11/2026. Phạm vi: 14 hồ sơ doanh nghiệp trong seed V16 của Website Minh Đức, nguồn dự án, tìm kiếm tài liệu được cấp quyền truy cập và trang chính thức của chủ nhãn hiệu.

**Kết quả: 0/14 hồ sơ có đủ chứng cứ để xác nhận Minh Đức được công khai logo trong ngữ cảnh đối tác.** Đây là trạng thái chưa xác minh, không phải kết luận các doanh nghiệp đã từ chối hoặc Minh Đức chắc chắn không có quyền. Không gửi yêu cầu cấp phép hay liên hệ bên thứ ba trong công việc này.

V16 đánh dấu cả 14 là `sample:true`, `approved:false`, nhưng vẫn lưu URL hình từ Wikimedia và hiển thị tên công ty trong dải tham khảo. Nguồn ảnh công khai hoặc một ô đánh dấu trong CMS không chứng minh quyền dùng nhãn hiệu hay quan hệ đối tác. Bản kiểm kê trước sửa nằm ở `logo-rights-v17-inventory.json`.

| Hồ sơ | Nguồn chính thức đã đối chiếu | Điều quan sát được | Xử lý V17 |
|---|---|---|---|
| Samsung | https://semiconductor.samsung.com/legal/ | Phạm vi sử dụng tài liệu được giới hạn; sử dụng khác cần chấp thuận phù hợp | Chưa xác minh; ẩn |
| LG Electronics | https://www.lg.com/global/legal/ | Dùng thương mại tài liệu website cần đồng ý bằng văn bản | Chưa xác minh; ẩn |
| Canon Việt Nam | https://global.canon/en/terms/ | Dùng logo Canon cần hợp đồng với Canon | Chưa xác minh; ẩn |
| Foxconn | https://www.foxconn.com.tw/en-us/patent-and-trademark | Việc đăng tài liệu công khai không tự cấp license; dùng nhãn hiệu cần cho phép | Chưa xác minh; ẩn |
| ASICS | https://www.asics.com/vn/en-vn/customer-service/disclaimer/disclaimer.html | Dùng ngoài phạm vi cá nhân được nêu cần cho phép trước | Chưa xác minh; ẩn |
| SEV (Samsung Bắc Ninh) | https://semiconductor.samsung.com/legal/ | Cùng nhãn hiệu Samsung; không thấy giấy cho phép riêng của dự án | Chưa xác minh; ẩn |
| Goertek Vina | https://www.goertek.com/en/about/compliance.html | Cam kết bảo vệ sở hữu trí tuệ; không phải giấy cấp quyền logo cho Minh Đức | Chưa xác minh; ẩn |
| Luxshare-ICT | https://www.luxshare-ict.com/en/terms%20of%20use.html | Nhãn hiệu/logo cần chấp thuận trước bằng văn bản | Chưa xác minh; ẩn |
| Amkor Technology | https://amkor.com/legal/ | Logo được nêu là nhãn hiệu đăng ký; không thấy grant dành cho Minh Đức | Chưa xác minh; ẩn |
| Pegatron | https://resume.sz.pegatroncorp.com/resume/Modules/WebSite/TermOfUse.aspx | Điều khoản của cổng tuyển dụng thuộc hệ thống nêu giới hạn dùng nhãn hiệu; không phải giấy phép cho dự án | Chưa xác minh; ẩn |
| Compal Electronics | https://www.compal.com/vi/investor-relations/company-info/ | Xác nhận trang doanh nghiệp; tài liệu quản lý IP không cấp quyền công khai logo cho dự án | Chưa xác minh; ẩn |
| Wistron Infocomm | https://www.wistron.com/en/LegalNotice | Có cấp phép tài liệu có điều kiện; tên/logo cho quảng cáo, quảng bá cần cho phép trước | Chưa xác minh; ẩn |
| Quanta Computer | https://www.quantatw.com/Quanta/english/esg/ESG2024/ch02.html | Mô tả quản lý IP; không phải cấp phép logo trong dải đối tác Minh Đức | Chưa xác minh; ẩn |
| Inventec | https://www.inventec.com/en/terms | Muốn dùng nhãn hiệu cần chấp thuận bằng văn bản và tuân thủ hướng dẫn | Chưa xác minh; ẩn |

Tài liệu công khai không chứng minh các thỏa thuận riêng không tồn tại. Một số trang chỉ cung cấp thông tin IP chung, không đủ kết luận điều kiện cấp phép cụ thể. Cần kiểm tra văn bản của từng bên cho đúng pháp nhân, file logo, ngữ cảnh, website và thời hạn trước khi chuyển trạng thái.

## Hành vi đã triển khai

- Không tải logo doanh nghiệp chưa xác minh ở trang công khai hoặc danh sách CMS; URL Wikimedia mặc định được gỡ khỏi seed chạy.
- Danh sách 14 hồ sơ còn trong CMS, mặc định ẩn, phục vụ tiếp tục hoàn thiện hồ sơ.
- Không có ô tự xác nhận quyền logo. Trường tài liệu/mã tham chiếu chỉ lưu yêu cầu xem xét trong demo, không tự cấp phép.
- `public/brand-rights.js` có danh sách grant đã kiểm tra rỗng. Hàm công khai đòi đối chiếu đúng doanh nghiệp, logo, origin, thời hạn, người duyệt và cả bằng chứng cấp quyền/quan hệ hợp tác. Đánh dấu `approved:true`, đổi URL hoặc nhập JSON không vượt qua danh sách này.
- Khi chưa có hồ sơ đủ điều kiện, trang chủ thể hiện bốn đường đi tư vấn theo ngành. Không dùng logo hoặc tên doanh nghiệp thật để tạo bằng chứng tín nhiệm thay thế.

## Hồ sơ cần để xác minh một logo sau này

Văn bản của đơn vị có quyền cấp phép; tên pháp nhân nhận quyền; đúng file/logo và hướng dẫn nhận diện; quyền dùng trên website cụ thể/ngữ cảnh đối tác; thời hạn và điều kiện thu hồi; bằng chứng cho mối quan hệ đang được trình bày. Tài liệu riêng tư nên lưu nội bộ, bản source chỉ giữ mã tham chiếu và kết quả duyệt cần thiết. Không ghi giấy phép thương mại hay hợp đồng riêng vào thư mục public.

Đây là kiểm kê bằng chứng và quy tắc xuất bản của prototype, không phải chứng nhận pháp lý hay sự chấp thuận của các doanh nghiệp.
