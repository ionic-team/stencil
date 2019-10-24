import { CompilerSystem, Logger } from '../declarations';
import { createNodeLogger } from '../sys/node_next/node-logger';
import { createNodeSysWithWatch } from '../sys/node_next/node-sys-watch';
import { loadConfig } from '@compiler';
import { parseFlags } from './parse-flags';
import { runTask } from './tasks/run-task';
import { shouldIgnoreError } from '@utils';
import { setupWorkerController } from '../sys/node_next/worker';
import exit from 'exit';
import { join } from 'path';
import { isString } from 'util';


export async function run(opts: RunCliOptions = {}) {
  if (!opts.process) {
    opts.process = process;
  }
  if (!opts.logger) {
    opts.logger = createNodeLogger(opts.process);
  }
  if (!opts.sys) {
    opts.sys = createNodeSysWithWatch(opts.process);
  }

  try {
    setupNodeProcess(opts.process, opts.logger);

    if (opts.sys.getCompilerExecutingPath == null) {
      opts.sys.getCompilerExecutingPath = getCompilerExecutingPath;
    }

    const validated = await loadConfig({
      sys_next: opts.sys,
      logger: opts.logger,
      flags: parseFlags(opts.process.argv.slice(2)),
    });

    if (validated.diagnostics.length > 0) {
      opts.logger.printDiagnostics(validated.diagnostics);
      exit(1);
    }

    setupWorkerController(opts.sys, opts.logger);

    opts.process.title = `Stencil: ${validated.config.namespace}`;

    await runTask(opts.process, validated.config, validated.config.flags.task);

  } catch (e) {
    if (!shouldIgnoreError(e)) {
      opts.logger.error(`uncaught cli error: ${e}${opts.logger.level === 'debug' ? e.stack : ''}`);
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
      logger.error('\nYour current version of Node is ' + prcs.version + ' but Stencil needs at least v8.9. It\'s recommended to install latest Node (https://github.com/nodejs/Release).\n');
      exit(1);
    }
    if (major < 10 || (major === 10 && minor < 13)) {
      logger.warn('\nYour current version of Node is ' + prcs.version + ', however the recommendation is a minimum of Node LTS (https://github.com/nodejs/Release). Note that future versions of Stencil will eventually remove support for non-LTS Node versions.\n');
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

export interface RunCliOptions {
  process?: NodeJS.Process;
  logger?: Logger;
  sys?: CompilerSystem;
}

export {
  createNodeLogger as createLogger,
  createNodeSysWithWatch as createSys,
  parseFlags,
  runTask
};
