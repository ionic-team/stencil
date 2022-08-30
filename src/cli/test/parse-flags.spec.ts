import { LogLevel } from '../../declarations';
import { BOOLEAN_CLI_ARGS, STRING_CLI_ARGS, NUMBER_CLI_ARGS } from '../config-flags';
import { parseEqualsArg, parseFlags } from '../parse-flags';
import { toDashCase } from '@utils';

describe('parseFlags', () => {
  it('should get known and unknown args', () => {
    const args = ['serve', '--address', '127.0.0.1', '--potatoArgument', '--flimflammery', 'test.spec.ts'];

    const flags = parseFlags(args);
    expect(flags.task).toBe('serve');
    expect(flags.args[0]).toBe('--address');
    expect(flags.args[1]).toBe('127.0.0.1');
    expect(flags.args[2]).toBe('--potatoArgument');
    expect(flags.args[3]).toBe('--flimflammery');
    expect(flags.args[4]).toBe('test.spec.ts');
    expect(flags.knownArgs).toEqual(['--address', '127.0.0.1']);
    expect(flags.unknownArgs[0]).toBe('--potatoArgument');
    expect(flags.unknownArgs[1]).toBe('--flimflammery');
    expect(flags.unknownArgs[2]).toBe('test.spec.ts');
  });

  it('should parse cli for dev server', () => {
    // user command line args
    // $ npm run serve --port 4444

    // args.slice(2)
    // [ 'serve', '--address', '127.0.0.1', '--port', '4444' ]

    const args = ['serve', '--address', '127.0.0.1', '--port', '4444'];

    const flags = parseFlags(args);
    expect(flags.task).toBe('serve');
    expect(flags.address).toBe('127.0.0.1');
    expect(flags.port).toBe(4444);
    expect(flags.knownArgs).toEqual(['--address', '127.0.0.1', '--port', '4444']);
  });

  it('should parse task', () => {
    const flags = parseFlags(['build']);
    expect(flags.task).toBe('build');
  });

  it('should parse no task', () => {
    const flags = parseFlags(['--flag']);
    expect(flags.task).toBe(null);
  });

  /**
   * these comprehensive tests of all the supported boolean args serve as
   * regression tests against duplicating any of the arguments in the arrays.
   * Because of the way that the arg parsing algorithm works having a dupe
   * will result in a value like `[true, true]` being set on ConfigFlags, which
   * will cause these tests to start failing.
   */
  describe.each(BOOLEAN_CLI_ARGS)('should parse boolean flag %s', (cliArg) => {
    it('should parse arg', () => {
      const flags = parseFlags([`--${cliArg}`]);
      expect(flags.knownArgs).toEqual([`--${cliArg}`]);
      expect(flags[cliArg]).toBe(true);
    });

    it(`should parse --no${cliArg}`, () => {
      const negativeFlag = '--no' + cliArg.charAt(0).toUpperCase() + cliArg.slice(1);
      const flags = parseFlags([negativeFlag]);
      expect(flags.knownArgs).toEqual([negativeFlag]);
      expect(flags[cliArg]).toBe(false);
    });

    it(`should override --${cliArg} with --no${cliArg}`, () => {
      const negativeFlag = '--no' + cliArg.charAt(0).toUpperCase() + cliArg.slice(1);
      const flags = parseFlags([`--${cliArg}`, negativeFlag]);
      expect(flags.knownArgs).toEqual([`--${cliArg}`, negativeFlag]);
      expect(flags[cliArg]).toBe(false);
    });

    it('should set value to null if not present', () => {
      const flags = parseFlags([]);
      expect(flags.knownArgs).toEqual([]);
      expect(flags[cliArg]).toBe(null);
    });
  });

  describe.each(STRING_CLI_ARGS)('should parse string flag %s', (cliArg) => {
    it(`should parse "--${cliArg} value"`, () => {
      const flags = parseFlags([`--${cliArg}`, 'test-value']);
      expect(flags.knownArgs).toEqual([`--${cliArg}`, 'test-value']);
      expect(flags.unknownArgs).toEqual([]);
      expect(flags[cliArg]).toBe('test-value');
    });

    it(`should parse "--${cliArg}=value"`, () => {
      const flags = parseFlags([`--${cliArg}=path/to/file.js`]);
      expect(flags.knownArgs).toEqual([`--${cliArg}`, 'path/to/file.js']);
      expect(flags.unknownArgs).toEqual([]);
      expect(flags[cliArg]).toBe('path/to/file.js');
    });

    it(`should parse "--${toDashCase(cliArg)} value"`, () => {
      const flags = parseFlags([`--${toDashCase(cliArg)}`, 'path/to/file.js']);
      expect(flags.knownArgs).toEqual([`--${toDashCase(cliArg)}`, 'path/to/file.js']);
      expect(flags.unknownArgs).toEqual([]);
      expect(flags[cliArg]).toBe('path/to/file.js');
    });

    it(`should parse "--${toDashCase(cliArg)}=value"`, () => {
      const flags = parseFlags([`--${toDashCase(cliArg)}=path/to/file.js`]);
      expect(flags.knownArgs).toEqual([`--${toDashCase(cliArg)}`, 'path/to/file.js']);
      expect(flags.unknownArgs).toEqual([]);
      expect(flags[cliArg]).toBe('path/to/file.js');
    });
  });

  it.each(NUMBER_CLI_ARGS)('should parse number flag %s', (cliArg) => {
    const flags = parseFlags([`--${cliArg}`, '42']);
    expect(flags.knownArgs).toEqual([`--${cliArg}`, '42']);
    expect(flags.unknownArgs).toEqual([]);
    expect(flags[cliArg]).toBe(42);
  });

  it('should override --config with second --config', () => {
    const args = ['--config', '/config-1.js', '--config', '/config-2.js'];
    const flags = parseFlags(args);
    expect(flags.config).toBe('/config-2.js');
  });

  describe.each<LogLevel>(['info', 'warn', 'error', 'debug'])('logLevel %s', (level) => {
    it("should parse '--logLevel %s'", () => {
      const args = ['--logLevel', level];
      const flags = parseFlags(args);
      expect(flags.logLevel).toBe(level);
    });

    it('should parse --logLevel=%s', () => {
      const args = [`--logLevel=${level}`];
      const flags = parseFlags(args);
      expect(flags.logLevel).toBe(level);
    });

    it("should parse '--log-level %s'", () => {
      const flags = parseFlags(['--log-level', level]);
      expect(flags.logLevel).toBe(level);
    });

    it('should parse --log-level=%s', () => {
      const flags = parseFlags([`--log-level=${level}`]);
      expect(flags.logLevel).toBe(level);
    });
  });

  /**
   * maxWorkers is (as of this writing) our only StringNumberCLIArg, meaning it
   * may be a string (like "50%") or a number (like 4). For this reason we have
   * some tests just for it.
   */
  describe('maxWorkers', () => {
    it.each([
      ['--maxWorkers', '4'],
      ['--maxWorkers=4'],
      ['--max-workers', '4'],
      ['--maxWorkers', '4e+0'],
      ['--maxWorkers', '40e-1'],
    ])('should parse %p, %p', (...args) => {
      const flags = parseFlags(args);
      expect(flags.maxWorkers).toBe(4);
    });

    it('should parse --maxWorkers 4', () => {
      const flags = parseFlags(['--maxWorkers', '4']);
      expect(flags.maxWorkers).toBe(4);
    });

    it('should parse --maxWorkers=4', () => {
      const flags = parseFlags(['--maxWorkers=4']);
      expect(flags.maxWorkers).toBe(4);
    });

    it('should parse --max-workers 4', () => {
      const flags = parseFlags(['--max-workers', '4']);
      expect(flags.maxWorkers).toBe(4);
    });

    it('should parse --maxWorkers=50%', function () {
      // see https://jestjs.io/docs/27.x/cli#--maxworkersnumstring
      const flags = parseFlags(['--maxWorkers=50%']);
      expect(flags.maxWorkers).toBe('50%');
    });

    it('should parse --max-workers=1', () => {
      const flags = parseFlags(['--max-workers=1']);
      expect(flags.maxWorkers).toBe(1);
    });

    it('should not parse --max-workers', () => {
      const flags = parseFlags([]);
      expect(flags.maxWorkers).toBe(null);
    });
  });

  describe('aliases', () => {
    describe('-p (alias for port)', () => {
      it('should parse -p=4444', () => {
        const flags = parseFlags(['-p=4444']);
        expect(flags.port).toBe(4444);
      });
      it('should parse -p 4444', () => {
        const flags = parseFlags(['-p', '4444']);
        expect(flags.port).toBe(4444);
      });
    });

    it('should parse -h (alias for help)', () => {
      const flags = parseFlags(['-h']);
      expect(flags.help).toBe(true);
    });

    it('should parse -v (alias for version)', () => {
      const flags = parseFlags(['-v']);
      expect(flags.version).toBe(true);
    });

    describe('-c alias for config', () => {
      it('should parse -c /my-config.js', () => {
        const flags = parseFlags(['-c', '/my-config.js']);
        expect(flags.config).toBe('/my-config.js');
      });

      it('should parse -c=/my-config.js', () => {
        const flags = parseFlags(['-c=/my-config.js']);
        expect(flags.config).toBe('/my-config.js');
      });
    });
  });

  it('should parse many', () => {
    const args = ['-v', '--help', '-c=./myconfig.json'];
    const flags = parseFlags(args);
    expect(flags.version).toBe(true);
    expect(flags.help).toBe(true);
    expect(flags.config).toBe('./myconfig.json');
  });

  describe('parseEqualsArg', () => {
    it.each([
      ['--fooBar=baz', '--fooBar', 'baz'],
      ['--foo-bar=4', '--foo-bar', '4'],
      ['--fooBar=twenty=3*4', '--fooBar', 'twenty=3*4'],
      ['--fooBar', '--fooBar', ''],
      ['--foo-bar', '--foo-bar', ''],
    ])('should parse %s correctly', (testArg, expectedArg, expectedValue) => {
      const [arg, value] = parseEqualsArg(testArg);
      expect(arg).toBe(expectedArg);
      expect(value).toBe(expectedValue);
    });
  });
});
