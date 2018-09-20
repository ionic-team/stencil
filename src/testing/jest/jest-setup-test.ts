import * as d from '../../declarations';
import { expectExtend } from '../matchers';
import { getDefaultBuildConditionals } from '../../build-conditionals';
import { h } from '../../renderer/vdom/h';
import { applyWindowToGlobal } from '@stencil/core/mock-doc';


declare const global: d.JestEnvironmentGlobal;

export function jestSetupTestFramework() {
  global.__BUILD_CONDITIONALS__ = getDefaultBuildConditionals();
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

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
}
