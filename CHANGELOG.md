# Changelog

All notable changes to this plugin are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-05-28

Initial release.

### Added

- Toolbar button and **Insert → Footnote** menu item.
- Inline `<sup>` reference at the caret, with stable UUID-based linking to
  a matching `<li>` in a `<div class="tiny_footnotes">` block at the bottom
  of the editor content.
- Auto-renumbering in document order — `[1]` is always the north-most
  reference regardless of insertion order. Idempotent; doesn't reset the
  caret while typing.
- Click on an existing reference jumps to (and focuses) the matching note.
- Backspace / Delete on a reference cleans up the matching `<li>` orphan.
- LTR enforcement on the footnotes block (HTML `dir` + inline
  `direction:ltr; unicode-bidi:isolate`) so notes don't render reversed
  when the editor body is RTL.
- Custom toolbar icon (F¹) rendered with `currentColor` so it follows the
  toolbar theme.
- Null privacy provider (plugin stores no personal data).
- Supported on Moodle 4.5 LTS and 5.0.
