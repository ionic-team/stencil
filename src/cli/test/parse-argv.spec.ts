import { parseArgv } from '../cli-utils';
import { StencilSystem } from '../../declarations';
const minimist = require('minimist');


describe('parseArgv', () => {

  let process: NodeJS.Process;
  let sys: StencilSystem;

  beforeEach(() => {
    process = {} as any;
    process.cwd = () => '/User/ellie_mae';
    process.argv = ['/node', '/stencil'];
    sys = {
      parseArgv: (args: string[], opts: any) => {
        return minimist(args, opts);
      }
    };
  });

  it('should parse args', () => {
    process.argv[2] = '--version';
    let argv = parseArgv(process, sys);
    expect(argv.version).toBe(true);

    process.argv[2] = '-v';
    argv = parseArgv(process, sys);
    expect(argv.version).toBe(true);

    process.argv[2] = '--help';
    argv = parseArgv(process, sys);
    expect(argv.help).toBe(true);

    process.argv[2] = '-h';
    argv = parseArgv(process, sys);
    expect(argv.help).toBe(true);

    process.argv[2] = '--prod';
    argv = parseArgv(process, sys);
    expect(argv.prod).toBe(true);

    process.argv[2] = '--dev';
    argv = parseArgv(process, sys);
    expect(argv.dev).toBe(true);

    process.argv[2] = '--watch';
    argv = parseArgv(process, sys);
    expect(argv.watch).toBe(true);

    process.argv[2] = '--no-cache';
    argv = parseArgv(process, sys);
    expect(argv.noCache).toBe(true);

    process.argv[2] = '--debug';
    argv = parseArgv(process, sys);
    expect(argv.debug).toBe(true);

    process.argv[2] = '--prerender';
    argv = parseArgv(process, sys);
    expect(argv.prerender).toBe(true);

    process.argv[2] = '--service-worker';
    argv = parseArgv(process, sys);
    expect(argv.serviceWorker).toBe(true);

    process.argv[2] = '--log-level';
    process.argv[3] = 'error';
    argv = parseArgv(process, sys);
    expect(argv.logLevel).toBe('error');

    process.argv[2] = '--log';
    argv = parseArgv(process, sys);
    expect(argv.log).toBe(true);

    process.argv[2] = '--stats';
    argv = parseArgv(process, sys);
    expect(argv.stats).toBe(true);

    process.argv[2] = '--config';
    process.argv[3] = '/my-config.js';
    argv = parseArgv(process, sys);
    expect(argv.config).toBe('/my-config.js');

    process.argv[2] = '-c';
    process.argv[3] = '/my-config.js';
    argv = parseArgv(process, sys);
    expect(argv.config).toBe('/my-config.js');

    process.argv[2] = '--es5';
    argv = parseArgv(process, sys);
    expect(argv.es5).toBe(true);

    process.argv[2] = '--docs';
    argv = parseArgv(process, sys);
    expect(argv.docs).toBe(true);
  });

});
