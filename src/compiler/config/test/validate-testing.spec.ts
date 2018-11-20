import * as d from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';


describe('validateTesting', () => {

  let config: d.Config;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      flags: {},
      outputTargets: [{
        type: 'www',
        dir: '/www'
      } as any as d.OutputTargetStats]
    };
  });


  it('set headless false w/ flag', () => {
    config.flags.e2e = true;
    config.flags.headless = false;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(false);
  });

  it('set headless true w/ flag', () => {
    config.flags.e2e = true;
    config.flags.headless = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default headless true', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('force headless with ci flag', () => {
    config.flags.e2e = true;
    config.flags.headless = false;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default to no-sandbox browser args with ci flag', () => {
    config.flags.e2e = true;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual([
      '--disable-gpu',
      '--disable-canvas-aa',
      '--disable-composited-antialiasing',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]);
  });

  it('default browser args', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual([
      '--disable-gpu',
      '--disable-canvas-aa',
      '--disable-composited-antialiasing'
    ]);
  });

  it('set default testPathIgnorePatterns', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      "/User/some/path/.vscode",
      "/User/some/path/.stencil",
      "/User/some/path/node_modules",
      "/www",
    ]);
  });

  it('set default testPathIgnorePatterns with custom outputTargets', () => {
    config.flags.e2e = true;
    config.outputTargets = [
      { type: 'dist', dir: './dist-folder' },
      { type: 'www', dir: './www-folder' },
      { type: 'docs', dir: './docs' },
    ];
    validateConfig(config);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      "/User/some/path/.vscode",
      "/User/some/path/.stencil",
      "/User/some/path/node_modules",
      "/User/some/path/dist-folder",
      "/User/some/path/www-folder",
    ]);
  });
});
