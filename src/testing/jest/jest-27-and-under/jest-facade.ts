import { JestFacade } from '../jest-facade';
import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-preprocessor';
import { createTestRunner as createTestRunner27 } from './jest-runner';
import { runJest as runJest27 } from './jest-runner';
import { runJestScreenshot as runJestScreenshot27 } from './jest-screenshot';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-setup-test-framework';

/**
 * `JestFacade` implementation for communicating between this directory's version of Jest and Stencil
 */
export class Jest27Stencil implements JestFacade {
  getJestCliRunner() {
    return runJest27;
  }

  getRunJestScreenshot() {
    return runJestScreenshot27;
  }

  getDefaultJestRunner() {
    return 'jest-jasmine2';
  }

  getCreateJestPuppeteerEnvironment() {
    return createJestPuppeteerEnvironment27;
  }

  getJestPreprocessor() {
    return jestPreprocessor27;
  }

  getCreateJestTestRunner() {
    return createTestRunner27;
  }

  getJestSetupTestFramework() {
    return jestSetupTestFramework27;
  }
}
