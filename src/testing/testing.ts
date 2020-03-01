import { CompilerBuildResults, CompilerNext, Config, DevServer, E2EProcessEnv, OutputTargetWww, Testing, TestingRunOptions } from '@stencil/core/internal';
import { getAppScriptUrl, getAppStyleUrl } from './testing-utils';
import { hasError } from '@utils';
import { runJest } from './jest/jest-runner';
import { runJestScreenshot } from './jest/jest-screenshot';
import { startPuppeteerBrowser } from './puppeteer/puppeteer-browser';
import { startServer } from '@stencil/core/dev-server';
import * as puppeteer from 'puppeteer';


export const createTesting = async (config: Config): Promise<Testing> => {
  config = setupTestingConfig(config);

  const { createCompiler } = require('../compiler/stencil.js');
  const compiler: CompilerNext = await createCompiler(config);

  let devServer: DevServer;
  let puppeteerBrowser: puppeteer.Browser;

  const run = async (opts: TestingRunOptions = {}) => {
    if (!opts.spec && !opts.e2e) {
      config.logger.error(`Testing requires either the --spec or --e2e command line flags, or both. For example, to run unit tests, use the command: stencil test --spec`);
      return false;
    }

    const env: E2EProcessEnv = process.env;
    const msg: string[] = [];

    if (opts.e2e) {
      msg.push('e2e');
      env.__STENCIL_E2E_TESTS__ = 'true';
    }

    if (opts.spec) {
      msg.push('spec');
      env.__STENCIL_SPEC_TESTS__ = 'true';
    }

    config.logger.info(config.logger.magenta(`testing ${msg.join(' and ')} files`));

    const doScreenshots = !!(opts.e2e && opts.screenshot);
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

      (config.outputTargets as OutputTargetWww[]).forEach(outputTarget => {
        outputTarget.empty = false;
      });

      const doBuild = !(config.flags && config.flags.build === false);
      if (doBuild) {
        buildTask = compiler.build();
      }

      config.devServer.openBrowser = false;
      config.devServer.gzip = false;
      config.devServer.reloadStrategy = null;

      const startupResults = await Promise.all([
        startServer(config.devServer, config.logger),
        startPuppeteerBrowser(config),
      ]);

      devServer = startupResults[0];
      puppeteerBrowser = startupResults[1];

      if (doBuild) {
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

    let passed = false;

    try {
      if (doScreenshots) {
        passed = await runJestScreenshot(config, env);
      } else {
        passed = await runJest(config, env);
      }
      config.logger.info('');

    } catch (e) {
      config.logger.error(e);
    }

    return passed;
  };

  const destroy = async () => {
    const closingTime: Promise<any>[] = []; // you don't have to go home but you can't stay here
    if (config) {
      config.sys && config.sys.destroy && config.sys.destroy();
      if (config.sys_next && config.sys_next.destroy) {
        closingTime.push(config.sys_next.destroy());
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
  }
};

function setupTestingConfig(config: Config) {
  config.buildEs5 = false;
  config.devMode = true;
  config.minifyCss = false;
  config.minifyJs = false;
  config.hashFileNames = false;
  config.validateTypes = false;
  config._isTesting = true;
  config.buildDist = true;

  config.flags = config.flags || {};
  config.flags.serve = false;
  config.flags.open = false;

  config.outputTargets.forEach(o => {
    if (o.type === 'www') {
      o.serviceWorker = null;
    }
  });

  return config;
}
