import { Config, ConfigFlags } from '@declarations';
import { getConfigFilePath } from '../cli-utils';
import { mockStencilSystem } from '../../testing/mocks';
import { parseFlags } from '../parse-flags';
import { run } from '../index';


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
    (process as any).exit = (code) => { exitCode = code; };
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

});
