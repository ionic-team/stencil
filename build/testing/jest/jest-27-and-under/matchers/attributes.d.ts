export declare function toEqualAttribute(elm: HTMLElement, expectAttrName: string, expectAttrValue: string): {
    message: () => string;
    pass: boolean;
};
export declare function toEqualAttributes(elm: HTMLElement, expectAttrs: {
    [attrName: string]: any;
}): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveAttribute(elm: HTMLElement, expectAttrName: string): {
    message: () => string;
    pass: boolean;
};
