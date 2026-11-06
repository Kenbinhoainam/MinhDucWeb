<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Website Minh Đức V14 — Báo cáo evaluator 2.0

Rubric **2.0.0** · Ngày **31/10/2026** · Mode **prototype** · Website: https://minh-duc-premium-v13.kenbinhoainam.chatgpt.site

## Kết luận

**Điểm phần đã kiểm tra: 74.3/100 · Độ phủ: 87.0% · Khoảng điểm toàn phạm vi: [64.6, 77.6].** Khoảng này là giới hạn toán học của các tiêu chí chưa kiểm tra, không phải khoảng tin cậy thống kê.

V14 cải thiện khả năng lựa chọn công việc, giải thích dịch vụ, form hai bước, hình ảnh và công cụ biên tập. **Chưa đủ điều kiện xác nhận toàn website đạt Flagship hoặc sẵn sàng nhận hồ sơ thật.** Các gate vận hành/hiệu năng còn chưa xác nhận; form và CMS máy chủ cần triển khai.

Bộ evaluator đã chuyển sang 10 nhóm/50 tiêu chí trong quá trình hoàn thiện bản này. Báo cáo V13 từng ghi 90 theo rubric sáu trụ cột cũ; con số đó không so sánh trực tiếp với kết quả 2.0. Bản nháp chấm V14 theo rubric cũ được thay bằng báo cáo này trước khi bàn giao. Không suy giá tiền hay hiệu quả kinh doanh từ điểm.

## Phạm vi và bằng chứng

Mục tiêu: phục vụ người lao động phổ thông tìm việc và người phụ trách nhân sự/FDI tìm giải pháp nhân lực. Tác vụ chính: tìm/lọc/lưu/so sánh việc; xem chi tiết và thử form; chọn dịch vụ, mang nhu cầu sang liên hệ; tìm cẩm nang; sửa và xem trước nội dung CMS.

Template đã lấy mẫu: home, việc làm, nội bộ, chi tiết ứng viên phổ thông, chi tiết nội bộ, dịch vụ, giới thiệu, tin tức, bài viết, liên hệ và CMS. Chromium trong môi trường cloud browser; 320/390/768/1440 CSS px, thêm home 2560px; VI/EN/ZH/KO. Đây là viewport mô phỏng, chưa thay kiểm thử thiết bị thật. Không loại tiêu chí nào bằng N/A.

- **168 cấu hình responsive:** 160 tổ hợp public + 4 home/2560 + 4 CMS/VI. Tải cả ảnh dưới fold; không phát hiện tràn ngang, heading/nút bị cắt, ảnh hỏng hay số H1 hiển thị sai. `v14-responsive-qa.json`.
- **29 assertion tương tác:** tìm kiếm không dấu, URL, bookmark, sort, compare, dịch vụ → form, validation và hoàn tất mô phỏng, news empty/reset, ảnh404, correct-record CMS preview và khoảng lương. `v14-interaction-qa.json`.
- **6 phép thử nội dung:** heading/nút dài gấp đôi, có fixture ảnh dọc sáng tại home. Không phát hiện lỗi hình học đã định nghĩa. Đây là gấp đôi độ dài, không phải thử browser zoom/text resize. `v14-stress-qa.json`.
- **Thử bàn phím bổ sung:** ArrowDown đổi tab dịch vụ, giới hạn 3 lựa chọn, Escape và trả focus; bảng so sánh căn hàng được quan sát. `v14-comparison-desktop.jpg`.
- **Font:** bộ cũ thiếu 41 ký tự Trung và 15 ký tự Hàn trong nội dung mới; sáu file 400/600/700 đã được thay subset, kiểm tra cmap cho kết quả 0 ký tự CJK demo thiếu. Chưa bao phủ nội dung CMS tùy ý.
- **Tương phản chủ đạo:** ink/trắng 13,92:1; muted/trắng 6,12:1; muted/ivory 5,66:1; crimson/trắng 6,53:1; blue/trắng 9,20:1. Chưa đo toàn bộ UI/media/state.

Danh mục phép kiểm tra có expected/actual và mã E01–E14 được lưu trong `v14-audit.json`. Các mức 0–5 được gán theo anchor; phép tính chạy bằng `score_audit.py` của skill. Script tính điểm không tự đo website hoặc xác thực chất lượng evidence.

## Bảng điểm

| Nhóm | Điểm đạt / trọng số áp dụng | Điểm phần đã kiểm tra | Độ phủ | Cận dưới toàn nhóm | Evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| A. Chiến lược và nội dung | 6.4 / 10.0 | 80.0 | 80.0% | 64.0 | E01, E02, E05 |
| B. Bản sắc và chỉ đạo nghệ thuật | 11.2 / 14.0 | 80.0 | 100.0% | 80.0 | E01, E04, E05 |
| C. Typography và ngôn ngữ | 7.2 / 10.0 | 72.0 | 100.0% | 72.0 | E01, E03, E06 |
| D. Bố cục và đa thiết bị | 8.6 / 12.0 | 71.7 | 100.0% | 71.7 | E01, E03, E04 |
| E. Hành trình và chuyển đổi | 11.0 / 14.0 | 78.6 | 100.0% | 78.6 | E02, E10, E11 |
| F. Khả năng tiếp cận | 8.2 / 12.0 | 68.3 | 100.0% | 68.3 | E01, E02, E07, E11 |
| G. Tương tác và chuyển động | 3.2 / 6.0 | 80.0 | 66.7% | 53.3 | E02, E05, E11 |
| H. Hiệu năng | 1.2 / 8.0 | 60.0 | 25.0% | 15.0 | E12, E13 |
| I. Khả năng tìm thấy | 4.2 / 6.0 | 70.0 | 100.0% | 70.0 | E09, E14 |
| J. CMS và độ bền vận hành | 3.4 / 8.0 | 68.0 | 62.5% | 42.5 | E02, E08, E14 |

Tổng: **64.6/100 điểm đã có bằng chứng**, **87.0/100 trọng số đã kiểm**. Điểm 74,3 là trung bình chuẩn hóa trên phần đã kiểm, không phải điểm toàn website.

## Điều kiện bàn giao

| Gate | Trạng thái | Phát hiện | Evidence |
| --- | --- | --- | --- |
| G1. Hành trình cốt lõi | unknown | UI qua các luồng; chưa có intake dữ liệu thật để xác nhận đầu-cuối. | E02, E10 |
| G2. Tiếp cận tác vụ | unknown | Có keyboard/focus chọn mẫu; thiếu screen reader và zoom đầy đủ. | E01, E11 |
| G3. Thiết bị và ngôn ngữ | unknown | Ma trận viewport/locale qua; thiếu thiết bị thật và text resize. | E01, E03 |
| G4. Nội dung và tài nguyên | unknown | Ảnh tải được, demo có nhãn; chưa xác nhận hồ sơ năng lực/case study. | E01, E05 |
| G5. Phục hồi và xuất bản | unknown | Ảnh có retry, source/version có quy trình; chưa diễn tập lỗi backend/rollback. | E02, E08, E14 |
| G6. Đo hiệu năng | unknown | Chưa có lab đại diện với cấu hình mạng/CPU/cache và ba lượt. | E12, E13 |

**Field CWV: unknown.** Chưa có RUM/CrUX đủ mẫu, thời kỳ và phân đoạn cho LCP/INP/CLS p75. Các giá trị PerformanceObserver trong iframe là diagnostic, dao động theo cách điều khiển viewport/cache; chúng không được dùng để kết luận CWV hoặc hiệu năng production.

V14 được bàn giao như một bản xem thử có kiểm tra. Không chuyển gate unknown thành pass để nâng điểm.

## Điểm mạnh có bằng chứng

**So sánh hỗ trợ quyết định.** Thu nhập, địa điểm, quyền lợi và yêu cầu CV dùng cùng data model; các trường căn hàng trên desktop và xếp dọc trên mobile. Có giới hạn ba việc, bỏ chọn, quản lý focus và Escape. E02, E04, E11.

**Đường đi B2B cụ thể hơn.** Bộ chọn bốn dịch vụ nêu phạm vi trao đổi và thông tin cần chuẩn bị; ngữ cảnh được mang sang form hai bước. Không đặt cam kết năng lực hoặc tiến độ chưa có nguồn. E02, E05, E10.

**Nội dung dùng chung, lỗi ảnh có phục hồi.** Ảnh bài viết tại home/list/detail lấy từ trường CMS; sửa SVG, bổ sung glyph CJK, thêm trạng thái ảnh không tải được và thử lại. Nội dung vẫn đọc được khi không chạy reveal. E01, E02, E06.

**Biên tập có ràng buộc.** Preview đúng job/post, kiểm tra thiếu trường/trùng tiêu đề/bản dịch nguồn, kiểm tra min/max lương và báo cáo nội dung theo khu vực. Đây là công cụ phía trình duyệt, chưa phải CMS máy chủ. E02, E08.

## Vấn đề và hành động

| ID | Vị trí | Expected / Actual và tác động | Ưu tiên | Sửa đề xuất | Acceptance test | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| MD14-01 | Form ứng viên/doanh nghiệp | Cần tiếp nhận và đối soát; hiện chỉ mô phỏng, chưa nhận lead/CV. | P1 trước vận hành | API/staging, lưu record/CV, xử lý lỗi và gửi lặp | Gửi fixture, xác minh nơi lưu, thử lỗi/retry/duplicate và thông báo đúng | E02, E10 |
| MD14-02 | Nội dung B2B/cẩm nang | Cần bằng chứng có nguồn; hiện ảnh AI, tin mẫu và nội dung ngắn chưa được biên tập viên xác nhận. | P2 | Hồ sơ năng lực, ảnh thật, nguồn và hiệu đính locale | Chủ nội dung xác nhận số liệu/quyền dùng; bài có nguồn và người chịu trách nhiệm | E05, E10 |
| MD14-03 | CMS và vận hành | Cần nhiều người biên tập và khôi phục; hiện localStorage, thiếu phân quyền/log máy chủ. | P1 trước vận hành | Backend CMS, roles, draft/publish, audit log, backup/restore | Hai tài khoản đúng quyền, lưu/xuất bản/khôi phục trên staging | E08, E14 |
| MD14-04 | Performance | Cần lab đại diện; hiện chỉ diagnostic và tài nguyên đã đo. | P2 | Ngân sách theo route, đo ba lượt và trace; field riêng nếu có | Ghi browser/build, CPU/network/cache, median/range; kiểm trường hợp chậm | E12, E13 |
| MD14-05 | Accessibility/thiết bị | Cần zoom, screen reader, reduced motion và mobile thật; hiện mới chọn mẫu keyboard/viewport. | P2 | Hoàn thiện ma trận tiếp cận | Task trace 200% text/400% reflow, media preference và screen reader; không mất CTA/trap | E01, E03, E11 |

## Tái kiểm

Baseline code: V13 + bản sửa SVG, source commit `a4c0d7c7ab85dcce4707c45902f1862c2a5c4f59`. Không chuyển điểm rubric cũ thành điểm 2.0.

| Criterion / issue | Baseline | Thay đổi | Kết quả mới | Evidence mới | Hồi quy cần kiểm |
| --- | --- | --- | --- | --- | --- |
| E03, E05 | Lọc/lưu cơ bản; chưa so sánh | Query URL, comparison 2–3 role, focus và giới hạn | Các assertion đã qua | E02, E04, E11 | Back/pagination dữ liệu lớn |
| A02, E02 | Dịch vụ mô tả chung | Bộ chọn scope + context đến form | Bốn nhu cầu và chuyển đúng context | E02, E05 | Nội dung B2B được doanh nghiệp duyệt |
| C03, MD14-05 | Subset CJK thiếu ký tự mới | Thay sáu font subset, kiểm glyph | 0 glyph CJK demo thiếu | E06 | Nội dung CMS mới và mạng chậm |
| D04, J02 | Ảnh home có hard-coded cover | Cover từ CMS, fallback/retry | Ảnh demo decode; 404 có retry | E01, E02, E03 | Ma trận số lượng item và mất mạng |
| J01 | Preview chỉ home; khoảng lương có thể đảo | Preview đúng record, salary validation, content checks | Assertion correct ID và reject min>max qua | E02, E08 | Backend roles/save/publish thật |

## Chưa kiểm tra

- **A03:** Chưa có hồ sơ chứng minh năng lực, quan hệ doanh nghiệp hoặc nguồn case study do chủ nội dung xác nhận.
- **G03:** Có CSS reduced-motion và nút pause trong source, nhưng chưa thực sự bật media preference để kiểm tra runtime.
- **G04:** Chưa có performance trace trên thiết bị đại diện.
- **H01:** Chưa có LCP lab đại diện, ba lượt và cấu hình mạng/CPU/cache đáng tin cậy.
- **H02:** Chưa đo độ trễ thao tác bằng phương pháp lab chuẩn hoặc INP field.
- **H03:** Quan sát CLS iframe dao động và chưa xác định đủ điều kiện; giữ diagnostic, không coi pass hoặc zero CLS.
- **J03:** Chưa triển khai backend nhận lead/CV; không có kết quả từ form đến nơi lưu để đối soát.
- **J05:** Chưa có vận hành thực, kênh nhận lỗi, analytics và người xử lý được chốt.

Ngoài ra còn thiếu screen reader, text resize/zoom, mobile thật, ma trận item-count đầy đủ và hiệu đính bản ngữ. Thiếu các bằng chứng này được ghi trong rating/reason; không coi chúng là pass hoặc loại bằng N/A.

## Bàn giao kỹ thuật

`v14-audit.json` chứa đủ 50 criterion, reason, evidence index và gate. `v14-score.json` là kết quả tính tự động theo rubric 2.0.0. Các file nguồn/HTML/CSS và báo cáo được lưu cùng version. Tính năng nhận hồ sơ thật, CMS máy chủ và dữ liệu kinh doanh xác minh là các đầu việc cần hoàn tất trước vận hành, thay vì tiếp tục polish thị giác để bù điểm.
