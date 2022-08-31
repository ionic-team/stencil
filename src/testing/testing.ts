import type {
  CompilerBuildResults,
  Compiler,
  CompilerWatcher,
  DevServer,
  E2EProcessEnv,
  ValidatedConfig,
  OutputTargetWww,
  Testing,
  TestingRunOptions,
} from '@stencil/core/internal';
import { getAppScriptUrl, getAppStyleUrl } from './testing-utils';
import { hasError } from '@utils';
import { runJest } from './jest/jest-runner';
import { runJestScreenshot } from './jest/jest-screenshot';
import { startPuppeteerBrowser } from './puppeteer/puppeteer-browser';
import { start } from '@stencil/core/dev-server';
import type * as puppeteer from 'puppeteer';

export const createTesting = async (config: ValidatedConfig): Promise<Testing> => {
  config = setupTestingConfig(config);

  const { createCompiler } = require('../compiler/stencil.js');
  const compiler: Compiler = await createCompiler(config);

  let devServer: DevServer;
  let puppeteerBrowser: puppeteer.Browser;

  const run = async (opts: TestingRunOptions = {}) => {
    let doScreenshots = false;
    let passed = false;
    let env: E2EProcessEnv;
    let compilerWatcher: CompilerWatcher = null;
    const msg: string[] = [];

    try {
      if (!opts.spec && !opts.e2e) {
        config.logger.error(
          `Testing requires either the --spec or --e2e command line flags, or both. For example, to run unit tests, use the command: stencil test --spec`
        );
        return false;
      }

      env = process.env;

      if (opts.e2e) {
        msg.push('e2e');
        env.__STENCIL_E2E_TESTS__ = 'true';
      }

      if (opts.spec) {
        msg.push('spec');
        env.__STENCIL_SPEC_TESTS__ = 'true';
      }

      config.logger.info(config.logger.magenta(`testing ${msg.join(' and ')} files${config.watch ? ' (watch)' : ''}`));

      doScreenshots = !!(opts.e2e && opts.screenshot);
      if (doScreenshots) {
        env.__STENCIL_SCREENSHOT__ = 'true';

        if (opts.updateScreenshot) {
          config.logger.info(config.logger.magenta(`updating master screenshots`));
        } else {
          config.logger.info(config.logger.magenta(`comparing against master screenshots`));
        }
      }

      if (opts.e2e) {
        // e2e tests only
        // do a build, start a dev server
        // and spin up a puppeteer browser
        let buildTask: Promise<CompilerBuildResults> = null;

        (config.outputTargets as OutputTargetWww[]).forEach((outputTarget) => {
          outputTarget.empty = false;
        });

        const doBuild = !(config.flags && config.flags.build === false);
        if (doBuild && config.watch) {
          compilerWatcher = await compiler.createWatcher();
        }

        if (doBuild) {
          if (compilerWatcher) {
            buildTask = new Promise((resolve) => {
              const removeListener = compilerWatcher.on('buildFinish', (buildResults) => {
                removeListener();
                resolve(buildResults);
              });
            });
            compilerWatcher.start();
          } else {
            buildTask = compiler.build();
          }
        }

        config.devServer.openBrowser = false;
        config.devServer.gzip = false;
        config.devServer.reloadStrategy = null;

        const startupResults = await Promise.all([
          start(config.devServer, config.logger),
          startPuppeteerBrowser(config),
        ]);

        devServer = startupResults[0];
        puppeteerBrowser = startupResults[1];

        if (buildTask) {
          const results = await buildTask;
          if (!results || (!config.watch && hasError(results && results.diagnostics))) {
            await destroy();
            return false;
          }
        }

        if (devServer) {
          env.__STENCIL_BROWSER_URL__ = devServer.browserUrl;
          config.logger.debug(`e2e dev server url: ${env.__STENCIL_BROWSER_URL__}`);

          env.__STENCIL_APP_SCRIPT_URL__ = getAppScriptUrl(config, devServer.browserUrl);
          config.logger.debug(`e2e app script url: ${env.__STENCIL_APP_SCRIPT_URL__}`);

          const styleUrl = getAppStyleUrl(config, devServer.browserUrl);
          if (styleUrl) {
            env.__STENCIL_APP_STYLE_URL__ = getAppStyleUrl(config, devServer.browserUrl);
            config.logger.debug(`e2e app style url: ${env.__STENCIL_APP_STYLE_URL__}`);
          }
        }
      }
    } catch (e) {
      config.logger.error(e);
      return false;
    }

    try {
      if (doScreenshots) {
        passed = await runJestScreenshot(config, env);
      } else {
        passed = await runJest(config, env);
      }
      config.logger.info('');
      if (compilerWatcher) {
        await compilerWatcher.close();
      }
    } catch (e) {
      config.logger.error(e);
    }

    return passed;
  };

  const destroy = async () => {
    const closingTime: Promise<any>[] = []; // you don't have to go home but you can't stay here
    if (config) {
      if (config.sys && config.sys.destroy) {
        closingTime.push(config.sys.destroy());
      }
      config = null;
    }

    if (devServer) {
      if (devServer.close) {
        closingTime.push(devServer.close());
      }
      devServer = null;
    }

    if (puppeteerBrowser) {
      if (puppeteerBrowser.close) {
        closingTime.push(puppeteerBrowser.close());
      }
      puppeteerBrowser = null;
    }

    await Promise.all(closingTime);
  };

  return {
    destroy,
    run,
  };
};

/**
 * Create a Stencil configuration for testing purposes.
 *
 * This function accepts an internal, validated configuration entity and modifies fields on the object to be more
 * conducive to testing.
 *
 * @param validatedConfig the configuration to modify
 * @returns the modified testing configuration
 */
function setupTestingConfig(validatedConfig: ValidatedConfig): ValidatedConfig {
  validatedConfig.buildEs5 = false;
  validatedConfig.devMode = true;
  validatedConfig.minifyCss = false;
  validatedConfig.minifyJs = false;
  validatedConfig.hashFileNames = false;
  validatedConfig.validateTypes = false;
  validatedConfig._isTesting = true;
  validatedConfig.buildDist = true;

  validatedConfig.flags.serve = false;
  validatedConfig.flags.open = false;

  validatedConfig.outputTargets.forEach((o) => {
    if (o.type === 'www') {
      o.serviceWorker = null;
    }
  });

  if (validatedConfig.flags.args.includes('--watchAll')) {
    validatedConfig.watch = true;
  }

  return validatedConfig;
}
