import { BUILD, Env } from '@app-data';
import type * as d from '@stencil/core/internal';
import { E2EProcessEnv } from '@stencil/core/internal';
import {
  modeResolutionChain,
  resetPlatform,
  setErrorHandler,
  stopAutoApplyChanges,
} from '@stencil/core/internal/testing';
import { MockDocument, MockNode, MockWindow, setupGlobal, teardownGlobal } from '@stencil/core/mock-doc';

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

    // Remove each node from the mocked DOM
    // Without this step, a component's `disconnectedCallback`
    // will not be called since this only happens when a node is removed,
    // not if the window is destroyed.
    //
    // So, we do this outside the mocked window/DOM teardown
    // because this operation is really only necessary in the testing
    // context so any "cleanup" operations in the `disconnectedCallback`
    // can happen to prevent testing errors with async code in the component
    //
    // We only care about removing all the nodes that are children of the `html` tag/node
    // That will always be the second child of the document since the first is the `!DOCTYPE` node
    removeDomNodes((((global as any).window as MockWindow).document as unknown as MockDocument).childNodes[1]);

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

/**
 * Recursively removes all child nodes of a passed node starting with the
 * furthest descendant and then moving back up the DOM tree.
 *
 * @param node The mocked DOM node that will be removed from the DOM
 */
function removeDomNodes(node: MockNode) {
  if (!node.childNodes?.length) {
    node.remove();
  }

  node.childNodes?.forEach(removeDomNodes);
}
