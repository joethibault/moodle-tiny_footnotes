# Footnotes for TinyMCE in Moodle (`tiny_footnotes`)

A free, GPL-licensed alternative to TinyMCE's premium Footnotes plugin, packaged
as a Moodle TinyMCE editor sub-plugin.

Adds a toolbar button and **Insert → Footnote** menu item that:

- Inserts a numeric superscript reference at the caret (`<sup>1</sup>`).
- Appends a matching entry to a footnotes block (`<div class="tiny_footnotes">…</div>`)
  at the bottom of the editor content.
- Auto-renumbers all references in document order — `1` is always the
  north-most reference, regardless of insertion order.
- Lets you edit each note inline at the bottom (no modal dialog).
- Cleans up orphaned notes when their reference is deleted.

## Screenshot

After insert, a `[1]` superscript appears at the caret and a corresponding
`1. <note text> ^` row is added to the footnotes section at the bottom of the
editor content.

## Requirements

- Moodle 4.5 LTS or later (supported branches: 4.5, 5.0).
- TinyMCE editor enabled (the default in Moodle 4.5+).

## Install

### From the Moodle Plugins directory

Site administration → Plugins → Install plugins → Search → "Footnotes".

### From source

Drop this directory into `lib/editor/tiny/plugins/footnotes` inside your Moodle
codebase, then visit **Site administration → Notifications** (or run
`php admin/cli/upgrade.php`) to complete installation.

The toolbar button and Insert-menu item appear automatically — no admin
configuration required.

## HTML produced

```html
<p>Body text with a reference<sup id="fnref-fabc1234" class="tiny_footnotes-ref"><a href="#fn-fabc1234">1</a></sup>.</p>

<div class="tiny_footnotes" dir="ltr" role="doc-endnotes" style="direction:ltr;unicode-bidi:isolate">
  <hr>
  <ol dir="ltr" style="direction:ltr;unicode-bidi:isolate">
    <li id="fn-fabc1234" dir="ltr" style="direction:ltr;unicode-bidi:isolate">
      Footnote text<a class="tiny_footnotes-back" href="#fnref-fabc1234" contenteditable="false">^</a>
    </li>
  </ol>
</div>
```

The inline `direction:ltr` and `unicode-bidi:isolate` are deliberate — they
keep the footnotes section LTR even when the surrounding editor body is set
to RTL. RTL footnote support is a future enhancement.

## Development

The canonical sources are in `amd/src/`. Pre-built AMD modules ship in
`amd/build/` so the plugin works out of the box without running grunt.

If you edit `amd/src/*.js`, rebuild with:

```bash
cd /path/to/moodle
npx grunt amd --root=lib/editor/tiny/plugins/footnotes
```

### Running checks locally

```bash
# From the moodle-plugin-ci install (https://github.com/moodlehq/moodle-plugin-ci)
moodle-plugin-ci phpcs   --max-warnings 0
moodle-plugin-ci validate
moodle-plugin-ci phpdoc  --max-warnings 0
moodle-plugin-ci phplint
moodle-plugin-ci grunt   --max-lint-warnings 0
```

The same suite runs automatically via `.github/workflows/ci.yml` on every push.

## License

GPL-3.0-or-later. See `LICENSE`.
