import type { BuildResultsComponentGraph, Config, Diagnostic } from '../declarations';
import type { CoreCompiler } from './load-compiler';
import { catchError } from '@utils';
import { startupCompilerLog } from './logs';

export async function taskPrerender(coreCompiler: CoreCompiler, config: Config) {
  startupCompilerLog(coreCompiler, config);

  const hydrateAppFilePath = config.flags.unknownArgs[0];

  if (typeof hydrateAppFilePath !== 'string') {
    config.logger.error(`Missing hydrate app script path`);
    config.sys.exit(1);
  }

  const srcIndexHtmlPath = config.srcIndexHtml;

  const diagnostics = await runPrerenderTask(coreCompiler, config, hydrateAppFilePath, null, srcIndexHtmlPath);
  config.logger.printDiagnostics(diagnostics);

  if (diagnostics.some(d => d.level === 'error')) {
    config.sys.exit(1);
  }
}

export async function runPrerenderTask(
  coreCompiler: CoreCompiler,
  config: Config,
  hydrateAppFilePath: string,
  componentGraph: BuildResultsComponentGraph,
  srcIndexHtmlPath: string,
) {
  const diagnostics: Diagnostic[] = [];

  try {
    const prerenderer = await coreCompiler.createPrerenderer(config);
    const results = await prerenderer.start({
      hydrateAppFilePath,
      componentGraph,
      srcIndexHtmlPath,
    });

    diagnostics.push(...results.diagnostics);
  } catch (e) {
    catchError(diagnostics, e);
  }

  return diagnostics;
}
