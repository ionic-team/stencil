import { normalizePath } from '@utils';
const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];
/**
 * Determine if a stringified file path is a TypeScript declaration file based on the extension at the end of the path.
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.d.ts` (case-sensitive), `false` otherwise.
 */
export const isDtsFile = (p) => p.endsWith('.d.ts');
/**
 * Determine if a stringified file path is a TypeScript file based on the extension at the end of the path. This
 * function does _not_ consider type declaration files (`.d.ts` files) to be TypeScript files.
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.ts` (case-sensitive) but does _not_ end in `.d.ts`, `false` otherwise.
 */
export const isTsFile = (p) => !isDtsFile(p) && p.endsWith('.ts');
/**
 * Determine if a stringified file path is a TSX file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.tsx` (case-sensitive), `false` otherwise.
 */
export const isTsxFile = (p) => p.endsWith('.tsx');
/**
 * Determine if a stringified file path is a JSX file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.jsx` (case-sensitive), `false` otherwise.
 */
export const isJsxFile = (p) => p.endsWith('.jsx');
/**
 * Determine if a stringified file path is a JavaScript file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.js` (case-sensitive), `false` otherwise.
 */
export const isJsFile = (p) => p.endsWith('.js');
export const isCommonDirModuleFile = (p) => COMMON_DIR_MODULE_EXTS.some((ext) => p.endsWith(ext));
export const setPackageVersion = (pkgVersions, pkgName, pkgVersion) => {
    pkgVersions.set(pkgName, pkgVersion);
};
export const setPackageVersionByContent = (pkgVersions, pkgContent) => {
    try {
        const pkg = JSON.parse(pkgContent);
        if (pkg.name && pkg.version) {
            setPackageVersion(pkgVersions, pkg.name, pkg.version);
        }
    }
    catch (e) { }
};
export const isLocalModule = (p) => p.startsWith('.') || p.startsWith('/');
export const isStencilCoreImport = (p) => p.startsWith('@stencil/core');
export const isNodeModulePath = (p) => normalizePath(p).split('/').includes('node_modules');
export const getModuleId = (orgImport) => {
    if (orgImport.startsWith('~')) {
        orgImport = orgImport.substring(1);
    }
    const splt = orgImport.split('/');
    const m = {
        moduleId: null,
        filePath: null,
        scope: null,
        scopeSubModuleId: null,
    };
    if (orgImport.startsWith('@') && splt.length > 1) {
        m.moduleId = splt.slice(0, 2).join('/');
        m.filePath = splt.slice(2).join('/');
        m.scope = splt[0];
        m.scopeSubModuleId = splt[1];
    }
    else {
        m.moduleId = splt[0];
        m.filePath = splt.slice(1).join('/');
    }
    return m;
};
export const getPackageDirPath = (p, moduleId) => {
    const parts = normalizePath(p).split('/');
    const m = getModuleId(moduleId);
    for (let i = parts.length - 1; i >= 1; i--) {
        if (parts[i - 1] === 'node_modules') {
            if (m.scope) {
                if (parts[i] === m.scope && parts[i + 1] === m.scopeSubModuleId) {
                    return parts.slice(0, i + 2).join('/');
                }
            }
            else if (parts[i] === m.moduleId) {
                return parts.slice(0, i + 1).join('/');
            }
        }
    }
    return null;
};
//# sourceMappingURL=resolve-utils.js.map