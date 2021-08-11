import type { BuildResultsComponentGraph, Config, Diagnostic } from '../declarations';
import type { CoreCompiler } from './load-compiler';
import { catchError } from '@utils';
import { startupCompilerLog } from './logs';

export const taskPrerender = async (coreCompiler: CoreCompiler, config: Config) => {
  startupCompilerLog(coreCompiler, config);

  const hydrateAppFilePath = config.flags.unknownArgs[0];

  if (typeof hydrateAppFilePath !== 'string') {
    config.logger.error(`Missing hydrate app script path`);
    return config.sys.exit(1);
  }

  const srcIndexHtmlPath = config.srcIndexHtml;

  const diagnostics = await runPrerenderTask(coreCompiler, config, hydrateAppFilePath, null, srcIndexHtmlPath);
  config.logger.printDiagnostics(diagnostics);

  if (diagnostics.some((d) => d.level === 'error')) {
    return config.sys.exit(1);
  }
};

export const runPrerenderTask = async (
  coreCompiler: CoreCompiler,
  config: Config,
  hydrateAppFilePath: string,
  componentGraph: BuildResultsComponentGraph,
  srcIndexHtmlPath: string
) => {
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
};
