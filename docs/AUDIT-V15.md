<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức V15 — nghiệm thu theo Flagship Evaluator 2.0

Ngày31/10/2026 · Cùng Site/project và phạm vi50 tiêu chí của V14.

## Kết luận

Runtime staging cho dữ liệu giả đã có form→D1/R2 và receipt đối soát. Chưa xác nhận đạt ngưỡng Flagship. Điểm chỉ tăng ở phần có bằng chứng mới; không đổi trọng số hoặc chuyển phần thiếu bằng chứng sang N/A.

| Phiên bản | Điểm phần đã kiểm | Độ phủ | Khoảng toàn phạm vi |
| --- | --- | --- | --- |
| V14 prototype | 74,3/100 | 87% | [64,6;77,6] |
| V15 staging | 75.3/100 | 89.0% | [67.0;78.0] |

## Mười nhóm

| Nhóm | Điểm đã kiểm | Độ phủ | Cận dưới toàn nhóm |
| --- | --- | --- | --- |
| A — Chiến lược và nội dung | 80.0 | 80.0% | 64.0 |
| B — Bản sắc và chỉ đạo nghệ thuật | 80.0 | 100.0% | 80.0 |
| C — Typography và ngôn ngữ | 72.0 | 100.0% | 72.0 |
| D — Bố cục và đa thiết bị | 71.7 | 100.0% | 71.7 |
| E — Hành trình và chuyển đổi | 82.9 | 100.0% | 82.9 |
| F — Khả năng tiếp cận | 68.3 | 100.0% | 68.3 |
| G — Tương tác và chuyển động | 80.0 | 66.7% | 53.3 |
| H — Hiệu năng | 60.0 | 25.0% | 15.0 |
| I — Khả năng tìm thấy | 70.0 | 100.0% | 70.0 |
| J — CMS và độ bền vận hành | 74.3 | 87.5% | 65.0 |

## Đã thực hiện

- Form doanh nghiệp, lao động phổ thông và nội bộ/CV lưu máy chủ; mã tiếp nhận được đọc lại và đối soát trước khi UI báo thành công.
- CMS có route bảo vệ và API kiểm owner; lưu draft có revision, preview draft theo quyền, publish/history/restore và audit events.
- CV mẫu riêng tư; giới hạn tệp/body, kiểm chữ ký, Origin, consent, idempotency và rate limit. Không nối thông báo bên ngoài.
- Giữ nhận diện/giao diện V14; sửa nhãn lưu máy chủ, trạng thái lỗi, focus lỗi CV và mã gửi tương thích preview HTTP.
- Đổi slug theo lựa chọn của người dùng; cập nhật origin canonical/OG; giữ noindex cho dữ liệu minh họa.

## Bằng chứng kiểm thử

| ID | Expected | Actual |
| --- | --- | --- |
| E15 | API contracts, permission, conflict, publish/rollback, validation, retry | 8/8 nhóm Node tests; actual API với SQLite và fake R2. Không thay cho SSO hosted. |
| E16 | Lưu D1, receipt proof, replay/conflict, từ chối anonymous | 10/10 HTTP checks trên managed preview D1/R2. |
| E17 | Hoàn tất3 loại form; lỗi CV giữ input, đổi tệp gửi lại |3 receipt được đối soát; lỗi CV focus đúng và giữ name/phone/consent sau sửa. |
| E19 |9 route ×4 mẫu viewport/locale, không ảnh hỏng/tràn, một H1 |36/36 pass; iframe outer320/390/768/1440, inner305/375/753/1425. Đây là geometry sample, không phải thiết bị thật/zoom. |

CMS publish/rollback được diễn tập ở core API trên SQLite. Chưa đăng nhập owner SSO để nghiệm thu CMS UI hoặc hosted restore. Lỗi máy chủ do CV đã thử qua UI; ngắt mạng sau commit chưa fault-injection. LCP/INP/CLS field unknown; chưa có lab đại diện được kiểm soát.

## Gate

| Gate | Trạng thái | Bằng chứng/giới hạn |
| --- | --- | --- |
| G1 | pass | Ba luồng form thử hoàn tất với dữ liệu giả và receipt đối soát trên preview. Pass giới hạn phạm vi staging đã ghi. |
| G2 | unknown | Keyboard/focus chọn mẫu qua; chưa screen reader và zoom đủ phạm vi. |
| G3 | unknown | 36 mẫu V15 + baseline V14 qua kiểm hình học/ảnh; zoom và thiết bị thật chưa đủ. |
| G4 | unknown | Ảnh và nội dung demo có nhãn; chứng cứ thương hiệu chưa xác nhận. |
| G5 | unknown | Phục hồi lỗi CV và rollback API core đã thử; mất mạng hoàn toàn, CMS SSO/restore hosted và quy trình vận hành chưa đủ. |
| G6 | unknown | Chưa có lab performance đại diện và ngân sách đo trước. |

## Việc tiếp theo theo ưu tiên

| Ưu tiên | Việc | Nghiệm thu |
| --- | --- | --- |
| P1 trước vận hành | Xác minh thông tin, case, ảnh/quyền, hotline và tin | Có người duyệt/nguồn/ngày cho mọi claim trọng yếu. |
| P1 trước vận hành | Nghiệm thu owner SSO/CMS và chính sách dữ liệu | Chủ Site sửa/lưu/preview/publish/restore trên hosted; tài khoản khác bị từ chối; retention, quét CV và người xử lý được duyệt. |
| P2 | Fault injection, zoom, AT và thiết bị đại diện | Retry trước/sau commit không nhân bản; thao tác bàn phím/screen reader,200% text/400% reflow và bàn phím ảo hoàn tất tác vụ. |
| P2 | Lab performance và nội dung biên | Ít nhất3 lượt/route, cấu hình thiết bị/mạng/cache rõ; item counts0/1/2/5/9 và locale mới không mất nội dung. |

Kế hoạch đầy đủ: `ROADMAP-FLAGSHIP-V15.md`. Runbook: `RUNBOOK-V15.md`. Tệp chấm máy: `v15-audit.json` và `v15-score.json`. Giữ V14 trong docs để so sánh, không thay lịch sử baseline.
