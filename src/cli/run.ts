import { hasError, isFunction, shouldIgnoreError } from '@utils';

import { createLogger } from '../compiler/sys/logger/console-logger';
import type * as d from '../declarations';
import { ValidatedConfig } from '../declarations';
import { createConfigFlags } from './config-flags';
import { findConfig } from './find-config';
import { CoreCompiler, loadCoreCompiler } from './load-compiler';
import { loadedCompilerLog, startupLog, startupLogVersion } from './logs';
import { parseFlags } from './parse-flags';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskGenerate } from './task-generate';
import { taskHelp } from './task-help';
import { taskInfo } from './task-info';
import { taskPrerender } from './task-prerender';
import { taskServe } from './task-serve';
import { taskTelemetry } from './task-telemetry';
import { taskTest } from './task-test';
import { telemetryAction } from './telemetry/telemetry';

export const run = async (init: d.CliInitOptions) => {
  const { args, logger, sys } = init;

  try {
    const flags = parseFlags(args);
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

    if (!task || task === 'help' || flags.help) {
      await taskHelp(createConfigFlags({ task: 'help', args }), logger, sys);

      return;
    }

    startupLog(logger, task);

    const findConfigResults = await findConfig({ sys, configPath: flags.config });
    if (hasError(findConfigResults.diagnostics)) {
      logger.printDiagnostics(findConfigResults.diagnostics);
      return sys.exit(1);
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
        return sys.exit(1);
      }
    }

    if (isFunction(sys.applyGlobalPatch)) {
      sys.applyGlobalPatch(validated.config.rootDir);
    }

    await telemetryAction(sys, validated.config, coreCompiler, async () => {
      await runTask(coreCompiler, validated.config, task, sys);
    });
  } catch (e) {
    if (!shouldIgnoreError(e)) {
      const details = `${logger.getLevel() === 'debug' && e instanceof Error ? e.stack : ''}`;
      logger.error(`uncaught cli error: ${e}${details}`);
      return sys.exit(1);
    }
  }
};

/**
 * Run a specified task
 *
 * @param coreCompiler an instance of a minimal, bootstrap compiler for running the specified task
 * @param config a configuration for the Stencil project to apply to the task run
 * @param task the task to run
 * @param sys the {@link CompilerSystem} for interacting with the operating system
 * @public
 * @returns a void promise
 */
export const runTask = async (
  coreCompiler: CoreCompiler,
  config: d.Config,
  task: d.TaskCommand,
  sys?: d.CompilerSystem
): Promise<void> => {
  const logger = config.logger ?? createLogger();
  const flags = createConfigFlags(config.flags ?? { task });
  config.logger = logger;
  config.flags = flags;
  config.sys = sys ?? config.sys ?? coreCompiler.createSystem({ logger });
  const strictConfig: ValidatedConfig = coreCompiler.validateConfig(config, {}).config;

  switch (task) {
    case 'build':
      await taskBuild(coreCompiler, strictConfig);
      break;

    case 'docs':
      await taskDocs(coreCompiler, strictConfig);
      break;

    case 'generate':
    case 'g':
      await taskGenerate(coreCompiler, strictConfig);
      break;

    case 'help':
      await taskHelp(strictConfig.flags, strictConfig.logger, sys);
      break;

    case 'prerender':
      await taskPrerender(coreCompiler, strictConfig);
      break;

    case 'serve':
      await taskServe(strictConfig);
      break;

    case 'telemetry':
      await taskTelemetry(strictConfig.flags, sys, strictConfig.logger);
      break;

    case 'test':
      await taskTest(strictConfig);
      break;

    case 'version':
      console.log(coreCompiler.version);
      break;

    default:
      strictConfig.logger.error(
        `${strictConfig.logger.emoji('❌ ')}Invalid stencil command, please see the options below:`
      );
      await taskHelp(strictConfig.flags, strictConfig.logger, sys);
      return config.sys.exit(1);
  }
};
