export function toEqualText(input, expectTextContent) {
    var _a;
    if (input == null) {
        throw new Error(`expect toEqualText() value is "${input}"`);
    }
    if (typeof input.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    let textContent;
    if (input.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        textContent = ((_a = input.textContent) !== null && _a !== void 0 ? _a : '').replace(/\s\s+/g, ' ').trim();
    }
    else {
        textContent = String(input).replace(/\s\s+/g, ' ').trim();
    }
    if (typeof expectTextContent === 'string') {
        expectTextContent = expectTextContent.replace(/\s\s+/g, ' ').trim();
    }
    const pass = textContent === expectTextContent;
    return {
        message: () => `expected textContent "${expectTextContent}" to ${pass ? 'not ' : ''}equal "${textContent}"`,
        pass: pass,
    };
}
//# sourceMappingURL=text.js.map