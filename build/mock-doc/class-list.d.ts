export declare class MockClassList {
    private elm;
    constructor(elm: HTMLElement);
    add(...classNames: string[]): void;
    remove(...classNames: string[]): void;
    contains(className: string): boolean;
    toggle(className: string): void;
    get length(): number;
    item(index: number): string;
    toString(): string;
}
