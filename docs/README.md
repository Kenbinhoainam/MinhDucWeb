# Tài liệu hiện hành — Website Minh Đức V21

Cập nhật ngày **04/11/2026**. Điểm bắt đầu của dự án là [README gốc](../README.md). Bản cập nhật hiện hành là [V21](PROTOTYPE-HANDOFF-V21.md), phát triển từ baseline đánh giá V20 / Sites #14. Các hướng dẫn V20 bên dưới còn áp dụng nếu không được V21 thay thế; bằng chứng V20 là lịch sử, không phải phép kiểm của V21.

## Hướng dẫn hiện hành

| Tệp | Dùng khi |
| --- | --- |
| [VERSIONING.md](VERSIONING.md) | Xác định phiên bản, commit và số xuất bản Sites |
| [PROTOTYPE-SCOPE-V20.md](PROTOTYPE-SCOPE-V20.md) | Kiểm phạm vi trang, locale, CMS, form và backend |
| [RUNBOOK-V20.md](RUNBOOK-V20.md) | Cài đặt, chạy, biên tập, sao lưu, build và bàn giao |
| [PROTOTYPE-HANDOFF-V20.md](PROTOTYPE-HANDOFF-V20.md) | Đọc thay đổi, kết quả kiểm chứng và đánh giá V20 |
| [IMAGERY-GUIDE.md](IMAGERY-GUIDE.md) | Thay ảnh, dùng bộ logo demo và tra nguồn tài nguyên |
| [KE-HOACH-TIEP-THEO-V20.md](KE-HOACH-TIEP-THEO-V20.md) | Tiếp tục từ V20, phân biệt việc đã làm và còn đề xuất |

## Bằng chứng V20 đã lưu

| Nhóm | Kết quả ghi nhận | Tệp |
| --- | ---: | --- |
| Trang/kích thước/locale | 180/180 | [v20-matrix.json](v20-matrix.json) |
| Phóng chữ CSS 200% | 21/21 | [v20-reflow.json](v20-reflow.json) |
| Locale và giữ ngữ cảnh | 52/52 | [v20-locales.json](v20-locales.json) |
| Mobile | 48/48 | [v20-mobile.json](v20-mobile.json) |
| Hành trình/CMS/dữ liệu rỗng | 61/61 | [v20-interactions.json](v20-interactions.json) |
| Widget và video | 50/50 | [v20-features.json](v20-features.json) |
| Tổng nghiệm thu / nguồn phát hành | 412/412, 8 tài nguyên khớp | [v20-acceptance.json](v20-acceptance.json) |

Tổng 412 trường hợp trình duyệt. Phạm vi, công cụ và giới hạn được ghi trong bản bàn giao. Đây là bằng chứng kế thừa của V20, không phải phép chạy mới của lượt chỉnh tài liệu. Đánh giá FQ1 89,25/100 là đánh giá chuyên gia tham khảo, không phải Lighthouse hoặc chứng nhận vận hành.

## Tài liệu lịch sử

Các báo cáo dưới đây giữ nguyên dữ kiện, điểm và điều kiện tại thời điểm thực hiện. Không lấy hướng dẫn hoặc trạng thái trong đó làm hiện trạng V20.

| Phiên bản / giai đoạn | Tài liệu |
| --- | --- |
| V19 | [Bàn giao V19](PROTOTYPE-HANDOFF-V19.md), [phạm vi V19](PROTOTYPE-SCOPE-V19.md), [runbook V19](RUNBOOK-V19.md), [kế hoạch V19](KE-HOACH-TIEP-THEO-V19.md) |
| V18 | [Bàn giao V18](PROTOTYPE-HANDOFF-V18.md) |
| V17.2 / V17.1 | [Khối doanh nghiệp V17.2](CHANGELOG-V17.2.md), [khôi phục logo V17.1](CHANGELOG-V17.1.md) |
| V17 | [Audit](AUDIT-PROTOTYPE-V17.md), [phạm vi](PROTOTYPE-SCOPE-V17.md), [bàn giao](PROTOTYPE-HANDOFF-V17.md), [hồ sơ quyền logo lúc đó](LOGO-RIGHTS-V17.md) |
| V16 | [Audit](AUDIT-PROTOTYPE-V16.md), [phạm vi](PROTOTYPE-SCOPE-V16.md), [bàn giao](PROTOTYPE-HANDOFF-V16.md) |
| V15 | [Audit](AUDIT-V15.md), [runbook staging](RUNBOOK-V15.md), [roadmap](ROADMAP-FLAGSHIP-V15.md) |
| V14 / V13 | [Audit V14](AUDIT-V14.md), [nghiệm thu V14](ACCEPTANCE-V14.md), [audit V13](AUDIT-V13.md) |
| V9–V14 | [Mục lục/hướng dẫn cũ được lưu nguyên trạng](README-LEGACY-V9-V14.md) |
| Kế hoạch trước V18/V20 | [Kế hoạch V17 → production](KE-HOACH-MINHDUCWEB-V17-TO-PRODUCTION.md), [đánh giá/kế hoạch ngày 01/11](DANH-GIA-VA-KE-HOACH-FLAGSHIP-2026-11-01.md) |

Các file JSON/txt có tiền tố `v13-` đến `v19-` và các scorecard cũ là hồ sơ kiểm thử/đánh giá lịch sử. Không đổi tên hoặc sửa điểm để tạo kết quả V20.
