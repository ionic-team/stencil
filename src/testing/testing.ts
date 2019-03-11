import * as d from '../declarations';
import { hasError } from '@utils';
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
    const { isValid, outputTarget } = getOutputTarget(config);
    if (!isValid) {
      this.isValid = false;
      return false;
    }

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
        this.config.logger.debug(`dev server url: ${env.__STENCIL_BROWSER_URL__}`);

        env.__STENCIL_LOADER_URL__ = getLoaderScriptUrl(config, outputTarget, this.devServer.browserUrl);
        this.config.logger.debug(`dev server loader: ${env.__STENCIL_LOADER_URL__}`);
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

  config.flags = config.flags || {};
  config.flags.serve = false;
  config.flags.open = false;

  return config;
}


function getOutputTarget(config: d.Config) {
  let isValid = true;

  let outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
  if (!outputTarget) {
    outputTarget = config.outputTargets.find(o => o.type === 'dist') as d.OutputTargetWww;
    if (!outputTarget) {
      config.logger.error(`Test missing config output target`);
      isValid = false;
    }
  }
  outputTarget.serviceWorker = null;

  config.outputTargets = [outputTarget];

  return { isValid, outputTarget };
}


function getLoaderScriptUrl(config: d.Config, outputTarget: d.OutputTargetWww, browserUrl: string) {
  const appLoaderFilePath = 'getLoaderPath(config, outputTarget)';

  let appLoadUrlPath: string;

  if (outputTarget.type === 'www') {
    appLoadUrlPath = config.sys.path.relative(outputTarget.dir, appLoaderFilePath);
  } else {
    appLoadUrlPath = config.sys.path.relative(config.rootDir, appLoaderFilePath);
  }

  return browserUrl + appLoadUrlPath;
}
