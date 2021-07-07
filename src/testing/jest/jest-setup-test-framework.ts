import type * as d from '@stencil/core/internal';
import { BUILD, Env } from '@app-data';
import { expectExtend } from '../matchers';
import { setupGlobal, teardownGlobal } from '@stencil/core/mock-doc';
import { setupMockFetch } from '../mock-fetch';
import { HtmlSerializer } from './jest-serializer';
import { resetBuildConditionals } from '../reset-build-conditionals';
import {
  resetPlatform,
  stopAutoApplyChanges,
  modeResolutionChain,
  setErrorHandler,
} from '@stencil/core/internal/testing';

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

  const jasmineEnv = (jasmine as any).getEnv();
  if (jasmineEnv != null) {
    jasmineEnv.addReporter({
      specStarted: (spec: any) => {
        global.currentSpec = spec;
      },
    });
  }

  global.screenshotDescriptions = new Set();

  const env: d.E2EProcessEnv = process.env;

  if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
    const time = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
    jest.setTimeout(time * 1.5);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = time;
  }
  if (typeof env.__STENCIL_ENV__ === 'string') {
    const stencilEnv = JSON.parse(env.__STENCIL_ENV__);
    Object.assign(Env, stencilEnv);
  }
}
