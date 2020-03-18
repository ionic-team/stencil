import * as d from '../../declarations';
import { checkVersion } from './task-version';
import { runPrerenderTask } from './task-prerender';
import { startupLog } from './startup-log';
import { taskWatch } from './task-watch';
import exit from 'exit';

export async function taskBuild(prcs: NodeJS.Process, config: d.Config) {
  if (config.flags.watch) {
    // watch build
    await taskWatch(prcs, config);
    return;
  }

  // one-time build
  startupLog(prcs, config);
  let exitCode = 0;

  try {
    const { createCompiler, version } = await import('@stencil/core/compiler');
    const checkVersionPromise = checkVersion(config, version);
    const compiler = await createCompiler(config);
    const results = await compiler.build();

    await compiler.destroy();

    if (results.hasError) {
      exitCode = 1;
    } else if (config.flags.prerender) {
      const prerenderDiagnostics = await runPrerenderTask(prcs, config, results.hydrateAppFilePath, results.componentGraph, null);
      config.logger.printDiagnostics(prerenderDiagnostics);

      if (prerenderDiagnostics.some(d => d.level === 'error')) {
        exitCode = 1;
      }
    }

    const checkVersionResults = await checkVersionPromise;
    checkVersionResults();
  } catch (e) {
    exitCode = 1;
    config.logger.error(e);
  }

  if (exitCode > 0) {
    exit(exitCode);
  }
}
