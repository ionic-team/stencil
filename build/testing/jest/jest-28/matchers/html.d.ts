export declare function toEqualHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string): {
    message: () => string;
    pass: boolean;
};
export declare function toEqualLightHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string): {
    message: () => string;
    pass: boolean;
};
export declare function compareHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string, serializeShadowRoot: boolean): {
    message: () => string;
    pass: boolean;
};
