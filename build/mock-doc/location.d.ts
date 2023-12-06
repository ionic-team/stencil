export declare class MockLocation implements Location {
    ancestorOrigins: any;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    username: string;
    password: string;
    origin: string;
    private _href;
    get href(): string;
    set href(value: string);
    assign(_url: string): void;
    reload(_forcedReload?: boolean): void;
    replace(_url: string): void;
    toString(): string;
}
