"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writePkgJson = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function writePkgJson(opts, pkgDir, pkgData) {
    pkgData.version = opts.version;
    pkgData.private = true;
    if (pkgData.main && !pkgData.main.startsWith('.')) {
        pkgData.main = `./${pkgData.main}`;
    }
    if (pkgData.module && !pkgData.module.startsWith('.')) {
        pkgData.module = `./${pkgData.module}`;
    }
    if (pkgData.types && !pkgData.types.startsWith('.')) {
        pkgData.types = `./${pkgData.types}`;
    }
    if (pkgData.module && pkgData.main) {
        pkgData.type = 'module';
        pkgData.exports = {
            import: pkgData.module,
            require: pkgData.main,
        };
    }
    // idk, i just like a nice pretty standardized order of package.json properties
    const formatedPkg = {};
    PROPS_ORDER.forEach((pkgProp) => {
        if (pkgProp in pkgData) {
            formatedPkg[pkgProp] = pkgData[pkgProp];
        }
    });
    fs_extra_1.default.writeFileSync(path_1.default.join(pkgDir, 'package.json'), JSON.stringify(formatedPkg, null, 2) + '\n');
}
exports.writePkgJson = writePkgJson;
const PROPS_ORDER = [
    'name',
    'version',
    'description',
    'bin',
    'main',
    'module',
    'browser',
    'types',
    'exports',
    'type',
    'files',
    'private',
    'sideEffects',
];
