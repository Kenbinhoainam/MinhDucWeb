<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Minh Đức — đánh giá độc lập và kế hoạch nâng cấp flagship

Ngày: **01/11/2026**. Trạng thái: **đánh giá và kế hoạch đề xuất; chưa triển khai nâng cấp**.

## 1. Nhận định và điểm số

**75/100 — prototype khá tốt, có nền tảng để nâng thành flagship; bằng chứng hiện có chưa đủ để gọi là flagship quốc tế siêu cao cấp.** Đây là điểm đánh giá chuyên gia sơ bộ theo rubric bên dưới, không phải phép đo khách quan hoặc chứng nhận. Điểm có trọng số là 74,5, làm tròn khi trình bày; không nên diễn giải chênh lệch 1–2 điểm thành cải thiện thực tế.

Thế mạnh là cấu trúc hai nhóm khách, tác vụ tuyển dụng, trạng thái giao diện và mức minh bạch của demo. Khoảng cách lớn nhất là bản sắc thương hiệu, tư liệu và bằng chứng năng lực thật, chiều sâu nội dung B2B, chất lượng bản địa hóa và cấu trúc mã giao diện qua nhiều phiên bản.

**Mức sẵn sàng vận hành: chưa nghiệm thu, không chấm điểm số.** Form mô phỏng và CMS localStorage là đúng phạm vi prototype. Chúng không bị tính thành lỗi chức năng trong bảng điểm này; việc vận hành thật có điều kiện nghiệm thu riêng ở mục 9.

### Phạm vi và độ tin cậy

- Đọc mã và HTML hiện tại của trang chủ, giới thiệu, dịch vụ, danh sách/chi tiết việc, liên hệ, tin tức; rà adapter prototype, CMS, SEO và backend được giữ lại.
- Xem trực tiếp ảnh `v16-proof-mobile.jpg` và `v14-comparison-desktop.jpg`. Đây là **ảnh lịch sử**, không phải ảnh chụp mới của checkout hôm nay. Ảnh V14 chỉ minh họa thiết kế so sánh việc ở thời điểm đó.
- Đọc báo cáo V16, số đo và log kiểm thử có sẵn; ghi nhận chúng là bằng chứng kế thừa, chưa chạy lại.
- Chạy mới 10 bài kiểm tra Node; cả 10 qua. Tái sinh static trong thư mục tạm, cả **13 tệp đầu ra** khớp byte với checkout.
- Browser Use bị tắt trong Work settings; công cụ web cũng không truy cập được URL prototype. Vì vậy **chưa kiểm trực tiếp live site, desktop toàn trang, Safari/iPhone, thiết bị thật, screen reader, Lighthouse hoặc field Core Web Vitals** trong lượt này. Chưa chạy full framework build vì checkout chưa có `node_modules`; kiểm static không thay cho kiểm Vinext/Workers.
- Tài liệu hiện hành chủ yếu ghi V16, tài liệu kế hoạch khác nhắc V17; chưa xác định live V17 khớp checkout này. Baseline đánh giá là **checkout hiện tại**, không mặc định là bản deployed.

Độ tin cậy cao cho kết luận về nguồn và tests vừa chạy; trung bình cho nội dung/kiến trúc; thấp hơn cho chất lượng thị giác toàn site và tương tác hiện tại. Điểm cần cập nhật sau vòng trình duyệt và thử người dùng ở mốc F4.

### Bảng điểm FQ1 — giữ nguyên rubric khi đánh giá lại

Mỗi nhóm chấm 0–10, bước 0,5. Mốc tham chiếu: 5 = có nền cơ bản nhưng còn khoảng trống lớn; 7 = tốt nhưng chưa khác biệt hoặc chưa kiểm chứng đủ; 9 = xuất sắc và có bằng chứng trên toàn phạm vi; 10 = hoàn thiện đặc biệt, được kiểm chứng rộng. Tổng = Σ(điểm nhóm / 10 × trọng số).

| Nhóm | Trọng số | Điểm /10 | Điểm quy đổi | Căn cứ chính và khoảng cách |
| --- | ---: | ---: | ---: | --- |
| Định vị và bản sắc | 15 | 7,0 | 10,5 | Navy/đỏ, serif/sans phù hợp; thông điệp “nhân lực toàn diện”, “đồng hành” còn dùng được cho nhiều doanh nghiệp cùng ngành |
| Mỹ thuật, typography và bố cục | 20 | 8,0 | 16,0 | Ảnh mobile cho thấy phân cấp và khoảng thở tốt; cần một ngôn ngữ ảnh/đồ họa riêng và kiểm lại toàn trang desktop |
| Nội dung và sức thuyết phục | 15 | 6,0 | 9,0 | Nội dung mẫu đủ thử tác vụ; ảnh AI, danh sách doanh nghiệp tham khảo, liên hệ chờ cập nhật và thiếu case đã xác minh làm sức thuyết phục flagship còn hạn chế |
| Hành trình và chuyển đổi | 20 | 8,5 | 17,0 | Tìm/lọc/lưu/so sánh, hai bước form, giữ ngữ cảnh và lỗi có nền tảng; chưa thử người lao động và người mua dịch vụ FDI thật |
| Mobile và tiếp cận | 10 | 8,0 | 8,0 | Kế thừa matrix/reflow/keyboard V16; một số nhãn 11–12px, chưa có kiểm thiết bị và AT đầy đủ |
| Bản địa hóa | 5 | 7,0 | 3,5 | Có VI/EN/ZH/KO và font; còn fallback tiếng Việt, chưa hiệu đính bản ngữ và thích nghi nội dung theo vai trò |
| Trạng thái và chuyển động | 5 | 8,0 | 4,0 | Có loading/error/success, pause, focus, reduced-motion trong nguồn; cần kiểm hành vi hiện tại trên thiết bị thật |
| Hệ thiết kế và khả năng bảo trì | 10 | 6,5 | 6,5 | Build tĩnh tái lập, tài liệu rõ; CSS chồng qua nhiều đời, public/CMS/locale chung khối mã lớn |
| **Tổng** | **100** | | **74,5 ≈ 75** | **Mục tiêu đề xuất ≥90/100 trên cùng rubric, kèm các điều kiện bắt buộc** |

Báo cáo V16 ghi **91,4/100 theo P1.0.0** cho mức hoàn thiện prototype trong phạm vi nội bộ, có nhiều tiêu chí về trạng thái và bàn giao. Bảng FQ1 tăng trọng tâm vào khác biệt thương hiệu, sức thuyết phục và khả năng duy trì chất lượng. **75 và 91,4 không dùng để kết luận website bị giảm chất lượng**; hai rubric và phạm vi bằng chứng khác nhau. Không sửa điểm lịch sử để khớp đánh giá mới.

## 2. Những gì đáng giữ và cần thay đổi

### Giữ làm nền

- Logo chính thức, navy/đỏ, định hướng con người và cách kết hợp serif với sans.
- Phân luồng doanh nghiệp/người tìm việc; thông tin lương, địa điểm, ca và quyền lợi rõ.
- Tìm việc không cần tài khoản; lưu/so sánh; trạng thái rỗng, lỗi và gửi thử trung thực.
- CMS có xem trước, căn ảnh và chỉnh ngôn ngữ; nguồn static có thể tái lập.
- Bốn ngôn ngữ trong kiến trúc, tài liệu evidence và cơ chế bảo vệ backend hiện có để đánh giá tái sử dụng.

### Phát hiện ưu tiên

| ID | Mức và loại | Bằng chứng | Ý nghĩa | Hành động |
| --- | --- | --- | --- | --- |
| F01 | Cao · thương hiệu | `app.js:21`, `:48–49`; hero và footer hiện tại | Giá trị đúng ngành nhưng chưa trả lời rõ “vì sao Minh Đức” | Chốt một luận điểm khác biệt có dữ kiện hỗ trợ; viết lại hero, lý do chọn, năng lực theo luận điểm đó |
| F02 | Cao · sức thuyết phục | `IMAGERY-GUIDE.md`; `app.js:22`; khối “Hồ sơ doanh nghiệp tham khảo” | Ảnh AI và tên Samsung/LG/Canon… có nhãn mẫu nhưng chưa tạo bằng chứng năng lực Minh Đức | Chụp ảnh thực tế; thay bằng case được phép công bố, quy trình thực và người chịu trách nhiệm. Nếu chưa có, dùng mô tả năng lực đã xác minh thay cho dải logo |
| F03 | Cao · nội dung B2B | `app.js:126–127`, `dich-vu.html` | Có trình khám phá dịch vụ và form, nhưng chưa đủ chiều sâu cho người mua đánh giá năng lực triển khai | Mỗi dịch vụ có đầu bài, phạm vi, đầu ra, địa bàn, cách phối hợp, case liên quan và CTA theo ngữ cảnh |
| F04 | Vừa · đọc trên mobile | `v16-measurements.json`: nút 12px, sort/compare 11px | Vùng bấm lớn là điểm tốt; chữ nhỏ vẫn cần kiểm với đối tượng lao động phổ thông | Body/input 16–18px, metadata có ý nghĩa thường ≥14px; kiểm ngôn ngữ dài và cỡ chữ hệ thống |
| F05 | Cao · hệ thiết kế | `build-static.mjs:5`: ghép 7 CSS gồm fonts và V12–V16; `site.css` có 151 `!important` | Tăng chi phí sửa và nguy cơ ảnh hưởng trang khác; không tự chứng minh có lỗi hiển thị | Tách token/base/component/page, quản lý cascade; refactor theo component có đối chiếu ảnh |
| F06 | Vừa · phân phối tài nguyên | Cả 7 trang được đọc nạp cùng 6 JS; `app.js` chứa public và CMS; homepage không có `srcset` | Có cơ hội giảm tải và chọn ảnh phù hợp màn hình; chưa có số đo để kết luận website chậm | Tách CMS/public/locale, ảnh nhiều kích thước, chỉ nạp phần cần; đo trước và sau |
| F07 | Cao · ngôn ngữ | `app.js:43`, `:157`; audit V16 thừa nhận chưa hiệu đính | Có bốn lựa chọn ngôn ngữ chưa đồng nghĩa trải nghiệm quốc tế hoàn chỉnh | Glossary, người duyệt bản ngữ, trạng thái bản dịch; xử lý fallback minh bạch |
| F08 | Điều kiện production | `prototype-v16.js:30–43`; `site-validation.ts:69`; `site-api.ts:56,59` | Form demo không lưu/gửi; backend giữ chế độ test và CV unscanned | Nối vận hành trong chặng riêng; kiểm server mode, quyền, lưu hồ sơ, quét CV và thông báo |
| F09 | Điều kiện production | `robots.txt`; `prerender.mjs:14–18`; `seo-preview.js` | Demo đang noindex; HTML chi tiết mặc định chưa cá thể hóa theo mọi ID/locale | Sinh/render nội dung và metadata đúng từng URL; kiểm indexability theo môi trường và vòng đời tin |
| F10 | Cao · bằng chứng nghiệm thu | README/audit V16 so với kế hoạch V17; browser không truy cập được | Chưa thể gắn điểm cho một release live xác định | Khóa source/release/URL, chụp và kiểm lại trên đúng bản |

Số đo nguồn mới: `app.js` **178.906 byte**, `site.css` **161.709 byte**; sáu JS nạp chung tổng **273.283 byte**, khoảng **94.019 byte khi gzip từng tệp**; CSS khoảng **35.184 byte gzip**. Đây là kích thước file và nén thử cục bộ, **không phải network transfer thực tế, LCP hay INP**. Không đặt mục tiêu tối ưu chỉ bằng số dòng hoặc số `!important`.

## 3. Định nghĩa flagship dành cho Minh Đức

Đề xuất định hướng **“Đối tác nhân lực công nghiệp, lấy con người làm trung tâm”**. Chất cao cấp đến từ bố cục tiết chế, thông tin chính xác, ảnh thật, độ nhất quán và sự dễ dùng. Người tìm việc phải cảm thấy gần gũi; người mua dịch vụ FDI phải thấy năng lực và tính tổ chức.

“Flagship siêu cao cấp” là mục tiêu sản phẩm/thương hiệu. Trong kế hoạch này, không coi một điểm thiết kế là chứng nhận quốc tế. Các chuẩn có thể kiểm gồm WCAG, Web Vitals, hướng dẫn tìm kiếm và yêu cầu an toàn phù hợp phạm vi.

### Tham chiếu ngành, không sao chép mỹ thuật

- **Randstad:** hai đường đi cho talent và clients rõ ràng; Minh Đức có thể học cách duy trì hai hành trình riêng. [Trang chính thức](https://www.randstad.com/).
- **Adecco:** trình bày các loại giải pháp cùng thông tin hỗ trợ người tìm việc; tham khảo cách trả lời câu hỏi chọn dịch vụ và xác thực kênh tuyển dụng. [Trang chính thức](https://www.adecco.com/en-us).
- **ManpowerGroup:** đưa vấn đề của doanh nghiệp, giải pháp và nghiên cứu ngành vào cùng hành trình. Minh Đức có thể phát triển nội dung hiểu thị trường lao động địa phương từ dữ liệu của mình. [Trang chính thức](https://www.manpowergroup.com/).

Đây là tham chiếu kiến trúc/nội dung từ website chính thức, không phải kết quả audit thị giác hay chứng minh hiệu quả chuyển đổi của các website đó.

## 4. Art direction và hệ thiết kế đề xuất

| Thành phần | Đặc tả khởi đầu | Điều kiện kiểm |
| --- | --- | --- |
| Màu | Navy chủ đạo, trắng ấm cho khoảng thở, đỏ thương hiệu cho hành động chính; màu trạng thái riêng | Token rõ vai trò; đo tương phản trên nền thật, kể cả ảnh/overlay |
| Typography | Giữ serif ở tiêu đề thương hiệu, sans cho nội dung/form/dữ liệu; H1 co giãn khoảng 36–72px tùy breakpoint | Tiếng Việt không vỡ dấu; ZH/KO có nhịp dòng riêng; body/input 16–18px; tránh ép line-break chung cho mọi locale |
| Bố cục | Grid 12 cột desktop, container khoảng 1.200–1.280px; tablet/mobile đổi cấu trúc theo tác vụ | Khoảng cách theo thang token; một điểm nhấn chính trong mỗi màn; chiều dài dòng đọc thoải mái |
| Ảnh | Một bộ ảnh cùng buổi chụp: con người, điều phối, hiện trường được phép, làm việc với khách | Hero có crop desktop/mobile, quyền sử dụng, alt và focal point; không dùng ảnh minh họa như bằng chứng khách hàng |
| Đồ họa riêng | Một sơ đồ quy trình mang ngôn ngữ thương hiệu; bản đồ địa bàn phục vụ nếu đã xác minh | Người xem hiểu quy trình/địa bàn nhanh; có bản văn bản tương đương |
| Motion | Chuyển trạng thái khoảng 160–220ms làm điểm xuất phát; dùng cho phản hồi, mở/đóng và đổi nội dung | Không cản đọc/bấm, có giảm chuyển động; pause cho nội dung tự chạy |
| Component | Header, menu mobile, selector ngôn ngữ, button, job card, service block, case, field, dialog, filter, toast | Đủ hover/focus/disabled/loading/error/empty/success; cùng ngôn ngữ thiết kế giữa trang chính và trang con |

Các con số trên là quyết định thiết kế đề xuất, cần chỉnh sau thử nghiệm. Kích thước nút **44–48px** là mục tiêu tiện dụng của dự án, cao hơn mức tối thiểu 24×24 CSS px với ngoại lệ của WCAG 2.2 AA. [W3C Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## 5. Kế hoạch theo trang và hành trình

### Trang chủ — thiết kế màn hình chủ đạo trước

Thứ tự nội dung đề xuất:

1. **Hero:** một lời hứa thương hiệu ngắn, một câu nêu rõ đối tượng/phạm vi và hai lối “Tìm việc” / “Giải pháp nhân lực”. Ảnh thật có chủ đích; ưu tiên hai đường đi đều dễ tìm.
2. **Bằng chứng ngắn:** thông tin đã xác minh về phạm vi, kinh nghiệm hoặc quy trình; mỗi dữ kiện có người duyệt và ngày cập nhật. Không bắt buộc đủ một số lượng KPI nếu thiếu dữ liệu.
3. **Nhu cầu doanh nghiệp:** 3 nhóm nhu cầu chính được Minh Đức xác nhận, liên kết đến trang dịch vụ có chiều sâu.
4. **Việc đang tuyển:** lọc nhanh theo địa bàn, 3 tin phù hợp, hiển thị lương/ca/địa điểm và trạng thái rõ.
5. **Một case nổi bật:** vấn đề → cách làm → kết quả đã kiểm chứng → bước tiếp theo. Khi chưa có quyền công bố case, dùng một quy trình thực được duyệt và ghi đúng bản chất.
6. **Con người và cách triển khai:** đội ngũ, trách nhiệm và điểm liên hệ thực.
7. **Kiến thức hữu ích:** 2–3 bài có tác giả/người duyệt và ngày cập nhật; nội dung giúp ra quyết định.
8. **Liên hệ:** một bước tiếp theo rõ cho từng nhóm; footer chứa thông tin chính thức và chính sách.

### Các trang còn lại

| Trang/luồng | Nâng cấp chính | Nghiệm thu sản phẩm |
| --- | --- | --- |
| Giải pháp doanh nghiệp | Trang tổng quan và template chi tiết dịch vụ; nêu đối tượng, đầu ra, phạm vi trách nhiệm, quy trình, địa bàn và case | Khách FDI giải thích lại được dịch vụ phù hợp và bước cần làm tiếp |
| Việc làm | Lọc theo vị trí/địa bàn/ca, lương dễ so sánh; phân biệt lương cơ bản và tổng thu nhập nếu dữ liệu có; giữ filter khi quay lại | Tìm được tin phù hợp, mở chi tiết, quay lại không mất lựa chọn |
| Chi tiết việc | Tóm tắt quyết định ở đầu, điều kiện và quyền lợi có cấu trúc; trạng thái hết tuyển rõ; CTA liên tục theo ngữ cảnh | Người lao động hiểu công việc, thu nhập và hồ sơ cần chuẩn bị trước khi ứng tuyển |
| Ứng tuyển | Giảm nhập liệu theo loại vị trí; giữ thông tin khi lỗi; feedback rõ; CV chỉ yêu cầu khi nghiệp vụ cần | Hoàn tất không trợ giúp; lỗi được hiểu và sửa; demo và thật có thông báo đúng thực trạng |
| Về Minh Đức | Lịch sử/năng lực thật, đội ngũ, cách triển khai, giá trị bằng hành động; ảnh thực | Có bằng chứng cho các lời khẳng định; người xem tìm được đơn vị và đầu mối liên hệ |
| Liên hệ B2B | Form ngắn, giữ dịch vụ đã chọn; gợi ý loại thông tin cần trao đổi; kênh và thời gian phản hồi do Minh Đức duyệt | Không mất ngữ cảnh; biết nội dung đã gửi, trạng thái và bước tiếp theo |
| Kiến thức và bài viết | Tách nội dung người tìm việc và nhà tuyển dụng; template đọc tốt, nội dung liên quan theo ý định | Bài có giá trị thực và đầu mối biên tập; đọc tốt trên mobile và bản dịch |
| CMS | Tách khỏi mã public, trường nhập có hướng dẫn, preview từng locale và viewport, trạng thái bản dịch/nội dung | Nhân viên sửa đúng mà không cần hiểu cấu trúc kỹ thuật; phát hiện thiếu dữ kiện trước xuất bản |

## 6. Nội dung cần chuẩn bị

Một đầu mối Minh Đức quản lý bảng nội dung với các cột: nội dung, nguồn, người duyệt, quyền công bố, ngôn ngữ, ngày cập nhật, trạng thái. Chuẩn bị từ đầu chặng thiết kế:

- Tên pháp nhân, mô tả đã duyệt, địa chỉ và kênh liên hệ chính thức.
- Phạm vi dịch vụ, địa bàn thực, quy trình triển khai và các cam kết có khả năng thực hiện.
- Khoảng 15–25 ảnh được chọn từ buổi chụp; danh sách quyền dùng cho từng ảnh.
- 2–3 case nếu được phép công bố; dữ kiện trước/sau có căn cứ. Thiếu case thì thay cấu trúc bằng bằng chứng quy trình thực.
- Tin tuyển dụng đủ dữ liệu để thử: nhiều địa điểm, ca, khoảng lương, tin dài, tin đóng, tin thiếu ảnh.
- Glossary VI/EN/ZH/KO và người hiệu đính từng ngôn ngữ. VI làm nguồn; quyết định locale nào mở production theo nội dung đã được duyệt.

Ảnh, case và phản hồi bản ngữ thường quyết định chất lượng cuối cùng; đưa chúng vào tiến độ chính, không để đến cuối mới thay placeholder.

## 7. Lộ trình đề xuất

### Chặng F — prototype flagship: khoảng 4–5 tuần làm việc

Giả định một người phụ trách product/visual design, một frontend engineer, QA và chủ nội dung tham gia đều; phản hồi trong 1–2 ngày. Đây là ước lượng sơ bộ theo quy mô hiện tại, không phải cam kết tiến độ hay báo giá. Chưa bao gồm thời gian chờ ảnh, case hoặc bản dịch ngoài kiểm soát.

| Mốc | Thời lượng | Việc và đầu ra | Người chính | Điều kiện chuyển mốc |
| --- | --- | --- | --- | --- |
| F0 — baseline | 2 ngày | Xác định source/URL V16 hay V17; inventory trang/state; ảnh trước sửa; danh sách nội dung; kiểm nguồn và gói bàn giao | Tech lead + chủ dự án | Release mẫu được định danh, source/preview khớp nhau |
| F1 — định vị và hệ thiết kế | 5 ngày | Chốt điểm khác biệt; cấu trúc nội dung; art direction; tokens; component mẫu; brief chụp và glossary | Product/visual designer + Minh Đức | Một hướng thiết kế thống nhất, dữ liệu cần dùng có chủ sở hữu |
| F2 — trang chủ chủ đạo | 3–4 ngày | Hero và trang chủ desktop/mobile, block dịch vụ/case/việc, micro-interaction mẫu | Designer + frontend | Chốt chất lượng ảnh, chữ, mật độ và CTA trước khi nhân rộng |
| F3 — hoàn thiện hệ trang | 6–8 ngày | Dịch vụ, jobs/detail/forms, About, insights, contact, CMS; các trạng thái; 4 locale; refactor component/CSS khi tích hợp | Frontend + designer + content | Hoàn tất tác vụ prototype; component dùng nhất quán; nội dung dài/thiếu/lỗi không phá bố cục |
| F4 — kiểm chứng và sửa | 3–5 ngày cho vòng đầu | Kiểm trình duyệt/thiết bị/AT, 5 người lao động + 3 người phụ trách doanh nghiệp, sửa vấn đề, chấm lại FQ1 | QA + designer + đại diện nghiệp vụ | Các điều kiện prototype bên dưới đạt, hạn chế còn lại có người phụ trách |

Tổng dự kiến: **19–24 ngày làm việc** cho chuỗi mốc này và một vòng kiểm/sửa đầu tiên. Chuẩn bị ảnh và bản dịch chạy đồng thời từ F0. Audit tiếp cận toàn phạm vi, bốn locale hoặc phát hiện từ người dùng có thể cần thêm vòng sửa và kiểm lại; khi đó kéo dài F4 đến khi đạt điều kiện, không giảm phạm vi nghiệm thu để giữ lịch. Cần cập nhật ước lượng nếu số trang/dịch vụ hoặc phạm vi CMS tăng.

### Chặng R — vận hành thật: khoảng 6–8 tuần tiếp theo

Kế thừa kế hoạch kỹ thuật trong `KE-HOACH-MINHDUCWEB-V17-TO-PRODUCTION.md`: **23–33 ngày công kỹ thuật + 15–20% dự phòng**, giả định một dev chính và QA bán thời gian, tích hợp sẵn có đã được xác minh. Rà lại ước lượng sau F0 và đánh giá nền tảng.

1. Xác minh hosting/auth/storage và tách prototype–staging–production; khóa hợp đồng dữ liệu.
2. Nối CMS với lưu nháp/xuất bản/khôi phục thật, quyền theo công việc và xử lý xung đột.
3. Nối form → lưu → xác nhận → hộp thư/người xử lý; chống gửi trùng và retry; pipeline CV nếu nằm trong phạm vi.
4. Nội dung/ảnh/bản dịch đã duyệt; render SEO đúng từng URL; analytics tối thiểu.
5. Kiểm E2E hosted, bảo vệ dữ liệu, hiệu năng, backup/restore và rollout nhóm nhỏ.

Với cách làm nối tiếp, dự trù khoảng **10–13 tuần làm việc** cho toàn bộ nâng cấp thiết kế sâu và mở vận hành, chưa tính chờ nội dung. Kế hoạch cũ dành 4–6 ngày cho duyệt/sửa prototype hiện hữu; 4–5 tuần ở đây dành cho **nâng chất lượng thương hiệu và thiết kế toàn hệ trang**, nên phạm vi khác.

## 8. Điều kiện nghiệm thu prototype flagship

| Khía cạnh | Điều kiện đề xuất và cách kiểm |
| --- | --- |
| Thương hiệu | Thống nhất một luận điểm định vị; ảnh/đồ họa có chỉ đạo riêng; cùng chất lượng trên trang chủ, trang con, form và CMS |
| Nội dung | Dữ kiện quan trọng có nguồn/người duyệt; mẫu được đánh dấu khi còn dùng trong prototype; danh sách thay thế trước production có chủ sở hữu |
| Tác vụ | 5/5 người lao động thử hoàn tất tìm việc → đọc → ứng tuyển demo; 3/3 đại diện B2B tìm đúng dịch vụ và gửi nhu cầu demo mà không cần người điều phối làm hộ. Đây là mục tiêu thử định tính nhỏ, không suy thành tỷ lệ thành công dân số |
| Mobile | Kiểm 320/390/768/1024/1440px và một Android Chrome/iPhone Safari thật; gồm bàn phím ảo, chiều cao thấp, CTA cố định và back navigation |
| Tiếp cận | Audit theo WCAG 2.2 AA cho toàn phạm vi phát hành: keyboard, focus, tên/ngữ nghĩa, tương phản, lỗi form, zoom/reflow, AT; không dùng điểm tự động thay cho kết luận tuân thủ |
| Ngôn ngữ | Kiểm cùng bốn hành trình trên locale trong phạm vi; bản dịch được duyệt; nội dung nguồn chưa dịch có cách hiển thị đã thống nhất; không trộn ngôn ngữ âm thầm |
| Trạng thái | Empty/error/loading/success/expired/offline ở nơi thích hợp; giữ dữ liệu khi lỗi; focus quay về đúng chỗ khi đóng dialog |
| Hệ thiết kế | Token/component có một nguồn chuẩn; không thêm tầng CSS theo số phiên bản; public không cần tải toàn bộ CMS; chụp đối chiếu regression |
| Điểm | Chấm lại bằng FQ1 với bằng chứng mới, mục tiêu ≥90/100 và không còn lỗi chặn tác vụ. Tổng điểm không được bù cho điều kiện bắt buộc chưa đạt |

Chuẩn tiếp cận được đối chiếu theo [WCAG 2.2 của W3C](https://www.w3.org/TR/WCAG22/). Phép thử text resize 200% kế thừa không thay thế kiểm reflow tương đương 320 CSS px và zoom thực tế. [Hướng dẫn Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## 9. Điều kiện mở vận hành và tiêu chuẩn kỹ thuật

- **Lưu và xử lý thật:** chỉ báo thành công sau khi server xác nhận; gửi lại không tạo trùng; người phụ trách thấy và xử lý được; lỗi thông báo không làm mất hồ sơ.
- **Quyền và CV:** kiểm quyền tại server, không lộ draft/hồ sơ/CV; tệp chờ quét hoặc bị từ chối không tải được; retention/xóa/backup có quy trình được duyệt. Backend hiện có là điểm xuất phát, chưa phải bằng chứng nghiệm thu security.
- **Khung security:** lập checklist áp dụng từ OWASP ASVS 5.0.0; chốt mức và phạm vi theo dữ liệu thực tế, cân nhắc Level 2 cho hệ nhận hồ sơ cá nhân. Báo cáo rõ mục đã kiểm và chưa kiểm; không tự nhận chứng nhận. [OWASP ASVS](https://asvs.owasp.org/).
- **Hiệu năng:** mục tiêu field p75, phân tách mobile/desktop: **LCP ≤2,5s; INP ≤200ms; CLS ≤0,1**. Trước launch đo lab trên cấu hình mobile/mạng ghi rõ, ít nhất ba lượt cho template chính; đo các tương tác đại diện. Sau launch dùng RUM khi đủ dữ liệu. Không dùng Lighthouse/TBT thay cho INP field. [Google Web Vitals](https://web.dev/articles/vitals).
- **Ngân sách tài nguyên ban đầu của dự án:** JS public ≤100kB gzip, CSS ≤40kB gzip, ảnh hero mobile khoảng ≤200kB, tổng tài nguyên tải lúc đầu khoảng ≤1MB trên landing đại diện. Đây là ngân sách đề xuất cần đo cùng chất lượng ảnh; không phải chuẩn quốc tế và không thay CWV. Các tệp hiện có có thể đã nằm dưới một số ngưỡng nhưng chưa chứng minh tốc độ thực tế.
- **SEO:** HTML ban đầu, title, canonical, hreflang và chia sẻ đúng từng tin/bài/locale; không mở index cho demo/draft; sitemap chỉ chứa trang có thể công bố. `JobPosting` chỉ cho trang chi tiết một việc thật, khớp nội dung hiển thị và xử lý tin hết hạn. [Google JobPosting](https://developers.google.com/search/docs/appearance/structured-data/job-posting).
- **Vận hành:** có người nhận sự cố, monitoring, diễn tập restore/rollback, hướng dẫn CMS và mục tiêu khôi phục được thống nhất trước launch.

Sau launch theo dõi view_job → start_application → stored_application, lead doanh nghiệp hợp lệ, lỗi gửi và thời gian phản hồi đầu tiên. Không đưa tên, số điện thoại hoặc CV vào analytics. Chốt mục tiêu tăng chuyển đổi sau khi có baseline; chưa hứa một tỷ lệ tăng khi chưa có dữ liệu.

## 10. Quyết định đầu tiên khi triển khai

**Bắt đầu ở F0, rồi hoàn thiện trang chủ chủ đạo và một trang chi tiết việc làm trên mobile.** Hai mẫu này kiểm chứng đồng thời chất lượng thương hiệu và khả năng sử dụng trước khi nhân rộng.

Trong tuần đầu cần chốt: nguồn/URL hiện hành, đầu mối duyệt, điểm khác biệt được chứng minh, dịch vụ và địa bàn thực, ảnh/case được phép dùng, ưu tiên ngôn ngữ, người xử lý lead và mức đầu tư nội dung. Không cần chốt công cụ AI/CRM mở rộng để bắt đầu phần thiết kế đã xác định.

## Phụ lục: hồ sơ kiểm chứng của lượt đánh giá này

- Lệnh kiểm: `node --test tests/site-api.test.ts tests/prototype-v16.test.mjs` — **10 pass, 0 fail**, Node v24.22.1. API tests dùng storage giả lập; không phải test end-to-end production.
- Static build trong thư mục tạm: **exit 0**; CSS, seed, 10 HTML trong public và template quản trị riêng khớp tổng **13 tệp**. Không sửa các tệp nguồn/đầu ra website đang có thay đổi sẵn.
- SHA-256 `public/app.js`: `86298a43e463c9280eaab141014cb88a6058946dfb4611eb28b705144584283f`.
- SHA-256 `public/site.css`: `a42cca39107c7b7e781495dd2d1abc52e7e127addab723cf236ce6565815cc15`.
- SHA-256 `public/index.html`: `e10aa68dc753f7b4575bfe9d30d11e80737a4cc4c6c2b4ddb71a0211d41f4fee`.
- SHA-256 `public/prototype-v16.js`: `b3e8dd9ce7321114ce4dacc5c9e7fa2df8ca11b3f2a7e52bbf6cf72c8f627585`.
- Bằng chứng kế thừa: `AUDIT-PROTOTYPE-V16.md`, `PROTOTYPE-SCOPE-V16.md`, `v16-matrix.json`, `v16-reflow.json`, `v16-measurements.json`, `v16-interactions.json` và hai ảnh đã nêu. Không gắn nhãn các kiểm tra này là lượt chạy mới.
- Tài liệu này bổ sung đánh giá chất lượng thương hiệu và kế hoạch thiết kế; giữ nguyên kế hoạch production và báo cáo lịch sử hiện có.
