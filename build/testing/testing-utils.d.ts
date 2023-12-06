/// <reference types="jest" />
import type * as d from '@stencil/core/internal';
import { InMemoryFileSystem } from '../compiler/sys/in-memory-fs';
export declare function shuffleArray(array: any[]): any[];
/**
 * Testing utility to validate the existence of some provided file paths using a specific file system
 *
 * @param fs the file system to use to validate the existence of some files
 * @param filePaths the paths to validate
 * @throws when one or more of the provided file paths cannot be found
 */
export declare function expectFilesExist(fs: InMemoryFileSystem, filePaths: string[]): void;
/**
 * Testing utility to validate the non-existence of some provided file paths using a specific file system
 *
 * @param fs the file system to use to validate the non-existence of some files
 * @param filePaths the paths to validate
 * @throws when one or more of the provided file paths is found
 */
export declare function expectFilesDoNotExist(fs: InMemoryFileSystem, filePaths: string[]): void;
export declare function getAppScriptUrl(config: d.ValidatedConfig, browserUrl: string): string;
export declare function getAppStyleUrl(config: d.ValidatedConfig, browserUrl: string): string;
/**
 * Utility for silencing `console` functions in tests.
 *
 * When this function is first called it grabs a reference to the `log`,
 * `error`, and `warn` functions on `console` and then returns a per-test setup
 * function which sets up a fresh set of mocks (via `jest.fn()`) and then
 * assigns them to each of these functions. This setup function will return a
 * reference to each of the three mock functions so tests can make assertions
 * about their calls and so on.
 *
 * Because references to the original `.log`, `.error`, and `.warn` functions
 * exist in closure within the function, it can use an `afterAll` call to clean
 * up after itself and ensure that the original implementations are restored
 * after the test suite finishes.
 *
 * An example of using this to silence log statements in a single test could look
 * like this:
 *
 * ```ts
 * describe("my-test-suite", () => {
 *   const { setupConsoleMocks, teardownConsoleMocks } = setupConsoleMocker()
 *
 *   it("should log a message", () => {
 *     const { logMock } = setupConsoleMocks();
 *     myFunctionWhichLogs(foo, bar);
 *     expect(logMock).toBeCalledWith('my log message');
 *     teardownConsoleMocks();
 *   })
 * })
 * ```
 *
 * @returns a per-test mock setup function
 */
export declare function setupConsoleMocker(): ConsoleMocker;
interface ConsoleMocker {
    setupConsoleMocks: () => {
        logMock: jest.Mock<typeof console.log>;
        warnMock: jest.Mock<typeof console.warn>;
        errorMock: jest.Mock<typeof console.error>;
    };
    teardownConsoleMocks: () => void;
}
/**
 * the callback that `withSilentWarn` expects to receive. Basically receives a mock
 * as its argument and returns a `Promise`, the value of which is returned by `withSilentWarn`
 * as well.
 */
type SilentWarnFunc<T> = (mock: jest.Mock<typeof console.warn>) => Promise<T>;
/**
 * Wrap a single callback with a silent `console.warn`. The callback passed in
 * receives the mocking function as an argument, so you can easily make assertions
 * that it is called if necessary.
 *
 * @param cb a callback which `withSilentWarn` will call after replacing `console.warn`
 * with a mock.
 * @returns a Promise wrapping the return value of the callback
 */
export declare function withSilentWarn<T>(cb: SilentWarnFunc<T>): Promise<T>;
export {};
