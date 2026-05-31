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
 * Tiny Footnotes — toolbar / menu placement.
 *
 * Declaring the button in plugininfo.php only makes it _available_; this
 * configure() hook is what actually inserts it into the editor's toolbar
 * and Insert menu when the editor mounts.
 *
 * @module      tiny_footnotes/configuration
 * @copyright   2026 Cursive Technology <info@cursivetechnology.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {addToolbarButton, addMenubarItem} from 'editor_tiny/utils';
import {buttonName, menuItemName} from './common';

export const configure = (instanceConfig) => {
    return {
        toolbar: addToolbarButton(instanceConfig.toolbar, 'content', buttonName),
        menu: addMenubarItem(instanceConfig.menu, 'insert', menuItemName),
    };
};
