# Quy ước phiên bản — Minh Đức V20

Xác minh ngày **04/11/2026**: phiên bản sản phẩm đang chạy là **Flagship Prototype V20**, được đối chiếu từ deployment thành công và đúng mã nguồn. Xem [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

## Các nhãn cần phân biệt

| Nhãn | Ý nghĩa |
| --- | --- |
| V20 | Phiên bản sản phẩm/prototype hiện hành |
| Số xuất bản Sites | Bộ đếm bản lưu/phát hành, có thể tăng khi chỉ sửa tài liệu |
| Commit Git | Trạng thái nguồn của saved version/deployment đã chọn |
| `package.json` → `0.1.0` | Metadata package, không phải nhãn prototype |
| Tên file V15/V16/V17 | Tên tương thích và mã được giữ lại; không tự xác định phiên bản website |
| `/api/health` → V15/staging | Nhãn backend lịch sử, không phải phiên bản giao diện hiện hành |

## Mốc đã đối chiếu

| Phiên bản / phạm vi | Số Sites | Commit nguồn |
| --- | ---: | --- |
| V20 — UI, widget và video | #13 | `95105f351f9264336ae01ba5daea1eb6cd259d5a` |
| V19 — đồng bộ tài liệu | #12 | `92aa6823e9893e4f8d72f50578c8e5c47d9cb709` |
| V19 — UI | #11 | `848425392ec54e9aafe70922a0de203b5b862222` |
| V18 | #10 | `b33e62993f0c508e6966418e8811cd03b5a63eb9` |
| V17.2 | #9 | `144a27837168c7a9ddaf00a557d437eba0ec76be` |

Bản #13 triển khai thành công lúc **02:04 ngày 04/11/2026, giờ Việt Nam**. Đây là mốc UI được đối chiếu khi bắt đầu lượt đồng bộ tài liệu. Một bản xuất bản chỉ sửa tài liệu có thể dùng số Sites tiếp theo trong khi sản phẩm vẫn là V20. Dữ liệu tham chiếu: [VERSION-REFERENCE-V20.json](VERSION-REFERENCE-V20.json); [tham chiếu V19](VERSION-REFERENCE-V19.json) là lịch sử.

## Cách xác định lần sau

1. Đọc trạng thái cuối của đúng deployment trên Site. Bản lưu mới nhất chưa chắc là bản đang chạy.
2. Đọc README và bàn giao tại full commit của deployment đó. Không suy từ checkout cũ, tên ZIP hoặc câu trả lời trước.
3. Khi build từ source: chạy `node scripts/build-static.mjs` rồi `node scripts/verify-runtime.mjs` để đối chiếu runtime sinh tự động. Không sửa trực tiếp `site-runtime.js`.
4. Chỉnh tài liệu giữ nhãn V20, không tự nâng V21 hay chấm điểm mới. Lượt nâng cấp sản phẩm thực tế phải có thay đổi/bằng chứng riêng.
5. Bản xuất mã nguồn cần ghi release label, commit và phạm vi. ZIP cũ không tự được cập nhật theo Site; video cục bộ không nằm trong source/JSON nếu chưa bàn giao tệp gốc.

## Điểm đánh giá

V20 có điểm FQ1 chuyên gia **89,25/100**, ghi trong [bàn giao](PROTOTYPE-HANDOFF-V20.md) và [nghiệm thu](v20-acceptance.json); V19 cùng rubric là 86,25/100. Điểm P1.0.0 96,6 của V17 thuộc rubric/phạm vi khác. Lượt kiểm phiên bản và chỉnh tài liệu này không chấm lại hoặc suy điểm 95–100.
