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
 * Tiny Footnotes — plugin entry point.
 *
 * @module      tiny_footnotes/plugin
 * @copyright   2026 Cursive Technology <info@cursivetechnology.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getTinyMCE} from 'editor_tiny/loader';
import {getPluginMetadata} from 'editor_tiny/utils';

import {component, pluginName} from './common';
import {getSetup as getCommandSetup} from './commands';
import * as Configuration from './configuration';

// PluginManager.add doesn't accept async setup, so we wait for TinyMCE and our
// async setup work in an IIFE, then return the [pluginName, configureHandler]
// tuple Moodle's tiny loader expects. The second element is what Moodle invokes
// to merge our toolbar/menu placement into the editor instance config.
//
// We use an async IIFE rather than `new Promise(async (resolve) => ...)` because
// ESLint's no-async-promise-executor rule (correctly) flags the latter: thrown
// errors inside an async executor would become unhandled rejections.
export default (async() => {
    const [tinyMCE, pluginMetadata, setupCommands] = await Promise.all([
        getTinyMCE(),
        getPluginMetadata(component, pluginName),
        getCommandSetup(),
    ]);

    tinyMCE.PluginManager.add(pluginName, (editor) => {
        setupCommands(editor);
        return pluginMetadata;
    });

    return [pluginName, Configuration];
})();
