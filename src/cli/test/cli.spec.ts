import { CliArgv, getConfigFilePath, overrideConfigFromArgv, parseArgv } from '../cli-utils';
import { Config } from '../../declarations';
import { mockStencilSystem } from '../../testing/mocks';
import { run } from '../index';
import { validateBuildConfig } from '../../compiler/config/validate-config';


describe('cli', () => {

  let process: NodeJS.Process;
  const logger: any = {
    error: (msg: string) => { error = msg; },
    log: () => {/**/},
    warn: () => {/**/},
    debug: () => {/**/}
  };
  var error: string;
  var exitCode: number;
  var config: Config;

  beforeEach(() => {
    process = {} as any;
    process.cwd = () => '/User/ellie_mae';
    process.exit = (code) => { exitCode = code; };
    process.once = () => process;
    process.on = () => process;
    process.env = {};
    process.platform = 'win32';
    process.argv = ['/node', '/stencil'];
    process.version = 'v6.11.2';
    error = null;
    exitCode = null;

    config = {};
    config.logger = logger;
    config.rootDir = process.cwd();
    config.sys = mockStencilSystem();
  });


  describe('getConfigFilePath', () => {

    it('should get absolute config path from argv', () => {
      const configPath = getConfigFilePath(process, config.sys, '/my-absolute-path/some.config.js');
      expect(configPath).toBe('/my-absolute-path/some.config.js');
    });

    it('should get cwd relative config path from argv', () => {
      process.cwd = () => '/my-cwd';
      const configPath = getConfigFilePath(process, config.sys, 'some.config.js');
      expect(configPath).toBe('/my-cwd/some.config.js');
    });

    it('should default config path from process.cwd()', () => {
      process.cwd = () => '/my-cwd';
      const configPath = getConfigFilePath(process, config.sys, '/my-cwd');
      expect(configPath).toBe('/my-cwd');
    });

  });

  describe('overrideConfigFromArgv', () => {

    it('should override dev mode', () => {
      config.devMode = true;
      const argv: CliArgv = { prod: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.devMode).toBe(false);
    });

    it('should override prod mode', () => {
      config.devMode = false;
      const argv: CliArgv = { dev: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.devMode).toBe(true);
    });

    it('should set debug log level', () => {
      const argv: CliArgv = { debug: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.logLevel).toBe('debug');
    });

    it('should set log level', () => {
      const argv: CliArgv = { logLevel: 'error' };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.logLevel).toBe('error');
    });

    it('should set no-cache', () => {
      const argv: CliArgv = { noCache: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.enableCache).toBe(false);
    });

    it('should disable prerender by default', () => {
      config.prerender = true;
      const argv: CliArgv = {};
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.prerender).toBe(false);
    });

    it('should enable prerender with argv', () => {
      const argv: CliArgv = { prerender: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.prerender).toBe(true);
    });

    it('should enable writeLog with argv', () => {
      const argv: CliArgv = { log: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.writeLog).toBe(true);
    });

    it('should enable service worker in prod mode by default', () => {
      config.devMode = false;
      const argv: CliArgv = {};
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.serviceWorker).toBe(true);
    });

    it('should disable service worker in dev mode by default', () => {
      config.devMode = true;
      const argv: CliArgv = {};
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.serviceWorker).toBe(false);
    });

    it('should force enable service worker in dev mode with argv', () => {
      config.devMode = true;
      const argv: CliArgv = { serviceWorker: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.serviceWorker).toBe(true);
    });

    it('should not enable service worker in prod mode if service worker config is false', () => {
      config.devMode = false;
      config.serviceWorker = false;
      const argv: CliArgv = {};
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.serviceWorker).toBe(false);
    });

    it('should not enable service worker in dev mode if service worker config is false', () => {
      config.devMode = true;
      config.serviceWorker = false;
      const argv: CliArgv = {};
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.serviceWorker).toBe(false);
    });

    it('should enable docs generate', () => {
      const argv: CliArgv = { docs: true };
      overrideConfigFromArgv(config, argv);
      validateBuildConfig(config);
      expect(config.generateDocs).toBe(true);
    });

  });

});
