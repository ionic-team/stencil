import * as d from '../declarations';
import { hasError } from '@utils';
import { isOutputTargetDistLazy, isOutputTargetWww } from '../compiler/output-targets/output-utils';
import { runJest } from './jest/jest-runner';
import { runJestScreenshot } from './jest/jest-screenshot';
import { startPuppeteerBrowser } from './puppeteer/puppeteer-browser';
import * as puppeteer from 'puppeteer';


export class Testing implements d.Testing {
  isValid = false;
  compiler: d.Compiler;
  config: d.Config;
  devServer: d.DevServer;
  puppeteerBrowser: puppeteer.Browser;

  constructor(config: d.Config) {
    const { Compiler } = require('../compiler/index.js');

    this.compiler = new Compiler(setupTestingConfig(config));
    this.config = this.compiler.config;

    this.isValid = this.compiler.isValid;

    if (this.isValid) {
      if (!config.flags.spec && !config.flags.e2e) {
        config.logger.error(`Testing requires either the --spec or --e2e command line flags, or both. For example, to run unit tests, use the command: stencil test --spec`);
        this.isValid = false;
      }
    }
  }

  async runTests() {
    if (!this.isValid || !this.compiler) {
      return false;
    }

    const env: d.E2EProcessEnv = process.env;
    const compiler = this.compiler;
    const config = this.config;
    config.outputTargets = getOutputTargets(config);

    const msg: string[] = [];

    if (config.flags.e2e) {
      msg.push('e2e');
      env.__STENCIL_E2E_TESTS__ = 'true';
    }

    if (config.flags.spec) {
      msg.push('spec');
      env.__STENCIL_SPEC_TESTS__ = 'true';
    }

    this.config.logger.info(this.config.logger.magenta(`testing ${msg.join(' and ')} files`));

    const doScreenshots = !!(config.flags.e2e && config.flags.screenshot);
    if (doScreenshots) {
      env.__STENCIL_SCREENSHOT__ = 'true';

      if (config.flags.updateScreenshot) {
        this.config.logger.info(this.config.logger.magenta(`updating master screenshots`));
      } else {
        this.config.logger.info(this.config.logger.magenta(`comparing against master screenshots`));
      }
    }

    if (config.flags.e2e) {
      // e2e tests only
      // do a build, start a dev server
      // and spin up a puppeteer browser

      let buildTask: Promise<d.BuildResults> = null;

      (config.outputTargets as d.OutputTargetWww[]).forEach(outputTarget => {
        outputTarget.empty = false;
      });

      const doBuild = !(config.flags && config.flags.build === false);
      if (doBuild) {
        buildTask = compiler.build();
      }

      const startupResults = await Promise.all([
        compiler.startDevServer(),
        startPuppeteerBrowser(config),
      ]);

      this.devServer = startupResults[0];
      this.puppeteerBrowser = startupResults[1];

      if (doBuild) {
        const results = await buildTask;
        if (!results || (!config.watch && hasError(results && results.diagnostics))) {
          await this.destroy();
          return false;
        }
      }

      if (this.devServer) {
        env.__STENCIL_BROWSER_URL__ = this.devServer.browserUrl;
        this.config.logger.debug(`e2e dev server url: ${env.__STENCIL_BROWSER_URL__}`);

        env.__STENCIL_APP_URL__ = getAppUrl(config, this.devServer.browserUrl);
        this.config.logger.debug(`e2e app url: ${env.__STENCIL_APP_URL__}`);
      }
    }

    let passed = false;

    try {
      if (doScreenshots) {
        passed = await runJestScreenshot(config, env);
      } else {
        passed = await runJest(config, env);
      }
      this.config.logger.info('');

    } catch (e) {
      this.config.logger.error(e);
    }

    return passed;
  }

  async destroy() {
    if (this.config) {
      this.config.sys.destroy();
      this.config = null;
    }

    if (this.devServer) {
      await this.devServer.close();
      this.devServer = null;
    }

    if (this.puppeteerBrowser) {
      await this.puppeteerBrowser.close();
      this.puppeteerBrowser = null;
    }

    this.compiler = null;
  }
}


function setupTestingConfig(config: d.Config) {
  config.buildEs5 = false;
  config.devMode = true;
  config.maxConcurrentWorkers = 1;
  config.validateTypes = false;
  config._isTesting = true;

  config.flags = config.flags || {};
  config.flags.serve = false;
  config.flags.open = false;

  return config;
}


function getOutputTargets(config: d.Config) {
  return config.outputTargets.filter(o => {
    return isOutputTargetWww(o) || isOutputTargetDistLazy(o);
  });
}


function getAppUrl(config: d.Config, browserUrl: string) {
  const wwwOutput = config.outputTargets.find(isOutputTargetWww);
  const appBuildDir = wwwOutput.buildDir;
  const appFileName = `${config.fsNamespace}.esm.js`;
  const appFilePath = config.sys.path.join(appBuildDir, appFileName);

  const appUrlPath = config.sys.path.relative(wwwOutput.dir, appFilePath);

  return browserUrl + appUrlPath;
}
