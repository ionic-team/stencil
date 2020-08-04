import type { CliInitOptions, Config, TaskCommand } from '../declarations';
import { dependencies } from '../compiler/sys/dependencies.json';
import { findConfig } from './find-config';
import { hasError, isFunction, shouldIgnoreError } from '@utils';
import { loadCoreCompiler, CoreCompiler } from './load-compiler';
import { loadedCompilerLog, startupLog, startupLogVersion } from './logs';
import { parseFlags } from './parse-flags';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskGenerate } from './task-generate';
import { taskHelp } from './task-help';
import { taskInfo } from './task-info';
import { taskPrerender } from './task-prerender';
import { taskServe } from './task-serve';
import { taskTest } from './task-test';

export const run = async (init: CliInitOptions) => {
  const { args, logger, sys } = init;

  try {
    const flags = parseFlags(args, sys);
    const task = flags.task;
    if (flags.debug || flags.verbose) {
      logger.setLevel('debug');
    }

    if (flags.ci) {
      logger.enableColors(false);
    }

    if (isFunction(sys.applyGlobalPatch)) {
      sys.applyGlobalPatch(sys.getCurrentDirectory());
    }

    if (task === 'help' || flags.help) {
      taskHelp(sys, logger);
      return;
    }

    startupLog(logger, task);

    const findConfigResults = await findConfig({ sys, configPath: flags.config });
    if (hasError(findConfigResults.diagnostics)) {
      logger.printDiagnostics(findConfigResults.diagnostics);
      sys.exit(1);
    }

    const ensureDepsResults = await sys.ensureDependencies({ rootDir: findConfigResults.rootDir, logger, dependencies });
    if (hasError(ensureDepsResults.diagnostics)) {
      logger.printDiagnostics(ensureDepsResults.diagnostics);
      sys.exit(1);
    }

    const coreCompiler = await loadCoreCompiler(sys);

    if (task === 'version' || flags.version) {
      console.log(coreCompiler.version);
      return;
    }

    startupLogVersion(logger, task, coreCompiler);

    loadedCompilerLog(sys, logger, flags, coreCompiler);

    if (task === 'info') {
      taskInfo(coreCompiler, sys, logger);
      return;
    }

    const validated = await coreCompiler.loadConfig({
      config: {
        flags,
      },
      configPath: findConfigResults.configPath,
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

    await sys.ensureResources({ rootDir: validated.config.rootDir, logger, dependencies });

    await runTask(coreCompiler, validated.config, task);
  } catch (e) {
    if (!shouldIgnoreError(e)) {
      logger.error(`uncaught cli error: ${e}${logger.getLevel() === 'debug' ? e.stack : ''}`);
      sys.exit(1);
    }
  }
};

export const runTask = async (coreCompiler: CoreCompiler, config: Config, task: TaskCommand) => {
  config.flags = config.flags || {};
  config.outputTargets = config.outputTargets || [];

  switch (task) {
    case 'build':
      await taskBuild(coreCompiler, config);
      break;

    case 'docs':
      await taskDocs(coreCompiler, config);
      break;

    case 'help':
      taskHelp(config.sys, config.logger);
      break;

    case 'generate':
    case 'g':
      await taskGenerate(coreCompiler, config);
      break;

    case 'prerender':
      await taskPrerender(coreCompiler, config);
      break;

    case 'serve':
      await taskServe(config);
      break;

    case 'test':
      await taskTest(config);
      break;

    case 'version':
      console.log(coreCompiler.version);
      break;

    default:
      config.logger.error(`${config.logger.emoji('❌ ')}Invalid stencil command, please see the options below:`);
      taskHelp(config.sys, config.logger);
      config.sys.exit(1);
  }
};
