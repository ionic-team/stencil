import * as d from '@declarations';
import { logger, sys } from '@sys';
import exit from 'exit';


export async function taskTest(config: d.Config) {
  // always ensure we have jest modules installed
  const ensureModuleIds = [
    '@types/jest',
    'jest',
    'jest-cli'
  ];

  if (config.flags && config.flags.e2e) {
    // if it's an e2e test, also make sure we're got
    // puppeteer modules installed
    ensureModuleIds.push(
      '@types/puppeteer',
      'puppeteer'
    );

    if (config.flags.screenshot) {
      // ensure we've got pixelmatch for screenshots
      logger.warn(logger.yellow(`EXPERIMENTAL: screenshot visual diff testing is currently under heavy development and has not reached a stable status. However, any assistance testing would be appreciated.`));
    }
  }

  // ensure we've got the required modules installed
  // jest and puppeteer are quite large, so this
  // is an experiment to lazy install these
  // modules only when you need them
  await sys.lazyRequire.ensure(
    logger,
    config.rootDir,
    ensureModuleIds
  );

  try {
    const { Testing } = require('../testing/index.js');

    const testing: d.Testing = new Testing(config);
    if (!testing.isValid) {
      exit(1);
    }

    const passed = await testing.runTests();
    await testing.destroy();

    if (!passed) {
      exit(1);
    }

  } catch (e) {
    logger.error(e);
    exit(1);
  }
}
