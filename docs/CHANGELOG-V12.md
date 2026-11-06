<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Changelog — Minh Đức Flagship V12

## Hoàn thành trong bản nâng cấp

| Nhóm | Thay đổi | File |
|---|---|---|
| Design system | 3-tier tokens, typography Noto, contrast-first action colors | `flagship-v12.css`, `styles.css` |
| Home B2B/B2C | Hero hai persona, CTA theo nhu cầu | `app.js` |
| Staffing | Form phác thảo nhu cầu doanh nghiệp và kết quả minh họa | `app.js`, `flagship-v12.css` |
| Quick apply | 2-step micro-form cho worker, vẫn giữ CV cho internal | `app.js`, `flagship-v12.css` |
| Gallery | Không lặp URL ảnh trên home mặc định; thêm 5 ảnh minh họa SVG | `app.js`, `assets/editorial-*.svg` |
| Motion | Cards hover, KPI reveal, reduced-motion, 48px touch | `flagship-v12.css` |
| Multi-language | Bản dịch UI V12 VI / EN / ZH / KO; CMS sử dụng cơ chế fallback VI cũ | `app.js` |
| CMS guardrail | Bộ đếm/giới hạn ký tự trong form editor, responsive | `app.js`, `flagship-v12.css` |
| SEO | Sinh schema JSON-LD có điều kiện xác minh; giữ noindex demo | `app.js` |
| Server | MIME WebP/SVG, static manifest phù hợp | `server.mjs` |
| Version | Nhãn V12 và tài liệu chạy thử | `*.html`, `START-WINDOWS.bat`, `README-V12.md` |

## Chưa triển khai, phải xử lý trước khi go-live

- Backend ứng tuyển, lưu trữ/CRM/Google Sheets và phân quyền CMS thực.
- Hệ thống đối soát thời gian cung ứng/ước tính theo năng lực thực tế.
- Kiểm thử tiêu chuẩn WCAG toàn hệ thống, Lighthouse/Core Web Vitals thực địa, chứng nhận hiệu năng.
- Gộp và xóa toàn bộ CSS patch cũ để thay bằng một `styles.css` duy nhất (cần regression đa trang).
- Quy trình SEO nội dung thật, sitemap, canonical, schema dữ liệu được duyệt và chuyển `robots` production.
