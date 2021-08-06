import type * as d from '../../declarations';
import { parseFlags } from '../parse-flags';

describe('parseFlags', () => {
  const args: string[] = [];
  let sys: d.CompilerSystem = {} as any;

  beforeEach(() => {
    args.length = 0;
    sys = {
      name: 'node',
    } as any;
  });

  it('should get known and unknown args', () => {
    args.push('serve', '--address', '127.0.0.1', '--coverage', '--reporters', 'test.spec.ts');

    const flags = parseFlags(args, sys);
    expect(flags.task).toBe('serve');
    expect(flags.args[0]).toBe('--address');
    expect(flags.args[1]).toBe('127.0.0.1');
    expect(flags.args[2]).toBe('--coverage');
    expect(flags.args[3]).toBe('--reporters');
    expect(flags.args[4]).toBe('test.spec.ts');
    expect(flags.knownArgs).toEqual(['--address', '127.0.0.1']);
    expect(flags.unknownArgs[0]).toBe('--coverage');
    expect(flags.unknownArgs[1]).toBe('--reporters');
    expect(flags.unknownArgs[2]).toBe('test.spec.ts');
  });

  it('should use cli args, no npm cmds', () => {
    // user command line args
    // $ npm run serve --port 4444

    // args.slice(2)
    // [ 'serve', '--address', '127.0.0.1', '--port', '4444' ]

    args.push('serve', '--address', '127.0.0.1', '--port', '4444');

    const flags = parseFlags(args, sys);
    expect(flags.task).toBe('serve');
    expect(flags.address).toBe('127.0.0.1');
    expect(flags.port).toBe(4444);
  });

  it('should use cli args first, then npm cmds', () => {
    // user command line args
    // $ npm run serve --port 4444

    // npm script
    // "serve": "stencil serve --address 127.0.0.1 --port 8888"

    // args.slice(2)
    // [ 'serve', '--address', '127.0.0.1', '--port', '8888', '4444' ]

    // process.env.npm_config_argv
    // {"remain":["4444"],"cooked":["run","serve","--port","4444"],"original":["run","serve","--port","4444"]}

    args.push('serve', '--address', '127.0.0.1', '--port', '8888', '4444');

    sys.getEnvironmentVar = (key) => {
      if (key === 'npm_config_argv') {
        return JSON.stringify({
          original: ['run', 'serve', '--port', '4444'],
        });
      }
    };

    const flags = parseFlags(args, sys);
    expect(flags.task).toBe('serve');
    expect(flags.address).toBe('127.0.0.1');
    expect(flags.port).toBe(4444);
  });

  it('run stencil cmd from npm scripts', () => {
    // user command line args
    // $ npm run dev

    // npm script
    // "dev": "stencil build --dev --watch --serve"

    // args.slice(2)
    // [ 'build', '--dev', '--watch', '--serve' ]

    // process.env.npm_config_argv
    // {"remain":[],"cooked":["run","dev"],"original":["run","dev"]}

    args.push('build', '--dev', '--watch', '--serve');

    process.env = {
      npm_config_argv: JSON.stringify({
        original: ['run', 'dev'],
      }),
    };

    const flags = parseFlags(args, sys);
    expect(flags.task).toBe('build');
    expect(flags.dev).toBe(true);
    expect(flags.watch).toBe(true);
    expect(flags.serve).toBe(true);
  });

  it('should parse task', () => {
    args[0] = 'build';
    const flags = parseFlags(args, sys);
    expect(flags.task).toBe('build');
  });

  it('should parse no task', () => {
    args[0] = '--flag';
    const flags = parseFlags(args, sys);
    expect(flags.task).toBe(null);
  });

  it('should parse build flag to true', () => {
    args[0] = 'test';
    args[1] = '--build';
    const flags = parseFlags(args, sys);
    expect(flags.build).toBe(true);
  });

  it('should parse build flag to false', () => {
    args[0] = 'test';
    args[1] = '--no-build';
    const flags = parseFlags(args, sys);
    expect(flags.build).toBe(false);
  });

  it('should not parse build flag, default null', () => {
    args[0] = 'test';
    const flags = parseFlags(args, sys);
    expect(flags.build).toBe(null);
  });

  it('should parse --cache', () => {
    args[0] = '--cache';
    const flags = parseFlags(args, sys);
    expect(flags.cache).toBe(true);
  });

  it('should parse --no-cache', () => {
    args[0] = '--no-cache';
    const flags = parseFlags(args, sys);
    expect(flags.cache).toBe(false);
  });

  it('should not parse --cache', () => {
    const flags = parseFlags(args, sys);
    expect(flags.cache).toBe(null);
  });

  it('should parse --ci', () => {
    args[0] = '--ci';
    const flags = parseFlags(args, sys);
    expect(flags.ci).toBe(true);
  });

  it('should parse --compare', () => {
    args[0] = '--compare';
    const flags = parseFlags(args, sys);
    expect(flags.compare).toBe(true);
  });

  it('should not parse --compare', () => {
    const flags = parseFlags(args, sys);
    expect(flags.compare).toBe(null);
  });

  it('should override --config with second --config', () => {
    args[0] = '--config';
    args[1] = '/config-1.js';
    args[2] = '--config';
    args[3] = '/config-2.js';
    const flags = parseFlags(args, sys);
    expect(flags.config).toBe('/config-2.js');
  });

  it('should parse --config', () => {
    args[0] = '--config';
    args[1] = '/my-config.js';
    const flags = parseFlags(args, sys);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse --config=/my-config.js', () => {
    args[0] = '--config=/my-config.js';
    const flags = parseFlags(args, sys);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse -c', () => {
    args[0] = '-c';
    args[1] = '/my-config.js';
    const flags = parseFlags(args, sys);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse -c=/my-config.js', () => {
    args[0] = '-c=/my-config.js';
    const flags = parseFlags(args, sys);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse --debug', () => {
    args[0] = '--debug';
    const flags = parseFlags(args, sys);
    expect(flags.debug).toBe(true);
  });

  it('should parse --dev', () => {
    args[0] = '--dev';
    const flags = parseFlags(args, sys);
    expect(flags.dev).toBe(true);
  });

  it('should override --no-docs flag with --docs', () => {
    args[0] = '--no-docs';
    args[1] = '--docs';
    const flags = parseFlags(args, sys);
    expect(flags.docs).toBe(true);
  });

  it('should override --docs flag with --no-docs', () => {
    args[0] = '--docs';
    args[1] = '--no-docs';
    const flags = parseFlags(args, sys);
    expect(flags.docs).toBe(false);
  });

  it('should parse --docs', () => {
    args[0] = '--docs';
    const flags = parseFlags(args, sys);
    expect(flags.docs).toBe(true);
  });

  it('should parse --docs-json', () => {
    args[0] = '--docs-json';
    args[1] = 'some/path/docs.json';
    const flags = parseFlags(args, sys);
    expect(flags.docsJson).toBe('some/path/docs.json');
  });

  it('should parse --docs-json w/ =', () => {
    args[0] = '--docs-json=some/path/docs.json';
    const flags = parseFlags(args, sys);
    expect(flags.docsJson).toBe('some/path/docs.json');
  });

  it('should parse --e2e', () => {
    args[0] = '--e2e';
    const flags = parseFlags(args, sys);
    expect(flags.e2e).toBe(true);
  });

  it('should parse --emulate=android', () => {
    args[0] = '--emulate=android';
    const flags = parseFlags(args, sys);
    expect(flags.emulate).toBe('android');
  });

  it('should parse --emulate android', () => {
    args[0] = '--emulate';
    args[1] = 'android';
    const flags = parseFlags(args, sys);
    expect(flags.emulate).toBe('android');
  });

  it('should not parse --emulate', () => {
    const flags = parseFlags(args, sys);
    expect(flags.emulate).toBe(null);
  });

  it('should parse --es5', () => {
    args[0] = '--es5';
    const flags = parseFlags(args, sys);
    expect(flags.es5).toBe(true);
  });

  it('should parse --help', () => {
    args[0] = '--help';
    const flags = parseFlags(args, sys);
    expect(flags.help).toBe(true);
  });

  it('should parse -h', () => {
    args[0] = '-h';
    const flags = parseFlags(args, sys);
    expect(flags.help).toBe(true);
  });

  it('should parse --no-headless', () => {
    args[0] = '--no-headless';
    const flags = parseFlags(args, sys);
    expect(flags.headless).toBe(false);
  });

  it('should parse --headless', () => {
    args[0] = '--headless';
    const flags = parseFlags(args, sys);
    expect(flags.headless).toBe(true);
  });

  it('should parse --logLevel', () => {
    args[0] = '--logLevel';
    args[1] = 'error';
    const flags = parseFlags(args, sys);
    expect(flags.logLevel).toBe('error');
  });

  it('should parse --logLevel=error', () => {
    args[0] = '--logLevel=error';
    const flags = parseFlags(args, sys);
    expect(flags.logLevel).toBe('error');
  });

  it('should parse --log-level', () => {
    args[0] = '--log-level';
    args[1] = 'error';
    const flags = parseFlags(args, sys);
    expect(flags.logLevel).toBe('error');
  });

  it('should parse --log', () => {
    args[0] = '--log';
    const flags = parseFlags(args, sys);
    expect(flags.log).toBe(true);
  });

  it('should parse --maxWorkers 4', () => {
    args[0] = '--maxWorkers';
    args[1] = '4';
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(4);
  });

  it('should parse --maxWorkers=4', () => {
    args[0] = '--maxWorkers=4';
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(4);
  });

  it('should parse --max-workers 4', () => {
    args[0] = '--max-workers';
    args[1] = '4';
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(4);
  });

  it('should parse --max-workers=1', () => {
    args[0] = '--max-workers=1';
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(1);
  });

  it('should not parse --max-workers', () => {
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(null);
  });

  it('should parse --no-open', () => {
    args[0] = '--no-open';
    const flags = parseFlags(args, sys);
    expect(flags.open).toBe(false);
  });

  it('should parse --port', () => {
    args[0] = '--port';
    args[1] = '8888';
    const flags = parseFlags(args, sys);
    expect(flags.port).toBe(8888);
  });

  it('should parse -p', () => {
    args[0] = '-p';
    args[1] = '4444';
    const flags = parseFlags(args, sys);
    expect(flags.port).toBe(4444);
  });

  it('should parse --prod', () => {
    args[0] = '--prod';
    const flags = parseFlags(args, sys);
    expect(flags.prod).toBe(true);
  });

  it('should parse --profile', () => {
    args[0] = '--profile';
    const flags = parseFlags(args, sys);
    expect(flags.profile).toBe(true);
  });

  it('should parse --prerender', () => {
    args[0] = '--prerender';
    const flags = parseFlags(args, sys);
    expect(flags.prerender).toBe(true);
  });

  it('should parse --root', () => {
    args[0] = '--root';
    args[1] = 'custom-www';
    const flags = parseFlags(args, sys);
    expect(flags.root).toBe('custom-www');
  });

  it('should parse --screenshot', () => {
    args[0] = '--screenshot';
    const flags = parseFlags(args, sys);
    expect(flags.screenshot).toBe(true);
  });

  it('should parse --screenshot-connector scripts/connector.js', () => {
    args[0] = '--screenshot-connector';
    args[1] = 'scripts/connector.js';
    const flags = parseFlags(args, sys);
    expect(flags.screenshotConnector).toBe('scripts/connector.js');
  });

  it('should parse --screenshot-connector=scripts/connector.js', () => {
    args[0] = '--screenshot-connector=scripts/connector.js';
    const flags = parseFlags(args, sys);
    expect(flags.screenshotConnector).toBe('scripts/connector.js');
  });

  it('should not parse --screenshot-connector', () => {
    const flags = parseFlags(args, sys);
    expect(flags.maxWorkers).toBe(null);
  });

  it('should parse --serve', () => {
    args[0] = '--serve';
    const flags = parseFlags(args, sys);
    expect(flags.serve).toBe(true);
  });

  it('should parse --service-worker', () => {
    args[0] = '--service-worker';
    const flags = parseFlags(args, sys);
    expect(flags.serviceWorker).toBe(true);
  });

  it('should parse --spec', () => {
    args[0] = '--spec';
    const flags = parseFlags(args, sys);
    expect(flags.spec).toBe(true);
  });

  it('should parse --stats', () => {
    args[0] = '--stats';
    const flags = parseFlags(args, sys);
    expect(flags.stats).toBe(true);
  });

  it('should parse --noUpdateScreenshot', () => {
    args[0] = '--noUpdateScreenshot';
    const flags = parseFlags(args, sys);
    expect(flags.updateScreenshot).toBe(false);
  });

  it('should parse --updateScreenshot', () => {
    args[0] = '--updateScreenshot';
    const flags = parseFlags(args, sys);
    expect(flags.updateScreenshot).toBe(true);
  });

  it('should parse --update-screenshot', () => {
    args[0] = '--update-screenshot';
    const flags = parseFlags(args, sys);
    expect(flags.updateScreenshot).toBe(true);
  });

  it('should not parse --update-screenshot', () => {
    const flags = parseFlags(args, sys);
    expect(flags.updateScreenshot).toBe(null);
  });

  it('should parse --version', () => {
    args[0] = '--version';
    const flags = parseFlags(args, sys);
    expect(flags.version).toBe(true);
  });

  it('should parse -v', () => {
    args[0] = '-v';
    const flags = parseFlags(args, sys);
    expect(flags.version).toBe(true);
  });

  it('should set null version', () => {
    const flags = parseFlags(args, sys);
    expect(flags.version).toBe(null);
  });

  it('should parse --watch', () => {
    args[0] = '--watch';
    const flags = parseFlags(args, sys);
    expect(flags.watch).toBe(true);
  });

  it('should parse --ssr', () => {
    args[0] = '--ssr';
    const flags = parseFlags(args, sys);
    expect(flags.ssr).toBe(true);
  });

  it('should parse many', () => {
    args[0] = '-v';
    args[1] = '--help';
    args[2] = '-c=./myconfig.json';
    const flags = parseFlags(args, sys);
    expect(flags.version).toBe(true);
    expect(flags.help).toBe(true);
    expect(flags.config).toBe('./myconfig.json');
  });
});
