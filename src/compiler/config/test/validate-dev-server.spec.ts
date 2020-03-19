import * as d from '../../../declarations';
import { normalizePath } from '../../../utils';
import { validateConfig } from '../validate-config';
import path from 'path';

describe('validateDevServer', () => {
  let inputConfig: d.Config;
  const root = path.resolve('/');

  beforeEach(() => {
    inputConfig = {
      sys: {} as any,
      rootDir: normalizePath(path.join(root, 'some', 'path')),
      devServer: {
        contentTypes: {},
      },
      flags: {
        serve: true,
      },
      namespace: 'Testing',
    };
  });

  it('should default address', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('0.0.0.0');
  });

  it('should remove http from address', () => {
    inputConfig.devServer.address = 'http://localhost';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('localhost');
  });

  it('should remove https from address', () => {
    inputConfig.devServer.address = 'https://localhost';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('localhost');
  });

  it('should remove trailing / from address', () => {
    inputConfig.devServer.address = 'localhost/';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('localhost');
  });

  it('should set address', () => {
    inputConfig.devServer.address = '123.123.123.123';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('123.123.123.123');
  });

  it('should set address from flags', () => {
    inputConfig.flags.address = '123.123.123.123';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.address).toBe('123.123.123.123');
  });

  it('should get custom baseUrl', () => {
    inputConfig.outputTargets = [
      {
        type: 'www',
        baseUrl: '/my-base-url',
      } as d.OutputTargetWww,
    ];
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.basePath).toBe('/my-base-url/');
  });

  it('should get custom baseUrl with domain', () => {
    inputConfig.outputTargets = [
      {
        type: 'www',
        baseUrl: 'http://stenciljs.com/my-base-url',
      } as d.OutputTargetWww,
    ];
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.basePath).toBe('/my-base-url/');
  });

  it('should default basePath', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.basePath).toBe('/');
  });

  it('should default root', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.root).toBe(normalizePath(path.join(root, 'some', 'path', 'www')));
  });

  it('should set relative root', () => {
    inputConfig.devServer.root = 'my-rel-root';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.root).toBe(normalizePath(path.join(root, 'some', 'path', 'my-rel-root')));
  });

  it('should set absolute root', () => {
    inputConfig.devServer.root = normalizePath(path.join(root, 'some', 'path', 'my-abs-root'));
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.root).toBe(normalizePath(path.join(root, 'some', 'path', 'my-abs-root')));
  });

  it('should default gzip', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.gzip).toBe(true);
  });

  it('should set gzip', () => {
    inputConfig.devServer.gzip = false;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.gzip).toBe(false);
  });

  it('should default port', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(3333);
  });

  it('should default port with ip address', () => {
    inputConfig.devServer.address = '192.12.12.10';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(3333);
  });

  it('should default port with localhost', () => {
    inputConfig.devServer.address = 'localhost';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(3333);
  });

  it('should not set default port if null', () => {
    inputConfig.devServer.port = null;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(null);
  });

  it('should set port if in address', () => {
    inputConfig.devServer.address = 'localhost:88';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(88);
    expect(config.devServer.address).toBe('localhost');
  });

  it('should set port if in address and has trailing slash', () => {
    inputConfig.devServer.address = 'https://localhost:88/';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(88);
    expect(config.devServer.address).toBe('localhost');
    expect(config.devServer.protocol).toBe('https');
  });

  it('should set address, port null, protocol', () => {
    inputConfig.devServer.address = 'https://subdomain.stenciljs.com/';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(null);
    expect(config.devServer.address).toBe('subdomain.stenciljs.com');
    expect(config.devServer.protocol).toBe('https');
  });

  it('should set port', () => {
    inputConfig.devServer.port = 4444;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(4444);
  });

  it('should set port from flags', () => {
    inputConfig.flags.port = 4444;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.port).toBe(4444);
  });

  it('should default historyApiFallback', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.historyApiFallback).toBeDefined();
    expect(config.devServer.historyApiFallback.index).toBe('index.html');
  });

  it('should set historyApiFallback', () => {
    inputConfig.devServer.historyApiFallback = {};
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.historyApiFallback).toBeDefined();
    expect(config.devServer.historyApiFallback.index).toBe('index.html');
  });

  it('should disable historyApiFallback', () => {
    inputConfig.devServer.historyApiFallback = null;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.historyApiFallback).toBe(null);
  });

  it('should default reloadStrategy hmr', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.reloadStrategy).toBe('hmr');
  });

  it('should set reloadStrategy pageReload', () => {
    inputConfig.devServer.reloadStrategy = 'pageReload';
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.reloadStrategy).toBe('pageReload');
  });

  it('should default openBrowser', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.openBrowser).toBe(true);
  });

  it('should set openBrowser', () => {
    inputConfig.devServer.openBrowser = false;
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.openBrowser).toBe(false);
  });

  it('should set openBrowser from flag', () => {
    inputConfig.flags = { open: false };
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.openBrowser).toBe(false);
  });

  it('should default http protocol', () => {
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.protocol).toBe('http');
  });

  it('should set https protocol if credentials are set', () => {
    inputConfig.devServer.https = { key: 'fake-key', cert: 'fake-cert' };
    const { config } = validateConfig(inputConfig);
    expect(config.devServer.protocol).toBe('https');
  });
});
