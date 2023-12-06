import { MockStyleElement } from './element';
declare class MockCSSRule {
    parentStyleSheet: MockCSSStyleSheet;
    cssText: string;
    type: number;
    constructor(parentStyleSheet: MockCSSStyleSheet);
}
export declare class MockCSSStyleSheet {
    ownerNode: any;
    type: string;
    parentStyleSheet: MockCSSStyleSheet;
    cssRules: MockCSSRule[];
    constructor(ownerNode: MockStyleElement);
    get rules(): MockCSSRule[];
    set rules(rules: MockCSSRule[]);
    deleteRule(index: number): void;
    insertRule(rule: string, index?: number): number;
}
export declare function getStyleElementText(styleElm: MockStyleElement): string;
export declare function setStyleElementText(styleElm: MockStyleElement, text: string): void;
export {};
