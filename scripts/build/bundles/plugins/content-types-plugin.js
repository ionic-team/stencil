"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypesPlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
function contentTypesPlugin(opts) {
    return {
        name: 'contentTypesPlugin',
        resolveId(id) {
            if (id.endsWith('content-types-db.json')) {
                return id;
            }
            return null;
        },
        load(id) {
            if (id.endsWith('content-types-db.json')) {
                return createContentTypeData(opts);
            }
            return null;
        },
    };
}
exports.contentTypesPlugin = contentTypesPlugin;
async function createContentTypeData(opts) {
    // create a focused content-type lookup object from
    // the mime db json file
    const mimeDbSrcPath = (0, path_1.join)(opts.nodeModulesDir, 'mime-db', 'db.json');
    const mimeDbJson = await fs_extra_1.default.readJson(mimeDbSrcPath);
    const extData = [];
    Object.keys(mimeDbJson).forEach((mimeType) => {
        const mimeTypeData = mimeDbJson[mimeType];
        if (Array.isArray(mimeTypeData.extensions)) {
            mimeTypeData.extensions.forEach((ext) => {
                extData.push({
                    ext,
                    mimeType,
                });
            });
        }
    });
    const exts = {};
    extData
        .sort((a, b) => {
        if (a.ext < b.ext)
            return -1;
        if (a.ext > b.ext)
            return 1;
        return 0;
    })
        .forEach((x) => (exts[x.ext] = x.mimeType));
    return `export default ${JSON.stringify(exts)}`;
}
