<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Vận hành Minh Đức V15 staging

## Phạm vi hiện tại

Chỉ dùng dữ liệu giả. Public vẫn noindex và ghi rõ ảnh AI/nội dung mẫu. Không có thông báo telesales, CRM hay Google Sheets. Một tài khoản owner quản trị nội dung và hộp thư; chưa cung cấp vai trò nhiều biên tập viên. Chưa tích hợp quét mã độc CV và chính sách lưu/xóa hồ sơ thật.

## Quản trị nội dung

1. Mở `/quan-tri.html` bằng tài khoản chủ Site. Sites thực hiện đăng nhập ChatGPT. API kiểm membership trên mỗi request; danh tính đầu tiên chỉ được cấp owner nếu khớp email owner cấu hình riêng trên máy chủ, sau đó quyền gắn với user ID ổn định. Client không chứa email bootstrap hoặc token cấp quyền.
2. Chỉnh nội dung và bấm lưu. Thanh trạng thái chỉ báo đã lưu khi API trả thành công. Nháp chưa được xuất bản không đổi API nội dung công khai.
3. Mở xem trước để đọc bản nháp, đúng ID công việc/bài viết. Người không có quyền preview sẽ nhận nội dung công khai.
4. Bấm xuất bản. Server kiểm cả revision nháp và revision công khai. Gửi lặp cùng phiên bản đang công khai không tạo thêm lần xuất bản.
5. Mở Lịch sử & khôi phục. Chọn snapshot, xác nhận để đổi bản công khai. Bản nháp vẫn giữ nguyên. Sau khôi phục, mở trang công khai và đối chiếu nội dung.

Khi gặp 409: xuất bản sao JSON trước nếu cần giữ thay đổi. Chọn Tải bản máy chủ, rồi hợp nhất thay đổi và lưu lại. Không tự ghi đè bản của phiên khác. Lỗi lưu không xóa dữ liệu đang mở; chưa rời trang khi thanh trạng thái báo lỗi.

## Form và CV thử

API form cần cookie phiên same-origin, Origin hợp lệ, mã idempotency và hai xác nhận. Server kiểm số điện thoại Việt Nam, độ dài, tin còn mở, lựa chọn ca/xe; vị trí nội bộ yêu cầu CV. PDF/DOC/DOCX tối đa5MB được kiểm phần đầu tệp, lưu vào R2 private dưới quarantine với trạng thái unscanned. Không diễn giải kiểm chữ ký thành quét mã độc.

Sau insert D1 thành công, API đọc lại record và trả receipt. UI đối soát thêm `/api/receipt`; endpoint này không trả tên, điện thoại hoặc CV. Cùng mã gửi, cùng phiên và payload trả cùng receipt; payload khác bị409. Intake giới hạn8 lượt/15phút theo IP dispatch hoặc cookie; API nội dung tối đa1,8MB sau encode để nằm trong giới hạn một giá trị D1.

Trong CMS, Hồ sơ & yêu cầu đọc100 bản gần nhất. Link CV qua API kiểm owner và trả attachment/octet-stream/nosniff/no-store; không cung cấp URL R2 công khai. Nhật ký chỉ lưu actor, hành động, mã subject và thời gian. Không đưa payload form vào console error.

## Source và phát hành

- Source public: `public/app.js`, `public/v15-runtime.js`, các file copy/style. `scripts/build-static.mjs` xuất HTML, CSS và seed JSON.
- Admin HTML sinh vào `private-pages/quan-tri.html`, chỉ trả từ route có kiểm quyền. Không được tạo lại `public/quan-tri.html`.
- API: `lib/site-api.ts`; validation: `lib/site-validation.ts`; schema: `db/schema.ts`.
- `ADMIN_BOOTSTRAP_EMAIL` là secret trên Sites; `SITE_MODE=staging`. Không ghi giá trị email vào repo, manifest hoặc browser.
- Migrations schema-only trong `drizzle/`; journal/snapshot đã áp dụng phải giữ nguyên. Chỉ append migration mới.
- Dùng Sites source helper/build helper và giữ cùng project ID/audience public. Kiểm `node --test tests/site-api.test.ts`, TypeScript, cú pháp JS; build/package từ cùng commit đã push.
- Giữ V14 tại commit `c7c76f58b4439a21417f466098d1f5b4500f6478`, Site version3. Rollback build bằng phiên bản Sites đã lưu; schema V15 bổ sung nên để nguyên dữ liệu. Việc rollback hosted build này chưa diễn tập.

## Checklist trước hồ sơ thật

Xác minh tư cách/thông tin doanh nghiệp, hotline, ảnh/quyền/case studies và tin tuyển dụng. Chốt chủ thể xử lý dữ liệu, mục đích, consent, retention/xóa, liên hệ và backup. Tích hợp quét CV và chỉ mở tải phù hợp chính sách. Nghiệm thu owner SSO, người không có quyền, publish/restore hosted và fault injection sau commit. Đo lab đại diện, zoom/AT, thiết bị thật; hiệu đính các bản dịch. Chỉ bỏ noindex khi phạm vi vận hành đã sẵn sàng.
