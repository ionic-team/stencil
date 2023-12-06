import { getCssSelectors } from './get-css-selectors';
export const serializeCss = (stylesheet, serializeOpts) => {
    const usedSelectors = serializeOpts.usedSelectors || null;
    const opts = {
        usedSelectors: usedSelectors || null,
        hasUsedAttrs: !!usedSelectors && usedSelectors.attrs.size > 0,
        hasUsedClassNames: !!usedSelectors && usedSelectors.classNames.size > 0,
        hasUsedIds: !!usedSelectors && usedSelectors.ids.size > 0,
        hasUsedTags: !!usedSelectors && usedSelectors.tags.size > 0,
    };
    const rules = stylesheet.rules;
    if (!rules) {
        return '';
    }
    const rulesLen = rules.length;
    const out = [];
    for (let i = 0; i < rulesLen; i++) {
        out.push(serializeCssVisitNode(opts, rules[i], i, rulesLen));
    }
    return out.join('');
};
const serializeCssVisitNode = (opts, node, index, len) => {
    var _a;
    const nodeType = node.type;
    if (nodeType === 4 /* CssNodeType.Declaration */) {
        return serializeCssDeclaration(node, index, len);
    }
    if (nodeType === 13 /* CssNodeType.Rule */) {
        return serializeCssRule(opts, node);
    }
    if (nodeType === 1 /* CssNodeType.Comment */) {
        if (((_a = node.comment) === null || _a === void 0 ? void 0 : _a[0]) === '!') {
            return `/*${node.comment}*/`;
        }
        else {
            return '';
        }
    }
    if (nodeType === 10 /* CssNodeType.Media */) {
        return serializeCssMedia(opts, node);
    }
    if (nodeType === 8 /* CssNodeType.KeyFrames */) {
        return serializeCssKeyframes(opts, node);
    }
    if (nodeType === 9 /* CssNodeType.KeyFrame */) {
        return serializeCssKeyframe(opts, node);
    }
    if (nodeType === 5 /* CssNodeType.FontFace */) {
        return serializeCssFontFace(opts, node);
    }
    if (nodeType === 15 /* CssNodeType.Supports */) {
        return serializeCssSupports(opts, node);
    }
    if (nodeType === 7 /* CssNodeType.Import */) {
        return '@import ' + node.import + ';';
    }
    if (nodeType === 0 /* CssNodeType.Charset */) {
        return '@charset ' + node.charset + ';';
    }
    if (nodeType === 12 /* CssNodeType.Page */) {
        return serializeCssPage(opts, node);
    }
    if (nodeType === 6 /* CssNodeType.Host */) {
        return '@host{' + serializeCssMapVisit(opts, node.rules) + '}';
    }
    if (nodeType === 2 /* CssNodeType.CustomMedia */) {
        return '@custom-media ' + node.name + ' ' + node.media + ';';
    }
    if (nodeType === 3 /* CssNodeType.Document */) {
        return serializeCssDocument(opts, node);
    }
    if (nodeType === 11 /* CssNodeType.Namespace */) {
        return '@namespace ' + node.namespace + ';';
    }
    return '';
};
const serializeCssRule = (opts, node) => {
    var _a, _b;
    const decls = node.declarations;
    const usedSelectors = opts.usedSelectors;
    const selectors = (_b = (_a = node.selectors) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
    if (decls == null || decls.length === 0) {
        return '';
    }
    if (usedSelectors) {
        let i;
        let j;
        let include = true;
        for (i = selectors.length - 1; i >= 0; i--) {
            const sel = getCssSelectors(selectors[i]);
            include = true;
            // classes
            let jlen = sel.classNames.length;
            if (jlen > 0 && opts.hasUsedClassNames) {
                for (j = 0; j < jlen; j++) {
                    if (!usedSelectors.classNames.has(sel.classNames[j])) {
                        include = false;
                        break;
                    }
                }
            }
            // tags
            if (include && opts.hasUsedTags) {
                jlen = sel.tags.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.tags.has(sel.tags[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // attrs
            if (include && opts.hasUsedAttrs) {
                jlen = sel.attrs.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.attrs.has(sel.attrs[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // ids
            if (include && opts.hasUsedIds) {
                jlen = sel.ids.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.ids.has(sel.ids[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            if (!include) {
                selectors.splice(i, 1);
            }
        }
    }
    if (selectors.length === 0) {
        return '';
    }
    const cleanedSelectors = [];
    let cleanedSelector = '';
    if (node.selectors) {
        for (const selector of node.selectors) {
            cleanedSelector = removeSelectorWhitespace(selector);
            if (!cleanedSelectors.includes(cleanedSelector)) {
                cleanedSelectors.push(cleanedSelector);
            }
        }
    }
    return `${cleanedSelectors}{${serializeCssMapVisit(opts, decls)}}`;
};
const serializeCssDeclaration = (node, index, len) => {
    if (node.value === '') {
        return '';
    }
    if (len - 1 === index) {
        return node.property + ':' + node.value;
    }
    return node.property + ':' + node.value + ';';
};
const serializeCssMedia = (opts, node) => {
    const mediaCss = serializeCssMapVisit(opts, node.rules);
    if (mediaCss === '') {
        return '';
    }
    return '@media ' + removeMediaWhitespace(node.media) + '{' + mediaCss + '}';
};
const serializeCssKeyframes = (opts, node) => {
    const keyframesCss = serializeCssMapVisit(opts, node.keyframes);
    if (keyframesCss === '') {
        return '';
    }
    return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + keyframesCss + '}';
};
const serializeCssKeyframe = (opts, node) => {
    var _a, _b;
    return ((_b = (_a = node.values) === null || _a === void 0 ? void 0 : _a.join(',')) !== null && _b !== void 0 ? _b : '') + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssFontFace = (opts, node) => {
    const fontCss = serializeCssMapVisit(opts, node.declarations);
    if (fontCss === '') {
        return '';
    }
    return '@font-face{' + fontCss + '}';
};
const serializeCssSupports = (opts, node) => {
    const supportsCss = serializeCssMapVisit(opts, node.rules);
    if (supportsCss === '') {
        return '';
    }
    return '@supports ' + node.supports + '{' + supportsCss + '}';
};
const serializeCssPage = (opts, node) => {
    var _a, _b;
    const sel = (_b = (_a = node.selectors) === null || _a === void 0 ? void 0 : _a.join(', ')) !== null && _b !== void 0 ? _b : '';
    return '@page ' + sel + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssDocument = (opts, node) => {
    const documentCss = serializeCssMapVisit(opts, node.rules);
    const doc = '@' + (node.vendor || '') + 'document ' + node.document;
    if (documentCss === '') {
        return '';
    }
    return doc + '{' + documentCss + '}';
};
const serializeCssMapVisit = (opts, nodes) => {
    let rtn = '';
    if (nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            rtn += serializeCssVisitNode(opts, nodes[i], i, len);
        }
    }
    return rtn;
};
const removeSelectorWhitespace = (selector) => {
    let rtn = '';
    let char = '';
    let inAttr = false;
    selector = selector.trim();
    for (let i = 0, l = selector.length; i < l; i++) {
        char = selector[i];
        if (char === '[' && rtn[rtn.length - 1] !== '\\') {
            inAttr = true;
        }
        else if (char === ']' && rtn[rtn.length - 1] !== '\\') {
            inAttr = false;
        }
        if (!inAttr && CSS_WS_REG.test(char)) {
            if (CSS_NEXT_CHAR_REG.test(selector[i + 1])) {
                continue;
            }
            if (CSS_PREV_CHAR_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const removeMediaWhitespace = (media) => {
    var _a;
    let rtn = '';
    let char = '';
    media = (_a = media === null || media === void 0 ? void 0 : media.trim()) !== null && _a !== void 0 ? _a : '';
    for (let i = 0, l = media.length; i < l; i++) {
        char = media[i];
        if (CSS_WS_REG.test(char)) {
            if (CSS_WS_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const CSS_WS_REG = /\s/;
const CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/;
const CSS_PREV_CHAR_REG = /[>\(\~\,\+]/;
//# sourceMappingURL=serialize-css.js.map