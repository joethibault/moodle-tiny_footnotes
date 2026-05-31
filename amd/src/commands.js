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
 * Tiny Footnotes - toolbar button, menu item, and editor event wiring.
 *
 * @module      tiny_footnotes/commands
 * @copyright   2026 Cursive Technology <info@cursivetechnology.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';

import {component, buttonName, menuItemName, icon, cls} from './common';
import {insertFootnote, focusNoteForRef, renumber} from './ui';

// User-provided F¹ glyph. Cleanup vs. the source file: stripped the white
// background rect (so dark themes work) and swapped hardcoded #000000 for
// currentColor (so it follows the toolbar's text color). Otherwise
// unchanged — original viewBox preserved so the glyph sits where the
// designer intended.
const iconSvg =
    '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    // eslint-disable-next-line max-len
    '<path fill="currentColor" fill-rule="nonzero" d="m7.5290446 16.697498q-0.09375 -0.015625 0.09375 0.015625q0.203125 0.015625 0.46875048 0.0625q0.28125 0.046875 0.6875 0.09375l-0.109375 0.953125q-0.609375 -0.046875 -1.2031255 -0.0625q-0.59375 0 -1.015625 0q-0.390625 0 -0.890625 0q-0.5 0.015625 -1.171875 0.078125l0.09375 -0.984375q0.375 -0.03125 0.609375 -0.0625q0.234375 -0.046875 0.390625 -0.0625q0.171875 -0.015625 0.0625 -0.015625q0 0 0.015625 -0.25q0.03125 -0.25 0.046875 -0.875q0.03125 -0.625 0.046875 -1.734375q0.015625 -1.125 0.015625 -2.59375q-0.265625 0.015625 -0.65625 0.015625q-0.375 0 -0.375 0l-0.125 -0.453125l0.484375 -0.859375q0 0 0.265625 0.03125q0.265625 0.015625 0.390625 0.03125q0 -0.875 0.375 -1.703125q0.375 -0.8437495 0.9375 -1.3749995q0.5625 -0.53125 1.1406255 -0.828125q0.578125 -0.296875 1.03125 -0.421875q0.46875 -0.125 0.625 -0.125q0.1875 0 0.40625 0.21875q0.21875 0.21875 0.390625 0.515625q0.1875 0.28125 0.28125 0.703125l-0.421875 0.578125q-0.375 -0.203125 -0.71875 -0.296875q-0.34375 -0.09375 -0.734375 -0.09375q-0.390625 0 -0.75 0.21875q-0.34375048 0.203125 -0.5937505 0.8593745q-0.25 0.640625 -0.25 1.75q0.7500005 0 1.3750005 0q0.625 -0.015625 0.625 -0.015625l0.1875 0.46875l-0.65625 0.84375q0 0 -0.46875 -0.015625q-0.46875048 -0.03125 -1.0625005 -0.046875q0 1.4375 0.015625 2.53125q0.03125 1.09375 0.046875 1.71875q0.03125 0.625 0.0625 0.90625q0.03125 0.265625 0.03125 0.28125zm7.4310155 -0.65625l0.375 0.953125q-0.75 0.484375 -1.28125 0.703125q-0.53125 0.203125 -1.078125 0.203125q-0.765625 0 -1.34375 -0.390625q-0.578125 -0.40625 -0.578125 -1.453125q0 0 0 -0.390625q0.015625 -0.390625 0.015625 -0.953125q0 -0.578125 0 -1.09375q0 -0.796875 -0.015625 -1.453125q0 -0.671875 0 -0.890625q-0.25 0 -0.609375 0q-0.359375 0 -0.359375 0l-0.125 -0.453125l0.484375 -0.859375q0 0 0.25 0.03125q0.25 0.03125 0.3125 0.03125q0 -0.046875 -0.015625 -0.375q-0.015625 -0.34375 -0.03125 -0.640625q-0.015625 -0.296875 -0.015625 -0.296875l1.265625 -1.1249995l0.59375 0.28125q0 0 -0.015625 0.42187452q0 0.421875 -0.015625 0.9375q0 0.5 0 0.796875q0.84375 0 1.5625 0q0.71875 -0.015625 0.71875 -0.015625l0.203125 0.484375l-0.765625 0.859375q0 0 -0.5 -0.03125q-0.5 -0.046875 -1.21875 -0.0625l0 1.890625q0 0.96875 0 1.59375q0.015625 0.625 0.046875 1.265625q0.015625 0.265625 0.171875 0.375q0.171875 0.109375 0.421875 0.109375q0.328125 0 0.6875 -0.125q0.375 -0.125 0.859375 -0.328125z"/>' +
    // eslint-disable-next-line max-len
    '<path fill="currentColor" fill-rule="nonzero" d="m18.082695 4.259999l0.359375 0.1875q0 0 -0.015625 0.90625q-0.015625 0.890625 -0.015625 2.609375q0 1.1406245 0.015625 1.7656245q0.015625 0.625 0.03125 0.875q0.03125 0.25 0.03125 0.25q0 0.109375 0.1875 0.171875q0.1875 0.046875 0.796875 0.171875l-0.0625 0.59375q-0.78125 -0.03125 -1.5625 -0.03125q-0.46875 0 -0.953125 0q-0.46875 0.015625 -1.03125 0.03125l-0.0625 -0.59375q0.46875 -0.09375 0.734375 -0.140625q0.28125 -0.0625 0.421875 -0.109375q0.140625 -0.0625 0.140625 -0.09375q0 0 0.015625 -0.234375q0.015625 -0.25 0.03125 -0.875q0.015625 -0.640625 0.015625 -1.7812495q0 -0.859375 -0.015625 -1.390625q0 -0.546875 -0.015625 -0.8125q-0.015625 -0.28125 -0.015625 -0.328125q0 -0.046875 0 -0.046875l-1.296875 -0.234375l-0.0625 -0.65625q0.90625 0 1.4375 -0.0625q0.546875 -0.078125 0.890625 -0.171875z"/>' +
    '</svg>';

export const getSetup = async() => {
    const [buttonLabel, menuItemLabel] = await Promise.all([
        getString('button_footnote', component),
        getString('menuitem_footnote', component),
    ]);

    return (editor) => {
        // Register the custom icon TinyMCE will draw on the button.
        editor.ui.registry.addIcon(icon, iconSvg);

        editor.ui.registry.addButton(buttonName, {
            icon,
            tooltip: buttonLabel,
            onAction: () => insertFootnote(editor),
        });

        editor.ui.registry.addMenuItem(menuItemName, {
            icon,
            text: menuItemLabel,
            onAction: () => insertFootnote(editor),
        });

        // Renumber only on events that can actually change marker structure.
        // NodeChange/KeyUp fire on every keystroke and selection move; using
        // them caused the caret to reset after each character typed inside a
        // note. Change/SetContent/Undo/Redo are sufficient for ordering, plus
        // a Backspace/Delete handler to catch marker deletions promptly.
        editor.on('Change SetContent Undo Redo', () => renumber(editor));
        editor.on('keyup', (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                renumber(editor);
            }
        });

        // Click on an existing marker -> jump to (and focus) the matching note.
        editor.on('click', (e) => {
            const ref = e.target.closest && e.target.closest('sup.' + cls.ref);
            if (ref) {
                focusNoteForRef(editor, ref);
                e.preventDefault();
            }
        });
    };
};
