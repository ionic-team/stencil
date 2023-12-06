export const parseStringLiteral = (m, node) => {
    if (typeof node.text === 'string' && node.text.includes('</')) {
        if (node.text.includes('<slot')) {
            m.htmlTagNames.push('slot');
        }
        if (node.text.includes('<svg')) {
            m.htmlTagNames.push('svg');
        }
    }
};
//# sourceMappingURL=string-literal.js.map