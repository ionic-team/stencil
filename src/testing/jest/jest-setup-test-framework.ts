import * as d from '../../declarations';
import { expectExtend } from '../matchers';
import { setupGlobal, teardownGlobal } from '@mock-doc';


declare const global: d.JestEnvironmentGlobal;

export function jestSetupTestFramework() {
  global.Context = {};
  global.resourcesUrl = '/build';

  expect.extend(expectExtend);

  setupGlobal(global);

  beforeEach(() => {
    const bc = require('@stencil/core/build-conditionals');
    const platform = require('@stencil/core/platform');

    // reset the platform for this new test
    platform.resetPlatform();
    bc.resetBuildConditionals(bc.BUILD);
  });

  afterEach(() => {
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
  }
}
