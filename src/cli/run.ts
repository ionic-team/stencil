import type { CliInitOptions } from '../declarations';
import { hasError, isFunction, shouldIgnoreError } from '@utils';
import { loadCoreCompiler } from './load-compiler';
import { loadedCompilerLog, startupLog } from './logs';
import { parseFlags } from './parse-flags';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskGenerate } from './task-generate';
import { taskHelp } from './task-help';
import { taskInfo } from './task-info';
import { taskPrerender } from './task-prerender';
import { taskServe } from './task-serve';
import { taskTest } from './task-test';
import { version } from '../version';

export async function run(init: CliInitOptions) {
  const { args, logger, sys, checkVersion } = init;

  try {
    const flags = parseFlags(sys, args);
    if (flags.debug || flags.verbose) {
      logger.setLevel('debug');
    }

    if (flags.ci) {
      logger.enableColors(false);
    }

    if (isFunction(sys.applyGlobalPatch)) {
      sys.applyGlobalPatch(sys.getCurrentDirectory());
    }

    if (flags.task === 'version' || flags.version) {
      console.log(version);
      return;
    }

    if (flags.task === 'help' || flags.help) {
      taskHelp(sys, logger);
      return;
    }

    startupLog(logger, flags);

    const coreCompiler = await loadCoreCompiler(sys);

    loadedCompilerLog(sys, logger, flags, coreCompiler);

    if (flags.task === 'info') {
      taskInfo(coreCompiler, sys, logger);
      return;
    }

    const validated = await coreCompiler.loadConfig({
      config: {
        flags,
      },
      configPath: flags.config,
      logger,
      sys,
    });

    if (validated.diagnostics.length > 0) {
      logger.printDiagnostics(validated.diagnostics);
      if (hasError(validated.diagnostics)) {
        sys.exit(1);
      }
    }

    if (isFunction(sys.applyGlobalPatch)) {
      sys.applyGlobalPatch(validated.config.rootDir);
    }

    switch (flags.task) {
      case 'build':
        await taskBuild(coreCompiler, validated.config, checkVersion);
        break;

      case 'docs':
        await taskDocs(coreCompiler, validated.config);
        break;

      case 'generate':
      case 'g':
        await taskGenerate(coreCompiler, validated.config);
        break;

      case 'prerender':
        await taskPrerender(coreCompiler, validated.config);
        break;

      case 'serve':
        await taskServe(validated.config);
        break;

      case 'test':
        await taskTest(validated.config);
        break;

      default:
        logger.error(`${logger.emoji('❌ ')}Invalid stencil command, please see the options below:`);
        taskHelp(sys, logger);
        sys.exit(1);
    }
  } catch (e) {
    if (!shouldIgnoreError(e)) {
      logger.error(`uncaught cli error: ${e}${logger.getLevel() === 'debug' ? e.stack : ''}`);
      sys.exit(1);
    }
  }
}
