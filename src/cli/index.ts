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
  try {
    const v = prcs.version.substring(1).split('.');
    const major = parseInt(v[0], 10);
    const minor = parseInt(v[1], 10);
    if (major < 8 || (major === 8 && minor < 9)) {
      logger.error(
        '\nYour current version of Node is ' + prcs.version + " but Stencil needs at least v8.9. It's recommended to install latest Node (https://github.com/nodejs/Release).\n",
      );
      exit(1);
    }
    if (major < 10 || (major === 10 && minor < 13)) {
      logger.warn(
        '\nYour current version of Node is ' +
          prcs.version +
          ', however the recommendation is a minimum of Node LTS (https://github.com/nodejs/Release). Note that future versions of Stencil will eventually remove support for non-LTS Node versions.\n',
      );
    }
  } catch (e) {}

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
