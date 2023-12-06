import { MockNode } from './node';
export declare class MockCustomElementRegistry implements CustomElementRegistry {
    private win;
    private __registry;
    private __whenDefined;
    constructor(win: Window);
    define(tagName: string, cstr: any, options?: any): void;
    get(tagName: string): any;
    upgrade(_rootNode: any): void;
    clear(): void;
    whenDefined(tagName: string): Promise<CustomElementConstructor>;
}
export declare function createCustomElement(customElements: MockCustomElementRegistry, ownerDocument: any, tagName: string): any;
export declare function connectNode(ownerDocument: any, node: MockNode): void;
export declare function disconnectNode(node: MockNode): void;
export declare function attributeChanged(node: MockNode, attrName: string, oldValue: string | null, newValue: string | null): void;
export declare function checkAttributeChanged(node: MockNode): boolean;
