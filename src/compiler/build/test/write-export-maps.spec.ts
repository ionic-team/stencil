import { mockBuildCtx, mockValidatedConfig } from '@stencil/core/testing';

import * as d from '../../../declarations';
import { writeExportMaps } from '../write-export-maps';

const execSyncMock = jest.fn();
jest.mock('child_process', () => ({
  execSync: execSyncMock,
}));

describe('writeExportMaps', () => {
  let config: d.ValidatedConfig;
  let buildCtx: d.BuildCtx;

  beforeEach(() => {
    config = mockValidatedConfig();
    buildCtx = mockBuildCtx(config);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should always generate the default exports', () => {
    writeExportMaps(config, buildCtx);

    expect(execSyncMock).toHaveBeenCalledTimes(2);
    expect(execSyncMock).toHaveBeenCalledWith(
      `npm pkg set "exports[.][import]"="./dist/${config.fsNamespace}/${config.fsNamespace}.esm.js"`,
    );
    expect(execSyncMock).toHaveBeenCalledWith(
      `npm pkg set "exports[.][require]"="./dist/${config.fsNamespace}/${config.fsNamespace}.cjs.js"`,
    );
  });

  //   it('should generate the lazy loader exports if the output target is present', () => {});

  //   it('should generate the custom elements exports if the output target is present', () => {});
});
