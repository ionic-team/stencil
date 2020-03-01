import * as d from '../declarations';
import { Compiler } from '@compiler_legacy';
import { normalizePath } from '@utils';
import { startServer } from '@stencil/core/dev-server';
import exit from 'exit';


export async function taskServe(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  config.suppressLogs = true;

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    exit(1);
  }

  config.flags.serve = true;
  config.devServer.openBrowser = flags.open;
  config.devServer.reloadStrategy = null;
  config.devServer.initialLoadUrl = '/';
  config.devServer.websocket = false;
  config.maxConcurrentWorkers = 1;

  config.devServer.root = process.cwd();

  if (typeof flags.root === 'string') {
    if (!config.sys.path.isAbsolute(config.flags.root)) {
      config.devServer.root = config.sys.path.relative(process.cwd(), flags.root);
    }
  }
  config.devServer.root = normalizePath(config.devServer.root);

  const devServer = await startServer(config.devServer, config.logger);

  process.once('SIGINT', () => {
    config.sys.destroy();
    devServer && devServer.close();
    exit(0);
  });
}
