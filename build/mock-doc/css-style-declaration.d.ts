export declare class MockCSSStyleDeclaration {
    private _styles;
    setProperty(prop: string, value: string): void;
    getPropertyValue(prop: string): string;
    removeProperty(prop: string): void;
    get length(): number;
    get cssText(): string;
    set cssText(cssText: string);
}
export declare function createCSSStyleDeclaration(): MockCSSStyleDeclaration;
