import * as d from '../../declarations';
import { catchError } from '@utils';
import { runPrerender } from '../../prerender/prerender-main';
import { startupLog } from './startup-log';
import { startServer } from '@stencil/core/dev-server';
import exit from 'exit';


export async function taskPrerender(prcs: NodeJS.Process, config: d.Config) {
  startupLog(prcs, config);

  const hydrateAppFilePath = config.flags.unknownArgs[0];

  if (typeof hydrateAppFilePath !== 'string') {
    config.logger.error(`Missing hydrate app script path`);
    exit(1);
  }

  const srcIndexHtmlPath = config.srcIndexHtml;

  const diagnostics = await runPrerenderTask(prcs, config, hydrateAppFilePath, null, srcIndexHtmlPath);
  config.logger.printDiagnostics(diagnostics);

  if (diagnostics.some(d => d.level === 'error')) {
    exit(1);
  }
}

export async function runPrerenderTask(prcs: NodeJS.Process, config: d.Config, hydrateAppFilePath: string, componentGraph: d.BuildResultsComponentGraph, srcIndexHtmlPath: string) {
  const devServerConfig = { ...config.devServer };
  devServerConfig.openBrowser = false;
  devServerConfig.gzip = false;
  devServerConfig.logRequests = false;
  devServerConfig.reloadStrategy = null;

  const devServer = await startServer(devServerConfig, config.logger);
  const diagnostics: d.Diagnostic[] = [];

  try {
    const prerenderDiagnostics = await runPrerender(prcs, __dirname, config, devServer, hydrateAppFilePath, componentGraph, srcIndexHtmlPath);
    diagnostics.push(...prerenderDiagnostics);
  } catch (e) {
    catchError(diagnostics, e);
  }

  if (devServer) {
    await devServer.close();
  }

  return diagnostics;
}
