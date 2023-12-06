"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacePlugin = void 0;
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const options_1 = require("../../utils/options");
/**
 * Creates a rollup plugin to replace strings in files during the bundling process
 * @param opts the options being used during a build
 * @returns the plugin that replaces specific pre-defined strings during the build
 */
function replacePlugin(opts) {
    const replaceData = (0, options_1.createReplaceData)(opts);
    replaceData[`process.env.NODE_DEBUG`] = false;
    replaceData[`process.binding('natives')`] = '';
    return (0, plugin_replace_1.default)(replaceData);
}
exports.replacePlugin = replacePlugin;
