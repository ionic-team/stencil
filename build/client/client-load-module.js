import { BUILD } from '@app-data';
import { consoleDevError, consoleError } from './client-log';
export const cmpModules = /*@__PURE__*/ new Map();
export const loadModule = (cmpMeta, hostRef, hmrVersionId) => {
    // loadModuleImport
    const exportName = cmpMeta.$tagName$.replace(/-/g, '_');
    const bundleId = cmpMeta.$lazyBundleId$;
    if (BUILD.isDev && typeof bundleId !== 'string') {
        consoleDevError(`Trying to lazily load component <${cmpMeta.$tagName$}> with style mode "${hostRef.$modeName$}", but it does not exist.`);
        return undefined;
    }
    const module = !BUILD.hotModuleReplacement ? cmpModules.get(bundleId) : false;
    if (module) {
        return module[exportName];
    }
    /*!__STENCIL_STATIC_IMPORT_SWITCH__*/
    return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${bundleId}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`).then((importedModule) => {
        if (!BUILD.hotModuleReplacement) {
            cmpModules.set(bundleId, importedModule);
        }
        return importedModule[exportName];
    }, consoleError);
};
//# sourceMappingURL=client-load-module.js.map