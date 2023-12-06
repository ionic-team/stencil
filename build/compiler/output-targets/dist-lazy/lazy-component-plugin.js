import { normalizePath } from '@utils';
export const lazyComponentPlugin = (buildCtx) => {
    const entrys = new Map();
    const plugin = {
        name: 'lazyComponentPlugin',
        resolveId(importee) {
            const entryModule = buildCtx.entryModules.find((entryModule) => entryModule.entryKey === importee);
            if (entryModule) {
                entrys.set(importee, entryModule);
                return importee;
            }
            return null;
        },
        load(id) {
            const entryModule = entrys.get(id);
            if (entryModule) {
                return entryModule.cmps.map(createComponentExport).join('\n');
            }
            return null;
        },
    };
    return plugin;
};
const createComponentExport = (cmp) => {
    const originalClassName = cmp.componentClassName;
    const underscoredClassName = cmp.tagName.replace(/-/g, '_');
    const filePath = normalizePath(cmp.sourceFilePath);
    return `export { ${originalClassName} as ${underscoredClassName} } from '${filePath}';`;
};
//# sourceMappingURL=lazy-component-plugin.js.map