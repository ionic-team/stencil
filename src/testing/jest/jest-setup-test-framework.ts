import * as d from '@stencil/core/internal';
import { expectExtend } from '../matchers';
import { setupGlobal, teardownGlobal } from '@mock-doc';
import { setupMockFetch } from '../mock-fetch';
import { HtmlSerializer } from './jest-serializer';
import { resetBuildConditionals } from '../reset-build-conditionals';


declare const global: d.JestEnvironmentGlobal;

export function jestSetupTestFramework() {
  global.Context = {};
  global.resourcesUrl = '/build';

  expect.extend(expectExtend);
  expect.addSnapshotSerializer(HtmlSerializer);

  setupGlobal(global);
  setupMockFetch(global);

  beforeEach(() => {
    const bc = require('@stencil/core/internal/app-data');
    const testingPlatform = require('@stencil/core/internal/platform');

    // reset the platform for this new test
    testingPlatform.resetPlatform();
    resetBuildConditionals(bc.BUILD);
  });

  afterEach(async () => {
    if (global.__CLOSE_OPEN_PAGES__) {
      await global.__CLOSE_OPEN_PAGES__();
    }
    const testingPlatform = require('@stencil/core/internal/platform');
    testingPlatform.stopAutoApplyChanges();

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
    jest.setTimeout(time);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = time;
  }
}
