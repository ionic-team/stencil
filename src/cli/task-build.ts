import type { Config } from '../declarations';
import type { CoreCompiler } from './load-compiler';
import { runPrerenderTask } from './task-prerender';
import { startCheckVersion, printCheckVersionResults } from './check-version';
import { startupCompilerLog } from './logs';
import { taskWatch } from './task-watch';

export const taskBuild = async (coreCompiler: CoreCompiler, config: Config) => {
  if (config.flags.watch) {
    // watch build
    await taskWatch(coreCompiler, config);
    return;
  }

  // one-time build
  let exitCode = 0;

  try {
    startupCompilerLog(coreCompiler, config);

    const versionChecker = startCheckVersion(config, coreCompiler.version);

    const compiler = await coreCompiler.createCompiler(config);
    const results = await compiler.build();

    await compiler.destroy();

    if (results.hasError) {
      exitCode = 1;
    } else if (config.flags.prerender) {
      const prerenderDiagnostics = await runPrerenderTask(coreCompiler, config, results.hydrateAppFilePath, results.componentGraph, null);
      config.logger.printDiagnostics(prerenderDiagnostics);

      if (prerenderDiagnostics.some(d => d.level === 'error')) {
        exitCode = 1;
      }
    }

    await printCheckVersionResults(versionChecker);
  } catch (e) {
    exitCode = 1;
    config.logger.error(e);
  }

  if (exitCode > 0) {
    config.sys.exit(exitCode);
  }
};
