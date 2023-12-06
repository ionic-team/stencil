export declare class MockHistory {
    private items;
    get length(): number;
    back(): void;
    forward(): void;
    go(_value: number): void;
    pushState(_state: any, _title: string, _url: string): void;
    replaceState(_state: any, _title: string, _url: string): void;
}
