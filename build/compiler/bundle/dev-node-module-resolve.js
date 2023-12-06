import { join, relative } from '@utils';
import { basename, dirname } from 'path';
import { DEV_MODULE_DIR } from './constants';
export const devNodeModuleResolveId = async (config, inMemoryFs, resolvedId, importee) => {
    if (!shouldCheckDevModule(resolvedId, importee)) {
        return resolvedId;
    }
    if (typeof resolvedId === 'string' || !resolvedId) {
        return resolvedId;
    }
    const resolvedPath = resolvedId.id;
    const pkgPath = getPackageJsonPath(resolvedPath, importee);
    if (!pkgPath) {
        return resolvedId;
    }
    const pkgJsonStr = await inMemoryFs.readFile(pkgPath);
    if (!pkgJsonStr) {
        return resolvedId;
    }
    let pkgJsonData;
    try {
        pkgJsonData = JSON.parse(pkgJsonStr);
    }
    catch (e) { }
    if (!pkgJsonData || !pkgJsonData.version) {
        return resolvedId;
    }
    resolvedId.id = serializeDevNodeModuleUrl(config, pkgJsonData.name, pkgJsonData.version, resolvedPath);
    resolvedId.external = true;
    return resolvedId;
};
const shouldCheckDevModule = (resolvedId, importee) => resolvedId &&
    importee &&
    typeof resolvedId !== 'string' &&
    resolvedId.id &&
    resolvedId.id.includes('node_modules') &&
    (resolvedId.id.endsWith('.js') || resolvedId.id.endsWith('.mjs')) &&
    !resolvedId.external &&
    !importee.startsWith('.') &&
    !importee.startsWith('/');
const getPackageJsonPath = (resolvedPath, importee) => {
    let currentPath = resolvedPath;
    for (let i = 0; i < 10; i++) {
        currentPath = dirname(currentPath);
        const aBasename = basename(currentPath);
        const upDir = dirname(currentPath);
        const bBasename = basename(upDir);
        if (aBasename === importee && bBasename === 'node_modules') {
            return join(currentPath, 'package.json');
        }
    }
    return null;
};
const serializeDevNodeModuleUrl = (config, moduleId, moduleVersion, resolvedPath) => {
    resolvedPath = relative(config.rootDir, resolvedPath);
    let id = `/${DEV_MODULE_DIR}/`;
    id += encodeURIComponent(moduleId) + '@';
    id += encodeURIComponent(moduleVersion) + '.js';
    id += '?p=' + encodeURIComponent(resolvedPath);
    return id;
};
//# sourceMappingURL=dev-node-module-resolve.js.map