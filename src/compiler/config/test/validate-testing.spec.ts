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

  it('default to no-sandbox browser args with ci flag', () => {
    config.flags.e2e = true;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual([
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]);
  });

  it('force headless with ci flag', () => {
    config.flags.e2e = true;
    config.flags.headless = false;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default to no browser args', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual(undefined);
  });

});
