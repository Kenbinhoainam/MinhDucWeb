<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Bàn giao prototype V17

V17 kế thừa nguồn V16 `401c197a289be98fc9a13c047be5edb4418bd426`, giữ cùng profile P1.0.0 và scope so sánh. V16, báo cáo và bằng chứng trước sửa vẫn nằm trong Git/docs.

## Hành vi đã thay đổi

- Hero, gallery và trang giới thiệu bỏ nhãn ảnh AI lặp lại. Alt mô tả nội dung ảnh; nguồn gốc ảnh được giữ trong manifest nội bộ. Trang thông tin demo giải thích giới hạn hình ảnh và dữ liệu, không khẳng định đây là tư liệu doanh nghiệp thực.
- Dải doanh nghiệp tham khảo được thay bằng bốn thẻ tư vấn theo ngành khi không có hồ sơ đủ điều kiện. Mỗi thẻ đi đến form với `staffing` và `lang`; mẫu Mechanical đã được thử bằng bàn phím đến hoàn tất mô phỏng.
- 14 hồ sơ mẫu ở CMS mặc định ẩn, không tải logo. Không có ô tự xác nhận quyền. Trường giấy phép chỉ là dữ liệu đề nghị xem xét. Chỉ grant được kiểm tra trong `brand-rights.js` mới có thể cho phép công khai. Xem `LOGO-RIGHTS-V17.md`.
- Thông tin bản trải nghiệm có VI/EN/ZH/KO, giữ locale khi quay lại website. Các chuỗi footer mới và mô tả ảnh cũng có bản dịch.
- CMS nhận đúng `assets/hero-photo.webp`; crop 0% không còn bị đổi ngầm thành 50%. Transform Hero được áp dụng cùng các slot khác. Modal thấp có cuộn; nút cuối vào được viewport và focus vòng đúng.
- Nút giảm chuyển động trong footer đặt `md_motion_preference`; không làm mất nội dung. Đây là điều khiển riêng của website, không giả định đã thử cài đặt hệ điều hành.
- Detail/article có shell trung tính trước JS, tránh chớp thông tin của entity mặc định khác với `id` đang mở. Khi JS chạy, heading, metadata và nav cha cập nhật theo nội dung thực.
- Bỏ ký hiệu kiểm tra trùng trong danh sách nội dung. Lỗi form giữ mô tả chữ, focus, `aria-invalid` và liên kết thông báo.

## Trạng thái và dữ liệu

CMS demo vẫn lưu tại `md_prototype_v16_content` để giữ các chỉnh sửa cục bộ của người đã dùng V16. Tên khóa là tương thích dữ liệu, không phải nhầm phiên bản. Adapter mới là `prototype-v17.js`.

Form không gửi, đọc nội dung CV hoặc lưu thông tin liên hệ. CV mẫu trong bài thử chỉ kiểm tra yêu cầu chọn tệp, đuôi và kích thước ở UI. Không tuyên bố đã quét file hay tiếp nhận hồ sơ thật. Backend D1/R2 và route quản trị được giữ nguyên, không thuộc đánh giá production lần này.

## Tái lập kiểm tra

1. Bắt đầu với dữ liệu giả. Trong CMS chọn **Đặt lại demo**, chấp nhận xác nhận. Nút này khôi phục nội dung; bookmark, lựa chọn tìm kiếm theo phiên và lựa chọn giảm chuyển động có điều khiển riêng.
2. Với so sánh mặc định, bỏ chọn các bookmark/việc đang so sánh, dùng URL ghi rõ `lang`, xóa filter bằng nút trên trang. Tắt/bật giảm chuyển động bằng chính nút footer để tái lập trạng thái mong muốn.
3. Tạm sao chép `scripts/v17-qa.html` thành `public/__qa.html`. Mở fixture và bấm **Run acceptance suite**. Nó chạy tuần tự 180 matrix, 42 reflow, 16 stress, 8 media/rights và 4 phép đo; dữ liệu stress được phục hồi trong `finally`.
4. Reflow là tăng chữ bằng CSS trong iframe, không tương đương kiểm zoom trình duyệt, bàn phím ảo hay thiết bị thật. Để thử lớp phủ, mở CMS trong fixture, chọn 390px, bấm **Short viewport 480px** rồi mở Image Studio; Shift+Tab/Tab/Escape theo `v17-interactions.json`.
5. `scripts/v17-proof.html` ghi ba trạng thái trình bày bằng các iframe thật. `__qa.html` và `__proof.html` chỉ dùng nội bộ, phải gỡ khỏi `public/` trước build/package.
6. Chạy `node --test tests/prototype-v16.test.mjs tests/brand-rights-v17.test.mjs tests/site-api.test.ts`, TypeScript và build Sites chính thức. Test có tên V16 đã được trỏ đến adapter V17; các test backend tiếp tục kiểm tra code được giữ lại.

## Ranh giới kết luận

Không có user study, hiệu đính bản ngữ độc lập, phiên screen reader hay kiểm thử thiết bị thật toàn bộ. Không suy ra WCAG conformance, field CWV, bảo mật production hay quyền thương mại từ điểm prototype.

Các việc cần bằng chứng bên ngoài: định vị/đặc trưng doanh nghiệp đã xác minh, tài liệu đối tác/logo, hiệu đính và thử với người dùng mục tiêu. Chúng không được thay bằng chứng nhận giả hoặc thêm số liệu doanh nghiệp tự tạo.
