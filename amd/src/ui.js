// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny Footnotes - DOM manipulation: insert, focus, renumber.
 *
 * v1 is LTR-only. RTL footnote support is intentionally deferred.
 *
 * Data model:
 *
 *   Inline marker:
 *     <sup id="fnref-{uuid}" class="tiny_footnotes-ref">
 *       <a href="#fn-{uuid}">N</a>
 *     </sup>
 *
 *   Footnotes block (always last child of editor body):
 *     <div class="tiny_footnotes"
 *          dir="ltr" style="direction:ltr;unicode-bidi:isolate"
 *          role="doc-endnotes">
 *       <hr>
 *       <ol dir="ltr">
 *         <li id="fn-{uuid}" dir="ltr">
 *           note text here
 *           <a class="tiny_footnotes-back" href="#fnref-{uuid}">^</a>
 *         </li>
 *       </ol>
 *     </div>
 *
 * Notes on the structure:
 *   - The inline `style` on the wrapper carries direction:ltr + unicode-bidi:
 *     isolate. Inline style beats any inherited CSS, and isolate creates a
 *     bidi isolation context so RTL ancestors can't bleed in.
 *   - The back-link sits at the END of each <li> (not the start) so arrow-key
 *     navigation through note text isn't blocked by a contenteditable=false
 *     element at the caret's natural entry point.
 *   - Note text lives as bare text in the <li> — wrapping spans get stripped
 *     when empty, which broke caret placement on insert.
 *
 * @module      tiny_footnotes/ui
 * @copyright   2026 Cursive Technology <info@cursivetechnology.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {cls} from './common';

const LTR_STYLE = 'direction:ltr;unicode-bidi:isolate';

const uuid = () => 'f' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

const ensureBlock = (editor) => {
    const body = editor.getBody();
    let block = body.querySelector(':scope > .' + cls.block);
    if (!block) {
        block = editor.dom.create('div', {
            'class': cls.block,
            'role': 'doc-endnotes',
            'dir': 'ltr',
            'style': LTR_STYLE,
        });
        block.innerHTML = '<hr><ol dir="ltr" style="' + LTR_STYLE + '"></ol>';
        body.appendChild(block);
    } else if (block !== body.lastElementChild) {
        body.appendChild(block);
    }
    return block;
};

export const insertFootnote = (editor) => {
    const id = uuid();

    editor.insertContent(
        `<sup id="fnref-${id}" class="${cls.ref}">` +
            `<a href="#fn-${id}">?</a>` +
        `</sup>`
    );

    const block = ensureBlock(editor);
    const ol = block.querySelector('ol');
    const li = editor.dom.create('li', {
        'id': 'fn-' + id,
        'dir': 'ltr',
        'style': LTR_STYLE,
    });
    // Seed text first (where the caret lands), back-link AFTER. This keeps
    // arrow-key navigation natural — the contenteditable=false back-link
    // sits at the trailing edge instead of blocking the caret's entry point.
    li.innerHTML =
        ` ` +
        `<a class="${cls.back}" href="#fnref-${id}" contenteditable="false" aria-label="Back to footnote reference">^</a>`;
    ol.appendChild(li);

    renumber(editor);

    // Caret at position 0 — right at the start of the leading text node,
    // BEFORE the back-link.
    const firstText = li.firstChild;
    if (firstText) {
        editor.selection.setCursorLocation(firstText, 0);
    } else {
        editor.selection.setCursorLocation(li, 0);
    }
    editor.focus();
};

export const focusNoteForRef = (editor, ref) => {
    const id = ref.id.replace(/^fnref-/, '');
    const li = editor.getBody().querySelector('#fn-' + id);
    if (!li) {
        return;
    }
    li.scrollIntoView({block: 'center', behavior: 'smooth'});
    const firstText = li.firstChild;
    if (firstText && firstText.nodeType === Node.TEXT_NODE) {
        editor.selection.setCursorLocation(firstText, firstText.textContent.length);
    } else {
        editor.selection.setCursorLocation(li, 0);
    }
    editor.focus();
};

export const renumber = (editor) => {
    const body = editor.getBody();
    const refs = Array.from(body.querySelectorAll('sup.' + cls.ref));
    let block = body.querySelector(':scope > .' + cls.block);

    if (refs.length === 0) {
        if (block) {
            block.remove();
        }
        return;
    }

    if (!block) {
        block = ensureBlock(editor);
    }
    const ol = block.querySelector('ol');
    if (!ol) {
        return;
    }

    const order = new Map();
    refs.forEach((ref, i) => {
        const id = ref.id.replace(/^fnref-/, '');
        order.set(id, i);
        const a = ref.querySelector('a');
        if (a && a.textContent !== String(i + 1)) {
            a.textContent = String(i + 1);
        }
    });

    Array.from(ol.children).forEach((li) => {
        const id = (li.id || '').replace(/^fn-/, '');
        if (!order.has(id)) {
            li.remove();
        }
    });

    // Sort, but ONLY appendChild if the order actually differs from current.
    // appendChild on an existing child reattaches the node, which resets the
    // caret to the start of that node — meaning every keystroke would jump
    // the cursor back to position 0. Idempotency is mandatory here.
    const items = Array.from(ol.children);
    const sorted = items.slice().sort((a, b) => {
        const ai = order.get(a.id.replace(/^fn-/, ''));
        const bi = order.get(b.id.replace(/^fn-/, ''));
        return ai - bi;
    });
    const orderChanged = items.some((li, i) => li !== sorted[i]);
    if (orderChanged) {
        sorted.forEach((li) => ol.appendChild(li));
    }

    if (block !== body.lastElementChild) {
        body.appendChild(block);
    }
};
