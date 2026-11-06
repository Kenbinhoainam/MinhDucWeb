# Local typefaces

Noto Sans and Noto Serif are retained from the preceding version. License notices are alongside the font files.

V14 refreshes the Chinese and Korean 400/600/700 subsets from the public Google Fonts repository:

- https://github.com/google/fonts/tree/main/ofl/notosanssc
- https://github.com/google/fonts/tree/main/ofl/notosanskr

The complete public variable font binaries were downloaded, then subset and instantiated locally with fontTools. No project text was transmitted to the font provider for this process. Coverage includes every Chinese/Hangul character used by the bundled demo copy, plus the earlier subset's characters and available punctuation. Coverage was checked for all three weights on 31 October 2026.

These subsets are optimized for the current demo. New CMS content can use system fallback for characters outside this set; production should use a complete language font or a maintained Unicode-range subset pipeline.
