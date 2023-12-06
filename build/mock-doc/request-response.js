import { MockHeaders } from './headers';
export class MockRequest {
    constructor(input, init = {}) {
        this._method = 'GET';
        this._url = '/';
        this.bodyUsed = false;
        this.cache = 'default';
        this.credentials = 'same-origin';
        this.integrity = '';
        this.keepalive = false;
        this.mode = 'cors';
        this.redirect = 'follow';
        this.referrer = 'about:client';
        this.referrerPolicy = '';
        if (typeof input === 'string') {
            this.url = input;
        }
        else if (input) {
            Object.assign(this, input);
            this.headers = new MockHeaders(input.headers);
        }
        Object.assign(this, init);
        if (init.headers) {
            this.headers = new MockHeaders(init.headers);
        }
        if (!this.headers) {
            this.headers = new MockHeaders();
        }
    }
    get url() {
        if (typeof this._url === 'string') {
            return new URL(this._url, location.href).href;
        }
        return new URL('/', location.href).href;
    }
    set url(value) {
        this._url = value;
    }
    get method() {
        if (typeof this._method === 'string') {
            return this._method.toUpperCase();
        }
        return 'GET';
    }
    set method(value) {
        this._method = value;
    }
    clone() {
        const clone = { ...this };
        clone.headers = new MockHeaders(this.headers);
        return new MockRequest(clone);
    }
}
export class MockResponse {
    constructor(body, init = {}) {
        this.ok = true;
        this.status = 200;
        this.statusText = '';
        this.type = 'default';
        this.url = '';
        this._body = body;
        if (init) {
            Object.assign(this, init);
        }
        this.headers = new MockHeaders(init.headers);
    }
    async json() {
        return JSON.parse(this._body);
    }
    async text() {
        return this._body;
    }
    clone() {
        const initClone = { ...this };
        initClone.headers = new MockHeaders(this.headers);
        return new MockResponse(this._body, initClone);
    }
}
//# sourceMappingURL=request-response.js.map