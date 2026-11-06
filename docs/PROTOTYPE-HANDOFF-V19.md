<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức — Flagship Prototype V19

Hoàn thiện ngày 01/11/2026 trên nguồn V18, cùng Site và phạm vi prototype.

## Kết quả

- Ngôn ngữ VI/EN/ZH/KO giữ đúng sau khi đổi lựa chọn, tải lại, tìm/lọc việc, mở liên kết và quay lại lịch sử hash. Tiếng Việt cũng có `lang=vi` rõ ràng. Tiêu đề trình duyệt theo ngôn ngữ đang xem.
- Sửa BHXH, cách diễn đạt bảo hiểm trong tiếng Hàn, nhãn địa điểm, placeholder, modal ảnh/video và bảng so sánh. Dịch theo từng trường: nội dung gốc đã khôi phục vẫn được dịch, còn chỉnh sửa và bản dịch CMS được giữ nguyên.
- Trên mobile, ô tìm việc đứng trước ảnh lớn; phần đầu danh sách việc được rút gọn; metadata/sort/compare quan trọng tăng lên 13px. Các nút chính được lấy mẫu tại 320px và 390px đạt mục tiêu 44px.
- Công việc đầu tiên xuất hiện tại 600–637px ở bốn ngôn ngữ và hai loại danh sách. Tiếng Việt: 926 → 637px, sớm hơn 289px, khoảng 31%.
- Trang chủ bỏ khối quy trình lặp, chuyển brief thành phần mở rộng bằng bàn phím, thu gọn gallery và bài viết. Đo cùng bố cục VI: desktop 1425px giảm 8.563 → 7.486px; mobile 375px giảm 12.787 → 10.006px. Đây là chiều cao tài liệu, không phải thời gian tải.
- Bốn dịch vụ có đầu ra đề xuất, trách nhiệm hai bên, tiêu chí bàn giao và tình huống minh họa rõ nhãn. Ba bài cẩm nang có các bước, checklist và câu hỏi thực tế ở bốn ngôn ngữ. Nội dung mới chỉ áp dụng cho bài mẫu chưa được sửa.
- Dịch vụ đang chọn giữ nguyên sau reload. URL chi tiết không có dữ liệu trả về trạng thái không tìm thấy thay vì lỗi JavaScript; bản ghi ẩn không được dùng làm fallback.
- 10 script công khai gộp thành một runtime tái lập: 354.620 → 324.559 byte; gzip thử cục bộ từ 127.544 → 113.073 byte, giảm khoảng 11,3%. Chưa tách toàn bộ mã CMS khỏi runtime. Đây không phải điểm Lighthouse hay dữ liệu Core Web Vitals.

## Kiểm chứng

| Nhóm | Kết quả | Bằng chứng |
| --- | --- | --- |
| Trang / kích thước / locale | 180/180 | `v19-matrix.json` |
| Phóng to chữ CSS 200% | 21/21 | `v19-reflow.json` |
| Đổi locale, reload và giữ ngữ cảnh | 52/52 | `v19-locales.json` |
| Vị trí kết quả, cỡ chữ, vùng chạm mobile | 48/48 | `v19-mobile.json` |
| Hành trình, CMS và dữ liệu rỗng | 61/61 | `v19-interactions.json` |
| Node regression | 24/24 | Script `test` trong `package.json` |
| Runtime trước/sau minify | Đạt | `node scripts/verify-runtime.mjs` |
| Build Vinext/Vite | Đạt | Helper chính thức `build-site.mjs`, hoàn thành 5 giai đoạn |
| Nguồn / tài nguyên phát hành | 9/9 khớp | `v19-release-check.json`; không có QA HTML hoặc trang quản trị được bảo vệ trong static output |

Tổng 362 kiểm tra trình duyệt. Chạy trên browser tích hợp Windows, khung 320/390/768/1440px; chiều rộng nội dung có thể giảm 15px do scrollbar. Kiểm 200% là phóng chữ CSS, không phải kiểm mọi chế độ zoom của thiết bị.

Kiểm trực tiếp bổ sung: Enter/Space mở/đóng brief; Escape đóng ảnh/so sánh và trả focus; caption ảnh và quyền lợi trong so sánh hiển thị tiếng Anh; đổi locale rồi Back qua lịch sử hash; tiêu đề tab được dịch. Không ghi nhận lỗi JavaScript trong phiên kiểm trực tiếp.

Harness ban đầu chờ sự kiện load khi iframe đi tới cùng URL có hash nên timeout sau một trường hợp. Đã sửa harness để reload thực sự khi URL có cùng path/query; không sửa locale đầu vào để làm test qua. Chạy lại đủ 52/52. Các JSON lưu kết quả cuối cùng.

## Chấm lại theo FQ1

Đánh giá chuyên gia sơ bộ: **86,25/100, trình bày làm tròn 86/100**, so với 82/100 của V18 trong lượt đánh giá trước. Giữ nguyên rubric và trọng số; không phải chứng nhận quốc tế hoặc phép đo khách quan.

| Nhóm | Trọng số | Điểm /10 | Quy đổi |
| --- | ---: | ---: | ---: |
| Định vị và bản sắc | 15 | 8 | 12 |
| Mỹ thuật, typography và bố cục | 20 | 9 | 18 |
| Nội dung và sức thuyết phục | 15 | 8 | 12 |
| Hành trình và chuyển đổi | 20 | 9 | 18 |
| Mobile và tiếp cận | 10 | 9 | 9 |
| Bản địa hóa | 5 | 8,5 | 4,25 |
| Trạng thái và chuyển động | 5 | 9 | 4,5 |
| Hệ thiết kế và khả năng bảo trì | 10 | 8,5 | 8,5 |
| **Tổng** | **100** | | **86,25** |

Chưa đủ cơ sở xác nhận trên 92. Chủ sở hữu xác nhận chưa có lợi thế và dự án thực tế để cung cấp trong lượt này. Những phần còn thiếu: định vị và kết quả dự án có bằng chứng, thông tin liên hệ chính thức, hiệu đính bản ngữ, thử tác vụ với người lao động/người mua dịch vụ FDI, thiết bị vật lý và công nghệ hỗ trợ. Không biến tình huống minh họa hoặc logo tham khảo thành bằng chứng khách hàng.

## Phạm vi và tiếp tục phát triển

Form vẫn mô phỏng hoàn tất, không gửi/lưu thông tin liên hệ hoặc CV; CMS lưu trên trình duyệt. Backend được giữ nguyên. Không tuyên bố đạt WCAG, tốc độ thực địa hay sẵn sàng vận hành thật.

Chỉnh nguồn trong `public/flagship-content.js`, `flagship-editorial.js`, `locale-routing.js`, `app.js` và `design-system.css`. `node scripts/build-static.mjs` sinh runtime, HTML, CSS và seed. Không sửa trực tiếp `site-runtime.js`; bộ kiểm hash sẽ phát hiện runtime cũ. `scripts/v19-qa.html` chỉ phục vụ kiểm thử cục bộ và phải nằm ngoài bản phát hành.

## Đồng bộ tài liệu ngày 02/11/2026

Bản UI được đối chiếu thành công trên Sites #11, commit `848425392ec54e9aafe70922a0de203b5b862222`; lần deploy tham chiếu hoàn tất lúc 19:52 ngày 01/11/2026, giờ Việt Nam. Đây là mốc nguồn của bàn giao V19; một lần xuất bản chỉ sửa tài liệu có thể dùng số Sites khác mà không đổi phiên bản sản phẩm.

Hướng dẫn hiện hành: [mục lục](README.md), [phiên bản](VERSIONING.md), [phạm vi V19](PROTOTYPE-SCOPE-V19.md), [runbook V19](RUNBOOK-V19.md), [ảnh/logo](IMAGERY-GUIDE.md) và [công việc tiếp theo](KE-HOACH-TIEP-THEO-V19.md).

Phần bổ sung này không chạy lại 362 phép thử trình duyệt, không đổi điểm FQ1 và không công nhận vận hành production. Các báo cáo V12–V18 được giữ nguyên dữ kiện, chỉ đánh dấu lịch sử và dẫn tới mục lục hiện hành.

Biên bản kiểm tài liệu và byte runtime của lượt này: `DOCUMENTATION-UPDATE-V19-2026-11-02.json`. Comment hash nguồn trong runtime sinh tự động được làm mới sau khi build; toàn bộ thân mã ứng dụng được đối chiếu byte, không thay đổi hành vi.
