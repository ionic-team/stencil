import { join } from '@utils';
import { getAbsoluteBuildDir } from './html-utils';
export const updateGlobalStylesLink = (config, doc, globalScriptFilename, outputTarget) => {
    if (!globalScriptFilename) {
        return;
    }
    const buildDir = getAbsoluteBuildDir(outputTarget);
    const originalPath = join(buildDir, config.fsNamespace + '.css');
    const newPath = join(buildDir, globalScriptFilename);
    if (originalPath === newPath) {
        return;
    }
    const replacer = new RegExp(escapeRegExp(originalPath) + '$');
    Array.from(doc.querySelectorAll('link')).forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
            const newHref = href.replace(replacer, newPath);
            if (newHref !== href) {
                link.setAttribute('href', newHref);
            }
        }
    });
};
const escapeRegExp = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//# sourceMappingURL=update-global-styles-link.js.map