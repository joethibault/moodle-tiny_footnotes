<?php
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
 * Tiny Footnotes plugin info.
 *
 * @package    tiny_footnotes
 * @copyright  2026 Cursive Technology <info@cursivetechnology.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_footnotes;

use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_menuitems;

/**
 * Registers the toolbar button and Insert-menu item for footnotes.
 */
class plugininfo extends plugin implements plugin_with_buttons, plugin_with_menuitems {

    /**
     * @return string[] Button identifiers in <frankenstyle>/<name> form.
     */
    public static function get_available_buttons(): array {
        return [
            'tiny_footnotes/footnote',
        ];
    }

    /**
     * @return string[] Menu item identifiers in <frankenstyle>/<name> form.
     */
    public static function get_available_menuitems(): array {
        return [
            'tiny_footnotes/footnote',
        ];
    }
}
