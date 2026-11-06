# Prototype UI/UX review — secondary Site

Baseline: secondary source `7dfac33`, private review Site `appgprj_6aeb62b7473c81918b158ac079784e38`. The live URL verified through Sites is https://minh-duc-stgg.kenbinhoainam.chatgpt.site. The older URL in AGENTS.md is not the current destination. Main Site publication is not authorized for this candidate.

## Final plan after three planning reviews

Prioritize workers finding and understanding a job, and employers choosing a service and requesting advice. Preserve current features, CMS-controlled company facts, four languages, prototype disclosures and automatic selected-branch maps.

1. Bring mobile search before the hero image; make audience choices task-oriented.
2. Clarify pay/location/job conditions and the primary action. Keep optional tools secondary.
3. Put service advice earlier; preserve selected-service context. Support exact branch links.
4. Apply a consistent visual hierarchy across navigation, listings, forms, editorial pages and demo portals.
5. Validate 320/390/768/1024/1440/1920/3840 widths, keyboard states, locale changes, map selection, main journeys and existing regressions.

Tradeoffs: retain the current framework and feature loading for this release; do not add another TV mode after the earlier rollback. Use scoped styles and restrained large-screen layout. Performance targets proposed by planners require measurement and are not claimed as passes. Third-party map loading remains automatic as requested.

Implementation is divided into 12 bounded worker assignments, at most three concurrent, followed by eight independent review assignments. The primary owns integration, browser checks and secondary-only publication.

## Validation

Completed 3 planning, 12 implementation and 8 independent review agents, in batches of at most three concurrent subagents. Final source passed all 289 Node tests, including four new locale-specific mobile-dock regressions.

Chrome verification on the completed UI:

- Nine public page types at 320, 390, 768, 1024, 1440, 1920 and 3840 CSS pixels: 63 checks, no horizontal overflow, JavaScript errors or duplicate visible H1s.
- Automated axe WCAG A/AA checks on seven principal pages at 390 and 1440: 14 scans, no reported violations. This is automated evidence, not an accessibility certification.
- Worker search, mobile menu/Escape, service-to-contact context, editable brief/back, branch deep links/automatic map/fallback, comparison, assistant close/focus state, and four locale rerenders passed browser smoke checks.
- At 390×844, the first job card begins around 677px; optional natural search, career tools and assistant entries follow results, outside the filter form. The initial mobile form has no nested forms or duplicated portal link.

Independent review found and verified fixes for:

- Service context lost from the mobile dock, and a legacy locale rewrite expanding planner fragments into stale URLs. Consultation now follows the current service; the planner remains a page fragment. Browser checks passed for all four locales.
- Duplicate floating assistance covering home area shortcuts and article text on phones. Those pages now retain labeled inline assistance, with the floating duplicate suppressed on phones. Area hit tests passed at 320×844, 390×844 and 390×900.
- An open menu retaining its state after switching to desktop width. Crossing 1280px now clears the mobile state, restoring the floating controls.
- Keyboard-focused form controls covered by the dock. Focus scrolling now uses the visible viewport, header and dock/tray bounds. Independent rechecks passed at 320×568, 390×844 and 667×375.
- The assistant conversation collapsing near a short-screen breakpoint. Compact layouts scroll the body beneath a visible header. Independent checks at 320×521, 360×700 and 360×701 verified visible chat, reachable prompts/compose and correct Close/Escape focus return.

Other reviews verified candidate and employer demo states, source URL allowlists, automatic branch map requests, locale rerenders, observer settling, private CMS isolation and unchanged company seed/backend/configuration. Google requests in the independent map review were intercepted to verify timing/count; this does not measure Google availability or performance.

The official Sites production build passed on the final reviewed source. Existing secondary owner-only access was reverified before publication. No main-Site deployment is authorized for this candidate.
