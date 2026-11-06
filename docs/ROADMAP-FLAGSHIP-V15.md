<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Kế hoạch nâng cấp Minh Đức lên Flagship

Ngày: 31/10/2026 · Baseline V14: commit c7c76f58b4439a21417f466098d1f5b4500f6478 · Rubric 2.0.0 (10 nhóm/50 tiêu chí).

## Mục tiêu và điều kiện nghiệm thu

Hai hành trình ưu tiên: người lao động tìm việc/ứng tuyển; doanh nghiệp làm rõ nhu cầu và gửi yêu cầu. Nội dung tuyển dụng do Minh Đức đăng; CMS phải giữ bố cục ổn định cho biên tập viên.

Baseline: điểm phần đã kiểm 74,3/100, độ phủ 87%, khoảng toàn phạm vi [64,6;77,6]. Đây là prototype, chưa xác nhận ngưỡng Flagship. Khi có backend thật trên staging, chỉ nâng mode cho hành trình đã kiểm chứng.

Để kết luận đạt Flagship theo rubric hiện hành: mode runtime; cận dưới toàn phạm vi ≥90; độ phủ ≥90%; cận dưới từng nhóm ≥70; G1–G6 đều pass; N/A ≤20%; field CWV chưa có dữ liệu phải ghi unknown. Không đổi trọng số hoặc loại tiêu chí thiếu bằng chứng để đạt ngưỡng.

## Thứ tự triển khai

| Đợt | Phạm vi | Kết quả cần có | Phụ thuộc |
| --- | --- | --- | --- |
| V15 / nền tảng | Intake máy chủ, CMS có đăng nhập, version/publish/restore, hộp thư hồ sơ thử | Dữ liệu đi từ form tới D1/R2, server kiểm quyền, có mã tiếp nhận và đối soát | Hosting D1/R2, danh tính chủ Site |
| V15 / độ bền | Validation, giới hạn body/file, idempotency, rate limit, lỗi/retry, ảnh/CMS stress | Lỗi không mất bản nháp, không báo thành công giả, không truy cập hồ sơ khi chưa được phép | API và data contract ổn định |
| V15 / trải nghiệm | Nhãn bốn ngôn ngữ, liên kết quyền riêng tư, bàn phím/focus, reflow | Luồng chính rõ và dễ dùng ở màn hình nhỏ | Nội dung và trạng thái API |
| V15 / đo và bàn giao | Build/tests, kiểm staging, log bằng chứng, báo cáo rubric giữ cùng scope | Bảng expected/actual, evidence ID, phần chưa kiểm và issue còn mở | Công cụ browser/đo sẵn có |
| Trước vận hành chính thức | Nội dung doanh nghiệp, ảnh/nguồn/quyền, hotline, chính sách dữ liệu, người phụ trách | Thông tin được Minh Đức xác nhận; dùng hồ sơ thật đúng chính sách đã duyệt | Chủ nội dung và quyết định vận hành |
| Nghiệm thu Flagship | Lab đại diện, AT/zoom/thiết bị thật, rollback, kiểm lại 50 tiêu chí | Đủ bằng chứng cho điểm/gate, không lấy số lần test thay cho chất lượng | Staging hoàn chỉnh và thiết bị/người thử |

## Kế hoạch chi tiết theo mười nhóm

| Nhóm / tiêu chí | Hiện trạng | Chỉnh sửa cụ thể | Kiểm tra chấp nhận | Mức phụ thuộc |
| --- | --- | --- | --- | --- |
| A01–A02 / thông điệp và quyết định | Persona và thông tin mẫu rõ; chưa xác nhận nội dung kinh doanh | Rà thông điệp theo B2B/B2C; nêu phạm vi dịch vụ, điều kiện lương và đầu vào cần chuẩn bị | Ba nhiệm vụ expert trace; sau đó thử với đại diện hai nhóm người dùng | Làm ngay + người dùng thử |
| A03 / bằng chứng thương hiệu | Chưa có case study và số liệu xác nhận | Chuẩn hóa mẫu case: bối cảnh → yêu cầu → cách làm → kết quả → nguồn/ngày/quyền công bố; chỉ công bố sau duyệt | Mỗi số liệu/logo/case có nguồn hoặc xác nhận chủ nội dung | Minh Đức cung cấp/duyệt |
| A04–A05 / cấu trúc và biên tập | Menu có sẵn, cẩm nang còn ngắn | Rà nhãn, FAQ, lỗi, CTA; các biểu mẫu nói đúng trạng thái lưu thật/thử nghiệm; lập chủ sở hữu nội dung | Tìm việc, tìm dịch vụ, tìm cẩm nang không đi vào trang sai hoặc ngõ cụt | Làm ngay |
| B01–B05 / bản sắc | Hệ màu/chữ thống nhất; ảnh AI có nhãn | Giữ nhận diện; dùng ảnh thực khi có; chuẩn hóa crop, sắc độ, icon, border và state; căn hàng so sánh | Đối chiếu ít nhất home, list, service, article và CMS trên desktop/mobile | Làm ngay + tư liệu thật |
| C01–C02 / typography | Cỡ mặc định ổn; chưa text resize/zoom đầy đủ | Kiểm body dài, label, caption và H1; giữ dòng Việt có dấu; bỏ chiều cao cứng ở vùng chữ | 200% text và reflow tương đương 400%; nội dung quyết định không bị cắt | Browser/AT |
| C03–C05 / ngôn ngữ | Subset CJK demo đã sửa; dịch chưa bản ngữ duyệt | Giữ 400/600/700; kiểm thiếu glyph, fallback; chuẩn locale ngày/số/tiền; fallbackVI minh bạch | Chuỗi Việt/CJK mới và bản dịch thiếu vẫn đọc/điều khiển được; link giữ ngữ cảnh | Làm ngay + hiệu đính |
| D01–D05 / đa thiết bị | Ma trận hình học đã có | Rà các breakpoint thật, sticky bar, form khi bàn phím mở, ảnh dọc; khoảng trắng ưu tiên tác vụ | 320/390/768/1280/1440; thử chạm và bàn phím ảo trên thiết bị đại diện | Browser + thiết bị thật |
| E01–E04 / hành trình và form | UI hoàn tất, dữ liệu chưa đi tới máy chủ | API ứng viên/doanh nghiệp, lưu D1, CV riêng tư R2; receipt; loading/error/retry; idempotency; consent | Gửi fixture → nhận receipt → xác nhận lưu; lỗi không reset dữ liệu; gửi lặp không nhân bản | Triển khai V15 |
| E05 / lựa chọn trung thực | Dialog và consent đã có | Giữ đường quay lại/đóng; tách rõ dữ liệu thử với vận hành thật; liên kết chính sách | Escape, back, bỏ chọn, mở lại không mất trạng thái hợp lý | Làm ngay |
| F01–F05 / tiếp cận | Keyboard/contrast chọn mẫu | Audit names/roles/status, focus, thứ tự Tab; lỗi liên kết field; vùng chạm; caption/alt đúng nghĩa | Tab/Shift+Tab/Enter/Space/Escape; screen reader mẫu; đo state và nền ảnh | Làm ngay + AT |
| G01–G05 / tương tác | State có sẵn; reduced-motion chưa runtime xác minh | Phản hồi async thật cho save/publish/receipt; luôn đọc được nội dung; pause và reduced-motion; giữ focus khi rerender | Thử pending/error/success/disabled; preference bật thật khi công cụ hỗ trợ; trace tương tác nặng | Triển khai + browser |
| H01–H05 / hiệu năng | Mới có diagnostic iframe và resource sizes | Ngân sách trước đo: sàng lọc LCP lab ≤2,5s, CLS ≤0,1, tương tác lọc/menu/form ≤200ms trên cấu hình được ghi; tách lab/field | Ít nhất 3 lượt/route, viewport/CPU/network/cache rõ, median/range; ghi thất bại, không đổi tên TBT thành INP | Công cụ đo đại diện |
| I01–I05 / tìm thấy | Noindex preview, metadata và URL có | Cập nhật toàn bộ origin sau đổi địa chỉ; nội dung hữu ích có nguồn; chỉ schema đúng dữ liệu thật; chuẩn canonical/locale | Crawl/status/link kiểm được; metadata và OG phù hợp; không index dữ liệu mẫu | Làm ngay + nội dung thật |
| J01–J02 / CMS và cực trị | CMS localStorage, validation cơ bản | Lưu draft máy chủ; preview đúng revision; server validation; optimistic concurrency; item counts 0/1/2/5/9, ảnh404/dọc và thiếu field | Hai lượt save xung đột không ghi đè âm thầm; nội dung biên không vỡ bố cục | Triển khai V15 |
| J03 / tính đúng tích hợp | Chưa có intake backend | Lưu records/CV và audit event; receipt kiểm được; outbox tích hợp sau, không gửi thông báo thật khi thử | Đối soát ID, file, loại hồ sơ; không lộ dữ liệu bằng endpoint công khai | Triển khai V15 |
| J04 / phiên bản | Có version Sites; chưa diễn tập | Version nội dung CMS + xuất bản/khôi phục; giữ bản build Sites và hướng dẫn quay lại | Draft chưa xuất bản không đổi trang công khai; rollback snapshot có kiểm sau | Triển khai + diễn tập |
| J05 / vận hành | Chưa chốt kênh/người xử lý | Nhật ký không chứa nội dung nhạy cảm; chủ sở hữu, sơ đồ nhận lead, backup/retention và event analytics được duyệt | Thử tìm lỗi và người nhận trách nhiệm; không gọi thống kê nội dung là conversion | Minh Đức chốt + tích hợp |

## Hợp đồng dữ liệu V15

- Public đọc nội dung đã xuất bản; draft chỉ trả cho tài khoản được cấp quyền.
- CMS đăng nhập ChatGPT do Sites quản lý. Server kiểm từng thao tác; client không tự cấp quyền. Chủ Site được cấu hình riêng; dùng user ID ổn định sau khi nhận diện.
- Public intake kiểm job ID, độ dài, điện thoại, consent, kích thước và định dạng file; lưu CV riêng tư, không tạo URL đọc công khai.
- Mã idempotency xác định một lượt gửi; lặp lại cùng mã trả cùng receipt. Thay payload cùng mã bị từ chối.
- Lưu nội dung dùng revision; xung đột trả 409 và giữ dữ liệu nhập để biên tập viên xử lý.
- Telesales/Google Sheets chỉ bật sau khi xác định nơi nhận và quyền. Test không tự gửi email/tin nhắn ra ngoài.
- Bản preview tiếp tục yêu cầu dữ liệu giả; chính sách xử lý hồ sơ thật, thời hạn lưu và quét CV cần duyệt trước mở vận hành.

## Đổi địa chỉ

Yêu cầu ban đầu `minh-duc.prototype` không dùng được qua DNS công khai vì `.prototype` chưa có trong danh sách TLD IANA. Người dùng đã chọn tên gọn trên Sites. Địa chỉ trả về sau đổi slug: **https://minh-duc-prototype.kenbinhoainam.chatgpt.site**.

Nguồn xác minh TLD: https://data.iana.org/TLD/tlds-alpha-by-domain.txt (31/10/2026). Việc đổi slug đã hoàn tất; không mua domain hoặc tự thay bằng tên miền khác.

## Giới hạn nghiệm thu

Không hứa điểm 90 trước khi có kết quả. Ảnh/case study, chính sách và dữ liệu thương hiệu cần chủ nội dung xác nhận; thiếu các phần đó phải giữ issue/gate mở. Từng đợt triển khai bàn giao source, URL, acceptance tests và báo cáo cùng rubric/scope; không lặp polish để bù những năng lực vận hành chưa có.

## Trạng thái đợt V15

Đã triển khai API D1/R2, bảo vệ CMS owner, draft/publish/history/restore, hộp thư thử, validation/idempotency và trạng thái form. Đã kiểm8 nhóm core API,10 actual preview HTTP checks,3 luồng form UI và36 mẫu geometry/ảnh/locale. Chi tiết và giới hạn: AUDIT-V15.md; điểm75,3 phần đã kiểm, độ phủ89%, khoảng[67;78].

Đợt kế tiếp có phụ thuộc: nghiệm thu owner SSO/CMS trên hosted; chính sách/người xử lý/quét CV và nội dung doanh nghiệp xác minh; fault injection mạng; lab đại diện, AT/zoom/thiết bị thật. Không bật hồ sơ thật hoặc bỏ noindex trước khi hoàn tất các mục tương ứng.
