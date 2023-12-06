export declare class MockHeaders {
    private _values;
    constructor(init?: string[][] | Map<string, string> | any);
    append(key: string, value: string): void;
    delete(key: string): void;
    entries(): any;
    forEach(cb: (value: string, key: string) => void): void;
    get(key: string): string;
    has(key: string): boolean;
    keys(): {
        next(): {
            value: string;
            done: boolean;
        };
        [Symbol.iterator](): any;
    };
    set(key: string, value: string): void;
    values(): any;
    [Symbol.iterator](): any;
}
