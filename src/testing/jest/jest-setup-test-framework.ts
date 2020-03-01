import * as d from '@stencil/core/internal';
import { BUILD } from '@app-data';
import { expectExtend } from '../matchers';
import { setupGlobal, teardownGlobal } from '@stencil/core/mock-doc';
import { setupMockFetch } from '../mock-fetch';
import { HtmlSerializer } from './jest-serializer';
import { resetBuildConditionals } from '../reset-build-conditionals';
import { resetPlatform, stopAutoApplyChanges } from '@stencil/core/internal/testing';


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
    resetBuildConditionals(BUILD);
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
      }
    });
  }

  global.screenshotDescriptions = new Set();

  const env: d.E2EProcessEnv = process.env;

  if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
    const time = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
    jest.setTimeout(time * 1.5);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = time;
  }
}
