import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateDevServer', () => {

  let config: Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();
  const root = path.resolve('/');

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: path.join(root, 'some', 'path'),
      devServer: {
        contentTypes: {}
      },
      flags: {
        serve: true
      }
    };
  });


  it('should default address', () => {
    validateConfig(config);
    expect(config.devServer.address).toBe('0.0.0.0');
  });

  it('should set address', () => {
    config.devServer.address = '123.123.123.123';
    validateConfig(config);
    expect(config.devServer.address).toBe('123.123.123.123');
  });

  it('should default root', () => {
    validateConfig(config);
    expect(config.devServer.root).toBe(path.join(root, 'some', 'path', 'www'));
  });

  it('should set relative root', () => {
    config.devServer.root = 'my-rel-root';
    validateConfig(config);
    expect(config.devServer.root).toBe(path.join(root, 'some', 'path', 'my-rel-root'));
  });

  it('should set absolute root', () => {
    config.devServer.root = path.join(root, 'some', 'path', 'my-abs-root');
    validateConfig(config);
    expect(config.devServer.root).toBe(path.join(root, 'some', 'path', 'my-abs-root'));
  });

  it('should default gzip', () => {
    validateConfig(config);
    expect(config.devServer.gzip).toBe(true);
  });

  it('should set gzip', () => {
    config.devServer.gzip = false;
    validateConfig(config);
    expect(config.devServer.gzip).toBe(false);
  });

  it('should default port', () => {
    validateConfig(config);
    expect(config.devServer.port).toBe(3333);
  });

  it('should set port', () => {
    config.devServer.port = 4444;
    validateConfig(config);
    expect(config.devServer.port).toBe(4444);
  });

  it('should default historyApiFallback', () => {
    validateConfig(config);
    expect(config.devServer.historyApiFallback).toBeDefined();
    expect(config.devServer.historyApiFallback.index).toBe('index.html');
  });

  it('should set historyApiFallback', () => {
    config.devServer.historyApiFallback = {};
    validateConfig(config);
    expect(config.devServer.historyApiFallback).toBeDefined();
    expect(config.devServer.historyApiFallback.index).toBe('index.html');
  });

  it('should disable historyApiFallback', () => {
    config.devServer.historyApiFallback = null;
    validateConfig(config);
    expect(config.devServer.historyApiFallback).toBe(null);
  });

  it('should default hotReplacement', () => {
    validateConfig(config);
    expect(config.devServer.hotReplacement).toBe(true);
  });

  it('should set hotReplacement', () => {
    config.devServer.hotReplacement = false;
    validateConfig(config);
    expect(config.devServer.hotReplacement).toBe(false);
  });

  it('should default openBrowser', () => {
    validateConfig(config);
    expect(config.devServer.openBrowser).toBe(true);
  });

  it('should set openBrowser', () => {
    config.devServer.openBrowser = false;
    validateConfig(config);
    expect(config.devServer.openBrowser).toBe(false);
  });

  it('should set openBrowser from flag', () => {
    config.flags = { open: false };
    validateConfig(config);
    expect(config.devServer.openBrowser).toBe(false);
  });

  it('should default http protocol', () => {
    validateConfig(config);
    expect(config.devServer.protocol).toBe('http');
  });

  it('should set https protocol', () => {
    config.devServer.protocol = 'HTTPS' as any;
    validateConfig(config);
    expect(config.devServer.protocol).toBe('https');
  });

  it('should default protocol http', () => {
    validateConfig(config);
    expect(config.devServer.protocol).toBe('http');
  });

});
