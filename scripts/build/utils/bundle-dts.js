"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDts = exports.bundleDts = void 0;
const bundle_generator_js_1 = require("dts-bundle-generator/dist/bundle-generator.js");
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * A thin wrapper for `dts-bundle-generator` which uses our build options to
 * set a few things up
 *
 * **Note**: this file caches its output to disk, and will return any
 * previously cached file if not in a prod environment!
 *
 * @param opts an object holding information about the current build of Stencil
 * @param inputFile the path to the file which should be bundled
 * @param outputOptions options for bundling the file
 * @returns a string containing the bundled typedef
 */
async function bundleDts(opts, inputFile, outputOptions) {
    const cachedDtsOutput = inputFile + '-bundled.d.ts';
    if (!opts.isProd) {
        try {
            return await fs_extra_1.default.readFile(cachedDtsOutput, 'utf8');
        }
        catch (e) { }
    }
    const config = {
        filePath: inputFile,
    };
    if (outputOptions) {
        config.output = outputOptions;
    }
    const outputCode = cleanDts((0, bundle_generator_js_1.generateDtsBundle)([config]).join('\n'));
    await fs_extra_1.default.writeFile(cachedDtsOutput, outputCode);
    return outputCode;
}
exports.bundleDts = bundleDts;
function cleanDts(dtsContent) {
    dtsContent = dtsContent.replace(/\/\/\/ <reference types="node" \/>/g, '');
    dtsContent = dtsContent.replace(/NodeJS.Process/g, 'any');
    dtsContent = dtsContent.replace(/import \{ URL \} from \'url\';/g, '');
    return dtsContent.trim() + '\n';
}
exports.cleanDts = cleanDts;
