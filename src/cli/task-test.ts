import * as d from '../declarations';


export async function taskTest(config: d.Config) {
  await config.sys.lazyRequire.ensure(
    config.logger,
    config.rootDir,
    ['@types/jest', 'jest', 'jest-environment-node', 'puppeteer']
  );

  const { Testing } = require('../testing/index.js');

  const testing: d.Testing = new Testing(config);
  if (!testing.isValid) {
    process.exit(1);
  }

  await testing.runTests();

  await testing.destroy();
}
