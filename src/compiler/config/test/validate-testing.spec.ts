import type * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';
import path from 'path';

describe('validateTesting', () => {
  let userConfig: d.Config;
  const ROOT = path.resolve('/');
  const sys = mockStencilSystem();
  const logger = mockLogger();

  beforeEach(() => {
    userConfig = {
      sys: sys as any,
      logger: logger,
      rootDir: path.join(ROOT, 'User', 'some', 'path'),
      srcDir: path.join(ROOT, 'User', 'some', 'path', 'src'),
      flags: {},
      namespace: 'Testing',
      configPath: path.join(ROOT, 'User', 'some', 'path', 'stencil.config.ts'),
    };
    userConfig.outputTargets = [
      {
        type: 'www',
        dir: path.join(ROOT, 'www'),
      } as any as d.OutputTargetStats,
    ];
  });

  it('set headless false w/ flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = false;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(false);
  });

  it('set headless true w/ flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default headless true', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('force headless with ci flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = false;
    userConfig.flags.ci = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default to no-sandbox browser args with ci flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.ci = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserArgs).toEqual([
      '--font-render-hinting=medium',
      '--incognito',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ]);
  });

  it('default browser args', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserArgs).toEqual(['--font-render-hinting=medium', '--incognito']);
  });

  it('set default testPathIgnorePatterns', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'www'),
    ]);
  });

  it('set default testPathIgnorePatterns with custom outputTargets', () => {
    userConfig.flags.e2e = true;
    userConfig.outputTargets = [
      { type: 'dist', dir: 'dist-folder' },
      { type: 'www', dir: 'www-folder' },
      { type: 'docs-readme', dir: 'docs' },
    ];
    const { config } = validateConfig(userConfig);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'User', 'some', 'path', 'www-folder'),
      path.join(ROOT, 'User', 'some', 'path', 'dist-folder'),
    ]);
  });

  it('set relative testEnvironment to absolute', () => {
    userConfig.flags.e2e = true;
    userConfig.testing = {
      testEnvironment: './rel-path.js',
    };
    const { config } = validateConfig(userConfig);
    expect(path.isAbsolute(config.testing.testEnvironment)).toBe(true);
    expect(path.basename(config.testing.testEnvironment)).toEqual('rel-path.js');
  });

  it('set node module testEnvironment', () => {
    userConfig.flags.e2e = true;
    userConfig.testing = {
      testEnvironment: 'jsdom',
    };
    const { config } = validateConfig(userConfig);
    expect(config.testing.testEnvironment).toEqual('jsdom');
  });

  it('do nothing for empty testEnvironment', () => {
    const { config } = validateConfig(userConfig);
    expect(config.testing.testEnvironment).toBeUndefined();
  });

  describe('testRegex', () => {
    let testRegex: RegExp;

    beforeEach(() => {
      userConfig.flags.spec = true;

      const { testing: testConfig } = validateConfig(userConfig).config;
      const testRegexSetting = testConfig?.testRegex;

      if (!testRegexSetting) {
        fail('No testRegex was found in the Stencil TestingConfig. Failing test.');
      }

      testRegex = new RegExp(testRegexSetting);
    });

    describe('test.* extensions', () => {
      it('matches files ending in .test.ts', () => {
        expect(testRegex.test('my-component.test.ts')).toBe(true);
      });

      it('matches files ending in .test.tsx', () => {
        expect(testRegex.test('my-component.test.tsx')).toBe(true);
      });

      it('matches files ending in .test.js', () => {
        expect(testRegex.test('my-component.test.js')).toBe(true);
      });

      it('matches files ending in .test.jsx', () => {
        expect(testRegex.test('my-component.test.jsx')).toBe(true);
      });

      it('matches the file "test.ts"', () => {
        expect(testRegex.test('some/path/test.ts')).toBe(true);
      });

      it('matches the file "test.tsx"', () => {
        expect(testRegex.test('some/path/test.tsx')).toBe(true);
      });

      it('matches the file "test.js"', () => {
        expect(testRegex.test('some/path/test.js')).toBe(true);
      });

      it('matches the file "test.jsx"', () => {
        expect(testRegex.test('some/path/test.jsx')).toBe(true);
      });

      it("doesn't match snap files ending in test.ts.snap", () => {
        expect(testRegex.test('my-component.test.ts.snap')).toBe(false);
      });

      it("doesn't match snap files ending in test.tsx.snap", () => {
        expect(testRegex.test('my-component.test.tsx.snap')).toBe(false);
      });

      it("doesn't match snap files ending in test.js.snap", () => {
        expect(testRegex.test('my-component.test.js.snap')).toBe(false);
      });

      it("doesn't match snap files ending in test.jsx.snap", () => {
        expect(testRegex.test('my-component.test.jsx.snap')).toBe(false);
      });

      it("doesn't match files ending in test.ts", () => {
        expect(testRegex.test('my-component-test.ts')).toBe(false);
      });

      it("doesn't match files ending in test.tsx", () => {
        expect(testRegex.test('my-component-test.tsx')).toBe(false);
      });

      it("doesn't match files ending in test.js", () => {
        expect(testRegex.test('my-component-test.js')).toBe(false);
      });

      it("doesn't match files ending in test.jsx", () => {
        expect(testRegex.test('my-component-test.jsx')).toBe(false);
      });

      it("doesn't match files ending in .test.t", () => {
        expect(testRegex.test('my-component.test.t')).toBe(false);
      });

      it("doesn't match files ending in .test.j", () => {
        expect(testRegex.test('my-component.test.j')).toBe(false);
      });
    });

    describe('spec.* extensions', () => {
      it('matches files ending in .spec.ts', () => {
        expect(testRegex.test('my-component.spec.ts')).toBe(true);
      });

      it('matches files ending in .spec.tsx', () => {
        expect(testRegex.test('my-component.spec.tsx')).toBe(true);
      });

      it('matches files ending in .spec.js', () => {
        expect(testRegex.test('my-component.spec.js')).toBe(true);
      });

      it('matches files ending in .spec.jsx', () => {
        expect(testRegex.test('my-component.spec.jsx')).toBe(true);
      });

      it('matches the file "spec.ts"', () => {
        expect(testRegex.test('some/path/spec.ts')).toBe(true);
      });

      it('matches the file "spec.tsx"', () => {
        expect(testRegex.test('some/path/spec.tsx')).toBe(true);
      });

      it('matches the file "spec.js"', () => {
        expect(testRegex.test('some/path/spec.js')).toBe(true);
      });

      it('matches the file "spec.jsx"', () => {
        expect(testRegex.test('some/path/spec.jsx')).toBe(true);
      });

      it("doesn't match snap files ending in spec.ts.snap", () => {
        expect(testRegex.test('my-component.spec.ts.snap')).toBe(false);
      });

      it("doesn't match snap files ending in spec.tsx.snap", () => {
        expect(testRegex.test('my-component.spec.tsx.snap')).toBe(false);
      });

      it("doesn't match snap files ending in spec.js.snap", () => {
        expect(testRegex.test('my-component.spec.js.snap')).toBe(false);
      });

      it("doesn't match snap files ending in spec.jsx.snap", () => {
        expect(testRegex.test('my-component.spec.jsx.snap')).toBe(false);
      });

      it("doesn't match files ending in spec.ts", () => {
        expect(testRegex.test('my-component-spec.ts')).toBe(false);
      });

      it("doesn't match files ending in spec.tsx", () => {
        expect(testRegex.test('my-component-spec.tsx')).toBe(false);
      });

      it("doesn't match files ending in spec.js", () => {
        expect(testRegex.test('my-component-spec.js')).toBe(false);
      });

      it("doesn't match files ending in spec.jsx", () => {
        expect(testRegex.test('my-component-spec.jsx')).toBe(false);
      });

      it("doesn't match files ending in .spec.t", () => {
        expect(testRegex.test('my-component.spec.t')).toBe(false);
      });

      it("doesn't match files ending in .spec.j", () => {
        expect(testRegex.test('my-component.spec.j')).toBe(false);
      });
    });

    describe('e2e.* extensions', () => {
      it('matches files ending in .e2e.ts', () => {
        expect(testRegex.test('my-component.e2e.ts')).toBe(true);
      });

      it('matches files ending in .e2e.tsx', () => {
        expect(testRegex.test('my-component.e2e.tsx')).toBe(true);
      });

      it('matches files ending in .e2e.js', () => {
        expect(testRegex.test('my-component.e2e.js')).toBe(true);
      });

      it('matches files ending in .e2e.jsx', () => {
        expect(testRegex.test('my-component.e2e.jsx')).toBe(true);
      });

      it('matches the file "e2e.ts"', () => {
        expect(testRegex.test('some/path/e2e.ts')).toBe(true);
      });

      it('matches the file "e2e.tsx"', () => {
        expect(testRegex.test('some/path/e2e.tsx')).toBe(true);
      });

      it('matches the file "e2e.js"', () => {
        expect(testRegex.test('some/path/e2e.js')).toBe(true);
      });

      it('matches the file "e2e.jsx"', () => {
        expect(testRegex.test('some/path/e2e.jsx')).toBe(true);
      });

      it("doesn't match snap files ending in e2e.ts.snap", () => {
        expect(testRegex.test('my-component.e2e.ts.snap')).toBe(false);
      });

      it("doesn't match snap files ending in e2e.tsx.snap", () => {
        expect(testRegex.test('my-component.e2e.tsx.snap')).toBe(false);
      });

      it("doesn't match snap files ending in e2e.js.snap", () => {
        expect(testRegex.test('my-component.e2e.js.snap')).toBe(false);
      });

      it("doesn't match snap files ending in e2e.jsx.snap", () => {
        expect(testRegex.test('my-component.e2e.jsx.snap')).toBe(false);
      });

      it("doesn't match files ending in e2e.ts", () => {
        expect(testRegex.test('my-component-e2e.ts')).toBe(false);
      });

      it("doesn't match files ending in e2e.tsx", () => {
        expect(testRegex.test('my-component-e2e.tsx')).toBe(false);
      });

      it("doesn't match files ending in e2e.js", () => {
        expect(testRegex.test('my-component-e2e.js')).toBe(false);
      });

      it("doesn't match files ending in e2e.jsx", () => {
        expect(testRegex.test('my-component-e2e.jsx')).toBe(false);
      });

      it("doesn't match files ending in .e2e.t", () => {
        expect(testRegex.test('my-component.e2e.t')).toBe(false);
      });

      it("doesn't match files ending in .e2e.j", () => {
        expect(testRegex.test('my-component.e2e.j')).toBe(false);
      });
    });
  });
});
