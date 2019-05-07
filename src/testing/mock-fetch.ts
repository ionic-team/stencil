import { URL } from 'url';


const mockedResponses = new Map<string, MockedResponseData>();
const resolveMockPromises: Promise<any>[] = [];


export function setupMockFetch(global: any) {
  global.window.fetch = function(input: RequestInfo) {
    return globalMockFetch(input);
  };
  global.fetch = function(input: RequestInfo) {
    return globalMockFetch(input);
  };
}


async function globalMockFetch(input: RequestInfo) {
  const rsp: MockResponse = {
    status: 404,
    headers: new MockHeaders()
  };

  await Promise.all(resolveMockPromises);

  let url: string;
  if (input == null) {
    throw new Error(`missing url input for mock fetch()`);
  } else if (typeof input === 'string') {
    url = input;
  } else if (typeof input.url === 'string') {
    url = input.url;
  } else {
    throw new Error(`invalid url for mock fetch()`);
  }

  let u = new URL(url, FETCH_BASE_URL);
  rsp.url = u.href;

  let rspData = mockedResponses.get(rsp.url);
  if (rspData == null) {
    u = new URL(FETCH_DEFAULT_PATH, FETCH_BASE_URL);
    rspData = mockedResponses.get(u.href);
  }

  if (rspData == null) {
    rsp.text = function() {
      return Promise.resolve('Not Found');
    };
    rsp.json = function() {
      return Promise.resolve({ data: 'Not Found' });
    };

  } else {
    rsp.status = rspData.status;
    rsp.statusText = rspData.statusText;
    rsp.type = rspData.type;

    if (Array.isArray(rspData.headers)) {
      rspData.headers.forEach(v => {
        rsp.headers.set(v[0], v[1]);
      });
    }
    rsp.text = function() {
      return Promise.resolve(rspData.textStr);
    };
    rsp.json = function() {
      if (typeof rspData.jsonStr === 'string') {
        return Promise.resolve(JSON.parse(rspData.jsonStr));
      }
      return Promise.resolve(rspData.jsonStr);
    };
  }

  if (typeof rsp.status !== 'number') {
    rsp.status = 200;
  }

  if (typeof rsp.statusText !== 'string') {
    if (rsp.status >= 500) {
      rsp.statusText = 'Internal Server Error';
    } else if (rsp.status === 404) {
      rsp.statusText = 'Not Found';
    } else if (rsp.status >= 400) {
      rsp.statusText = 'Bad Request';
    } else if (rsp.status === 302) {
      rsp.statusText = 'Found';
    } else if (rsp.status === 301) {
      rsp.statusText = 'Moved Permanently';
    } else if (rsp.status >= 300) {
      rsp.statusText = 'Redirection';
    } else {
      rsp.statusText = 'OK';
    }
  }

  rsp.ok = (rsp.status >= 200 && rsp.status <= 299);

  if (typeof rsp.type !== 'string') {
    rsp.type = 'basic';
  }

  return rsp;
}


function mockedResponse(rsp: MockResponse, input: MockRequestInput, reject: boolean) {
  if (rsp == null) {
    rsp = {
      status: 404
    };
  }

  if (typeof rsp.url !== 'string') {
    if (typeof input === 'string') {
      rsp.url = input;
    } else if (input && typeof input.url === 'string') {
      rsp.url = input.url;
    } else {
      rsp.url = FETCH_DEFAULT_PATH;
    }
  }

  const u = new URL(rsp.url, FETCH_BASE_URL);
  rsp.url = u.href;

  const mockedResponseData: MockedResponseData = {
    input: input,
    status: rsp.status,
    statusText: rsp.statusText,
    headers: rsp.headers.serialize(),
    type: rsp.type,
    reject: reject,
    jsonStr: null,
    textStr: null
  };

  if (typeof rsp.json === 'function') {
    const p = rsp.json() as any;
    if (p != null && typeof p.then === 'function') {
      p.then((data: any) => {
        if (typeof data !== 'string') {
          mockedResponseData.jsonStr = JSON.stringify(data, null, 2);
        } else {
          mockedResponseData.jsonStr = data;
        }
      });
      resolveMockPromises.push(p);

    } else if (p != null && typeof p === 'object') {
      mockedResponseData.jsonStr = JSON.stringify(p, null, 2);
    } else {
      mockedResponseData.jsonStr = p;
    }
  }

  if (typeof rsp.text === 'function') {
    const p = rsp.text();
    if (p != null) {
      if (typeof p.then === 'function') {
        p.then(data => {
          mockedResponseData.textStr = data;
        });
        resolveMockPromises.push(p);
      } else {
        mockedResponseData.textStr = p as any;
      }
    } else {
      mockedResponseData.textStr = p as any;
    }
  }

  mockedResponses.set(rsp.url, mockedResponseData);
}


export function mockFetchReset() {
  mockedResponses.clear();
  resolveMockPromises.length = 0;
}


export const mockFetch = {
  json(data: any, url?: MockRequestInput) {
    const rsp: MockResponse = {
      headers: new MockHeaders([
        ['Content-Type', 'application/json']
      ]),
      json() {
        return Promise.resolve(JSON.stringify(data, null, 2));
      }
    };
    mockedResponse(rsp, url, false);
  },

  text(data: string, url?: MockRequestInput) {
    const rsp: MockResponse = {
      headers: new MockHeaders([
        ['Content-Type', 'text/plain']
      ]),
      text() {
        return Promise.resolve(data);
      }
    };
    mockedResponse(rsp, url, false);
  },

  response(rsp: MockResponse, url?: MockRequestInput) {
    mockedResponse(rsp, url, false);
  },

  reject(rsp?: MockResponse, url?: MockRequestInput) {
    mockedResponse(rsp, url, true);
  },

  reset: mockFetchReset
};


export class MockHeaders {
  values = new Map<string, string>();

  constructor(values?: string[][]) {
    if (Array.isArray(values)) {
      values.forEach(v => {
        this.values.set(v[0], v[1]);
      });
    }
  }

  serialize() {
    const s: string[][] = [];
    this.values.forEach((value, key) => {
      s.push([key, value]);
    });
    return s;
  }

  append(key: string, value: string) {
    this.values.set(key, value);
  }

  delete(key: string) {
    this.values.delete(key);
  }

  get(key: string) {
    return this.values.get(key);
  }

  has(key: string) {
    return this.values.has(key);
  }

  set(key: string, value: string) {
    this.values.set(key, value);
  }
}


export interface MockRequest {
  headers?: MockHeaders;
  method?: string;
  referrer?: string;
  url?: string;
}


export interface MockResponse {
  headers?: MockHeaders;
  ok?: boolean;
  status?: number;
  statusText?: string;
  type?: string;
  url?: string;
  json?(): Promise<any>;
  text?(): Promise<string>;
}


export interface MockedResponseData {
  input: MockRequestInput;
  textStr: string;
  jsonStr: string;
  headers: string[][];
  status: number;
  statusText: string;
  type: string;
  reject: boolean;
}

export type MockRequestInput = MockRequest | string;

const FETCH_BASE_URL = 'https://mocked.stenciljs.com';

const FETCH_DEFAULT_PATH = '/mock-fetch-data';
