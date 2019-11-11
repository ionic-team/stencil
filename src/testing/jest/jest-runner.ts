import * as d from '../../declarations';
import { buildJestArgv, getProjectListFromCLIArgs } from './jest-config';
import { setScreenshotEmulateData } from '../puppeteer/puppeteer-emulate';


export async function runJest(config: d.Config, env: d.E2EProcessEnv) {
  let success = false;

  try {
    // set all of the emulate configs to the process.env to be read later on
    const emulateConfigs = getEmulateConfigs(config.testing, config.flags);
    env.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(emulateConfigs);

    if (config.flags.ci || config.flags.e2e) {
      env.__STENCIL_DEFAULT_TIMEOUT__ = '30000';
    } else {
      env.__STENCIL_DEFAULT_TIMEOUT__ = '15000';
    }
    if (config.flags.devtools) {
      env.__STENCIL_DEFAULT_TIMEOUT__ = '300000000';
    }

    // build up our args from our already know list of args in the config
    const jestArgv = buildJestArgv(config);

    // build up the project paths, which is basically the app's root dir
    const projects = getProjectListFromCLIArgs(config, jestArgv);

    // run the jest-cli with our data rather than letting the
    // jest-cli parse the args itself
    const { runCLI } = require('jest-cli');
    const cliResults = await runCLI(jestArgv, projects);

    success = !!cliResults.results.success;

  } catch (e) {
    config.logger.error(`runJest: ${e}`);
  }

  return success;
}


export function createTestRunner(): any {

  const TestRunner = require('jest-runner');

  class StencilTestRunner extends TestRunner {

    async runTests(tests: { path: string }[], watcher: any, onStart: any, onResult: any, onFailure: any, options: any) {
      const env = (process.env as d.E2EProcessEnv);

        // filter out only the tests the flags said we should run
      tests = tests.filter(t => includeTestFile(t.path, env));

      if (env.__STENCIL_SCREENSHOT__ === 'true') {
        // we're doing e2e screenshots, so let's loop through
        // each of the emulate configs for each test

        // get the emulate configs from the process env
        // and parse the emulate config data
        const emulateConfigs = JSON.parse(env.__STENCIL_EMULATE_CONFIGS__) as d.EmulateConfig[];

        // loop through each emulate config to re-run the tests per config
        for (let i = 0; i < emulateConfigs.length; i++) {
          const emulateConfig = emulateConfigs[i];

          // reset the environment for each emulate config
          setScreenshotEmulateData(emulateConfig, env);

          // run the test for each emulate config
          await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
        }

      } else {
        // not doing e2e screenshot tests
        // so just run each test once
        await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
      }
    }

  }

  return StencilTestRunner;
}


export function includeTestFile(testPath: string, env: d.E2EProcessEnv) {
  testPath = testPath.toLowerCase().replace(/\\/g, '/');

  const hasE2E = testPath.includes('.e2e.') || testPath.includes('/e2e.');
  if (env.__STENCIL_E2E_TESTS__ === 'true' && hasE2E) {
    // keep this test if it's an e2e file and we should be testing e2e
    return true;
  }

  if (env.__STENCIL_SPEC_TESTS__ === 'true' && !hasE2E) {
    // keep this test if it's a spec file and we should be testing unit tests
    return true;
  }
  return false;
}


export function getEmulateConfigs(testing: d.TestingConfig, flags: d.ConfigFlags) {
  let emulateConfigs = testing.emulate.slice();

  if (typeof flags.emulate === 'string') {
    const emulateFlag = flags.emulate.toLowerCase();

    emulateConfigs = emulateConfigs.filter(emulateConfig => {
      if (typeof emulateConfig.device === 'string' && emulateConfig.device.toLowerCase() === emulateFlag) {
        return true;
      }

      if (typeof emulateConfig.userAgent === 'string' && emulateConfig.userAgent.toLowerCase().includes(emulateFlag)) {
        return true;
      }

      return false;
    });
  }

  return emulateConfigs;
}
