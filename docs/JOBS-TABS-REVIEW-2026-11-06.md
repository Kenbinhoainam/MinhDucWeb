# Rà soát tab Việc làm · 06/11/2026

## Vấn đề và quyết định

Bốn nút sắp xếp chiếm chỗ cạnh tiêu đề kết quả và dễ xuống dòng ở màn hình hẹp. Nhãn “Tuyển gấp” cũng dễ bị hiểu là bộ lọc. Hai nhóm việc trước đây xuất hiện ở cả menu chính và cụm liên kết trong danh sách, dù người dùng cần phân biệt chủ yếu theo nơi làm và yêu cầu CV.

- **Sắp xếp.** Dùng một `<select>` HTML thu gọn, có nhãn “Sắp xếp” và hiển thị lựa chọn hiện tại. Bốn chế độ gồm mới nhất, thu nhập cao xuống thấp theo mức tối đa, thu nhập thấp lên cao theo mức tối thiểu và ưu tiên tin gấp. Chế độ cuối vẫn hiển thị các tin khác. Các lựa chọn được gói trong một ô và trình duyệt xử lý thao tác chọn. [Carbon Design System · Dropdown](https://www.carbondesignsystem.com/building-blocks/core/components/dropdown/guidelines)
- **Nhóm việc.** Menu chính có một mục “Việc làm”. Hai tab “Việc phổ thông” (mặc định) và “Việc tại Minh Đức” luôn hiện nhãn và số tin đang mở. Mỗi tab hiển thị một danh sách cùng phần giới thiệu làm rõ nơi làm và yêu cầu CV. Tabs hợp với hai nhóm liên quan có thể xem riêng, nhưng dễ làm người dùng bỏ sót nhóm còn lại. Giữ cả hai nhãn ngay trên danh sách và duy trì liên kết thẳng đến nhóm nội bộ ở chân trang. [GOV.UK Design System · Tabs](https://design-system.service.gov.uk/components/tabs/)
- **Khả năng tiếp cận.** `tablist` có tên, mỗi `tab` có `aria-selected` và `aria-controls`, mỗi `tabpanel` lấy tên từ tab tương ứng qua `aria-labelledby`. Panel không hoạt động dùng `hidden`. Phím Tab đưa focus vào tab đang chọn, ←/→ và Home/End di chuyển focus, Enter/Space kích hoạt. Focus có chỉ dấu trực quan. Nhãn của ô sắp xếp dùng `label`, mô tả dùng `aria-describedby`, số kết quả và thứ tự được thông báo qua vùng `role="status"`. [W3C WAI-ARIA APG · Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

## URL và tích hợp

- `viec-lam.html` mở nhóm phổ thông, `?tab=internal` mở nhóm nội bộ. Đường dẫn cũ `tuyen-dung-noi-bo.html` được chuẩn hóa sang nhóm nội bộ bằng `location.replace`, giữ ngôn ngữ, bộ lọc hợp lệ và fragment. `MDLocale.jobsState/jobsHref` thống nhất cách đọc và tạo URL.
- Mỗi tab nhớ riêng từ khóa, khu vực, KCN, lương, chế độ việc đã lưu, sắp xếp và trang trong phiên xem. Đổi thứ tự đưa về trang 1. Chuyển tab và đổi thứ tự tạo mốc lịch sử để Back/Forward khôi phục theo URL. Link chi tiết mang ngữ cảnh danh sách qua `from` để nút quay lại mở đúng nhóm và bộ lọc.
- Tích hợp cập nhật bố cục và bản dịch VI/EN/ZH/KO, trạng thái menu ở trang chi tiết, canonical/hreflang theo tab và locale, cùng bundle trình duyệt. Sự kiện `md:jobs-view-change` đồng bộ tìm việc bằng ngôn ngữ tự nhiên và trợ lý. Công cụ nghề nghiệp được gắn ở danh sách phổ thông và chi tiết việc phổ thông.

## Kiểm thử và bàn giao

Đợt này có 3 lượt lập kế hoạch, 12 worker và 8 lượt phản biện độc lập đã hoàn tất, chia theo đợt tối đa 3 subagent đồng thời.

| Phạm vi | Kết quả đã ghi nhận |
| --- | --- |
| Bộ kiểm thử Node của điều phối chính | 311/311 test đạt trên bản cuối |
| Ma trận trang công khai | 63 lượt ở 320/390/768/1024/1440/1920/3840 CSS px, không ghi nhận tràn ngang hay lỗi JavaScript |
| Ma trận Việc làm | 56/56 lượt đạt trên bản tích hợp cuối cho 2 tab × 4 ngôn ngữ × 7 độ rộng, gồm các ca trạng thái, lịch sử và bàn phím |
| axe theo quy tắc WCAG A/AA | 14 lượt quét trang công khai và 8 lượt quét riêng hai tab trên bản cuối; 0 vi phạm được báo |
| Portal trên trình duyệt, `outputs/jobs-portal.cjs` | Đạt. Giữ cùng phần tử DOM của portal, tùy chọn chưa lưu, lựa chọn việc nội bộ và việc phổ thông đã lưu. Focus đúng khi mở lặp từ chân trang ở cả hai chiều chuyển tab. |

Các kiểm tra giao diện chạy trên Chrome với viewport mô phỏng từ 320 đến 3840 CSS px. Chưa kiểm thử trên thiết bị vật lý hoặc điều khiển TV. Axe không thay thế đánh giá với người dùng và công nghệ hỗ trợ thực tế.

## Kết quả phản biện và kiểm tra lại

- Đồng bộ liên kết việc đã lưu với bộ lọc hiện tại; giữ ngữ cảnh tab/sắp xếp ở liên kết quay lại trên cả desktop và điện thoại.
- Thêm điểm dừng focus ở panel, đặt liên kết đã lưu sau phần mô tả, khôi phục focus sau Back và xếp bộ lọc nâng cao thành một cột ở màn nhỏ.
- Tạo mốc lịch sử nhất quán cho lần sửa bộ lọc; chốt nội dung đang nhập trước khi đổi ngôn ngữ. Kiểm tra cả thao tác nhanh và sau debounce đều đạt.
- Khi bundle tải lỗi, nhóm nội bộ có thông báo đúng ngôn ngữ, nút thử lại và liên hệ. Tin không tồn tại/hết tuyển chỉ hiển thị hành động quay lại; không còn CTA ứng tuyển rỗng.
- Chỉ nhận ngữ cảnh quay lại từ đường dẫn danh sách cùng origin; giới hạn độ dài ngữ cảnh lồng trong URL, chỉ giữ các fragment được hỗ trợ. Dữ liệu nhập chứa HTML vẫn trơ.
- Với câu tìm việc mâu thuẫn giữa phổ thông và nội bộ, để người dùng chọn lại loại việc; không tự chọn theo tab. CV từ chối MIME rõ ràng không phù hợp, giữ giới hạn 5 MiB và luồng mô phỏng không gửi tệp.

Điều phối chính đã chạy lại 7 ca tập trung cho các sửa lỗi lịch sử/focus/locale/URL/trạng thái tải; các ca đều đạt. Kiểm tra lại biểu mẫu xác nhận liên kết desktop/mobile, CV, tin không khả dụng và ngữ cảnh nguồn; không có yêu cầu ghi dữ liệu. Portal giữ nguyên DOM, lựa chọn chưa lưu và việc đã lưu khi đổi tab.

Vòng cuối độc lập đạt 63 kiểm thử mục tiêu và 20 ca trình duyệt; không ghi nhận lỗi chặn phát hành. Điều phối chính xác nhận thêm production build thành công, 311 kiểm thử toàn bộ đạt, 56 tổ hợp hai tab/bốn ngôn ngữ đạt và 8 lượt axe trên bản cuối không có vi phạm. Các luồng B2B, menu responsive và Google Maps tự mở vẫn hoạt động; không sửa backend, DB, xác thực hoặc hosting manifest.

Sau khi chốt kiểm thử, chỉ xuất bản lên Site phụ `appgprj_6aeb62b7473c81918b158ac079784e38` với quyền xem riêng tư hiện có. Site chính cần xác nhận riêng cho đúng bản ứng viên. Giữ tách biệt lịch sử repo, cấu hình hosting, cơ sở dữ liệu, quyền truy cập và canonical origin của hai Site.


Địa chỉ duyệt đã xác minh: https://minh-duc-stgg.kenbinhoainam.chatgpt.site/viec-lam.html . Giữ quyền xem owner-only; site chính vẫn cần xác nhận riêng.
