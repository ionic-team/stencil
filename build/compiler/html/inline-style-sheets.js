import { join } from '@utils';
export const inlineStyleSheets = (compilerCtx, doc, maxSize, outputTarget) => {
    const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]'));
    return Promise.all(globalLinks.map(async (link) => {
        const href = link.getAttribute('href');
        if (typeof href !== 'string' || !href.startsWith('/') || link.getAttribute('media') !== null) {
            return;
        }
        try {
            const fsPath = join(outputTarget.dir, href);
            const styles = await compilerCtx.fs.readFile(fsPath);
            if (styles.length > maxSize) {
                return;
            }
            // insert inline <style>
            const inlinedStyles = doc.createElement('style');
            inlinedStyles.innerHTML = styles;
            link.parentNode.insertBefore(inlinedStyles, link);
            link.remove();
        }
        catch (e) { }
    }));
};
//# sourceMappingURL=inline-style-sheets.js.map