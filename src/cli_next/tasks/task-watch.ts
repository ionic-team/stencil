import * as d from '../../declarations';
import { createCompiler } from '@compiler';
import { startupLog } from './startup-log';
import { startServer } from '@dev-server';
import exit from 'exit';


export async function taskWatch(prcs: NodeJS.Process, config: d.Config) {
  startupLog(prcs, config);

  let devServerPromise: Promise<d.DevServer> = null;
  let devServer: d.DevServer = null;
  let exitCode = 0;

  if (config.flags.serve) {
    devServerPromise = startServer(config.devServer, config.logger);
  }

  try {
    const compiler = await createCompiler(config);
    const watcher = await compiler.createWatcher();

    if (devServerPromise) {
      devServer = await devServerPromise;
      watcher.on(devServer.emit);
    }

    prcs.once('SIGINT', () => {
      compiler.destroy();
    });

    const closeResults = await watcher.start();
    if (closeResults.exitCode > 0) {
      exitCode = closeResults.exitCode;
    }

  } catch (e) {
    exitCode = 1;
    config.logger.error(e);
  }

  if (devServer) {
    await devServer.close();
  }

  if (exitCode > 0) {
    exit(exitCode);
  }
}
