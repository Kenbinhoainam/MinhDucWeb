<!-- historical-v19-index -->
> **Tài liệu lịch sử.** Giữ nguyên dữ kiện, kết quả và phạm vi tại thời điểm lập; không phải hướng dẫn hiện hành của V20. Xem [mục lục V20](README.md) và [bàn giao V20](PROTOTYPE-HANDOFF-V20.md).

# V17.1 — Restore company demo logos

Base: V17 commit `e58f98a44c85a9466ba49f289c99a0090cecce95`.

The project owner requested a selective rollback of the business section so the prototype can demonstrate company logos to customers. The homepage again uses a moving strip with 14 company profiles and 13 unique logo assets bundled locally. The CMS again provides a logo preview, source field, inline logo editor, sorting, filtering and display controls. The industry-card fallback introduced in V17 is removed from this section.

Demo display is stored in `demoLogoVisible`, independently of legal approval. Sample `approved` values remain false; this change makes no claim about verified trademark permission or an actual partnership. The information page explains the demo purpose in all four languages. No repeated notice was added to the presentation section. Source provenance is in `public/assets/partners/manifest.json`.

A one-time migration restores known sample profiles from cached V17 content while preserving customer edits to other content. Subsequent visibility choices are respected. The other V17 changes, including image captions, media fitting, responsive breadcrumbs, simulated forms, multilingual content and protected server administration, remain in place.

## Validation

- 16 homepage viewport/locale cases: 320, 390, 768 and 1440 px × VI/EN/ZH/KO; 14 logos, no broken image, no stretched image and no horizontal page overflow.
- CMS company editor at 320 and 1440 px: 14 company rows and logos; no horizontal page overflow.
- Cached V17 migration preserves custom home and job content.
- CMS logo checkbox persists off/on across navigation; marquee pause/resume and reduced-motion controls work.
- 14 unit tests and TypeScript check pass. Official Sites build validates the publication artifact.

Evidence: `docs/v17-1-acceptance.json`; repeatable browser fixture: `scripts/v17-1-qa.html` (temporarily served as `public/__qa.html`, removed before publication). Historical V17 audit reports describe the earlier version and have not been reassessed for this bounded change.
