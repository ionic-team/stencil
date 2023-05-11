import type * as d from '@stencil/core/declarations';
import { mockCompilerSystem, mockLoadConfigInit, mockLogger } from '@stencil/core/testing';
import path from 'path';

import { ConfigFlags, createConfigFlags } from '../../../cli/config-flags';
import { validateConfig } from '../validate-config';

describe('validateTesting', () => {
  const ROOT = path.resolve('/');
  const sys = mockCompilerSystem();
  const logger = mockLogger();
  let userConfig: d.Config;
  let flags: ConfigFlags;

  beforeEach(() => {
    flags = createConfigFlags();
    userConfig = {
      sys: sys as any,
      logger: logger,
      rootDir: path.join(ROOT, 'User', 'some', 'path'),
      srcDir: path.join(ROOT, 'User', 'some', 'path', 'src'),
      flags,
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

  describe('browserHeadless', () => {
    describe("using 'headless' value from cli", () => {
      it.each([false, true, 'new'])('sets browserHeadless to %s', (headless) => {
        userConfig.flags = { ...flags, e2e: true, headless };
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.testing.browserHeadless).toBe(headless);
      });

      it('defaults to true outside of CI', () => {
        userConfig.flags = { ...flags, e2e: true };
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.testing.browserHeadless).toBe(true);
      });
    });

    describe('with ci enabled', () => {
      it("forces using the old headless mode when 'headless: false'", () => {
        userConfig.flags = { ...flags, ci: true, e2e: true, headless: false };
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.testing.browserHeadless).toBe(true);
      });

      it('allows the new headless mode to be used', () => {
        userConfig.flags = { ...flags, ci: true, e2e: true, headless: 'new' };
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.testing.browserHeadless).toBe('new');
      });
    });

    describe('`testing` configuration', () => {
      beforeEach(() => {
        userConfig.flags = { ...flags, e2e: true, headless: undefined };
      });

      it.each<boolean | 'new'>([false, true, 'new'])(
        'uses %s browserHeadless mode from testing config',
        (browserHeadlessValue) => {
          userConfig.testing = { browserHeadless: browserHeadlessValue };
          const { config } = validateConfig(userConfig, mockLoadConfigInit());
          expect(config.testing.browserHeadless).toBe(browserHeadlessValue);
        }
      );

      it('defaults the headless mode to true when browserHeadless is not provided', () => {
        userConfig.testing = {};
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.testing.browserHeadless).toBe(true);
      });
    });
  });

  describe('browserArgs', () => {
    it('adds default browser args', () => {
      userConfig.flags = { ...flags, e2e: true };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.browserArgs).toEqual(['--font-render-hinting=medium', '--incognito']);
    });

    it("adds additional browser args when the 'ci' flag is set", () => {
      userConfig.flags = { ...flags, ci: true, e2e: true };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.browserArgs).toEqual([
        '--font-render-hinting=medium',
        '--incognito',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]);
    });
  });

  describe('testPathIgnorePatterns', () => {
    it('set default testPathIgnorePatterns', () => {
      userConfig.flags = { ...flags, e2e: true };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.testPathIgnorePatterns).toEqual([
        path.join(ROOT, 'User', 'some', 'path', '.vscode'),
        path.join(ROOT, 'User', 'some', 'path', '.stencil'),
        path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
        path.join(ROOT, 'www'),
      ]);
    });

    it('set default testPathIgnorePatterns with custom outputTargets', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.outputTargets = [
        { type: 'dist', dir: 'dist-folder' },
        { type: 'www', dir: 'www-folder' },
        { type: 'docs-readme', dir: 'docs' },
      ];
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.testPathIgnorePatterns).toEqual([
        path.join(ROOT, 'User', 'some', 'path', '.vscode'),
        path.join(ROOT, 'User', 'some', 'path', '.stencil'),
        path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
        path.join(ROOT, 'User', 'some', 'path', 'www-folder'),
        path.join(ROOT, 'User', 'some', 'path', 'dist-folder'),
      ]);
    });
  });

  describe('testEnvironment', () => {
    it('set relative testEnvironment to absolute', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testEnvironment: './rel-path.js',
      };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(path.isAbsolute(config.testing.testEnvironment)).toBe(true);
      expect(path.basename(config.testing.testEnvironment)).toEqual('rel-path.js');
    });

    it('set node module testEnvironment', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testEnvironment: 'jsdom',
      };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.testEnvironment).toEqual('jsdom');
    });

    it('do nothing for empty testEnvironment', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.testEnvironment).toBeUndefined();
    });
  });

  describe('testRegex', () => {
    let testRegex: RegExp;

    beforeEach(() => {
      userConfig.flags = { ...flags, spec: true };

      const { testing: testConfig } = validateConfig(userConfig, mockLoadConfigInit()).config;
      const testRegexSetting = testConfig?.testRegex;

      if (!testRegexSetting) {
        throw new Error('No testRegex was found in the Stencil TestingConfig. Failing test.');
      }

      testRegex = new RegExp(testRegexSetting);
    });

    describe('test.* extensions', () => {
      it.each([
        'my-component.test.ts',
        'my-component.test.tsx',
        'my-component.test.js',
        'my-component.test.jsx',
        'some/path/test.ts',
        'some/path/test.tsx',
        'some/path/test.js',
        'some/path/test.jsx',
      ])(`matches the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(true);
      });

      it.each([
        'my-component.test.ts.snap',
        'my-component.test.tsx.snap',
        'my-component.test.js.snap',
        'my-component.test.jsx.snap',
        'my-component-test.ts',
        'my-component-test.tsx',
        'my-component-test.js',
        'my-component-test.jsx',
        'my-component.test.t',
        'my-component.test.j',
      ])(`doesn't match the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(false);
      });
    });

    describe('spec.* extensions', () => {
      it.each([
        'my-component.spec.ts',
        'my-component.spec.tsx',
        'my-component.spec.js',
        'my-component.spec.jsx',
        'some/path/spec.ts',
        'some/path/spec.tsx',
        'some/path/spec.js',
        'some/path/spec.jsx',
      ])(`matches the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(true);
      });

      it.each([
        'my-component.spec.ts.snap',
        'my-component.spec.tsx.snap',
        'my-component.spec.js.snap',
        'my-component.spec.jsx.snap',
        'my-component-spec.ts',
        'my-component-spec.tsx',
        'my-component-spec.js',
        'my-component-spec.jsx',
        'my-component.spec.t',
        'my-component.spec.j',
      ])(`doesn't match the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(false);
      });
    });

    describe('e2e.* extensions', () => {
      it.each([
        'my-component.e2e.ts',
        'my-component.e2e.tsx',
        'my-component.e2e.js',
        'my-component.e2e.jsx',
        'some/path/e2e.ts',
        'some/path/e2e.tsx',
        'some/path/e2e.js',
        'some/path/e2e.jsx',
      ])(`matches the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(true);
      });

      it.each([
        'my-component.e2e.ts.snap',
        'my-component.e2e.tsx.snap',
        'my-component.e2e.js.snap',
        'my-component.e2e.jsx.snap',
        'my-component-e2e.ts',
        'my-component-e2e.tsx',
        'my-component-e2e.js',
        'my-component-e2e.jsx',
        'my-component.e2e.t',
        'my-component.e2e.j',
      ])(`doesn't match the file '%s'`, (filename) => {
        expect(testRegex.test(filename)).toBe(false);
      });
    });
  });
});
