import { CompilerSystem, Logger } from '../declarations';
import { createNodeLogger } from '../sys/node/node-logger';
import { createNodeSysWithWatch } from '../sys/node/node-sys-watch';
import exit from 'exit';
import { join } from 'path';
import { parseFlags } from './parse-flags';
import { runTask } from './tasks/run-task';
import { shouldIgnoreError, hasError, isString } from '@utils';
import { setupWorkerController } from '../sys/node/worker';
import { taskVersion } from './tasks/task-version';

export async function run(init: CliInitOptions) {
  if (!init) {
    throw new Error('cli missing run init');
  }
  const prcs = init.process;
  if (!prcs) {
    throw new Error('cli run missing "process"');
  }
  const logger = init.logger;
  if (!logger) {
    throw new Error('cli run missing "logger"');
  }
  const sys = init.sys;
  if (!sys) {
    throw new Error('cli run missing "sys"');
  }

  try {
    const flags = parseFlags(prcs.argv.slice(2));

    if (flags.ci) {
      logger.colors = false;
    }

    if (flags.task === 'version' || flags.version) {
      return taskVersion();
    }

    if (flags.help) {
      flags.task = 'help';
    }

    setupNodeProcess(prcs, logger);

    if (sys.getCompilerExecutingPath == null) {
      sys.getCompilerExecutingPath = getCompilerExecutingPath;
    }

    const { loadConfig } = await import('@stencil/core/compiler');

    const validated = await loadConfig({
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
        exit(1);
      }
    }

    setupWorkerController(sys, logger, 'stencil-compiler-worker');

    prcs.title = `Stencil: ${validated.config.namespace}`;

    await runTask(prcs, validated.config, validated.config.flags.task);
  } catch (e) {
    if (!shouldIgnoreError(e)) {
      logger.error(`uncaught cli error: ${e}${logger.level === 'debug' ? e.stack : ''}`);
      exit(1);
    }
  }
}

function getCompilerExecutingPath() {
  return join(__dirname, '..', 'compiler', 'stencil.js');
}

function setupNodeProcess(prcs: NodeJS.Process, logger: Logger) {
  prcs.on(`unhandledRejection`, (e: any) => {
    if (!shouldIgnoreError(e)) {
      let msg = 'unhandledRejection';
      if (e != null) {
        if (isString(e)) {
          msg += ': ' + e;
        } else if (e.stack) {
          msg += ': ' + e.stack;
        } else if (e.message) {
          msg += ': ' + e.message;
        }
      }
      logger.error(msg);
    }
  });
}

export interface CliInitOptions {
  process?: NodeJS.Process;
  logger?: Logger;
  sys?: CompilerSystem;
}

export { createNodeLogger, createNodeSysWithWatch as createNodeSystem, parseFlags, runTask };
