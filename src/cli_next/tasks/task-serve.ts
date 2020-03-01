import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { startServer } from '@stencil/core/dev-server';


export async function taskServe(process: NodeJS.Process, config: d.Config) {
  config.suppressLogs = true;

  config.flags.serve = true;
  config.devServer.openBrowser = config.flags.open;
  config.devServer.reloadStrategy = null;
  config.devServer.initialLoadUrl = '/';
  config.devServer.websocket = false;
  config.maxConcurrentWorkers = 1;

  config.devServer.root = process.cwd();

  if (typeof config.flags.root === 'string') {
    if (!config.sys.path.isAbsolute(config.flags.root)) {
      config.devServer.root = config.sys.path.relative(process.cwd(), config.flags.root);
    }
  }
  config.devServer.root = normalizePath(config.devServer.root);

  const devServer = await startServer(config.devServer, config.logger);

  process.once('SIGINT', () => {
    devServer && devServer.close();
  });
}
