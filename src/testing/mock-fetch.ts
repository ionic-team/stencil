import { URL } from 'url';


const mockedResponses = new Map<string, MockedResponseData>();


export function setupMockFetch(global: any) {
  const win = global.window;
  if (!('fetch' in win)) {
    win.fetch = function(input: MockRequestInfo) {
      return globalMockFetch(input);
    };
  }
  if (!('fetch' in global)) {
    global.fetch = function(input: MockRequestInfo) {
      return globalMockFetch(input);
    };
  }
}

async function globalMockFetch(requestInput: MockRequestInfo) {
  let requestUrl: string;
  if (requestInput == null) {
    throw new Error(`missing url input for mock fetch()`);
  } else if (typeof requestInput === 'string') {
    requestUrl = requestInput;
  } else if (typeof requestInput.url === 'string') {
    requestUrl = requestInput.url;
  } else {
    throw new Error(`invalid url for mock fetch()`);
  }

  requestUrl = (new URL(requestUrl, FETCH_BASE_URL)).href;

  let mockedData = mockedResponses.get(requestUrl);
  if (mockedData == null) {
    const defaultUrl = new URL(FETCH_DEFAULT_PATH, FETCH_BASE_URL);
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
    } else if (mockedResponse.status === 404) {
      mockedResponse.statusText = 'Not Found';
    } else if (mockedResponse.status >= 400) {
      mockedResponse.statusText = 'Bad Request';
    } else if (mockedResponse.status === 302) {
      mockedResponse.statusText = 'Found';
    } else if (mockedResponse.status === 301) {
      mockedResponse.statusText = 'Moved Permanently';
    } else if (mockedResponse.status >= 300) {
      mockedResponse.statusText = 'Redirection';
    } else {
      mockedResponse.statusText = 'OK';
    }
  }

  mockedResponse.ok = (mockedResponse.status >= 200 && mockedResponse.status <= 299);

  if (typeof mockedResponse.type !== 'string') {
    mockedResponse.type = 'basic';
  }

  return mockedResponse;
}


function setMockedResponse(response: MockResponse, input: MockRequestInfo, reject: boolean) {
  if (!response) {
    throw new Error('MockResponse required');
  }
  if (typeof response.url !== 'string') {
    if (typeof input === 'string') {
      response.url = input;
    } else if (input && typeof input.url === 'string') {
      response.url = input.url;
    } else {
      response.url = FETCH_DEFAULT_PATH;
    }
  }

  const u = new URL(response.url, FETCH_BASE_URL);
  response.url = u.href;

  const mockedResponseData: MockedResponseData = {
    response,
    reject,
  };

  mockedResponses.set(response.url, mockedResponseData);
}

export function mockFetchReset() {
  mockedResponses.clear();
}

export const mockFetch = {

  json(data: any, url?: string) {
    const rsp = new MockResponse(JSON.stringify(data, null, 2), {
      headers: new MockHeaders([
        ['Content-Type', 'application/json']
      ])
    });
    setMockedResponse(rsp, url, false);
  },

  text(data: string, url?: string) {
    const rsp = new MockResponse(data, {
      headers: new MockHeaders([
        ['Content-Type', 'text/plain']
      ])
    });
    setMockedResponse(rsp, url, false);
  },

  response(rsp: MockResponse, url?: string) {
    setMockedResponse(rsp, url, false);
  },

  reject(rsp?: MockResponse, url?: string) {
    setMockedResponse(rsp, url, true);
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

  forEach(cb: (value: string, key: string) => void) {
    this.values.forEach(cb);
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


// ReQUEST

export interface MockRequestInit {
  headers?: MockHeaders;
  status?: number;
  statusText?: string;
}

export type MockRequestInfo = MockRequest | string;

export class MockRequest {
  headers?: MockHeaders;
  method?: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
  url?: string;

  constructor(_mockInput: MockRequestInfo, _mockInit?: MockRequestInit) {}
}


// ReSPONSE

export interface MockResponseInit {
  headers?: MockHeaders;
  ok?: boolean;
  status?: number;
  statusText?: string;
  type?: ResponseType;
  url?: string;
}

export class MockResponse {
  headers?: MockHeaders;
  ok: boolean;
  status?: number;
  statusText?: string;
  type?: string;
  url?: string;

  constructor(private mockedBody: string, private mockedResponseInit?: MockResponseInit) {
    if (mockedResponseInit) {
      this.headers = mockedResponseInit.headers;
      this.ok = mockedResponseInit.ok;
      this.status = mockedResponseInit.status;
      this.statusText = mockedResponseInit.statusText;
      this.type = mockedResponseInit.type;
      this.url = mockedResponseInit.url;
    }
  }

  async json() {
    return JSON.parse(this.mockedBody);
  }

  async text() {
    return this.mockedBody;
  }

  clone() {
    return new MockResponse(this.mockedBody, this.mockedResponseInit);
  }
}

class MockResponse404 extends MockResponse {
  status = 404;
  statusText = 'Not Found'
  constructor() {
    super('', {
      headers: new MockHeaders([
        ['Content-Type', 'text/plain']
      ])
    });
  }
  async json() {
    return { status: 404, statusText: 'Not Found' };
  }
  async text() {
    return 'Not Found';
  }
}


export interface MockedResponseData {
  response: MockResponse;
  reject: boolean;
}

const FETCH_BASE_URL = 'https://mocked.stenciljs.com';

const FETCH_DEFAULT_PATH = '/mock-fetch-data';
