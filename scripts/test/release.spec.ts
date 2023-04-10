import fs from 'fs-extra';
import path from 'path';

import * as Prompts from '../prompts';
import { release } from '../release';
import * as ReleaseTasks from '../release-tasks';
import * as Options from '../utils/options';
import { stubPackageData } from './PackageData.stub';

describe('release()', () => {
  const rootDir = '/testing-dir';

  let consoleLogSpy: jest.SpyInstance<
    ReturnType<typeof globalThis.console.log>,
    Parameters<typeof globalThis.console.log>
  >;
  let getOptionsSpy: jest.SpyInstance<ReturnType<typeof Options.getOptions>, Parameters<typeof Options.getOptions>>;
  let runReleaseTasksSpy: jest.SpyInstance<
    ReturnType<typeof ReleaseTasks.runReleaseTasks>,
    Parameters<typeof ReleaseTasks.runReleaseTasks>
  >;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(globalThis.console, 'log');
    consoleLogSpy.mockReturnValue();

    getOptionsSpy = jest.spyOn(Options, 'getOptions');
    getOptionsSpy.mockReturnValue({
      packageJson: stubPackageData(),
    });

    runReleaseTasksSpy = jest.spyOn(ReleaseTasks, 'runReleaseTasks');
    runReleaseTasksSpy.mockResolvedValue();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    getOptionsSpy.mockRestore();
    runReleaseTasksSpy.mockRestore();
  });

  describe('prepareRelease', () => {
    const prepareFlag = '--prepare';

    let emptyDirSpy: jest.SpyInstance<ReturnType<typeof fs.emptyDir>, Parameters<typeof fs.emptyDir>>;
    let writeJsonSyncSpy: jest.SpyInstance<ReturnType<typeof fs.writeJsonSync>, Parameters<typeof fs.writeJsonSync>>;
    let promptPrepareReleaseSpy: jest.SpyInstance<
      ReturnType<typeof Prompts.promptPrepareRelease>,
      Parameters<typeof Prompts.promptPrepareRelease>
    >;

    beforeEach(() => {
      emptyDirSpy = jest.spyOn(fs, 'emptyDir');
      emptyDirSpy.mockImplementation((_dir) => {});

      writeJsonSyncSpy = jest.spyOn(fs, 'writeJsonSync');
      writeJsonSyncSpy.mockReturnValue();

      promptPrepareReleaseSpy = jest.spyOn(Prompts, 'promptPrepareRelease');
      promptPrepareReleaseSpy.mockResolvedValue({
        confirm: true,
        versionToUse: '0.0.1',
      });
    });

    afterEach(() => {
      emptyDirSpy.mockRestore();
      writeJsonSyncSpy.mockRestore();
      promptPrepareReleaseSpy.mockRestore();
    });

    it('empties the build directory', async () => {
      await release(rootDir, [prepareFlag]);
      expect(emptyDirSpy).toHaveBeenCalledTimes(1);
      expect(emptyDirSpy).toHaveBeenCalledWith(path.join(rootDir, 'build'));
    });

    it('writes a release-data.json file to disk', async () => {
      await release(rootDir, [prepareFlag]);
      expect(writeJsonSyncSpy).toHaveBeenCalledTimes(1);
      expect(writeJsonSyncSpy).toHaveBeenCalledWith(
        path.join(rootDir, 'build', 'release-data.json'),
        {
          packageJson: stubPackageData(),
          version: '0.0.1',
        },
        { spaces: 2 }
      );
    });

    it('returns early when confirm is falsy', async () => {
      promptPrepareReleaseSpy.mockResolvedValue({
        confirm: false,
        versionToUse: '0.0.1',
      });

      await release(rootDir, [prepareFlag]);

      expect(writeJsonSyncSpy).not.toHaveBeenCalled();
      expect(runReleaseTasksSpy).not.toHaveBeenCalled();
    });

    it('invokes runReleaseTasks', async () => {
      await release(rootDir, [prepareFlag]);
      expect(runReleaseTasksSpy).toHaveBeenCalledTimes(1);
      expect(runReleaseTasksSpy).toHaveBeenCalledWith(
        {
          packageJson: stubPackageData(),
          version: '0.0.1',
        },
        [prepareFlag]
      );
    });
  });

  describe('publishRelease', () => {
    const publishFlag = '--publish';

    // the return type is explicitly set for two reasons:
    // 1. TypeScript infers `readJson` to have a return type of `void`, since it's the last function signature in a
    // series of overloaded types
    // 2. The most narrow return type `readJson` has is `any`. Since we're only using this function once for the
    // express purpose of reading `BuildOptions` written to disk, we want _a_ return type. However, if we set this to
    // `BuildOptions`, we run into type errors when instantiating it
    let readJsonSyncSpy: jest.SpyInstance<any, Parameters<typeof fs.readJson>>;
    let promptReleaseSpy: jest.SpyInstance<
      ReturnType<typeof Prompts.promptRelease>,
      Parameters<typeof Prompts.promptRelease>
    >;

    beforeEach(() => {
      getOptionsSpy.mockReturnValue({
        packageJson: stubPackageData({
          version: '0.1.0',
        }),
        version: '0.1.0',
      });

      readJsonSyncSpy = jest.spyOn(fs, 'readJson');
      readJsonSyncSpy.mockReturnValue({
        buildId: 'mockBuildId',
        version: '0.1.0',
        vermoji: '🐢',
        isCI: false,
      });

      promptReleaseSpy = jest.spyOn(Prompts, 'promptRelease');
      promptReleaseSpy.mockResolvedValue({
        confirm: true,
        npmTag: 'testing',
        // six characters long (i.e. correct length), but a very fake OTP
        otp: 'abcOtp',
      });
    });

    afterEach(() => {
      readJsonSyncSpy.mockRestore();
      promptReleaseSpy.mockRestore();
    });

    it('reads a release-data.json file from disk', async () => {
      await release(rootDir, [publishFlag]);
      expect(readJsonSyncSpy).toHaveBeenCalledTimes(1);
      expect(readJsonSyncSpy).toHaveBeenCalledWith(path.join(rootDir, 'build', 'release-data.json'));
    });

    it('pipes data read from release-data.json into the provided options', async () => {
      await release(rootDir, [publishFlag]);
      expect(getOptionsSpy).toHaveBeenCalledTimes(1);
      expect(getOptionsSpy).toHaveBeenCalledWith(rootDir, {
        buildId: 'mockBuildId',
        version: '0.1.0',
        vermoji: '🐢',
        isCI: false,
        isPublishRelease: true,
        isProd: true,
      });
    });

    it('returns early when confirm is falsy', async () => {
      promptReleaseSpy.mockResolvedValue({
        confirm: false,
        npmTag: 'testing',
        // six characters long (i.e. correct length), but a very fake OTP
        otp: 'abcOtp',
      });

      await release(rootDir, [publishFlag]);

      expect(runReleaseTasksSpy).not.toHaveBeenCalled();
    });

    it('throws an error when package.json#version and the release data version do not match', async () => {
      getOptionsSpy.mockReturnValue({
        packageJson: stubPackageData({
          version: '0.1.0',
        }),
        version: '0.1.1',
      });

      await expect(release(rootDir, [publishFlag])).rejects.toThrow(
        'Prepare release data (0.1.1) and package.json (0.1.0) versions do not match. Try re-running release prepare.'
      );
    });

    it('invokes runReleaseTasks', async () => {
      await release(rootDir, [publishFlag]);
      expect(runReleaseTasksSpy).toHaveBeenCalledTimes(1);
      expect(runReleaseTasksSpy).toHaveBeenCalledWith(
        {
          otp: 'abcOtp',
          packageJson: stubPackageData({
            version: '0.1.0',
          }),
          tag: 'testing',
          version: '0.1.0',
        },
        [publishFlag]
      );
    });
  });
});
