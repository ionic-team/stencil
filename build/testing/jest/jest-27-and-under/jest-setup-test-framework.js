import { BUILD, Env } from '@app-data';
import { modeResolutionChain, resetPlatform, setErrorHandler, stopAutoApplyChanges, } from '@stencil/core/internal/testing';
import { setupGlobal, teardownGlobal } from '@stencil/core/mock-doc';
import { setupMockFetch } from '../../mock-fetch';
import { resetBuildConditionals } from '../../reset-build-conditionals';
import { HtmlSerializer } from './jest-serializer';
import { expectExtend } from './matchers';
export function jestSetupTestFramework() {
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
        var _a, _b, _c, _d, _e, _f;
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
        // We only care about removing all the nodes that are children of the 'body' tag/node.
        // This node is a child of the `html` tag which is the 2nd child of the document (hence
        // the `1` index).
        const bodyNode = (_e = (_d = (_c = (_b = (_a = global.window) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.childNodes) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.childNodes) === null || _e === void 0 ? void 0 : _e.find((ref) => ref.nodeName === 'BODY');
        (_f = bodyNode === null || bodyNode === void 0 ? void 0 : bodyNode.childNodes) === null || _f === void 0 ? void 0 : _f.forEach(removeDomNodes);
        teardownGlobal(global);
        global.resourcesUrl = '/build';
    });
    const jasmineEnv = jasmine.getEnv();
    if (jasmineEnv != null) {
        jasmineEnv.addReporter({
            specStarted: (spec) => {
                global.currentSpec = spec;
            },
        });
    }
    global.screenshotDescriptions = new Set();
    // during E2E tests, we can safely assume that the current environment is a `E2EProcessEnv`
    const env = process.env;
    if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
        const time = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
        jest.setTimeout(time * 1.5);
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
export function removeDomNodes(node) {
    var _a, _b;
    if (node == null) {
        return;
    }
    if (!((_a = node.childNodes) === null || _a === void 0 ? void 0 : _a.length)) {
        node.remove();
    }
    (_b = node.childNodes) === null || _b === void 0 ? void 0 : _b.forEach(removeDomNodes);
}
//# sourceMappingURL=jest-setup-test-framework.js.map