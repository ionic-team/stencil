import * as d from '../declarations';
import { buildError, catchError, hasError } from '@utils';
import { drainPrerenderQueue, initializePrerenderEntryUrls } from './prerender-queue';
import { generateRobotsTxt } from './robots-txt';
import { generateSitemapXml } from './sitemap-xml';
import { generateTemplateHtml } from './prerender-template-html';
import { getPrerenderConfig } from './prerender-config';
import { getAbsoluteBuildDir } from '../compiler/html/utils';
import { isOutputTargetWww } from '../compiler/output-targets/output-utils';
import { NodeWorkerController } from '../sys/node_next/worker';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { URL } from 'url';


export async function runPrerender(prcs: NodeJS.Process, cliRootDir: string, config: d.Config, devServer: d.DevServer, buildResults: d.CompilerBuildResults) {
  const outputTargets = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string');

  if (outputTargets.length === 0) {
    return;
  }

  const diagnostics: d.Diagnostic[] = [];

  if (typeof buildResults.hydrateAppFilePath !== 'string') {
    const diagnostic = buildError(diagnostics);
    diagnostic.header = `Prerender Error`;
    diagnostic.messageText = `Build results missing "hydrateAppFilePath"`;

  } else {
    const hydrateAppExists = fs.existsSync(buildResults.hydrateAppFilePath);
    if (!hydrateAppExists) {
      const diagnostic = buildError(diagnostics);
      diagnostic.header = `Prerender Error`;
      diagnostic.messageText = `Unable to open "hydrateAppFilePath": ${buildResults.hydrateAppFilePath}`;
    }
  }

  if (!hasError(diagnostics)) {
    let workerCtrl: NodeWorkerController = null;

    try {
      const cliWorkerPath = path.join(cliRootDir, 'cli-worker.js');
      workerCtrl = new NodeWorkerController(
        cliWorkerPath,
        config.maxConcurrentWorkers,
        config.logger
      );

      await Promise.all(outputTargets.map(outputTarget => {
        return runPrerenderOutputTarget(
          prcs,
          workerCtrl,
          diagnostics,
          config,
          devServer,
          buildResults,
          outputTarget
        );
      }));

    } catch (e) {
      catchError(diagnostics, e);
    }

    if (workerCtrl) {
      workerCtrl.destroy();
    }
  }

  config.logger.printDiagnostics(diagnostics);
}


async function runPrerenderOutputTarget(prcs: NodeJS.Process, workerManager: NodeWorkerController, diagnostics: d.Diagnostic[], config: d.Config, devServer: d.DevServer, buildResults: d.CompilerBuildResults, outputTarget: d.OutputTargetWww) {
  try {
    const timeSpan = config.logger.createTimeSpan(`prerendering started`);

    const prerenderDiagnostics: d.Diagnostic[] = [];

    const devServerBaseUrl = new URL(devServer.browserUrl);
    const devServerHostUrl = devServerBaseUrl.origin;
    config.logger.debug(`prerender hydrate app: ${buildResults.hydrateAppFilePath}`);
    config.logger.debug(`prerender dev server: ${devServerHostUrl}`);

    // get the prerender urls to queue up
    const manager: d.PrerenderManager = {
      prcs,
      prerenderUrlWorker(prerenderRequest: d.PrerenderRequest) {
        return workerManager.send('prerenderWorker', prerenderRequest);
      },
      componentGraphPath: null,
      config: config,
      diagnostics: prerenderDiagnostics,
      devServerHostUrl: devServerHostUrl,
      hydrateAppFilePath: buildResults.hydrateAppFilePath,
      isDebug: (config.logLevel === 'debug'),
      logCount: 0,
      maxConcurrency: Math.max(20, (config.maxConcurrentWorkers * 10)),
      outputTarget: outputTarget,
      prerenderConfig: getPrerenderConfig(prerenderDiagnostics, outputTarget.prerenderConfig),
      prerenderConfigPath: outputTarget.prerenderConfig,
      templateId: null,
      urlsCompleted: new Set(),
      urlsPending: new Set(),
      urlsProcessing: new Set(),
      resolve: null
    };

    if (!config.flags.ci && !manager.isDebug) {
      manager.progressLogger = startProgressLogger(prcs);
    }

    initializePrerenderEntryUrls(manager);

    if (manager.urlsPending.size === 0) {
      const err = buildError(diagnostics);
      err.messageText = `prerendering failed: no urls found in the prerender config`;
      return;
    }

    const templateHtml = await generateTemplateHtml(config, diagnostics, outputTarget);
    if (diagnostics.length > 0 || typeof templateHtml !== 'string') {
      return;
    }

    manager.templateId = createPrerenderTemplate(config, templateHtml);
    manager.componentGraphPath = createComponentGraphPath(config, buildResults, outputTarget);

    await new Promise(resolve => {
      manager.resolve = resolve;

      prcs.nextTick(() => {
        drainPrerenderQueue(manager);
      });
    });

    if (manager.isDebug) {
      const debugDiagnostics = prerenderDiagnostics.filter(d => d.level === 'debug');
      if (debugDiagnostics.length > 0) {
        config.logger.printDiagnostics(debugDiagnostics);
      }
    }

    const duration = timeSpan.duration();

    const sitemapResults = await generateSitemapXml(manager);
    await generateRobotsTxt(manager, sitemapResults);

    const prerenderBuildErrors = prerenderDiagnostics.filter(d => d.level === 'error');
    const prerenderRuntimeErrors = prerenderDiagnostics.filter(d => d.type === 'runtime');

    if (prerenderBuildErrors.length > 0) {
      // convert to just runtime errors so the other build files still write
      // but the CLI knows an error occurred and should have an exit code 1
      prerenderBuildErrors.forEach(diagnostic => {
        diagnostic.type = 'runtime';
      });
      diagnostics.push(...prerenderBuildErrors);
    }
    diagnostics.push(...prerenderRuntimeErrors);

    // Clear progress logger
    if (manager.progressLogger) {
      await manager.progressLogger.stop();
    }

    const totalUrls = manager.urlsCompleted.size;
    if (totalUrls > 1) {
      const average = Math.round(duration / totalUrls);
      config.logger.info(`prerendered ${totalUrls} urls, averaging ${average} ms per url`);
    }

    const statusMessage = prerenderBuildErrors.length > 0 ? 'failed' : 'finished';
    const statusColor = prerenderBuildErrors.length > 0 ? 'red' : 'green';

    timeSpan.finish(`prerendering ${statusMessage}`, statusColor, true);

  } catch (e) {
    catchError(diagnostics, e);
  }
}


function createPrerenderTemplate(config: d.Config, templateHtml: string) {
  const hash = generateContentHash(templateHtml);
  const templateFileName = `prerender-template-${hash}.html`;
  const templateId = path.join(os.tmpdir(), templateFileName);
  config.logger.debug(`prerender template: ${templateId}`);
  fs.writeFileSync(templateId, templateHtml);
  return templateId;
}


function createComponentGraphPath(config: d.Config, buildResults: d.CompilerBuildResults, outputTarget: d.OutputTargetWww) {
  if (buildResults.componentGraph) {
    const content = getComponentPathContent(config, buildResults.componentGraph, outputTarget);
    const hash = generateContentHash(content);
    const fileName = `prerender-component-graph-${hash}.json`;
    const componentGraphPath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(componentGraphPath, content);
    return componentGraphPath;
  }
  return null;
}


function getComponentPathContent(config: d.Config, componentGraph: {[scopeId: string]: string[]}, outputTarget: d.OutputTargetWww) {
  const buildDir = getAbsoluteBuildDir(config, outputTarget);
  const object: {[key: string]: string[]} = {};
  const entries = Object.entries(componentGraph);
  for (const [key, chunks] of entries) {
    object[key] = chunks.map(filename => path.join(buildDir, filename));
  }
  return JSON.stringify(object);
}


function startProgressLogger(prcs: NodeJS.Process): d.ProgressLogger {
  let promise = Promise.resolve();
  const update = (text: string) => {
    text = text.substr(0, prcs.stdout.columns - 5) + '\x1b[0m';
    return promise = promise.then(() => {
      return new Promise<any>(resolve => {
        readline.clearLine(prcs.stdout, 0);
        readline.cursorTo(prcs.stdout, 0, null);
        prcs.stdout.write(text, resolve);
      });
    });
  };

  const stop = () => {
    return update('\x1B[?25h');
  };

  // hide cursor
  prcs.stdout.write('\x1B[?25l');
  return {
    update,
    stop
  };
}


function generateContentHash(content: string) {
  return crypto.createHash('md5')
    .update(content)
    .digest('hex')
    .toLowerCase()
    .substr(0, 12);
}
