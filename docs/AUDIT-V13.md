<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức V13 — Báo cáo đánh giá giao diện & UX

Ngày đánh giá: 31/10/2026. Bản tiếp nối từ Minh-Duc-Flagship-V12(1).zip.

## 1. Tổng quan & xếp hạng

**90/100 — Premium Commercial.** Đạt mục tiêu 90+ trong phạm vi **thiết kế giao diện, luồng tương tác và khả năng bảo vệ bố cục của prototype**. Đây là điểm đánh giá chuyên môn do trợ lý chấm theo rubric `flagship-website-evaluator`, không phải điểm Lighthouse, chứng nhận độc lập hoặc xác nhận website sẵn sàng nhận hồ sơ thật.

V13 có hướng thị giác nhất quán hơn, phân luồng doanh nghiệp/ứng viên rõ ngay đầu trang, biểu mẫu ngắn, các trạng thái tương tác và CMS có giới hạn nội dung. Bản này được xuất bản riêng tư để chủ dự án xem và thử.

Theo thang phân loại của skill, 80–91 thuộc Premium Commercial; **chưa đạt hạng Flagship 92+**. Khoảng giá tham chiếu $5.000–$10.000 trong rubric chỉ mô tả phân khúc thiết kế, không phải định giá hay báo giá thực tế cho dự án.

**Mức sẵn sàng vận hành chưa được chứng nhận:** chưa có backend nhận hồ sơ, đăng nhập/phân quyền CMS, dữ liệu doanh nghiệp được xác minh, ảnh hoạt động thật hoặc đo Core Web Vitals trên môi trường có lưu lượng thực. Điểm 90 không bao gồm các năng lực chưa triển khai này.

## 2. Sáu trụ cột & điểm trừ chí mạng

| Trụ cột | Điểm | Căn cứ và phần còn thiếu |
| --- | ---: | --- |
| Art Direction & UI System | **18/20** | Nền ivory, navy và đỏ; phối serif/sans; hero có khung ảnh rõ; nhịp bố cục và thẻ tuyển dụng thống nhất. Trừ 2 vì hình ảnh còn là minh họa AI, chưa tạo bản sắc bằng tư liệu thật của Minh Đức. |
| CRO & Dual-Persona UX | **18/20** | Tab doanh nghiệp/ứng viên; tìm kiếm không dấu; lưu việc; phác thảo nhu cầu; form hai bước với lỗi và xác nhận rõ. Trừ 2 vì thiếu bằng chứng kinh doanh được xác minh và đo chuyển đổi thực tế. |
| Motion & Micro-interactions | **14/15** | Hover, focus, pressed, loading/success; chuyển động nhẹ, có reduced-motion, có tạm dừng dải đối tác; không khóa cuộn. Trừ 1 vì chưa đo độ mượt trên điện thoại cấu hình thấp. |
| Multi-Script & Mobile Ergonomics | **14/15** | Font tự lưu, heading có khoảng dòng bảo vệ dấu; quy tắc CJK; CTA cố định; các hành động chính có vùng chạm tối thiểu 48px; kiểm tra VI/EN/ZH/KO. Trừ 1 vì chưa hiệu đính toàn bộ bản dịch bằng người bản ngữ và chưa thử thiết bị thật. |
| CMS Zero-Breakage Architecture | **14/15** | Nội dung có cấu trúc, giới hạn ký tự và bộ đếm, ảnh có khung/tâm cắt, xem trước 4 độ rộng và 4 ngôn ngữ; kiểm tra dữ liệu nhập. Trừ 1 vì chưa bao phủ mọi tổ hợp nội dung và số lượng item. Điểm này chỉ đánh giá bảo vệ giao diện, không đánh giá bảo mật CMS máy chủ. |
| Technical & Edge SEO | **12/15** | HTML dựng sẵn, font nội bộ, trạng thái rỗng/lỗi, cấu trúc heading và metadata; dữ liệu tuyển dụng mẫu không được phát schema như tin thật. Trừ 3 vì chưa có CWV/Lighthouse thực đo, OG động riêng từng nội dung và còn CSS kế thừa cần gom lại. |
| **Tổng trước điểm trừ** | **90/100** | |
| **Điểm trừ chí mạng** | **0** | Không phát hiện các lỗi dưới đây trong phạm vi kiểm tra. |
| **Tổng cuối** | **90/100** | **Premium Commercial, phạm vi prototype giao diện & UX.** |

Kiểm tra fatal flags:

- Template rẻ tiền: không dùng ảnh bắt tay và shadow đen dày; icon, màu, kiểu chữ đã thống nhất. Ảnh AI vẫn là điểm yếu về độ tin cậy và được ghi nhãn minh họa.
- Lỗi dấu/tràn chữ: không phát hiện tràn ngang hoặc chữ trong heading/nút bị cắt ở ma trận đã chạy.
- CMS dễ vỡ: không phát hiện tràn bố cục ở các phép thử nội dung dài gấp đôi và ảnh dọc. Không suy rộng thành bảo đảm mọi nội dung đều an toàn.
- Form di động quá 5 trường bắt buộc ngay bước đầu: không có; bước đầu form ứng viên phổ thông dùng ba nhóm lựa chọn.
- Animation cản trở: không khóa cuộn hoặc buộc đợi hoạt ảnh; có chế độ giảm chuyển động.

### Bằng chứng kiểm tra

**168 trường hợp responsive**, không phát hiện tràn ngang, ảnh đã tải bị lỗi, heading/nút bị cắt ngang hoặc số lượng H1 hiển thị khác 1. Bao gồm 10 biến thể trang công khai × 4 ngôn ngữ × 4 độ rộng 320/390/768/1440px; thêm trang chủ ở 2560px × 4 ngôn ngữ và CMS tiếng Việt ở 4 độ rộng. Dữ liệu gốc: `docs/v13-responsive-qa.json`.

**3 phép thử bất lợi:** trang chủ với chữ dài 200% và fixture ảnh dọc sáng 320×960, tại VI/320px, KO/390px, VI/1440px; không phát hiện tràn ngang/cắt chữ. Dữ liệu: `docs/v13-stress-qa.json`. Đây là kiểm tra giới hạn hình học; không phải kiểm định tự động chất lượng thị giác hay tương phản của mọi ảnh.

**Luồng đã thao tác:** chuyển persona; tìm `co khi`; lưu việc và lọc việc đã lưu; mở đúng tin; kiểm tra lựa chọn còn thiếu; lỗi số điện thoại/consent; trạng thái hoàn tất mô phỏng; lưu nội dung CMS và xem trước nội dung đã lưu. Dữ liệu thử nghiệm CMS đã khôi phục về mẫu.

Các phép thử dùng Chromium trong môi trường trình duyệt kiểm tra, không thay thế Safari/iOS/Android thật, kiểm thử bảo mật, audit WCAG toàn diện hoặc Lighthouse. Không đưa ra con số LCP/CLS giả định.

## 3. Những chi tiết nâng giá trị thiết kế

- Hero làm rõ hai nhu cầu thực tế, sau đó đưa người dùng tới việc làm hoặc bản phác thảo nhân sự có ngữ cảnh.
- Thẻ việc làm ưu tiên vị trí, địa điểm và lương; ảnh có tỷ lệ ổn định, hành động lưu phản hồi ngay.
- Typography có phân cấp rõ và có khoảng thở; heading tiếng Việt không bị ép sát dòng. Màn hình nhỏ vẫn giữ nhịp đọc và CTA dễ chạm.
- Biểu mẫu đưa lỗi tại chỗ, giữ lại lựa chọn không nhạy cảm trong phiên và nói đúng trạng thái chưa gửi dữ liệu.
- CMS giữ bố cục cố định, chỉ mở nội dung; bộ đếm ký tự và preview giúp phát hiện vấn đề trước khi lưu/phát hành.
- Bỏ số liệu năng lực và thời gian cung ứng chưa có căn cứ; ghi rõ tư liệu mẫu, tránh biến nội dung trình diễn thành bằng chứng kinh doanh.

## 4. Những điểm còn làm giảm giá trị thương hiệu

Ảnh AI, tin tuyển dụng mẫu và danh sách doanh nghiệp tham khảo chưa tạo được độ tin cậy như ảnh hoạt động, case study và quan hệ hợp tác đã xác minh. Dòng thông báo prototype là cần thiết ở bản này nhưng không phải nội dung cho website vận hành chính thức.

Form hiện không tạo lead, gửi CV hoặc đồng bộ CRM. CMS lưu theo trình duyệt, không có tài khoản/phân quyền/lịch sử máy chủ. Không đưa dữ liệu ứng viên thật vào bản này. Các nhãn tính năng hỗ trợ nội dung theo quy tắc không được coi là tích hợp AI backend thật.

Các lớp CSS V11/V12 vẫn còn để bảo toàn chức năng cũ; V13 chưa phải một lần tái cấu trúc toàn bộ mã nguồn. Bộ font CJK được tối ưu cho nội dung mẫu; nội dung mới cần thử lại khả năng hiển thị/fallback. Bản dịch và số liệu kinh doanh cần người có trách nhiệm duyệt trước công bố.

## 5. Lộ trình lên Flagship và vận hành thực

| Hướng nâng cấp | Đã hoàn thành trong V13 | Bước tiếp theo để vượt 92 và vận hành |
| --- | --- | --- |
| Quick Polish | Hệ màu, typography, khoảng trắng, hero, thẻ việc làm, gallery và bố cục di động. | Thay ảnh AI bằng bộ ảnh Minh Đức có quyền sử dụng; đưa case study thật vào đúng vị trí chuyển đổi. |
| UX & Motion Upgrade | Persona tabs, bộ lọc/lưu việc, form hai bước, trạng thái lỗi/hoàn tất, focus và reduced-motion. | Thử với ứng viên/doanh nghiệp thật; đo hoàn thành form và kiểm tra điện thoại cấu hình thấp. |
| Architecture & CMS Hardening | Giới hạn dữ liệu, khóa bố cục/ảnh, preview đa màn hình/ngôn ngữ, import có kiểm tra, HTML dựng sẵn. | Backend nhận hồ sơ, phân quyền và audit log; quy trình dịch/duyệt; consent/lưu trữ theo chính sách được duyệt; gom CSS; đo hiệu năng và SEO trên tên miền chính thức. |

Các bước cần dữ liệu thật hoặc quyết định vận hành không được giả lập để nâng điểm. V13 hoàn tất vòng nâng cấp thiết kế đạt 90/100; trạng thái vận hành thật vẫn được tách riêng rõ ràng.
