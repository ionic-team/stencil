"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSizzleBundle = exports.sizzlePlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
/**
 * Bundles sizzle, a CSS selector engine, into the Stencil compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that in-lines sizzle
 */
function sizzlePlugin(opts) {
    return {
        name: 'sizzlePlugin',
        /**
         * A rollup build hook for resolving sizzle [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in the import statement
         * @returns a string that resolves an import to some id
         */
        resolveId(id) {
            if (id === 'sizzle') {
                return id;
            }
            return null;
        },
        /**
         * A rollup build hook for loading sizzle. [Source](https://rollupjs.org/guide/en/#load)
         * @param id the path of the module to load
         * @returns sizzle, pre-bundled
         */
        async load(id) {
            if (id !== 'sizzle') {
                return null;
            }
            return getSizzleBundle(opts);
        },
    };
}
exports.sizzlePlugin = sizzlePlugin;
/**
 * Creates a sizzle bundle to inline
 * @param opts the options being used during a build of the Stencil compiler
 * @returns a modified version of sizzle, wrapped in an immediately invoked function expression (IIFE)
 */
async function getSizzleBundle(opts) {
    const f = opts.isProd ? 'sizzle.min.js' : 'sizzle.js';
    const sizzlePath = (0, path_1.join)(opts.nodeModulesDir, 'sizzle', 'dist', f);
    const sizzleContent = await fs_extra_1.default.readFile(sizzlePath, 'utf8');
    return `// Sizzle ${opts.sizzleVersion}
export default (function() {
const window = {
  document: {
    createElement() {
      return {};
    },
    nodeType: 9,
    documentElement: {
      nodeType: 1,
      nodeName: 'HTML'
    }
  }
};
const module = { exports: {} };

${sizzleContent}

return module.exports;
})();
`;
}
/**
 * Write a file to disk with our patched version of sizzle so that tools like
 * esbuild can access it
 *
 * @param opts Stencil build options
 * @returns a promise wrapping the filename
 */
async function writeSizzleBundle(opts) {
    const patchedSizzle = await getSizzleBundle(opts);
    const fileName = `sizzle-bundle-cache${opts.isProd ? '.min' : ''}.js`;
    const cacheFile = (0, path_1.join)(opts.scriptsBuildDir, fileName);
    fs_extra_1.default.writeFileSync(cacheFile, patchedSizzle);
    return cacheFile;
}
exports.writeSizzleBundle = writeSizzleBundle;
