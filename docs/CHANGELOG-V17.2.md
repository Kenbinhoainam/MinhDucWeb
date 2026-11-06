<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# V17.2 — Company presentation refinement

Base: V17.1 commit `a873e3973fd92ad571c5d4de7b5429a1f0cff5ad`.

## Problem and behavior

The inline image editor rejected its own bundled logo path (`assets/partners/samsung.svg`), leaving the dialog open with an invalid-source message. The editor now accepts safe nested files under `assets/` while continuing to reject traversal, embedded credentials and unsupported URL protocols. Saving a logo preserves other unsaved form fields and updates both the profile preview and its list thumbnail.

The homepage now offers an optional “View all companies” disclosure in VI/EN/ZH/KO. It shows all 14 visible profiles in a responsive grid with company names. Opening it pauses the moving strip. Native details/summary supplies keyboard behavior; reduced-motion controls remain effective. The public section is omitted for zero visible profiles, and one profile has no redundant pause/disclosure control.

A failed company logo falls back to its company name within the existing space, including the grid and CMS thumbnails. It does not insert the generic full-image error panel into the narrow logo strip. Other image recovery behavior remains unchanged.

The owner’s demo-display decision and all V17.1 logo assets are retained. This iteration does not change permission records, the form simulation boundary, protected server administration or the Site audience.

## Verification

Evidence and exact pass/fail results are in `docs/v17-2-acceptance.json`. Browser fixture: `scripts/v17-2-qa.html`, temporarily served as `public/__qa.html` and removed before packaging. The scope covers viewport/locale combinations, zero/one/multiple profiles, missing assets, long names, CMS logo editing and keyboard controls. Unit coverage also tests the actual application validator on supported and rejected paths. Historical Flagship scores have not been reassessed for this bounded iteration.
