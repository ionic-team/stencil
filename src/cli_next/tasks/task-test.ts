import * as d from '../../declarations';
import { Testing as TestingTypes } from '@stencil/core/testing';
import exit from 'exit';


export async function taskTest(config: d.Config) {
  try {
    const testingRunOpts: d.TestingRunOptions = {
      e2e: !!config.flags.e2e,
      screenshot: !!config.flags.screenshot,
      spec: !!config.flags.spec,
      updateScreenshot: !!config.flags.updateScreenshot,
    };

    // always ensure we have jest modules installed
    const ensureModuleIds = [
      '@types/jest',
      'jest',
      'jest-cli'
    ];

    if (testingRunOpts.e2e) {
      // if it's an e2e test, also make sure we're got
      // puppeteer modules installed and if browserExecutablePath is provided don't download Chromium use only puppeteer-core instead
      const puppeteer = config.testing.browserExecutablePath ? 'puppeteer-core' : 'puppeteer';

      ensureModuleIds.push(
        '@types/puppeteer',
        puppeteer
      );

      if (testingRunOpts.screenshot) {
        // ensure we've got pixelmatch for screenshots
        config.logger.warn(config.logger.yellow(`EXPERIMENTAL: screenshot visual diff testing is currently under heavy development and has not reached a stable status. However, any assistance testing would be appreciated.`));
      }
    }

    // ensure we've got the required modules installed
    // jest and puppeteer are quite large, so this
    // is an experiment to lazy install these
    // modules only when you need them
    await config.sys.lazyRequire.ensure(
      config.logger,
      config.rootDir,
      ensureModuleIds
    );

    // let's test!
    const { createTesting } = require('../testing/index.js');
    const testing: TestingTypes = await createTesting(config);
    const passed = await testing.run(testingRunOpts);
    await testing.destroy();

    if (!passed) {
      exit(1);
    }

  } catch (e) {
    config.logger.error(e);
    exit(1);
  }
}
