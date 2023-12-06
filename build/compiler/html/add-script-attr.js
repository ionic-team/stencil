import { join } from '@utils';
import { getAbsoluteBuildDir } from './html-utils';
export const addScriptDataAttribute = (config, doc, outputTarget) => {
    const resourcesUrl = getAbsoluteBuildDir(outputTarget);
    const entryEsmFilename = `${config.fsNamespace}.esm.js`;
    const entryNoModuleFilename = `${config.fsNamespace}.js`;
    const expectedEsmSrc = join(resourcesUrl, entryEsmFilename);
    const expectedNoModuleSrc = join(resourcesUrl, entryNoModuleFilename);
    const scripts = Array.from(doc.querySelectorAll('script'));
    const scriptEsm = scripts.find((s) => s.getAttribute('src') === expectedEsmSrc);
    const scriptNomodule = scripts.find((s) => s.getAttribute('src') === expectedNoModuleSrc);
    if (scriptEsm) {
        scriptEsm.setAttribute('data-stencil', '');
    }
    if (scriptNomodule) {
        scriptNomodule.setAttribute('data-stencil', '');
    }
};
//# sourceMappingURL=add-script-attr.js.map