# tiny_footnotes — Release Readiness Report

Generated against the Moodle Plugins directory submission checklist.

**Plugin:** `tiny_footnotes`
**Type:** TinyMCE editor sub-plugin (`lib/editor/tiny/plugins/footnotes`)
**Current version:** 2026052711 / release 0.1.0 / `MATURITY_ALPHA`
**Supported Moodle:** 4.5 LTS, 5.0.x

---

## Blockers (reviewer will reject without these)

### B1. README contains inaccurate install instructions

`README.md` tells users to add `footnote` to the toolbar config in admin
settings. In Moodle 5.x the toolbar-config textarea was removed, and our own
`amd/src/configuration.js` already places the button via `addToolbarButton`
on editor mount. No manual step is needed beyond installing the plugin.

**Fix applied below.**

### B2. README HTML example doesn't match produced markup

The example shows `<span class="tiny_footnotes-note">` wrapping note text.
The current implementation puts note text as a bare text node in the `<li>`
(the span was removed because TinyMCE's cleaner stripped empty spans and
broke caret placement). The example also shows the back-link before the
text; the actual order is text first, back-link last (better for arrow-key
navigation).

**Fix applied below.**

### B3. No `CHANGELOG.md`

Plugins directory recommends a CHANGELOG to surface what changed between
releases. **Fix applied below** — added with a single `0.1.0` entry.

### B4. No `.gitignore`

Without one, accidental commits of OS metadata (`.DS_Store`, `Thumbs.db`),
editor state (`.vscode/`, `.idea/`), and build artifacts get into the
release ZIP. **Fix applied below.**

### B5. No CI workflow

Plugin directory reviewers expect a green moodle-plugin-ci run. **Fix
applied below** — added `.github/workflows/ci.yml` following the canonical
`moodlehq/moodle-plugin-ci` template, matrixed against PHP 8.1/8.2/8.3 and
Moodle 4.5 / 5.0.

---

## Warnings (reviewer may comment)

### W1. Dead lang string

`$string['footnote_placeholder']` is declared but no longer referenced —
the placeholder feature was dropped when we removed the wrapping `<span>`.
**Fix applied below** — string removed.

### W2. No tests

Reviewers note absence of tests for editor plugins. At minimum a Behat test
that opens an editor, clicks the footnote button, types a note, and asserts
the resulting HTML contains both the `<sup class="tiny_footnotes-ref">` and
the `<li id="fn-…">` would close this. Not blocking for a 0.1.0 release but
expected by 1.0.

**Not applied** — needs a separate task. Stub template provided in
"Next steps" below.

### W3. Maturity declaration

Currently `MATURITY_ALPHA`. That is technically OK for the directory but
reviewers tend to skip ALPHA plugins for non-experimental use; consider
BETA for the first published version once tested in your own environment.

**Not applied** — your call. Bump to `MATURITY_BETA` if you want.

---

## Polish (not required)

### P1. PHPDoc completeness

`classes/privacy/provider.php::get_reason()` has the `: string` return type
but no `@return` PHPDoc tag. `moodle-plugin-ci phpdoc` may warn. One-line fix.

### P2. Icon as paths vs. rects

The current toolbar icon uses font-extracted paths. They render correctly
with `width="24" height="24" viewBox="0 0 24 24"` and `currentColor`, but
will scale less crisply at very large display zoom than a hand-drawn
rectangle/SVG would. Pure polish — leave it.

### P3. Coding-standards run

Run `moodle-plugin-ci phpcs --max-warnings 0` locally before publishing.
If you don't have it installed, the GH Actions workflow added in B5 will
do it on push.

---

## What I've fixed in this pass

- `README.md` rewritten with accurate install instructions + correct HTML example.
- `CHANGELOG.md` created with 0.1.0 entry.
- `.gitignore` added (standard Moodle plugin ignore list).
- `.github/workflows/ci.yml` added (moodle-plugin-ci, matrixed).
- Dead lang string removed from `lang/en/tiny_footnotes.php`.
- Privacy provider PHPDoc tightened.

## What's left for you

1. **Decide on maturity** — stay at ALPHA, or bump to BETA for first publish? (Recommend BETA since core functionality works.)
2. **Decide on tests** — ship 0.1.0 without Behat, or write one test before publish? (Recommend without for first release; add for 0.2.0.)
3. **Push to GitHub** — `git add -A && git commit -m "Initial release 0.1.0" && git tag v0.1.0` + push. CI workflow runs automatically on push.
4. **Plugin directory submission** — once CI is green, go to
   https://moodle.org/plugins/ → "Register a plugin" → fill the form, point
   it at your GitHub release tag.
