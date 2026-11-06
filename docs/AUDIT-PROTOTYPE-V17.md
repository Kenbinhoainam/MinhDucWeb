<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Website Minh Đức — đánh giá Prototype V17

**96,6/100 · Flagship prototype nội bộ P1.0.0 · expert_review.** Độ phủ tiêu chí 100%; biên toàn phạm vi [96,6;96,6]. Cả 6 gate đạt trong mẫu đã công bố. Production readiness: **not_assessed**.

So sánh hợp lệ với V16: **91,4 → 96,6**, cùng rubric, cùng scope signature và không có N/A. Điểm runtime V15 không nằm trong phép so. Đây là đánh giá chuyên môn nội bộ, không phải chứng nhận độc lập hoặc phép đo sự hài lòng của người dùng.

## Thay đổi tạo ra kết quả

- Gỡ nhãn ảnh AI lặp ở Hero/gallery và dọn mô tả ảnh. Giữ nội dung demo ở nơi cần quyết định, không biến ảnh minh họa thành bằng chứng cơ sở vật chất thật.
- Rà 14 hồ sơ doanh nghiệp:0 hồ sơ đủ bằng chứng để xác nhận quyền logo cho Minh Đức. Ẩn logo và tên trong dải công khai, không cho ô checkbox/JSON nhập tự cấp quyền. Thay bằng 4 đường đi tư vấn theo ngành có nội dung cụ thể.
- Sửa2 lỗi thấy khi thử: intrinsic grid tiếng Trung320px và searchgrid tiếng Anh khi tăng chữ. Sau sửa, 180 ma trận và 42 reflow đều qua.
- Sửa input ảnh nhận đường dẫn assets/, áp đúng crop0% và transform Hero. Thử ảnh dọc/ngang/404, không mất layout hoặc đường đi.
- Bổ sung trang thông tin4 ngôn ngữ, nav cha trên trang sâu, shell trung tính trước JS, giảm ký hiệu trang trí trùng, control giảm chuyển động có trạng thái và khả năng giữ lựa chọn.
- Thử lại đường tư vấn có prefill/error/success, CV nội bộ với file quá dung lượng và tệp mẫu, CMSsave/preview/reset, cùng focus vòng vàEscape ở390×480.

## Điểm theo nhóm

| Nhóm | Điểm đạt / trọng số | Điểm nhóm /100 |
|---|---:|---:|
| A · Mục tiêu, nội dung và kiến trúc | 9.6/10 | 96 |
| B · Bản sắc và chỉ đạo nghệ thuật | 15.2/16 | 95 |
| C · Typography và phân cấp thông tin | 9.6/10 | 96 |
| D · Bố cục và thiết kế đa thiết bị | 11.4/12 | 95 |
| E · Điều hướng và hành trình chính | 14/14 | 100 |
| F · Component và trạng thái giao diện | 10/10 | 100 |
| G · Khả năng tiếp cận trong prototype | 9.6/10 | 96 |
| H · Nội dung, hình ảnh và bản địa hóa | 7.6/8 | 95 |
| I · Chuyển động và phản hồi cảm nhận | 4.8/5 | 96 |
| J · Tính trung thực và khả năng bàn giao | 4.8/5 | 96 |

## Bằng chứng

| ID | Loại / nguồn | Kết quả |
|---|---|---|
| V17 | Ảnh trình duyệt `v17-proof-mobile.jpg` | Home/khối ngành/CMS14 hồ sơ,0 đủ điều kiện |
| M17 | `v17-matrix.json` |180/180,4 độ rộng và4 locale, không lỗi ảnh hoặc tràn document |
| R17 | `v17-reflow.json` |42/42 phép tăng chữ bằngCSS ở320/640 |
| C17 | `v17-measure.json`, `v17-error-colors.json` | Caption/save13,92:1; copy ngành6,19:1; chữ lỗi tối thiểu7,16:1; control44–48px |
| MEDIA17 | `v17-media.json`, `v17-stress.json` |8/8 ảnh/quyền và16/16 dữ liệu dài/rỗng/lỗi |
| T17 | `v17-interactions.json` | Contact/CV/CMS, motion, preview, focus và dialog viewport thấp |
| S17 | Source và `v17-unit-tests.txt` | Gate quyền logo, URL/crop, shell, ngữ nghĩa;12 test qua |
| SPEC17 | Scope/handoff/logo review | Phạm vi bất biến, ranh giới mô phỏng và quyền chưa xác minh rõ |

`v17-acceptance.json` là kết quả đầy đủ 250 trường hợp. Các trace V16 được giữ làm baseline và hỗ trợ phần không đổi; phần thay đổi có bằng chứng mới riêng. Số trường hợp không thay thế kiểm tra chất lượng hay mở rộng kết luận ra ngoài mẫu.

## Gate và vấn đề

PG1 hành trình, PG2 thiết bị/nội dung, PG3 keyboard theo loại prototype, PG4 trung thực, PG5 toàn vẹn giao diện và PG6 tái lập: **pass trong phạm vi**. Không còn P0/P1 mở.

Các lỗi MD17-01 đến MD17-04 đã giải quyết: trình bày ảnh/logo, tràn ở tổ hợp biên, URL/crop ảnh, nội dung mặc định chớp sai ở detail/article. Hai trạng thái cần tiếp tục là chiều sâu xác nhận bằng người dùng/ngôn ngữ/AT và tài liệu cấp quyền logo thật. Chúng được giữ rõ, không ghi là đã được doanh nghiệp chấp thuận.

## Vì sao chưa chấm100

Tám tiêu chí còn4/5: định vị khác biệt có nghiên cứu(A01), chiều sâu chỉ đạo nghệ thuật độc quyền(B01), đọc metadata thực trên thiết bị(C02), native zoom/device breadth(D02), AT/đọc toàn bộ cấu trúc(G04), hiệu đính bản ngữ (H03), đo độ trễ độc lập với host(I05), tái lập mọi bookmark/preference bằng một thao tác (J04). Những giới hạn này không được bù bằng việc tự đặt mức5 hoặc thêm hiệu ứng.

Không có user study, AT/native device đầy đủ, hiệu đính bản ngữ độc lập hay xác nhận pháp lý. Không suy điểm này thành production security, full WCAG, field CWV, doanh thu, chất lượng hợp đồng hoặc giá bán.

## 50 tiêu chí

| ID | Tiêu chí | Mức | Bằng chứng |
|---|---|---:|---|
| A01 | Giá trị và đối tượng | 4/5 | V01, S02, V17, M17, S17, SPEC17 |
| A02 | Kiến trúc phục vụ câu hỏi quyết định | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| A03 | Ưu tiên thông tin theo nhiệm vụ | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| A04 | Độ rộng và chiều sâu mô phỏng | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| A05 | Nội dung tạo tin cậy đúng ngữ cảnh | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| B01 | Ý tưởng nghệ thuật gắn thương hiệu | 4/5 | V01, S02, V17, M17, S17, SPEC17 |
| B02 | Ngôn ngữ thị giác nhất quán | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| B03 | Tỷ lệ, nhịp và khoảng thở | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| B04 | Chất lượng mỹ thuật của ảnh và đồ họa | 5/5 | V01, S02, V17, M17, S17, SPEC17, MEDIA17, T17 |
| B05 | Mức hoàn thiện xuyên trang | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| C01 | Hệ chữ có vai trò | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| C02 | Khả năng đọc trong ngữ cảnh | 4/5 | V01, S02, V17, M17, S17, SPEC17 |
| C03 | Hierarchy giúp tìm thông tin | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| C04 | Glyph và định dạng ngôn ngữ | 5/5 | V01, S02, V17, M17, S17, SPEC17, R17 |
| C05 | Microcopy và nhãn hành động | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| D01 | Thích ứng theo các viewport đã cam kết | 5/5 | M01, V17, M17, S17, SPEC17 |
| D02 | Reflow và nội dung dài | 4/5 | M02, I04, V17, M17, S17, SPEC17 |
| D03 | Vùng cố định và lớp phủ | 5/5 | I03, H01, V17, M17, S17, SPEC17, T17, R17 |
| D04 | Grid, căn chỉnh và khoảng cách hệ thống | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| D05 | Mật độ theo tác vụ và lượng dữ liệu | 5/5 | I04, V17, M17, S17, SPEC17 |
| E01 | Điều hướng và nhận biết vị trí | 5/5 | I03, H01, V17, M17, S17, SPEC17, T17 |
| E02 | Hoàn tất tác vụ ưu tiên | 5/5 | I01, I02, H01, V17, M17, S17, SPEC17, T17, MEDIA17 |
| E03 | Tìm kiếm, lọc hoặc cơ chế tìm nội dung | 5/5 | I03, H01, V17, M17, S17, SPEC17 |
| E04 | Gửi dữ liệu và xác nhận mô phỏng | 5/5 | I01, V17, M17, S17, SPEC17 |
| E05 | Quay lại, hủy và đổi lựa chọn | 5/5 | I02, I03, H01, V17, M17, S17, SPEC17 |
| F01 | Nhất quán và tái sử dụng component | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| F02 | Trạng thái điều khiển | 5/5 | I01, I03, V17, M17, S17, SPEC17 |
| F03 | Loading, empty, error và success | 5/5 | I01, I04, V17, M17, S17, SPEC17 |
| F04 | Trường nhập và hướng dẫn sửa lỗi | 5/5 | I01, I02, V17, M17, S17, SPEC17 |
| F05 | Component phức hợp | 5/5 | I02, I03, H01, V17, M17, S17, SPEC17, T17, MEDIA17 |
| G01 | Tương phản có đo | 5/5 | M03, V17, M17, S17, SPEC17, C17 |
| G02 | Kích thước và khoảng cách vùng thao tác | 5/5 | M03, V17, M17, S17, SPEC17 |
| G03 | Bàn phím và focus theo loại prototype | 5/5 | I03, V17, M17, S17, SPEC17 |
| G04 | Tên, cấu trúc đọc và ngữ nghĩa | 4/5 | S01, V17, M17, S17, SPEC17 |
| G05 | Ý nghĩa không phụ thuộc một tín hiệu | 5/5 | V01, S01, V17, M17, S17, SPEC17, T17 |
| H01 | Nội dung thực tế và đủ điều kiện quyết định | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| H02 | Ảnh sắc nét, crop và chức năng | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| H03 | Bản dịch và nội dung bản địa | 4/5 | V01, S02, V17, M17, S17, SPEC17 |
| H04 | Nội dung dài và thiếu trường tùy chọn | 5/5 | I04, V17, M17, S17, SPEC17 |
| H05 | Lỗi tài nguyên và thay ảnh | 5/5 | I04, S01, H01, V17, M17, S17, SPEC17, MEDIA17, T17 |
| I01 | Chuyển động có mục đích | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| I02 | Phản hồi sau thao tác | 5/5 | I01, I02, I03, V17, M17, S17, SPEC17 |
| I03 | Liên tục giữa màn hình và trạng thái | 5/5 | I02, I03, V17, M17, S17, SPEC17 |
| I04 | Quyền dừng và giảm chuyển động | 5/5 | I03, S01, V17, M17, S17, SPEC17, T17 |
| I05 | Độ trễ không làm sai lệch thử nghiệm | 4/5 | I01, I02, V17, M17, S17, SPEC17 |
| J01 | Ranh giới demo và dữ liệu thật | 5/5 | V01, S02, V17, M17, S17, SPEC17 |
| J02 | Bản kê phạm vi có thể đối chiếu | 5/5 | S02, V17, M17, S17, SPEC17 |
| J03 | Hợp đồng bàn giao thiết kế | 5/5 | S02, V17, M17, S17, SPEC17 |
| J04 | Tái lập trạng thái thử | 4/5 | I02, V17, M17, S17, SPEC17 |
| J05 | Phát hiện và bước tiếp theo | 5/5 | S02, V17, M17, S17, SPEC17 |

Chi tiết lý do, issue, gate và procedure của từng evidence: `prototype-v17-audit.json`. Quyền logo: `LOGO-RIGHTS-V17.md`. Tái lập và hợp đồng thiết kế: `PROTOTYPE-HANDOFF-V17.md`.
