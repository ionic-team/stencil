import { MockResponse } from '../mock-doc';
export declare function setupMockFetch(global: any): void;
export declare function mockFetchReset(): void;
export declare const mockFetch: {
    json(data: any, url?: string): void;
    text(data: string, url?: string): void;
    response(rsp: MockResponse, url?: string): void;
    reject(rsp?: MockResponse, url?: string): void;
    reset: typeof mockFetchReset;
};
export { MockHeaders, MockRequest, MockRequestInfo, MockRequestInit, MockResponse, MockResponseInit, } from '../mock-doc';
