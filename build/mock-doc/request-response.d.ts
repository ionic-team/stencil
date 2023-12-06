import { MockHeaders } from './headers';
export type MockRequestInfo = MockRequest | string;
export interface MockRequestInit {
    body?: any;
    cache?: string;
    credentials?: string;
    headers?: any;
    integrity?: string;
    keepalive?: boolean;
    method?: string;
    mode?: string;
    redirect?: string;
    referrer?: string;
    referrerPolicy?: string;
}
export declare class MockRequest {
    private _method;
    private _url;
    bodyUsed: boolean;
    cache: string;
    credentials: string;
    headers: MockHeaders;
    integrity: string;
    keepalive: boolean;
    mode: string;
    redirect: string;
    referrer: string;
    referrerPolicy: string;
    constructor(input?: any, init?: MockRequestInit);
    get url(): string;
    set url(value: string);
    get method(): string;
    set method(value: string);
    clone(): MockRequest;
}
export interface MockResponseInit {
    headers?: any;
    ok?: boolean;
    status?: number;
    statusText?: string;
    type?: string;
    url?: string;
}
export declare class MockResponse {
    private _body;
    headers: MockHeaders;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    constructor(body?: string, init?: MockResponseInit);
    json(): Promise<any>;
    text(): Promise<string>;
    clone(): MockResponse;
}
