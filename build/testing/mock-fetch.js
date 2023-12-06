import { MockHeaders, MockResponse } from '../mock-doc';
const mockedResponses = new Map();
export function setupMockFetch(global) {
    const win = global.window;
    if (!('fetch' in win)) {
        win.fetch = function (input) {
            return globalMockFetch(input);
        };
    }
    if (!('fetch' in global)) {
        global.fetch = function (input) {
            return globalMockFetch(input);
        };
    }
}
async function globalMockFetch(requestInput) {
    let requestUrl;
    if (requestInput == null) {
        throw new Error(`missing url input for mock fetch()`);
    }
    else if (typeof requestInput === 'string') {
        requestUrl = requestInput;
    }
    else if (typeof requestInput.url === 'string') {
        requestUrl = requestInput.url;
    }
    else {
        throw new Error(`invalid url for mock fetch()`);
    }
    requestUrl = new URL(requestUrl, location.href).href;
    let mockedData = mockedResponses.get(requestUrl);
    if (mockedData == null) {
        const defaultUrl = new URL(FETCH_DEFAULT_PATH, location.href);
        mockedData = mockedResponses.get(defaultUrl.href);
    }
    if (mockedData == null) {
        return new MockResponse404();
    }
    const mockedResponse = mockedData.response.clone();
    if (typeof mockedResponse.status !== 'number') {
        mockedResponse.status = 200;
    }
    if (typeof mockedResponse.statusText !== 'string') {
        if (mockedResponse.status >= 500) {
            mockedResponse.statusText = 'Internal Server Error';
        }
        else if (mockedResponse.status === 404) {
            mockedResponse.statusText = 'Not Found';
        }
        else if (mockedResponse.status >= 400) {
            mockedResponse.statusText = 'Bad Request';
        }
        else if (mockedResponse.status === 302) {
            mockedResponse.statusText = 'Found';
        }
        else if (mockedResponse.status === 301) {
            mockedResponse.statusText = 'Moved Permanently';
        }
        else if (mockedResponse.status >= 300) {
            mockedResponse.statusText = 'Redirection';
        }
        else {
            mockedResponse.statusText = 'OK';
        }
    }
    mockedResponse.ok = mockedResponse.status >= 200 && mockedResponse.status <= 299;
    if (typeof mockedResponse.type !== 'string') {
        mockedResponse.type = 'basic';
    }
    return mockedResponse;
}
function setMockedResponse(response, input, reject) {
    if (!response) {
        throw new Error('MockResponse required');
    }
    if (typeof response.url !== 'string' || response.url === '') {
        if (typeof input === 'string') {
            response.url = input;
        }
        else if (input && typeof input.url === 'string') {
            response.url = input.url;
        }
        else {
            response.url = FETCH_DEFAULT_PATH;
        }
    }
    const u = new URL(response.url, location.href);
    response.url = u.href;
    const mockedResponseData = {
        response,
        reject,
    };
    mockedResponses.set(response.url, mockedResponseData);
}
export function mockFetchReset() {
    mockedResponses.clear();
}
export const mockFetch = {
    json(data, url) {
        const rsp = new MockResponse(JSON.stringify(data, null, 2), {
            headers: new MockHeaders({
                'Content-Type': 'application/json',
            }),
        });
        setMockedResponse(rsp, url, false);
    },
    text(data, url) {
        const rsp = new MockResponse(data, {
            headers: new MockHeaders({
                'Content-Type': 'text/plain',
            }),
        });
        setMockedResponse(rsp, url, false);
    },
    response(rsp, url) {
        setMockedResponse(rsp, url, false);
    },
    reject(rsp, url) {
        setMockedResponse(rsp, url, true);
    },
    reset: mockFetchReset,
};
class MockResponse404 extends MockResponse {
    constructor() {
        super('', {
            headers: new MockHeaders({
                'Content-Type': 'text/plain',
            }),
        });
        this.ok = false;
        this.status = 404;
        this.statusText = 'Not Found';
    }
    async json() {
        return { status: 404, statusText: 'Not Found' };
    }
    async text() {
        return 'Not Found';
    }
}
const FETCH_DEFAULT_PATH = '/mock-fetch-data';
export { MockHeaders, MockRequest, MockResponse, } from '../mock-doc';
//# sourceMappingURL=mock-fetch.js.map