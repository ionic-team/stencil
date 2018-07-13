import * as d from '../../declarations';
import { getBrowserUrl, getDevServerClientUrl } from '../util';


describe('dev-server, util', () => {

  it('should get url with custom pathname', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 44
    };
    const url = getBrowserUrl(devServerConfig, '/my-custom-path-name');
    expect(url).toBe('http://localhost:44/my-custom-path-name');
  });

  it('should get path with 80 port', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 80
    };
    const url = getBrowserUrl(devServerConfig);
    expect(url).toBe('http://localhost/');
  });

  it('should get path with https', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'https',
      address: '0.0.0.0',
      port: 3333
    };
    const url = getBrowserUrl(devServerConfig);
    expect(url).toBe('https://localhost:3333/');
  });

  it('should get path with custom address', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: 'staging.stenciljs.com',
      port: 3333
    };
    const url = getBrowserUrl(devServerConfig);
    expect(url).toBe('http://staging.stenciljs.com:3333/');
  });

  it('should get path for dev server', () => {
    const devServerConfig: d.DevServerConfig = {
      protocol: 'http',
      address: '0.0.0.0',
      port: 3333
    };
    const url = getDevServerClientUrl(devServerConfig);
    expect(url).toBe('http://localhost:3333/~dev-server');
  });

});
