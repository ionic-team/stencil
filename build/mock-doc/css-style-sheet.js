class MockCSSRule {
    constructor(parentStyleSheet) {
        this.parentStyleSheet = parentStyleSheet;
        this.cssText = '';
        this.type = 0;
    }
}
export class MockCSSStyleSheet {
    constructor(ownerNode) {
        this.type = 'text/css';
        this.parentStyleSheet = null;
        this.cssRules = [];
        this.ownerNode = ownerNode;
    }
    get rules() {
        return this.cssRules;
    }
    set rules(rules) {
        this.cssRules = rules;
    }
    deleteRule(index) {
        if (index >= 0 && index < this.cssRules.length) {
            this.cssRules.splice(index, 1);
            updateStyleTextNode(this.ownerNode);
        }
    }
    insertRule(rule, index = 0) {
        if (typeof index !== 'number') {
            index = 0;
        }
        if (index < 0) {
            index = 0;
        }
        if (index > this.cssRules.length) {
            index = this.cssRules.length;
        }
        const cssRule = new MockCSSRule(this);
        cssRule.cssText = rule;
        this.cssRules.splice(index, 0, cssRule);
        updateStyleTextNode(this.ownerNode);
        return index;
    }
}
export function getStyleElementText(styleElm) {
    const output = [];
    for (let i = 0; i < styleElm.childNodes.length; i++) {
        output.push(styleElm.childNodes[i].nodeValue);
    }
    return output.join('');
}
export function setStyleElementText(styleElm, text) {
    // keeping the innerHTML and the sheet.cssRules connected
    // is not technically correct, but since we're doing
    // SSR we'll need to turn any assigned cssRules into
    // real text, not just properties that aren't rendered
    const sheet = styleElm.sheet;
    sheet.cssRules.length = 0;
    sheet.insertRule(text);
    updateStyleTextNode(styleElm);
}
function updateStyleTextNode(styleElm) {
    const childNodeLen = styleElm.childNodes.length;
    if (childNodeLen > 1) {
        for (let i = childNodeLen - 1; i >= 1; i--) {
            styleElm.removeChild(styleElm.childNodes[i]);
        }
    }
    else if (childNodeLen < 1) {
        styleElm.appendChild(styleElm.ownerDocument.createTextNode(''));
    }
    const textNode = styleElm.childNodes[0];
    textNode.nodeValue = styleElm.sheet.cssRules.map((r) => r.cssText).join('\n');
}
//# sourceMappingURL=css-style-sheet.js.map