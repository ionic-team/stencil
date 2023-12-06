export declare function toHaveClass(elm: HTMLElement, expectClassName: string): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveClasses(elm: HTMLElement, expectClassNames: string[]): {
    message: () => string;
    pass: boolean;
};
export declare function toMatchClasses(elm: HTMLElement, expectClassNames: string[]): {
    message: () => string;
    pass: boolean;
};
