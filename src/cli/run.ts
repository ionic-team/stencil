import type * as d from '../declarations';
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
import { taskTelemetry } from './task-telemetry';
import { telemetryAction } from './telemetry/telemetry';

export const run = async (init: d.CliInitOptions) => {
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
      await taskHelp({ flags: { task: 'help', args }, outputTargets: [] }, logger, sys);
      return;
    }

    startupLog(logger, task);

    const findConfigResults = await findConfig({ sys, configPath: flags.config });
    if (hasError(findConfigResults.diagnostics)) {
      logger.printDiagnostics(findConfigResults.diagnostics);
      return sys.exit(1);
    }

    const ensureDepsResults = await sys.ensureDependencies({
      rootDir: findConfigResults.rootDir,
      logger,
      dependencies: dependencies as any,
    });

    if (hasError(ensureDepsResults.diagnostics)) {
      logger.printDiagnostics(ensureDepsResults.diagnostics);
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
      await telemetryAction(sys, { flags: { task: 'info' }, outputTargets: [] }, logger, coreCompiler, async () => {
        await taskInfo(coreCompiler, sys, logger);
      });
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

    await sys.ensureResources({ rootDir: validated.config.rootDir, logger, dependencies: dependencies as any });

    await telemetryAction(sys, validated.config, logger, coreCompiler, async () => {
      await runTask(coreCompiler, validated.config, task, sys);
    });
  } catch (e) {
    if (!shouldIgnoreError(e)) {
      logger.error(`uncaught cli error: ${e}${logger.getLevel() === 'debug' ? e.stack : ''}`);
      return sys.exit(1);
    }
  }
};

export const runTask = async (
  coreCompiler: CoreCompiler,
  config: d.Config,
  task: d.TaskCommand,
  sys?: d.CompilerSystem
) => {
  config.flags = config.flags || { task };
  config.outputTargets = config.outputTargets || [];

  switch (task) {
    case 'build':
      await taskBuild(coreCompiler, config, sys);
      break;

    case 'docs':
      await taskDocs(coreCompiler, config);
      break;

    case 'generate':
    case 'g':
      await taskGenerate(coreCompiler, config);
      break;

    case 'help':
      await taskHelp(config, config.logger, sys);
      break;

    case 'prerender':
      await taskPrerender(coreCompiler, config);
      break;

    case 'serve':
      await taskServe(config);
      break;

    case 'telemetry':
      // TODO(STENCIL-148) make this parameter no longer optional, remove the surrounding if statement
      if (sys) {
        await taskTelemetry(config, sys, config.logger);
      }
      break;

    case 'test':
      await taskTest(config);
      break;

    case 'version':
      console.log(coreCompiler.version);
      break;

    default:
      config.logger.error(`${config.logger.emoji('❌ ')}Invalid stencil command, please see the options below:`);
      await taskHelp(config, config.logger, sys);
      return config.sys.exit(1);
  }
};
