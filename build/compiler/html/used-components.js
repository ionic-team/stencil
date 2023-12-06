/**
 * Scan the provided `doc` for any known Stencil components
 * @param doc the Document to scan
 * @param cmps the compiler metadata of known Stencil components
 * @returns a list of all tags that were identified as known Stencil components
 */
export const getUsedComponents = (doc, cmps) => {
    const tags = new Set(cmps.map((cmp) => cmp.tagName.toUpperCase()));
    const found = [];
    const searchComponents = (el) => {
        if (tags.has(el.tagName)) {
            found.push(el.tagName.toLowerCase());
        }
        for (let i = 0; i < el.childElementCount; i++) {
            searchComponents(el.children[i]);
        }
    };
    searchComponents(doc.documentElement);
    return found;
};
//# sourceMappingURL=used-components.js.map