import * as d from '../declarations';
import { buildError, catchError } from '@utils';
import { drainPrerenderQueue, initializePrerenderEntryUrls } from './prerender-queue';
import { generateRobotsTxt } from './robots-txt';
import { generateSitemapXml } from './sitemap-xml';
import { generateTemplateHtml } from './prerender-template-html';
import { getPrerenderConfig } from './prerender-config';
import { getAbsoluteBuildDir } from '../compiler/html/utils';
import { isOutputTargetWww } from '../compiler/output-targets/output-utils';
import { WorkerManager } from '../sys/node/worker';
import path from 'path';
import readline from 'readline';
import { URL } from 'url';


export async function runPrerender(prcs: NodeJS.Process, cliRootDir: string, config: d.Config, devServer: d.DevServer, buildResults: d.BuildResults) {
  const outputTargets = config.outputTargets
    .filter(isOutputTargetWww)
    .filter(o => typeof o.indexHtml === 'string');

  if (outputTargets.length === 0) {
    return;
  }

  const diagnostics: d.Diagnostic[] = [];
  try {
    const workerModulePath = path.join(cliRootDir, 'cli-worker.js');
    const workerManager = new WorkerManager(workerModulePath, {
      maxConcurrentWorkers: config.maxConcurrentWorkers,
      maxConcurrentTasksPerWorker: config.maxConcurrentTasksPerWorker,
      logger: config.logger
    });

    await Promise.all(outputTargets.map(outputTarget => {
      return runPrerenderOutputTarget(
        prcs,
        workerManager,
        diagnostics,
        config,
        devServer,
        buildResults,
        outputTarget
      );
    }));

    workerManager.destroy();

  } catch (e) {
    catchError(diagnostics, e);
  }

  config.logger.printDiagnostics(diagnostics);
}


async function runPrerenderOutputTarget(prcs: NodeJS.Process, workerManager: WorkerManager, diagnostics: d.Diagnostic[], config: d.Config, devServer: d.DevServer, buildResults: d.BuildResults, outputTarget: d.OutputTargetWww) {
  try {
    const timeSpan = config.logger.createTimeSpan(`prerendering started`);

    const prerenderDiagnostics: d.Diagnostic[] = [];

    const devServerBaseUrl = new URL(devServer.browserUrl);
    const devServerHostUrl = devServerBaseUrl.origin;
    config.logger.debug(`prerender dev server: ${devServerHostUrl}`);

    // get the prerender urls to queue up
    const manager: d.PrerenderManager = {
      prcs,
      prerenderUrlWorker(prerenderRequest: d.PrerenderRequest) {
        return workerManager.run('prerenderWorker', [prerenderRequest]);
      },
      componentGraphPath: null,
      config: config,
      diagnostics: prerenderDiagnostics,
      devServerHostUrl: devServerHostUrl,
      hydrateAppFilePath: buildResults.hydrateAppFilePath,
      isDebug: (config.logLevel === 'debug'),
      logCount: 0,
      maxConcurrency: (config.maxConcurrentWorkers * 2 - 1),
      outputTarget: outputTarget,
      prerenderConfig: getPrerenderConfig(prerenderDiagnostics, outputTarget.prerenderConfig),
      prerenderConfigPath: outputTarget.prerenderConfig,
      templateId: null,
      urlsCompleted: new Set(),
      urlsPending: new Set(),
      urlsProcessing: new Set(),
      resolve: null
    };

    if (!config.flags.ci && config.logLevel !== 'debug') {
      manager.progressLogger = startProgressLogger();
    }

    initializePrerenderEntryUrls(manager);

    if (manager.urlsPending.size === 0) {
      const err = buildError(diagnostics);
      err.messageText = `prerendering failed: no urls found in the prerender config`;
      return;
    }

    const templateHtml = await generateTemplateHtml(config, diagnostics, outputTarget);
    manager.templateId = await createPrerenderTemplate(config, templateHtml);
    manager.componentGraphPath = await createComponentGraphPath(config, buildResults, outputTarget);

    await new Promise(resolve => {
      manager.resolve = resolve;

      config.sys.nextTick(() => {
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


async function createPrerenderTemplate(config: d.Config, templateHtml: string) {
  const hash = await config.sys.generateContentHash(templateHtml, 12);
  const templateFileName = `prerender-template-${hash}.html`;
  const templateId = config.sys.path.join(config.sys.details.tmpDir, templateFileName);
  await config.sys.fs.writeFile(templateId, templateHtml);
  return templateId;
}


async function createComponentGraphPath(config: d.Config, buildResults: d.BuildResults, outputTarget: d.OutputTargetWww) {
  if (buildResults.componentGraph) {
    const content = getComponentPathContent(config, buildResults.componentGraph, outputTarget);
    const hash = await config.sys.generateContentHash(content, 12);
    const fileName = `prerender-component-graph-${hash}.json`;
    const componentGraphPath = config.sys.path.join(config.sys.details.tmpDir, fileName);
    await config.sys.fs.writeFile(componentGraphPath, content);
    return componentGraphPath;
  }
  return null;
}


function getComponentPathContent(config: d.Config, componentGraph: Map<string, string[]>, outputTarget: d.OutputTargetWww) {
  const buildDir = getAbsoluteBuildDir(config, outputTarget);
  const object: {[key: string]: string[]} = {};
  for (const [key, chunks] of componentGraph.entries()) {
    object[key] = chunks.map(filename => config.sys.path.join(buildDir, filename));
  }
  return JSON.stringify(object);
}


const startProgressLogger = (): d.ProgressLogger => {
  let promise = Promise.resolve();
  const update = (text: string) => {
    text = text.substr(0, process.stdout.columns - 5) + '\x1b[0m';
    return promise = promise.then(() => {
      return new Promise<any>(resolve => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(text, resolve);
      });
    });
  };
  const stop = () => {
    return update('\x1B[?25h');
  };
  // hide cursor
  process.stdout.write('\x1B[?25l');
  return {
    update,
    stop
  };
};
