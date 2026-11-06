<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# Audit Minh Đức — $10K Checklist (80 points)

Scores here are **expert judgment of the local prototype**, not Lighthouse, conversion rate or production assurance. V10 was last delivered with 60/80 reported for V9, with improved imagery but AI-only. Numbers below are a deliberately conservative reassessment.

| Criterion | V10 baseline | V11 local review | Evidence and remaining gaps |
|---|---:|---:|---|
| Point of view | 7 | 8 | Clearer FDI supplier / job seeker hierarchy; verified brand stories still needed |
| Typography | 7 | 8 | Vietnamese headline rhythm, clear type scale; external webfont may fail offline |
| Color | 8 | 9 | Six named brand tokens, red action focus |
| Hierarchy | 8 | 9 | Hero title, CTA/search and spacing refinements; dense cards remain |
| Imagery | 7 | 7 | Coherent WebP illustration set, no actual company photography |
| Motion | 8 | 8 | Controlled marquee and reduced motion; no motion metrics |
| Mobile | 8 | 9 | Reworked single-column CTA and touch targets; screenshots at 390/768px |
| Polish | 7 | 7 | Static checks pass, but backend/performance/security not production tested |
| **Total** | **60/80** | **65/80** | **Design-only subjective score, not a shipping certificate** |

### Important
The V10 baseline is re-scored against the same eight rubric headings to permit a consistent comparison; neither score is a certified measurement. Authentic imagery and backend production checks gate the top band.

### Engineering verification
- JS syntax check via `node --check app.js` and `node --check demo-translations.js`.
- Link/asset existence audit across all pages, image dimension verification, responsive screenshot 375, 768, 1440 when browser available.
- Test menu, search, application fields, language demos, no CJK overflow, keyboard navigation.
- Note: CMS stores in localStorage; no actual payment, ATS, real employer claims or server CV upload.
