import * as d from '../../declarations';
import { expectExtend } from '../matchers';
import { getDefaultBuildConditionals } from '../../build-conditionals';
import { h } from '../../renderer/vdom/h';
import { applyWindowToGlobal } from '@stencil/core/mock-doc';


declare const global: d.JestEnvironmentGlobal;

export function jestSetupTestFramework() {
  global._BUILD_ = getDefaultBuildConditionals();
  global.Context = {};
  global.h = h;
  global.resourcesUrl = '/build';

  applyWindowToGlobal(global);

  expect.extend(expectExtend);

  const jasmineEnv = (jasmine as any).getEnv();
  if (jasmineEnv) {
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
