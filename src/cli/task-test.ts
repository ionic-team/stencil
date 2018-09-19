import * as d from '../declarations';


export async function taskTest(config: d.Config) {
  await config.sys.lazyRequire.ensure(
    config.logger,
    config.rootDir,
    [
      '@types/jest',
      '@types/puppeteer',
      'jest',
      'jest-environment-node',
      'puppeteer'
    ]
  );

  const { Testing } = require('../testing/index.js');

  const testing: d.Testing = new Testing(config);
  if (!testing.isValid) {
    process.exit(1);
  }

  const passed = await testing.runTests();
  await testing.destroy();

  if (passed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
