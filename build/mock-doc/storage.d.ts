export declare class MockStorage {
    private items;
    key(_value: number): void;
    getItem(key: string): string;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}
