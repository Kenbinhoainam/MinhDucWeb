<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức V16 — đánh giá Prototype Flagship

Ngày 31/10/2026 · Profile **P1.0.0** · Browser HTML · High fidelity · **Expert review**.

## Kết luận

**Prototype HTML đạt ngưỡng Flagship nội bộ P1.0.0 trong phạm vi đã kiểm: 91,4/100.** Độ phủ trọng số100%; khoảng toàn phạm vi[91,4;91,4];50/50 tiêu chí có evidence; PG1–PG6 pass; không có issue P0/P1 còn mở; không dùng N/A. Đây là mô hình chuyên môn nội bộ, không phải chứng nhận quốc tế.

Production readiness: **chưa đánh giá**. Không suy kết quả người dùng thật, WCAG đầy đủ, Safari/iPhone, an toàn hệ thống hoặc field performance từ kết quả này.

Điểm75,3 đã báo ở V15 thuộc rubric website runtime2.0.0, không so trực tiếp với điểm prototype. Baseline V15 được giữ và chấm lại phần đã có evidence theo P1.0.0:76,5 phần đã xem, coverage51%, bounds[39;88]. Vì coverage khác nhau, không diễn giải thành mức tăng hiệu quả sử dụng hoặc tăng điểm toàn bộ tương đương. Scope signature baseline/V16 giống nhau: `ad573cf8910c3e22a06e3e1f5bf7c54b899e0a4f0ff80da16b82437540b1636d`.

## Phạm vi và bằng chứng

Hai nhóm public: người lao động phổ thông và người phụ trách doanh nghiệp FDI; CMS demo cho nhân viên biên tập. Tác vụ: tìm/lọc/so sánh việc; đọc và ứng tuyển demo; dịch vụ/gửi nhu cầu; tìm đọc cẩm nang; sửa Home/ảnh/tin/bản dịch, preview/reset.

Public VI/EN/ZH/KO; CMS chromeVI, nội dung preview4 locale.10 route chính và4 mẫu CMS; outer width320/390/768/1440px, client width305/375/753/1425 do scrollbar. Reflow14 mẫu là **CSS text resize200%** ở iframe320/640px, không được gọi là browser zoom400% hoặc đo thiết bị thật.

Loại evidence: visual(screenshot/ảnh trước sửa), measurement(matrix/reflow/màu/vùng bấm), interaction(Cua traces/stress), source_review(DOM/AX/code) và specification(scope/handoff). Không có user_test. Một số hành vi không đổi kế thừa log V14, đã ghi riêng thay vì tính là lượt chạy V16.

Form mô phỏng tại trình duyệt, không gửi/lưu thông tin liên hệ hoặc CV. CMS demo dùng localStorage riêng; không truy cập dữ liệu nhạy cảm qua API quản trị. AI/SEO là gợi ý theo quy tắc, dịch demo có sẵn/hiệu đính thủ công. Không yêu cầu DB/email/Sheets/CWV/SEO production trong mẫu số này.

## Kết quả 10 nhóm

| Nhóm | Điểm | Độ phủ | Khoảng |
| --- | ---: | ---: | --- |
| A — Mục tiêu, nội dung và kiến trúc | 92.0 | 100.0% | [92.0;92.0] |
| B — Bản sắc và chỉ đạo nghệ thuật | 87.5 | 100.0% | [87.5;87.5] |
| C — Typography và phân cấp thông tin | 92.0 | 100.0% | [92.0;92.0] |
| D — Bố cục và thiết kế đa thiết bị | 91.7 | 100.0% | [91.7;91.7] |
| E — Điều hướng và hành trình chính | 91.4 | 100.0% | [91.4;91.4] |
| F — Component và trạng thái giao diện | 96.0 | 100.0% | [96.0;96.0] |
| G — Khả năng tiếp cận trong prototype | 88.0 | 100.0% | [88.0;88.0] |
| H — Nội dung, hình ảnh và bản địa hóa | 92.5 | 100.0% | [92.5;92.5] |
| I — Chuyển động và phản hồi cảm nhận | 92.0 | 100.0% | [92.0;92.0] |
| J — Tính trung thực và khả năng bàn giao | 96.0 | 100.0% | [96.0;96.0] |

## Kết quả kiểm thử

| Phép thử | Expected / actual | Evidence |
| --- | --- | --- |
| Viewport/locale |164/164 không tràn document, không ảnh hỏng, một H1 và breadcrumb căn cùng hàng | `v16-matrix.json` |
| Dữ liệu biên |16/16:0/1/2/5/9 items, title dài/excerpt trống,404 placeholder/retry | `v16-stress.json` |
| Chữ phóng |14/14 CSS text200%, không tràn document sau sửa header/grid/wrap | `v16-reflow.json` |
| Form mobile |4 locale worker hoàn tất; business lỗi/correction/completion rõ mô phỏng | `v16-public-flows.json`, `v16-interactions.json` |
| CMS |Home/ảnh giữ chữ, lưu/preview đúng; lương sai bị chặn; bản dịchEN đúngid; reset mẫu | `v16-interactions.json` |
| Keyboard |Arrow slider; Tab/Shift+Tab trap; Escape đóng iframe/studio; Enter/Escape menu; compare2 | `v16-interactions.json` |
| Màu/vùng bấm |CTA6,53:1, sort13,92:1, breadcrumb5,73:1; mẫu control44–48px | `v16-measurements.json` |

## Phát hiện đã xử lý

| Issue | Vị trí | Expected / actual và sửa | Trạng thái |
| --- | --- | --- | --- |
| MD16-01 · P2 | Breadcrumb About và inner headers | Các phần cùng đường căn; không giữ khoảng ảnh banner cũ. Ảnh1 lệch baseline; link36px và phần hiện tại chưa align-center. | resolved |
| MD16-02 · P2 | CMS overview | Chỉ giữ biên tập/lưu/xem trước cần cho demo. Ảnh2 có quality gate/production checklist dài và dư. | resolved |
| MD16-03 · P2 | 320px EN job details | Grid/fieldset co giãn đúng. Lượt đầu scroll310>client305; grid con intrinsic min-width. | resolved |
| MD16-04 · P1 | 200% text mobile header/grid | Menu và nội dung quan trọng nằm trong viewport. Header và label dài gây tràn trong lượt reflow đầu; đã wrap header/grid/text. | resolved |
| MD16-05 · P2 | Image studio | URL/range có tên, một dialog. URL/ranges thiếu tên và role dialog lồng; đã sửa và thử AX. | resolved |
| MD16-06 · P2 | CMS preview iframe | Escape bên trong preview đóng parent. Escape không tới parent; đã thêm listener theo load và thử count0. | resolved |
| MD16-07 · P2 | Ảnh lỗi trong link decorative | Retry có thể truy cập, không lồng control hoặc thừa aria-hidden. Placeholder cũ ở trong anchor aria-hidden; đã tách host và giữ cơ chế phục hồi. | resolved |

## Điều kiện PG1–PG6

| Gate | Trạng thái | Evidence |
| --- | --- | --- |
| PG1 | pass trong phạm vi prototype | I01, I02, I03 |
| PG2 | pass trong phạm vi prototype | M01, M02 |
| PG3 | pass trong phạm vi prototype | I03 |
| PG4 | pass trong phạm vi prototype | V01, S02 |
| PG5 | pass trong phạm vi prototype | V01, I04 |
| PG6 | pass trong phạm vi prototype | S02, I02 |

## Giới hạn và bước tiếp theo

MD16-08/P3 còn mở: hiệu đính bản ngữ, nghiên cứu với người lao động/FDI và kiểm thiết bị/AT thật. Reduced-motion có source và pause đã chạy, chưa bật media preference hệ điều hành để kiểm riêng. Tất cả màu trên ảnh/alpha chưa đo pixel. Chưa lặp mọi biến thể CV hoặc ảnh khác tỷ lệ; các phần tương ứng giữ4/5 thay vì tự cho5.

Bản demo không chứa bảng chấm điểm, quality gate, preflight, server inbox hoặc lịch sử xuất bản máy chủ trong luồng trình diễn. Chỉ giữ nhãn prototype và ghi chú mô phỏng cần thiết. Các báo cáo là tài liệu bàn giao riêng.

Trước production cần xác minh dữ liệu doanh nghiệp và quyền ảnh/case, vận hành nhận hồ sơ, quyền/retention/quét CV, tích hợp theo yêu cầu và kiểm SEO/performance/an toàn riêng. Đây là backlog production, không phải lỗi của prototype.

## Điểm chi tiết 50 tiêu chí

| ID | Tiêu chí | Mức0–5 | Evidence | Nhận xét |
| --- | --- | ---: | --- | --- |
| A01 | Giá trị và đối tượng | 4 | V01, S02 | Giá trị cho hai nhóm và CTA rõ; thông điệp còn tính ngành, chưa có nghiên cứu định vị khác biệt. |
| A02 | Kiến trúc phục vụ câu hỏi quyết định | 5 | V01, S02 | Cấu trúc trả lời dịch vụ/phạm vi, địa điểm/lương/điều kiện, cách ứng tuyển và đường về. |
| A03 | Ưu tiên thông tin theo nhiệm vụ | 5 | V01, S02 | Public ưu tiên nhiệm vụ; CMS bỏ kiểm định và cảnh báo production, giữ chỉnh/lưu/preview. |
| A04 | Độ rộng và chiều sâu mô phỏng | 5 | V01, S02 | Bản kê cụ thể template/state/locale và nhánh lỗi; phần chưa tích hợp ghi riêng. |
| A05 | Nội dung tạo tin cậy đúng ngữ cảnh | 4 | V01, S02 | Đối tác/ảnh/tin mẫu có nhãn, không công bố số liệu chưa xác minh; case thật để giai đoạn nội dung. |
| B01 | Ý tưởng nghệ thuật gắn thương hiệu | 4 | V01, S02 | Navy/đỏ và ảnh con người phù hợp Minh Đức, chưa là art direction độc quyền. |
| B02 | Ngôn ngữ thị giác nhất quán | 5 | V01, S02 | Cùng palette/icon/ảnh/CTA xuyên public và CMS; mật độ CMS khác có lý do. |
| B03 | Tỷ lệ, nhịp và khoảng thở | 4 | V01, S02 | Nhịp các khối và trang tác vụ hợp lý, còn có thể biên tập gọn thêm nội dung dài. |
| B04 | Chất lượng mỹ thuật của ảnh và đồ họa | 4 | V01, S02 | Ảnh AI minh họa và đồ họa editorial sắc, có crop; tư liệu doanh nghiệp thật chưa thuộc bản mẫu. |
| B05 | Mức hoàn thiện xuyên trang | 5 | V01, S02 | Các trang tác vụ, CMS và states được rà cùng hệ; breadcrumb/ảnh lỗi/overlay đã sửa. |
| C01 | Hệ chữ có vai trò | 5 | V01, S02 | Vai trò serif thương hiệu/sans nội dung/data và weights nhất quán, có fallback CJK. |
| C02 | Khả năng đọc trong ngữ cảnh | 4 | V01, S02 | Chữ cần đọc đã tăng, reflow có test; một số metadata nhỏ và khả năng đọc thực trên điện thoại cần user test. |
| C03 | Hierarchy giúp tìm thông tin | 5 | V01, S02 | Lương/địa điểm, tiêu đề, CTA và các nhóm field rõ trong màn hình thương hiệu và tác vụ. |
| C04 | Glyph và định dạng ngôn ngữ | 4 | V01, S02 | Dấu Việt/CJK, đơn vị và ngày có mẫu; còn fallback tiếng Việt có chủ đích và tên địa danh nguyên bản. |
| C05 | Microcopy và nhãn hành động | 5 | V01, S02 | Copy lưu/chờ/error/complete/reset đúng demo; không nói đã nhận hồ sơ thật. |
| D01 | Thích ứng theo các viewport đã cam kết | 5 | M01 | 164 mẫu bao phủ các width/locale đã khóa, không mất CTA/ảnh và không tràn ngang. |
| D02 | Reflow và nội dung dài | 4 | M02, I04 | 14 phép CSS text200% và content stress qua; không suy browser zoom hoặc thiết bị thật. |
| D03 | Vùng cố định và lớp phủ | 4 | I03, H01 | Menu/modal/dock dùng được và thoát được; chưa thử bàn phím ảo thực hoặc mọi viewport thấp. |
| D04 | Grid, căn chỉnh và khoảng cách hệ thống | 5 | V01, S02 | Breadcrumb align-center, grids minmax/min-width, tiêu đề dài wrap thay cắt chữ; đồng nhất đường căn. |
| D05 | Mật độ theo tác vụ và lượng dữ liệu | 5 | I04 | 0/1/2/5/9 items ở các template dữ liệu chính giữ đường đi; không ép chiều cao bằng cắt dữ liệu. |
| E01 | Điều hướng và nhận biết vị trí | 4 | I03, H01 | Menu/deep link/query/return rõ; static detail có thể hiện fallback ngắn trước JS, chưa hoàn hảo mọi điểm vào. |
| E02 | Hoàn tất tác vụ ưu tiên | 4 | I01, I02, H01 | Tác vụ người lao động/doanh nghiệp/CMS demo hoàn tất; chưa chạy lại mọi biến thể CV/new posts. |
| E03 | Tìm kiếm, lọc hoặc cơ chế tìm nội dung | 5 | I03, H01 | Query không dấu, empty/reset, sort/bookmark/compare và ngữ cảnh URL có evidence mới và kế thừa. |
| E04 | Gửi dữ liệu và xác nhận mô phỏng | 5 | I01 | Validation/errors/giữ nhập, checking, completion/retry được khai báo mô phỏng, chặn gửi lặp trong adapter. |
| E05 | Quay lại, hủy và đổi lựa chọn | 5 | I02, I03, H01 | Hủy studio, đóng preview/Escape và reset có xác nhận; không mất chữ khi lưu ảnh. |
| F01 | Nhất quán và tái sử dụng component | 5 | V01, S02 | Pattern component có source và variants, public/CMS theo vai trò, loại bỏ panel chấm điểm khỏi sản phẩm. |
| F02 | Trạng thái điều khiển | 5 | I01, I03 | Default/selected/pressed/disabled/error/focus theo control được thử;1 compare disabled,2 mở được. |
| F03 | Loading, empty, error và success | 5 | I01, I04 | Rỗng, lỗi nhập/ảnh, checking và success demo có hành động tiếp theo, không dùng skeleton giấu nội dung. |
| F04 | Trường nhập và hướng dẫn sửa lỗi | 5 | I01, I02 | Lỗi field gắn ID, name/phone/consent được giữ; salary invalid có focus/native validity; labels studio đã sửa. |
| F05 | Component phức hợp | 4 | I02, I03, H01 | Modal/tab/accordion/filter có evidence; chưa thử mọi tổ hợp phức hợp ở từng locale. |
| G01 | Tương phản có đo | 4 | M03 | Các cặp màu nền đặc và vùng quan trọng có đo; không coi nền alpha/ảnh là pixel measurement. |
| G02 | Kích thước và khoảng cách vùng thao tác | 5 | M03 | Mẫu thao tác chính44–48px, đủ tách biệt, labels mở rộng checkbox/radio; CSS ràng buộc vùng dùng lặp. |
| G03 | Bàn phím và focus theo loại prototype | 5 | I03 | Tab/Shift+Tab/Arrow/Enter/Escape và focus restore được thao tác thật ở menu, comparison và studio/preview. |
| G04 | Tên, cấu trúc đọc và ngữ nghĩa | 4 | S01 | DOM/AX có heading, tên, state, error liên kết; URL/range và nested dialog đã sửa; chưa audit AT toàn bộ. |
| G05 | Ý nghĩa không phụ thuộc một tín hiệu | 4 | V01, S01 | Trạng thái có chữ+icon, sample/ảnh AI rõ; còn có thể giảm lặp ký hiệu trang trí trong AX. |
| H01 | Nội dung thực tế và đủ điều kiện quyết định | 5 | V01, S02 | Dữ liệu tuyển dụng đại diện nghiệp vụ, salary/location/CV/type/4 sections đủ thử; không dùng lorem ipsum. |
| H02 | Ảnh sắc nét, crop và chức năng | 5 | V01, S02 | Ảnh/đồ họa theo vai trò, có khung/focal point và preview; crop nhiều viewport được xem. |
| H03 | Bản dịch và nội dung bản địa | 4 | V01, S02 | 4 locale vào/ra flow rõ và có fallback; chưa hiệu đính bản ngữ toàn bộ nội dung. |
| H04 | Nội dung dài và thiếu trường tùy chọn | 5 | I04 | Tiêu đề dài, excerpt trống, lượng dữ liệu khác nhau qua các template chính, không cắt thông tin. |
| H05 | Lỗi tài nguyên và thay ảnh | 4 | I04, S01, H01 | 404 placeholder/retry an toàn và giữ layout; chưa chạy lại mọi ảnh dọc/new crop sau thay wrapper. |
| I01 | Chuyển động có mục đích | 5 | V01, S02 | Motion ít, hỗ trợ feedback; lựa chọn tĩnh vẫn đọc được toàn nội dung. |
| I02 | Phản hồi sau thao tác | 5 | I01, I02, I03 | Phản hồi đồng bộ, checking demo rõ; save/preview/corrected error không bỏ ngữ cảnh. |
| I03 | Liên tục giữa màn hình và trạng thái | 5 | I02, I03 | Quay lại, chỉnh ảnh/phiên ngôn ngữ, compare và preview giữ record; reset có điểm đầu rõ. |
| I04 | Quyền dừng và giảm chuyển động | 4 | I03, S01 | Pause thực tế qua; source có reduced-motion, chưa bật preference hệ điều hành để thử riêng. |
| I05 | Độ trễ không làm sai lệch thử nghiệm | 4 | I01, I02 | Quan sát các tác vụ đủ phản hồi; delay220ms là thiết kế minh họa, không là số đo production. |
| J01 | Ranh giới demo và dữ liệu thật | 5 | V01, S02 | Một nhãn prototype gọn và ghi chú tại form; demo không gọi/lưu lead/CV; CMS key riêng. |
| J02 | Bản kê phạm vi có thể đối chiếu | 5 | S02 | Scope/task/template/locale/viewport/evidence được ghi, không đổi exclusions để tăng điểm. |
| J03 | Hợp đồng bàn giao thiết kế | 5 | S02 | Source+handoff có tokens, states, content/media/locale/focus/constraints và acceptance, backend tách riêng. |
| J04 | Tái lập trạng thái thử | 4 | I02 | Reset seed, URL explicit, import/export và hướng dẫn tái lập có sẵn; bookmark/preference có state riêng. |
| J05 | Phát hiện và bước tiếp theo | 5 | S02 | Issue IDs, expected/actual/acceptance được ghi, expert review/user research và production tách bạch. |

## Tệp bàn giao

`PROTOTYPE-SCOPE-V16.md`, `PROTOTYPE-HANDOFF-V16.md`, `prototype-v16-audit.json`, `prototype-v16-score.json` và baselineP1 riêng. Screenshot: `v16-proof-mobile.jpg`. Source/publication giữ cùng Site ID.
