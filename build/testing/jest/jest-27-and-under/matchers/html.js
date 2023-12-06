import { parseHtmlToFragment, serializeNodeToHtml } from '@stencil/core/mock-doc';
export function toEqualHtml(input, shouldEqual) {
    return compareHtml(input, shouldEqual, true);
}
export function toEqualLightHtml(input, shouldEqual) {
    return compareHtml(input, shouldEqual, false);
}
export function compareHtml(input, shouldEqual, serializeShadowRoot) {
    if (input == null) {
        throw new Error(`expect toEqualHtml() value is "${input}"`);
    }
    if (typeof input.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    let serializeA;
    if (input.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        const options = getSpecOptions(input);
        serializeA = serializeNodeToHtml(input, {
            prettyHtml: true,
            outerHtml: true,
            removeHtmlComments: options.includeAnnotations === false,
            excludeTags: ['body'],
            serializeShadowRoot,
        });
    }
    else if (input.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
        serializeA = serializeNodeToHtml(input, {
            prettyHtml: true,
            excludeTags: ['style'],
            excludeTagContent: ['style'],
            serializeShadowRoot,
        });
    }
    else if (typeof input === 'string') {
        const parseA = parseHtmlToFragment(input);
        serializeA = serializeNodeToHtml(parseA, {
            prettyHtml: true,
            serializeShadowRoot,
        });
    }
    else {
        throw new Error(`expect toEqualHtml() value should be an element, shadow root or string.`);
    }
    const parseB = parseHtmlToFragment(shouldEqual);
    const serializeB = serializeNodeToHtml(parseB, {
        prettyHtml: true,
        excludeTags: ['body'],
    });
    if (serializeA !== serializeB) {
        expect(serializeA).toBe(serializeB);
        return {
            message: () => 'HTML does not match',
            pass: false,
        };
    }
    return {
        message: () => 'expect HTML to match',
        pass: true,
    };
}
function getSpecOptions(el) {
    if (el && el.ownerDocument && el.ownerDocument.defaultView) {
        return el.ownerDocument.defaultView['__stencil_spec_options'] || {};
    }
    return {};
}
//# sourceMappingURL=html.js.map