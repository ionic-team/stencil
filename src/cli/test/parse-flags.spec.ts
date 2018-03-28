import { StencilSystem } from '../../declarations';
import { parseFlags } from '../parse-flags';


describe('parseFlags', () => {

  let process: NodeJS.Process;

  beforeEach(() => {
    process = {} as any;
    process.cwd = () => '/User/ellie_mae';
    process.argv = ['/node', '/stencil'];
  });


  it('should parse task', () => {
    process.argv[2] = 'build';
    const flags = parseFlags(process);
    expect(flags.task).toBe('build');
  });

  it('should parse no task', () => {
    process.argv[2] = '--flag';
    const flags = parseFlags(process);
    expect(flags.task).toBe(null);
  });

  it('should parse --cache', () => {
    process.argv[2] = '--cache';
    const flags = parseFlags(process);
    expect(flags.cache).toBe(true);
  });

  it('should parse --no-cache', () => {
    process.argv[2] = '--no-cache';
    const flags = parseFlags(process);
    expect(flags.cache).toBe(false);
  });

  it('should not parse --cache', () => {
    const flags = parseFlags(process);
    expect(flags.cache).toBe(null);
  });

  it('should parse --config', () => {
    process.argv[2] = '--config';
    process.argv[3] = '/my-config.js';
    const flags = parseFlags(process);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse --config=/my-config.js', () => {
    process.argv[2] = '--config=/my-config.js';
    const flags = parseFlags(process);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse -c', () => {
    process.argv[2] = '-c';
    process.argv[3] = '/my-config.js';
    const flags = parseFlags(process);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse -c=/my-config.js', () => {
    process.argv[2] = '-c=/my-config.js';
    const flags = parseFlags(process);
    expect(flags.config).toBe('/my-config.js');
  });

  it('should parse --debug', () => {
    process.argv[2] = '--debug';
    const flags = parseFlags(process);
    expect(flags.debug).toBe(true);
  });

  it('should parse --dev', () => {
    process.argv[2] = '--dev';
    const flags = parseFlags(process);
    expect(flags.dev).toBe(true);
  });

  it('should parse --docs', () => {
    process.argv[2] = '--docs';
    const flags = parseFlags(process);
    expect(flags.docs).toBe(true);
  });

  it('should parse --docs-json', () => {
    process.argv[2] = '--docs-json';
    process.argv[3] = 'some/path/docs.json';
    const flags = parseFlags(process);
    expect(flags.docsJson).toBe('some/path/docs.json');
  });

  it('should parse --docs-json w/ =', () => {
    process.argv[2] = '--docs-json=some/path/docs.json';
    const flags = parseFlags(process);
    expect(flags.docsJson).toBe('some/path/docs.json');
  });

  it('should parse --es5', () => {
    process.argv[2] = '--es5';
    const flags = parseFlags(process);
    expect(flags.es5).toBe(true);
  });

  it('should parse --help', () => {
    process.argv[2] = '--help';
    const flags = parseFlags(process);
    expect(flags.help).toBe(true);
  });

  it('should parse -h', () => {
    process.argv[2] = '-h';
    const flags = parseFlags(process);
    expect(flags.help).toBe(true);
  });

  it('should parse --log-level', () => {
    process.argv[2] = '--log-level';
    process.argv[3] = 'error';
    const flags = parseFlags(process);
    expect(flags.logLevel).toBe('error');
  });

  it('should parse --log', () => {
    process.argv[2] = '--log';
    const flags = parseFlags(process);
    expect(flags.log).toBe(true);
  });

  it('should parse --prod', () => {
    process.argv[2] = '--prod';
    const flags = parseFlags(process);
    expect(flags.prod).toBe(true);
  });

  it('should parse --prerender', () => {
    process.argv[2] = '--prerender';
    const flags = parseFlags(process);
    expect(flags.prerender).toBe(true);
  });

  it('should parse --stats', () => {
    process.argv[2] = '--stats';
    const flags = parseFlags(process);
    expect(flags.stats).toBe(true);
  });

  it('should parse --version', () => {
    process.argv[2] = '--version';
    const flags = parseFlags(process);
    expect(flags.version).toBe(true);
  });

  it('should parse -v', () => {
    process.argv[2] = '-v';
    const flags = parseFlags(process);
    expect(flags.version).toBe(true);
  });

  it('should set null version', () => {
    const flags = parseFlags(process);
    expect(flags.version).toBe(null);
  });

  it('should parse --watch', () => {
    process.argv[2] = '--watch';
    const flags = parseFlags(process);
    expect(flags.watch).toBe(true);
  });

  it('should parse many', () => {
    process.argv[2] = '-v';
    process.argv[3] = '--help';
    process.argv[4] = '-c=./myconfig.json';
    const flags = parseFlags(process);
    expect(flags.version).toBe(true);
    expect(flags.help).toBe(true);
    expect(flags.config).toBe('./myconfig.json');
  });

});
