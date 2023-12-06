"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDoc = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const parse5_plugin_1 = require("./plugins/parse5-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const sizzle_plugin_1 = require("./plugins/sizzle-plugin");
async function mockDoc(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'mock-doc');
    const outputDir = opts.output.mockDocDir;
    // bundle d.ts
    const bundleDtsPromise = bundleMockDocDts(inputDir, outputDir);
    (0, write_pkg_json_1.writePkgJson)(opts, outputDir, {
        name: '@stencil/core/mock-doc',
        description: 'Mock window, document and DOM outside of a browser environment.',
        main: 'index.cjs',
        module: 'index.js',
        types: 'index.d.ts',
        sideEffects: false,
    });
    const esOutput = {
        format: 'es',
        file: (0, path_1.join)(outputDir, 'index.js'),
        preferConst: true,
        banner: (0, banner_1.getBanner)(opts, `Stencil Mock Doc`, true),
    };
    const cjsOutput = {
        format: 'cjs',
        file: (0, path_1.join)(outputDir, 'index.cjs'),
        intro: CJS_INTRO,
        outro: CJS_OUTRO,
        strict: false,
        esModule: false,
        banner: (0, banner_1.getBanner)(opts, `Stencil Mock Doc (CommonJS)`, true),
    };
    const mockDocBundle = {
        input: (0, path_1.join)(inputDir, 'index.js'),
        output: [esOutput, cjsOutput],
        plugins: [
            (0, parse5_plugin_1.parse5Plugin)(opts),
            (0, sizzle_plugin_1.sizzlePlugin)(opts),
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, plugin_node_resolve_1.default)(),
            (0, plugin_commonjs_1.default)(),
        ],
    };
    await bundleDtsPromise;
    return [mockDocBundle];
}
exports.mockDoc = mockDoc;
const CJS_INTRO = `
var mockDoc = (function(exports) {
'use strict';
`.trim();
const CJS_OUTRO = `
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
}
return exports;
})({});
`.trim();
async function bundleMockDocDts(inputDir, outputDir) {
    // only reason we can do this is because we already know the shape
    // of mock-doc's dts files and how we want them to come together
    const srcDtsFiles = (await fs_extra_1.default.readdir(inputDir)).filter((f) => {
        return f.endsWith('.d.ts') && !f.endsWith('index.d.ts') && !f.endsWith('index.d.ts-bundled.d.ts');
    });
    const output = await Promise.all(srcDtsFiles.map((inputDtsFile) => {
        return getDtsContent(inputDir, inputDtsFile);
    }));
    const srcIndexDts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'index.d.ts'), 'utf8');
    output.push(getMockDocExports(srcIndexDts));
    await fs_extra_1.default.writeFile((0, path_1.join)(outputDir, 'index.d.ts'), output.join('\n') + '\n');
}
async function getDtsContent(inputDir, inputDtsFile) {
    const srcDtsText = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, inputDtsFile), 'utf8');
    const allLines = srcDtsText.split('\n');
    const filteredLines = allLines.filter((ln) => {
        if (ln.trim().startsWith('///')) {
            return false;
        }
        if (ln.trim().startsWith('import ')) {
            return false;
        }
        if (ln.trim().startsWith('__')) {
            return false;
        }
        if (ln.trim().startsWith('private')) {
            return false;
        }
        if (ln.replace(/ /g, '').startsWith('export{}')) {
            return false;
        }
        return true;
    });
    let dtsContent = filteredLines
        .map((ln) => {
        if (ln.trim().startsWith('export ')) {
            ln = ln.replace('export ', '');
        }
        return ln;
    })
        .join('\n')
        .trim();
    dtsContent = dtsContent.replace(/    /g, '  ');
    return dtsContent;
}
function getMockDocExports(srcIndexDts) {
    const exportLines = srcIndexDts.split('\n').filter((ln) => ln.trim().startsWith('export {'));
    const dtsExports = [];
    exportLines.forEach((ln) => {
        const splt = ln.split('{')[1].split('}')[0].trim();
        const exportNames = splt
            .split(',')
            .map((n) => n.trim())
            .filter((n) => n.length > 0);
        dtsExports.push(...exportNames);
    });
    return `export { ${dtsExports.sort().join(', ')} }`;
}
