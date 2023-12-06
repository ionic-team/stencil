"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyRequirePlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function lazyRequirePlugin(opts, moduleIds, resolveToPath) {
    return {
        name: 'lazyRequirePlugin',
        resolveId(importee) {
            if (moduleIds.includes(importee)) {
                return {
                    id: resolveToPath,
                    external: true,
                };
            }
            return null;
        },
        generateBundle(_, bundle) {
            Object.keys(bundle).forEach((fileName) => {
                const b = bundle[fileName];
                if (b.code) {
                    b.code = b.code.replace(`require('${resolveToPath}')`, `_lazyRequire('${resolveToPath}')`);
                    if (!b.code.includes('function _lazyRequire(')) {
                        b.code = b.code.replace(`'use strict';`, `'use strict';\n\n${getLazyRequireFn(opts)}`);
                    }
                }
            });
        },
    };
}
exports.lazyRequirePlugin = lazyRequirePlugin;
function getLazyRequireFn(opts) {
    return fs_extra_1.default.readFileSync(path_1.default.join(opts.bundleHelpersDir, 'lazy-require.js'), 'utf8').trim();
}
