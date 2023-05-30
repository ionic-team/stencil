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

  describe('devTools', () => {
    it('ignores devTools settings if CI is enabled', () => {
      userConfig.flags = { ...flags, ci: true, devtools: true, e2e: true };
      userConfig.testing = {};

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserDevtools).toBeUndefined();
    });

    it('sets browserDevTools to true when the devtools flag is set', () => {
      userConfig.flags = { ...flags, devtools: true, e2e: true };
      userConfig.testing = {};

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserDevtools).toBe(true);
      // browserHeadless must be false to enabled dev tools (which are headful by definition)
      expect(config.testing.browserHeadless).toBe(false);
    });

    it("sets browserDevTools to true when set in a project's config", () => {
      userConfig.flags = { ...flags, devtools: false, e2e: true };
      userConfig.testing = { browserDevtools: true };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserDevtools).toBe(true);
      // browserHeadless must be false to enabled dev tools (which are headful by definition)
      expect(config.testing.browserHeadless).toBe(false);
    });
  });

  describe('browserWaitUntil', () => {
    it('sets the default to "load" if no value is provided', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {};

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserWaitUntil).toBe('load');
    });

    it('does not override a provided value', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        browserWaitUntil: 'domcontentloaded',
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserWaitUntil).toBe('domcontentloaded');
    });
  });

  describe('browserArgs', () => {
    it('does not add duplicate default fields', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        browserArgs: ['--unique', '--font-render-hinting=medium'],
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.browserArgs).toEqual(['--unique', '--font-render-hinting=medium', '--incognito']);
    });

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

  describe('screenshotConnector', () => {
    it('assigns the screenshotConnector value from the provided flags', () => {
      userConfig.flags = { ...flags, e2e: true, screenshotConnector: path.join(ROOT, 'mock', 'path') };
      userConfig.testing = { screenshotConnector: path.join(ROOT, 'another', 'mock', 'path') };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.screenshotConnector).toBe(path.join(ROOT, 'mock', 'path'));
    });

    it("uses the config's root dir to make the screenshotConnector path absolute", () => {
      userConfig.flags = { ...flags, e2e: true, screenshotConnector: path.join('mock', 'path') };
      userConfig.testing = { screenshotConnector: path.join('another', 'mock', 'path') };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.screenshotConnector).toBe(path.join(ROOT, 'User', 'some', 'path', 'mock', 'path'));
    });

    it('sets screenshotConnector if a non-string is provided', () => {
      userConfig.flags = { ...flags, e2e: true };
      // the nature of this test is to evaluate a non-string, hence the type assertion
      userConfig.testing = { screenshotConnector: true as unknown as string };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.screenshotConnector).toBe(path.join('screenshot', 'local-connector.js'));
    });
  });

  describe('testPathIgnorePatterns', () => {
    it('does not alter a provided testPathIgnorePatterns', () => {
      userConfig.flags = { ...flags, e2e: true };

      const mockPath1 = path.join('this', 'is', 'a', 'mock', 'path');
      const mockPath2 = path.join('this', 'is', 'another', 'mock', 'path');
      userConfig.testing = { testPathIgnorePatterns: [mockPath1, mockPath2] };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.testPathIgnorePatterns).toEqual([mockPath1, mockPath2]);
    });

    it('sets the default testPathIgnorePatterns if not array is provided', () => {
      userConfig.flags = { ...flags, e2e: true };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.testPathIgnorePatterns).toEqual([
        path.join(ROOT, 'User', 'some', 'path', '.vscode'),
        path.join(ROOT, 'User', 'some', 'path', '.stencil'),
        path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
        path.join(ROOT, 'www'),
      ]);
    });

    it('sets the default testPathIgnorePatterns with custom outputTargets', () => {
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

  describe('preset', () => {
    it.each([null, true])("uses stencil's default preset if a non-string (%s) is provided", (nonStringPreset) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires a non-string value, hence the type assertion
        preset: nonStringPreset as unknown as string,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      // 'testing' is the internal directory where `jest-preset.js` can be found
      expect(config.testing.preset).toEqual('testing');
    });

    it('forces a provided preset path to be absolute', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        preset: path.join('mock', 'path'),
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.preset).toEqual(path.join(ROOT, 'User', 'some', 'path', 'mock', 'path'));
    });

    it('does not change an already absolute preset path', () => {
      userConfig.flags = { ...flags, e2e: true };

      const presetPath = path.join(ROOT, 'mock', 'path');
      userConfig.testing = {
        preset: presetPath,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.preset).toEqual(presetPath);
    });
  });

  describe('setupFilesAfterEnv', () => {
    it.each([null, true])('forces a non-array (%s) of setup files to a default', (nonSetupFiles) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires a non-string value, hence the type assertion
        setupFilesAfterEnv: nonSetupFiles as unknown as string[],
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      // 'testing' is the internal directory where the default setup file can be found
      expect(config.testing.setupFilesAfterEnv).toEqual([path.join('testing', 'jest-setuptestframework.js')]);
    });

    it.each([[[]], [['mock-setup-file.js']]])(
      "prepends stencil's default file to an array: %s",
      (setupFilesAfterEnv) => {
        userConfig.flags = { ...flags, e2e: true };
        userConfig.testing = {
          setupFilesAfterEnv: [...setupFilesAfterEnv],
        };

        const { config } = validateConfig(userConfig, mockLoadConfigInit());

        expect(config.testing.setupFilesAfterEnv).toEqual([
          // 'testing' is the internal directory where the default setup file can be found
          path.join('testing', 'jest-setuptestframework.js'),
          ...setupFilesAfterEnv,
        ]);
      }
    );
  });

  describe('testEnvironment', () => {
    it('sets a relative testEnvironment to absolute', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testEnvironment: './rel-path.js',
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(path.isAbsolute(config.testing.testEnvironment)).toBe(true);
      expect(path.basename(config.testing.testEnvironment)).toEqual('rel-path.js');
    });

    it('allows a node module testEnvironment', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testEnvironment: 'jsdom',
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.testEnvironment).toEqual('jsdom');
    });

    it('does nothing for an empty testEnvironment', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.testEnvironment).toBeUndefined();
    });
  });

  describe('allowableMismatchedPixels', () => {
    it.each([0, 123])('does nothing is a non-negative number (%s) is provided', (pixelCount) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        allowableMismatchedPixels: pixelCount,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.allowableMismatchedPixels).toBe(pixelCount);
    });

    it('creates an error if a negative number is provided', () => {
      const pixelCount = -1;
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        allowableMismatchedPixels: pixelCount,
      };

      const { config, diagnostics } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.allowableMismatchedPixels).toBe(pixelCount);
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0]).toEqual({
        absFilePath: null,
        header: 'Build Error',
        level: 'error',
        lines: [],
        messageText: 'allowableMismatchedPixels must be a value that is 0 or greater',
        relFilePath: null,
        type: 'build',
      });
    });

    it.each([true, null])('defaults to a reasonable value if a non-number (%s) is provided', (pixelCount) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires using a non-number, hence th type assertion
        allowableMismatchedPixels: pixelCount as unknown as number,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.allowableMismatchedPixels).toBe(100);
    });
  });

  describe('allowableMismatchedRatio', () => {
    it.each([-0, 0, 0.5, 1.0])(
      'does nothing if a value between 0 and 1 is provided (%s)',
      (allowableMismatchedRatio) => {
        userConfig.flags = { ...flags, e2e: true };
        userConfig.testing = {
          allowableMismatchedRatio,
        };

        const { config } = validateConfig(userConfig, mockLoadConfigInit());

        expect(config.testing.allowableMismatchedRatio).toBe(allowableMismatchedRatio);
      }
    );

    it.each([-1, -0.1, 1.1, 2])(
      'creates an error if a number outside 0 and 1 is provided (%s)',
      (allowableMismatchedRatio) => {
        userConfig.flags = { ...flags, e2e: true };
        userConfig.testing = {
          allowableMismatchedRatio,
        };

        const { config, diagnostics } = validateConfig(userConfig, mockLoadConfigInit());

        expect(config.testing.allowableMismatchedRatio).toBe(allowableMismatchedRatio);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0]).toEqual({
          absFilePath: null,
          header: 'Build Error',
          level: 'error',
          lines: [],
          messageText: 'allowableMismatchedRatio must be a value ranging from 0 to 1',
          relFilePath: null,
          type: 'build',
        });
      }
    );

    it.each([true, null])('does nothing when a non-number (%s) is provided', (allowableMismatchedRatio) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires using a non-number, hence th type assertion
        allowableMismatchedRatio: allowableMismatchedRatio as unknown as number,
      };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.testing.allowableMismatchedRatio).toBe(allowableMismatchedRatio);
    });
  });

  describe('pixelmatchThreshold', () => {
    it.each([-0, 0, 0.5, 1.0])('does nothing if a value between 0 and 1 is provided (%s)', (pixelmatchThreshold) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        pixelmatchThreshold,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.pixelmatchThreshold).toBe(pixelmatchThreshold);
    });

    it.each([-0.1, -1, 1.1, 2])(
      'creates an error if a number outside 0 and 1 is provided (%s)',
      (pixelmatchThreshold) => {
        userConfig.flags = { ...flags, e2e: true };
        userConfig.testing = {
          pixelmatchThreshold,
        };

        const { config, diagnostics } = validateConfig(userConfig, mockLoadConfigInit());

        expect(config.testing.pixelmatchThreshold).toBe(pixelmatchThreshold);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0]).toEqual({
          absFilePath: null,
          header: 'Build Error',
          level: 'error',
          lines: [],
          messageText: 'pixelmatchThreshold must be a value ranging from 0 to 1',
          relFilePath: null,
          type: 'build',
        });
      }
    );

    it.each([true, null])('defaults to a reasonable value if a non-number (%s) is provided', (pixelmatchThreshold) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires using a non-number, hence th type assertion
        pixelmatchThreshold: pixelmatchThreshold as unknown as number,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.allowableMismatchedPixels).toBe(100);
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

  describe('testMatch', () => {
    it('removes testRegex from the config when testMatch is an array', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testMatch: ['mockMatcher'],
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.testMatch).toEqual(['mockMatcher']);
      expect(config.testing.testRegex).toBeUndefined();
    });

    it('removes testMatch from the config when testRegex is a string', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        testMatch: undefined,
        testRegex: '/regexStr/',
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.testMatch).toBeUndefined();
      expect(config.testing.testRegex).toBe('/regexStr/');
    });
  });

  describe('runner', () => {
    it('does nothing if the runner property is a string', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        runner: 'my-runner.js',
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.runner).toEqual('my-runner.js');
    });

    it('sets the runner if a non-string value is provided', () => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        runner: undefined,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      // 'testing' is the internal directory where the default runner file can be found
      expect(config.testing.runner).toEqual(path.join('testing', 'jest-runner.js'));
    });
  });

  describe('waitBeforeScreenshot', () => {
    it.each([-0, 0, 0.5, 1.0])('does nothing for a non-negative value (%s)', (waitBeforeScreenshot) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        waitBeforeScreenshot,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.waitBeforeScreenshot).toBe(waitBeforeScreenshot);
    });

    it('creates an error if the value provided is negative', () => {
      const waitBeforeScreenshot = -1;
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        waitBeforeScreenshot,
      };

      const { config, diagnostics } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.waitBeforeScreenshot).toBe(waitBeforeScreenshot);
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0]).toEqual({
        absFilePath: null,
        header: 'Build Error',
        level: 'error',
        lines: [],
        messageText: 'waitBeforeScreenshot must be a value that is 0 or greater',
        relFilePath: null,
        type: 'build',
      });
    });

    it.each([true, null])('defaults to a reasonable value if a non-number (%s) is provided', (waitBeforeScreenshot) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        // the nature of this test requires using a non-number, hence the type assertion
        pixelmatchThreshold: waitBeforeScreenshot as unknown as number,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.waitBeforeScreenshot).toBe(10);
    });
  });

  describe('emulate', () => {
    it.each([[undefined], [[]]])('provides a reasonable default for %s', (emulate) => {
      userConfig.flags = { ...flags, e2e: true };
      userConfig.testing = {
        emulate,
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.emulate).toEqual([
        {
          userAgent: 'default',
          viewport: {
            width: 600,
            height: 600,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: false,
          },
        },
      ]);
    });

    it('does nothing when a non-zero length array is provided', () => {
      userConfig.flags = { ...flags, e2e: true };

      const emulateConfig: d.EmulateConfig = {
        userAgent: 'mockAgent',
        viewport: {
          width: 100,
          height: 100,
          deviceScaleFactor: 1,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      };
      userConfig.testing = {
        emulate: [emulateConfig],
      };

      const { config } = validateConfig(userConfig, mockLoadConfigInit());

      expect(config.testing.emulate).toEqual([emulateConfig]);
    });
  });
});
