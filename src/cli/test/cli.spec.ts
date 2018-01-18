import { Config } from '../../util/interfaces';
import { getConfigFilePath, parseArgv, overrideConfigFromArgv, CliArgv } from '../cli-utils';
import { mockStencilSystem } from '../../testing/mocks';
import { run } from '../index';
import { validateBuildConfig } from '../../util/validate-config';


describe('cli', () => {

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

  describe('parseCmdArgs', () => {

    it('should parse args', () => {
      process.argv[2] = '--version';
      let argv = parseArgv(process);
      expect(argv.version).toBe(true);

      process.argv[2] = '-v';
      argv = parseArgv(process);
      expect(argv.version).toBe(true);

      process.argv[2] = '--help';
      argv = parseArgv(process);
      expect(argv.help).toBe(true);

      process.argv[2] = '-h';
      argv = parseArgv(process);
      expect(argv.help).toBe(true);

      process.argv[2] = '--prod';
      argv = parseArgv(process);
      expect(argv.prod).toBe(true);

      process.argv[2] = '--dev';
      argv = parseArgv(process);
      expect(argv.dev).toBe(true);

      process.argv[2] = '--watch';
      argv = parseArgv(process);
      expect(argv.watch).toBe(true);

      process.argv[2] = '--debug';
      argv = parseArgv(process);
      expect(argv.debug).toBe(true);

      process.argv[2] = '--prerender';
      argv = parseArgv(process);
      expect(argv.prerender).toBe(true);

      process.argv[2] = '--service-worker';
      argv = parseArgv(process);
      expect(argv.serviceWorker).toBe(true);

      process.argv[2] = '--log-level';
      process.argv[3] = 'error';
      argv = parseArgv(process);
      expect(argv.logLevel).toBe('error');

      process.argv[2] = '--config';
      process.argv[3] = '/my-config.js';
      argv = parseArgv(process);
      expect(argv.config).toBe('/my-config.js');

      process.argv[2] = '-c';
      process.argv[3] = '/my-config.js';
      argv = parseArgv(process);
      expect(argv.config).toBe('/my-config.js');

      process.argv[2] = '--es5';
      argv = parseArgv(process);
      expect(argv.es5).toBe(true);

      process.argv[2] = '--docs';
      argv = parseArgv(process);
      expect(argv.docs).toBe(true);
    });

  });


  var process: NodeJS.Process;
  var logger: any = {
    error: (msg: string) => { error = msg; },
    log: () => {},
    warn: () => {},
    debug: () => {}
  };
  var error: string;
  var exitCode: number;
  var config: Config;

  beforeEach(() => {
    (process as any) = {};
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

});
