import { path } from '../../../compiler';
import { BuildOptions, getOptions } from '../options';
import * as Vermoji from '../vermoji';

describe('release options', () => {
  describe('getOptions', () => {
    const ROOT_DIR = './';
    // Friday, February 24, 2023 2:42:09.123 PM, GMT
    const FAKE_SYSTEM_TIME_MS = 1677249729123;
    const FAKE_SYSTEM_TIME_S = FAKE_SYSTEM_TIME_MS.toString(10).slice(0, -3);

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(FAKE_SYSTEM_TIME_MS);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns the correct default value', () => {
      const buildOpts = getOptions(ROOT_DIR);

      // some paths exist in the expected object that are not normalized, so we store the OS-specific separator in a
      // variable in order to call `join()` with it
      const separator = path.sep;

      expect(buildOpts).toEqual<BuildOptions>({
        buildDir: 'build',
        // More focused tests for `buildId` can be found in another testing suite in this file
        buildId: expect.any(String),
        bundleHelpersDir: ['scripts', 'bundles', 'helpers'].join(separator),
        changelogPath: 'CHANGELOG.md',
        ghRepoName: 'stencil',
        ghRepoOrg: 'ionic-team',
        isCI: false,
        isProd: false,
        isPublishRelease: false,
        nodeModulesDir: 'node_modules',
        output: {
          cliDir: 'cli',
          compilerDir: 'compiler',
          devServerDir: 'dev-server',
          internalDir: 'internal',
          mockDocDir: 'mock-doc',
          screenshotDir: 'screenshot',
          sysNodeDir: ['sys', 'node'].join(separator),
          testingDir: 'testing',
        },
        // reads in package.json, skip it verifying it
        packageJson: expect.any(Object),
        packageJsonPath: 'package.json',
        packageLockJsonPath: 'package-lock.json',
        rootDir: ROOT_DIR,
        scriptsBuildDir: ['scripts', 'build'].join(separator),
        scriptsBundlesDir: ['scripts', 'bundles'].join(separator),
        scriptsDir: 'scripts',
        srcDir: 'src',
        tag: 'dev',
        typescriptDir: ['node_modules', 'typescript'].join(separator),
        typescriptLibDir: ['node_modules', 'typescript', 'lib'].join(separator),
        vermoji: '💎',
        // More focused tests for `version` can be found in another testing suite in this file
        version: expect.any(String),
      });
    });

    describe('buildId', () => {
      it('defaults the buildId if none is provided', () => {
        const { buildId } = getOptions(ROOT_DIR);

        expect(buildId).toBeDefined();
        expect(buildId).toBe(FAKE_SYSTEM_TIME_S);
      });

      it('uses the provided the buildId', () => {
        const expectedBuildId = 'test-build-id';
        const { buildId } = getOptions(ROOT_DIR, { buildId: expectedBuildId });

        expect(buildId).toBeDefined();
        expect(buildId).toBe(expectedBuildId);
      });
    });

    describe('version', () => {
      it('defaults the version if none is provided', () => {
        const { version } = getOptions(ROOT_DIR);

        expect(version).toBeDefined();
        // Expect a version string with the format 0.0.0-dev-[EPOCH_TIME]-[GIT_SHA_7_CHARS]
        expect(version).toMatch(new RegExp(`\\d+\\.\\d+\\.\\d+-dev.${FAKE_SYSTEM_TIME_S}.\\w{7}`));
      });

      it('uses the provided the version', () => {
        const expectedVersion = '3.0.0-dev-1234';
        const { version } = getOptions(ROOT_DIR, { version: expectedVersion });

        expect(version).toBeDefined();
        expect(version).toBe(expectedVersion);
      });
    });

    describe('publish + prod check', () => {
      it("throws an error if 'isPublishRelease' is set, but Stencil is not built for 'isProd'", () => {
        expect(() => getOptions(ROOT_DIR, { isProd: false, isPublishRelease: true })).toThrow(
          'release must also be a prod build'
        );
      });

      it.each<Partial<BuildOptions>>([
        { isProd: false },
        { isPublishRelease: false },
        { isProd: false, isPublishRelease: false },
        { isProd: true, isPublishRelease: false },
        { isProd: true, isPublishRelease: true },
      ])("does not throw an error for other combinations of 'isPublishRelease' and 'isProd'", (buildOpts) => {
        expect(() => getOptions(ROOT_DIR, buildOpts)).not.toThrow();
      });
    });

    describe('vermoji', () => {
      let getVermojiSpy: jest.SpyInstance<ReturnType<typeof Vermoji.getVermoji>, Parameters<typeof Vermoji.getVermoji>>;

      beforeEach(() => {
        getVermojiSpy = jest.spyOn(Vermoji, 'getVermoji');
        getVermojiSpy.mockImplementation((_changelogPath) => '🧀');
      });

      afterEach(() => {
        getVermojiSpy.mockRestore();
      });

      it('defaults to 💎 for non-prod builds', () => {
        expect(getOptions(ROOT_DIR).vermoji).toBe('💎');
      });

      it.each<Partial<BuildOptions>>([
        { isProd: true, vermoji: '🦄' },
        { isProd: false, vermoji: '🦄' },
      ])("uses the provided vermoji, regardless of 'isProd'", () => {
        const expectedVermoji = '🦄';
        const { vermoji } = getOptions(ROOT_DIR, { vermoji: expectedVermoji });
        expect(vermoji).toEqual('🦄');
      });

      it('picks a new vermoji when none is provided for prod builds', () => {
        const { vermoji } = getOptions(ROOT_DIR, { isProd: true });
        expect(vermoji).toEqual('🧀');
      });
    });
  });
});
