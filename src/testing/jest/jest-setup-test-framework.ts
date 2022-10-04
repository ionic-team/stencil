import { BUILD, Env } from '@app-data';
import type * as d from '@stencil/core/internal';
import { E2EProcessEnv } from '@stencil/core/internal';
import {
  modeResolutionChain,
  resetPlatform,
  setErrorHandler,
  stopAutoApplyChanges,
} from '@stencil/core/internal/testing';
import { setupGlobal, teardownGlobal } from '@stencil/core/mock-doc';

import { expectExtend } from '../matchers';
import { setupMockFetch } from '../mock-fetch';
import { resetBuildConditionals } from '../reset-build-conditionals';
import { HtmlSerializer } from './jest-serializer';

declare const global: d.JestEnvironmentGlobal;

export function jestSetupTestFramework() {
  global.Context = {};
  global.resourcesUrl = '/build';

  expect.extend(expectExtend);
  expect.addSnapshotSerializer(HtmlSerializer);

  setupGlobal(global);
  setupMockFetch(global);

  beforeEach(() => {
    // reset the platform for this new test
    resetPlatform();
    setErrorHandler(undefined);
    resetBuildConditionals(BUILD);
    modeResolutionChain.length = 0;
  });

  afterEach(async () => {
    if (global.__CLOSE_OPEN_PAGES__) {
      await global.__CLOSE_OPEN_PAGES__();
    }
    stopAutoApplyChanges();

    teardownGlobal(global);
    global.Context = {};
    global.resourcesUrl = '/build';
  });

  // TODO(STENCIL-307): Remove usage of the Jasmine global
  const jasmineEnv = (jasmine as any).getEnv();
  if (jasmineEnv != null) {
    jasmineEnv.addReporter({
      specStarted: (spec: any) => {
        global.currentSpec = spec;
      },
    });
  }

  global.screenshotDescriptions = new Set();

  // during E2E tests, we can safely assume that the current environment is a `E2EProcessEnv`
  const env: E2EProcessEnv = process.env as E2EProcessEnv;

  if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
    const time = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
    jest.setTimeout(time * 1.5);
    // TODO(STENCIL-307): Remove usage of the Jasmine global
    // eslint-disable-next-line jest/no-jasmine-globals -- these will be removed when we migrate to jest-circus
    jasmine.DEFAULT_TIMEOUT_INTERVAL = time;
  }
  if (typeof env.__STENCIL_ENV__ === 'string') {
    const stencilEnv = JSON.parse(env.__STENCIL_ENV__);
    Object.assign(Env, stencilEnv);
  }
}
