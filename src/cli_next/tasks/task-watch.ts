import * as d from '../../declarations';
import { createCompiler } from '@compiler';
import { startServer } from '@dev-server';
import exit from 'exit';


export async function taskWatch(prcs: NodeJS.Process, config: d.Config) {
  let devServerPromise: Promise<d.DevServer> = null;
  let devServer: d.DevServer = null;

  if (config.flags.serve) {
    devServerPromise = startServer(config.devServer, config.logger);
  }

  const compiler = await createCompiler(config);
  const watcher = await compiler.createWatcher();

  if (config.flags.serve) {
    devServer = await devServerPromise;
    watcher.on(devServer.emit);
  }

  prcs.once('SIGINT', () => {
    watcher.close();
  });

  const closeResults = await watcher.start();

  if (devServer) {
    await devServer.close();
  }

  if (closeResults.exitCode > 0) {
    exit(closeResults.exitCode);
  }
}
