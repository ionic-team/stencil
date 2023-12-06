import { getScopeId } from '../style/scope-css';
export const generateModuleGraph = (cmps, bundleModules) => {
    const cmpMap = new Map();
    cmps.forEach((cmp) => {
        const bundle = bundleModules.find((b) => b.cmps.includes(cmp));
        if (bundle) {
            // add default case for no mode
            cmpMap.set(getScopeId(cmp.tagName), bundle.rollupResult.imports);
        }
    });
    return cmpMap;
};
//# sourceMappingURL=component-graph.js.map