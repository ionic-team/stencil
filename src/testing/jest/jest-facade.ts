import { JestConfig, JestPreprocessor, JestPuppeteerEnvironment, JestTestRunner } from './jest-apis';

/**
 * Interface for Jest-version specific code implementations that interact with Stencil.
 *
 * It is expected that there exists a Jest version-specific implementation for this interface in each version-specific
 * directory Stencil supports.
 */
export interface JestFacade {
  // TODO(STENCIL-961): Fix build validation when types are pulled in from `@stencil/core/declarations`
  /**
   * Retrieve a function that invokes the Jest CLI.
   *
   * This function does not perform the invocation itself. Rather, it expects the caller to prepare a Stencil
   * configuration object and environment for tests to run and invoke the returned value itself.
   *
   * @returns A function that invokes the Jest CLI.
   */
  getJestCliRunner(): (config: any, e2eEnv: any) => Promise<boolean>;

  // TODO(STENCIL-961): Fix build validation when types are pulled in from `@stencil/core/declarations`
  /**
   * Retrieve a function that invokes Stencil's Screenshot runner.
   *
   * This function does not start screenshot tests themselves. Rather, it expects the caller to prepare a Stencil
   * configuration object and environment for tests to run and invoke the screenshot runner itself.
   *
   * @returns A function that invokes the Screenshot runner.
   */
  getRunJestScreenshot(): (config: any, e2eEnv: any) => Promise<boolean>;

  /**
   * Retrieve the default Jest runner name prescribed by Stencil.
   *
   * Examples of valid return values include 'jest-jasmine2' and 'jest-circus'.
   *
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  getDefaultJestRunner(): string;

  /**
   * Retrieve a function that builds an E2E (puppeteer) testing environment that uses Jest as its test runner.
   *
   * @returns A function that builds an E2E testing environment.
   */
  getCreateJestPuppeteerEnvironment(): () => JestPuppeteerEnvironment;

  /**
   * Create an object used to transform files as a part of running Jest.
   *
   * The object returned by this function is expected to conform to the interface/guide laid out by Jest for
   * [writing custom transformers](https://jestjs.io/docs/code-transformation#writing-custom-transformers).
   *
   * @returns the object used to transform files at test time
   */
  getJestPreprocessor(): JestPreprocessor;

  /**
   * Retrieve a custom Stencil-Jest test runner
   *
   * @returns the test runner
   */
  getCreateJestTestRunner(): JestTestRunner;

  /**
   * Retrieve a function that returns the setup configuration code to run between tests.
   *
   * The value returned by said function is expected to be used in a
   * [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array) context.
   *
   * @returns a function that runs a setup configuration between tests.
   */
  getJestSetupTestFramework(): () => void;

  /**
   * Retrieve the Jest preset configuration object for configuring tests.
   *
   * The value returned by said function is expected to be used in a
   * [preset](https://jestjs.io/docs/configuration#preset-string) context.
   *
   * @returns the Jest preset object to be used for a particular version of Jest.
   */
  getJestPreset(): JestConfig;
}
