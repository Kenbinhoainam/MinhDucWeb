<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Phạm vi Prototype V17

Giữ nguyên scope/rubric P1.0.0 của V16; không có N/A và không giảm mẫu số sau khi xem điểm.

```json
{
  "audiences": [
    "Lao động phổ thông",
    "Đại diện nhân sự doanh nghiệp FDI",
    "Nhân viên biên tập CMS demo"
  ],
  "primary_tasks": [
    "T01 tìm/lọc/so sánh việc và mở chi tiết",
    "T02 đọc điều kiện và ứng tuyển demo, sửa lỗi",
    "T03 hiểu dịch vụ và gửi nhu cầu demo",
    "T04 sửa Home/ảnh/tin/bản dịch, lưu, preview và reset nội dung",
    "T05 tìm và đọc cẩm nang"
  ],
  "templates": [
    "Home",
    "About",
    "Services",
    "Worker/internal lists",
    "Worker/internal detail and application",
    "Knowledge hub/article",
    "Two-step contact",
    "CMS overview/Home/job/post/partner/settings",
    "Dialogs and empty/error/success states"
  ],
  "viewports": [
    "320",
    "390",
    "768",
    "1440",
    "CSS text200% at320/640"
  ],
  "locales": [
    "vi",
    "en",
    "zh",
    "ko",
    "CMS chrome vi; content preview vi/en/zh/ko"
  ],
  "exclusions": [],
  "simulation_limits": "Đánh giá UI và hành vi trong phạm vi prototype; ranh giới kết nối của mỗi snapshot ghi trong evidence. Không gồm backend production, uptime, DB, email/Sheets, tự dịch/AI thật, field CWV, SEO indexing hoặc doanh thu. CMS trong phạm vi demo. Expert review, không có user test; CSS text-resize không thay kiểm thiết bị/AT thực."
}
```

Bổ sung mẫu rủi ro trong cùng phạm vi: trang thông tin demo4 locale, ảnh dọc/ngang, import phê duyệt logo giả, nội bộ CV tiếng Anh, dialog390×480. Tính điểm không gồm xác nhận quyền thật hoặc quản trị production.
