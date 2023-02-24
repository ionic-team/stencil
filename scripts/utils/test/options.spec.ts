import { BuildOptions, getOptions } from '../options';
import * as Vermoji from '../vermoji';

describe('release options', () => {
  describe('getOptions', () => {
    const ROOT_DIR = './';

    it('returns the correct default value', () => {
      const buildOpts = getOptions(ROOT_DIR);

      expect(buildOpts).toEqual<BuildOptions>({
        buildDir: 'build',
        // More focused tests for `buildId` can be found in another testing suite in this file
        buildId: expect.any(String),
        bundleHelpersDir: 'scripts/bundles/helpers',
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
          sysNodeDir: 'sys/node',
          testingDir: 'testing',
        },
        // reads in package.json, skip it verifying it
        packageJson: expect.any(Object),
        packageJsonPath: 'package.json',
        packageLockJsonPath: 'package-lock.json',
        rootDir: ROOT_DIR,
        scriptsBuildDir: 'scripts/build',
        scriptsBundlesDir: 'scripts/bundles',
        scriptsDir: 'scripts',
        srcDir: 'src',
        tag: 'dev',
        typescriptDir: 'node_modules/typescript',
        typescriptLibDir: 'node_modules/typescript/lib',
        vermoji: '💎',
        // TODO(NOW)
        version: expect.any(String),
      });
    });

    describe('buildId', () => {
      it('defaults the buildId if none is provided', () => {
        const { buildId } = getOptions(ROOT_DIR);

        expect(buildId).toBeDefined();
        // Expect a Date of the format yyyyMMddHHmmss
        expect(buildId).toMatch(/\d{14}/);
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
        // Expect a version string with the format 0.0.0-dev-yyyyMMddHHmmss
        expect(version).toMatch(/0\.0\.0-dev\.\d{14}/);
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
