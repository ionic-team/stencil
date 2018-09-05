import * as d from '../declarations';
import { getLoaderPath } from '../compiler/app/app-file-naming';
import { hasError } from '../compiler/util';
import { runJest, setupJestConfig } from './jest/jest-runner';
import { startPuppeteerBrowser } from './puppeteer/puppeteer-browser';
import * as puppeteer from 'puppeteer';


export class Testing implements d.Testing {
  isValid = false;
  compiler: d.Compiler;
  config: d.Config;
  devServer: d.DevServer;
  puppeteerBrowser: puppeteer.Browser;
  jestConfigPath: string;

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
      return;
    }

    const env: d.E2EProcessEnv = process.env;
    const compiler = this.compiler;
    const config = this.config;
    const { isValid, outputTarget } = getOutputTarget(config);
    if (!isValid) {
      this.isValid = false;
      return;
    }

    const msg: string[] = [];

    if (config.flags.e2e) {
      msg.push('e2e');
      env.__STENCIL_E2E_TESTS__ = 'true';
    }

    if (config.flags.spec) {
      msg.push('spec');
    }

    config.logger.info(config.logger.magenta(`testing ${msg.join(' and ')} files`));

    const doScreenshots = !!(config.flags.e2e && config.flags.screenshot);
    if (doScreenshots) {
      env.__STENCIL_SCREENSHOTS__ = 'true';
      config.logger.info(config.logger.magenta(`generating screenshots`));
    }

    const jestEnvNodeModule = config.sys.lazyRequire.getModulePath('jest-environment-node');
    env.__STENCIL_JEST_ENVIRONMENT_NODE_MODULE__ = jestEnvNodeModule;
    config.logger.debug(`jest-environment-node: ${jestEnvNodeModule}`);

    if (config.flags.e2e) {
      // e2e tests only
      // do a build, start a dev server
      // and spin up a puppeteer browser
      const startupResults = await Promise.all([
        compiler.build(),
        compiler.startDevServer(),
        startPuppeteerBrowser(config),
      ]);

      const results = startupResults[0];
      this.devServer = startupResults[1];
      this.puppeteerBrowser = startupResults[2];

      if (!results || (!config.watch && hasError(results && results.diagnostics))) {
        await this.destroy();
        process.exit(1);
      }

      if (this.devServer) {
        env.__STENCIL_BROWSER_URL__ = this.devServer.browserUrl;
        config.logger.debug(`dev server url: ${env.__STENCIL_BROWSER_URL__}`);

        env.__STENCIL_LOADER_URL__ = getLoaderScriptUrl(config, outputTarget, this.devServer.browserUrl);
        config.logger.debug(`dev server loader: ${env.__STENCIL_LOADER_URL__}`);
      }
    }

    this.jestConfigPath = await setupJestConfig(config);

    try {
      await runJest(config, this.jestConfigPath, doScreenshots);
    } catch (e) {
      config.logger.error(e);
    }

    config.logger.info('');
  }

  async destroy() {
    if (this.config) {
      if (this.jestConfigPath) {
        try {
          await this.config.sys.fs.unlink(this.jestConfigPath);
        } catch (e) {}
      }

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
  const appLoaderFilePath = getLoaderPath(config, outputTarget);

  let appLoadUrlPath: string;

  if (outputTarget.type === 'www') {
    appLoadUrlPath = config.sys.path.relative(outputTarget.dir, appLoaderFilePath);
  } else {
    appLoadUrlPath = config.sys.path.relative(config.rootDir, appLoaderFilePath);
  }

  return browserUrl + appLoadUrlPath;
}
