<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Bàn giao prototype Minh Đức V16

## Mục tiêu và điểm bắt đầu

Hai luồng công khai: người lao động tìm/so sánh việc và ứng tuyển demo; doanh nghiệp đọc dịch vụ và gửi nhu cầu demo. CMS demo phục vụ nhân viên chỉnh Home, ảnh, tin và bản dịch. Mở `/index.html`, `/viec-lam.html`, `/dich-vu.html` và `/cms-demo.html`.

CMS demo không cần đăng nhập vì chỉ chứa dữ liệu mẫu và nội dung lưu riêng trên trình duyệt. Các endpoint quản trị máy chủ vẫn kiểm quyền; demo không gọi chúng. Không đưa dữ liệu thật vào CMS demo. Các biểu mẫu không gửi/lưu tên, điện thoại hay CV.

## Ngôn ngữ thị giác

- Nhận diện: navy/đỏ thương hiệu, nền trắng và màu giấy nhạt; ảnh con người/môi trường làm việc minh họa AI có nhãn. Đồ họa cẩm nang dùng cùng hệ màu và nét.
- Màu đã đo: navy `#152e45`, chữ phụ `#526373`, đỏ CTA `#b51f37`, nền giấy `#f7f6f2`. Chữ trắng/đỏ CTA đo6,53:1; navy/trắng13,92:1. Nền ảnh/alpha không được coi như phép đo pixel.
- Font: Noto Sans cho nội dung/dữ liệu, Noto Serif cho tiêu đề thương hiệu; subset CJK và fallback trong `public/fonts.css`. Không đổi font bằng từng component.
- Layout dùng container chung; token, breakpoint và state được ghi trong `public/flagship-v13.css`, `public/flagship-v14.css`, `public/prototype-v16.css`. Lớp V16 sửa đích danh component, không dùng overflow hidden toàn trang để giấu lỗi.
- Grid sử dụng cột co giãn minmax(0,1fr), min-width0 cho con. Chuỗi dài được xuống dòng; không cắt lương, địa điểm hoặc quyền lợi.

## Component và trạng thái

Breadcrumb là nav/ol, li căn giữa, item hiện tại có aria-current; link44px. Header mobile có thể xuống hàng khi phóng chữ; menu mở dưới header và có vùng cuộn riêng.

Button chính đỏ, phụ viền, toggle dùng pressed/selected. Các mẫu đo trên mobile: menu48×48, bookmark48×48, so sánh cao48, nút sắp xếp cao44 và CTA cao48 CSSpx. Checkbox có label; lỗi liên kết với input bằng aria-describedby, focus về trường đầu tiên sai.

Form giữ thông tin khi sai, chỉ hiện completion mô phỏng sau validation. State checking220ms minh họa phản hồi, không phải số đo tốc độ production. Có nút thử lại. Nội bộ giữ kiểm CV bắt buộc, phần mở rộng và dung lượng5MB ở client; không upload tệp.

Dialog chỉnh ảnh có URL/range được đặt tên, hỗ trợ Arrow key; Tab/Shift+Tab giữ vòng trong dialog, Escape đóng và trả focus. Preview CMS cùng origin truyền Escape từ iframe ra parent. Marquee có dừng; CSS reduced-motion được giữ, chưa thay cho kiểm hệ điều hành/thiết bị thật.

Ảnh lỗi dùng placeholder và nút thử lại có tên. Nếu ảnh nằm trong anchor, placeholder tách khỏi anchor/aria-hidden để nút không nằm trong vùng bị ẩn hoặc lồng control tương tác; khi ảnh tải lại được sẽ phục hồi host.

## Nội dung và mô phỏng

Giữ tin tuyển dụng bốn phần cố định: Mô tả → Yêu cầu → Quyền lợi → Cách ứng tuyển. Địa điểm cho nhập tự do; lương max không nhỏ hơn min. Home chia accordion, ảnh và bản dịch đặt ngay khu vực liên quan. AI/SEO là gợi ý theo quy tắc; bản dịch demo hiệu đính thủ công, thiếu thì fallbackVI.

Content key: `md_prototype_v16_content`. Lưu cập nhật bản xem trước trên cùng trình duyệt; không đồng bộ máy khác. Mở Thiết lập bản demo để xuất/nhập JSON. Đặt lại demo có xác nhận và phục hồi nội dung mẫu. Bookmark/lựa chọn cá nhân có cơ chế riêng; xóa chúng bằng control có sẵn nếu cần lặp đúng điểm vào.

## Nghiệm thu và tái lập

`docs/PROTOTYPE-SCOPE-V16.md` khóa phạm vi; `docs/prototype-v16-audit.json` ghi50 tiêu chí; `docs/prototype-v16-score.json` là kết quả script P1.0.0. Không so điểm này với runtime2.0.0 của V15.

Harness development-only: `scripts/v16-qa.html`; sao chép tạm sang `public/__qa.html` khi QA. Có matrix, content stress và reflow text200%. Không đưa harness/proof HTML vào bản xuất bản. Phép đo iframe ghi cả outer width và client width do scrollbar. Chữ200% là phép thử CSS text resize trong browser, không được gọi thành Safari/iPhone hoặc WCAG certification.

Các trace mới: matrix164 mẫu, stress16 mẫu, reflow14 mẫu, public flows4 locale và interaction log. Kiểm build/TypeScript/JS trước đóng gói. Báo cáo nằm ngoài luồng trình diễn; CMS không có điểm chấm, preflight hoặc checklist production.

## Giai đoạn triển khai sản phẩm

Khi chuyển sang vận hành: xác minh thông tin/case/ảnh/quyền và người biên tập; nối quyền CMS, intake/retention/quét CV, thông báo/Sheets, dịch/AI theo lựa chọn. Nghiệm thu an toàn, SEO, lab/field performance và thiết bị/AT riêng. Đây là backlog production, không trừ điểm prototype. User research với lao động phổ thông/FDI và hiệu đính bản ngữ còn là giả định cần kiểm, không gọi expert review là kết quả người dùng xác nhận.
