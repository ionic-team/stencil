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
        version: '0.0.1',
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
        version: '0.0.1',
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

    it('invokes runReleaseTasks with a specified version when version is not set', async () => {
      promptPrepareReleaseSpy.mockResolvedValue({
        confirm: true,
        specifiedVersion: '0.0.2',
      });

      await release(rootDir, [prepareFlag]);
      expect(runReleaseTasksSpy).toHaveBeenCalledTimes(1);
      expect(runReleaseTasksSpy).toHaveBeenCalledWith(
        {
          packageJson: stubPackageData(),
          version: '0.0.2',
        },
        [prepareFlag]
      );
    });
  });
});
