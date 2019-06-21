import * as d from '@stencil/core/declarations';
import { DEV_SERVER_URL, getBrowserUrl, getDevServerClientUrl } from '../dev-server-utils';


describe('dev-server, util', () => {

  it('should get url with custom base url and pathname', () => {
    const protocol = 'http:';
    const address = '0.0.0.0';
    const port = 44;
    const baseUrl = '/my-base-url/';
    const pathname = '/my-custom-path-name';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('http://localhost:44/my-base-url/my-custom-path-name');
  });

  it('should get url with custom pathname', () => {
    const protocol = 'http';
    const address = '0.0.0.0';
    const port = 44;
    const baseUrl = '/';
    const pathname = '/my-custom-path-name';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('http://localhost:44/my-custom-path-name');
  });

  it('should get path with 80 port', () => {
    const protocol = 'http';
    const address = '0.0.0.0';
    const port = 80;
    const baseUrl = '/';
    const pathname = '/';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('http://localhost/');
  });

  it('should get path with no port', () => {
    const protocol = 'http';
    const address = '0.0.0.0';
    const port: any = undefined;
    const baseUrl = '/';
    const pathname = '/';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('http://localhost/');
  });

  it('should get path with https', () => {
    const protocol = 'https';
    const address = '0.0.0.0';
    const port = 3333;
    const baseUrl = '/';
    const pathname = '/';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('https://localhost:3333/');
  });

  it('should get path with custom address', () => {
    const protocol = 'http';
    const address = 'staging.stenciljs.com';
    const port = 3333;
    const baseUrl = '/';
    const pathname = '/';
    const url = getBrowserUrl(protocol, address, port, baseUrl, pathname);
    expect(url).toBe('http://staging.stenciljs.com:3333/');
  });

});


describe('getDevServerClientUrl',  () => {

  it('should get path for dev server w/ host w/ port', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 3333,
      basePath: '/my-base-url/'
    };
    const host = 'staging.stenciljs:5555.com';
    const url = getDevServerClientUrl(devServerConfig, host);
    expect(url).toBe(`http://staging.stenciljs:5555.com/my-base-url${DEV_SERVER_URL}`);
  });

  it('should get path for dev server w/ host no port', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 3333,
      basePath: '/my-base-url/'
    };
    const host = 'staging.stenciljs.com';
    const url = getDevServerClientUrl(devServerConfig, host);
    expect(url).toBe(`http://staging.stenciljs.com/my-base-url${DEV_SERVER_URL}`);
  });

  it('should get path for dev server w/ base url and port, no host', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 3333,
      basePath: '/my-base-url/'
    };
    const host: string = null;
    const url = getDevServerClientUrl(devServerConfig, host);
    expect(url).toBe(`http://localhost:3333/my-base-url${DEV_SERVER_URL}`);
  });

  it('should get path for dev server w/ base url and w/out port', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      basePath: '/my-base-url/'
    };
    const host: string = null;
    const url = getDevServerClientUrl(devServerConfig, host);
    expect(url).toBe(`${devServerConfig.protocol}://localhost/my-base-url${DEV_SERVER_URL}`);
  });

  it('should get path for dev server w/ custom address, base url and port', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '1.2.3.4',
      port: 3333,
      basePath: '/my-base-url/'
    };
    const host: string = null;
    const url = getDevServerClientUrl(devServerConfig, host);
    expect(url).toBe(`${devServerConfig.protocol}://${devServerConfig.address}:3333/my-base-url${DEV_SERVER_URL}`);
  });

});
