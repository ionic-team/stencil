import * as d from '@declarations';
import { normalizePath } from '@utils';
import { logger, sys } from '@sys';
import exit from 'exit';


export async function taskServe(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  const { Compiler } = require('../compiler/index.js');

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    exit(1);
  }

  config.flags.serve = true;
  config.devServer.openBrowser = false;
  config.devServer.hotReplacement = false;
  config.maxConcurrentWorkers = 1;

  config.devServer.root = process.cwd();

  if (typeof flags.root === 'string') {
    if (!sys.path.isAbsolute(config.flags.root)) {
      config.devServer.root = sys.path.relative(process.cwd(), flags.root);
    }
  }
  config.devServer.root = normalizePath(config.devServer.root);

  const devServer = await compiler.startDevServer();
  if (devServer) {
    logger.info(`dev server: ${devServer.browserUrl}`);
  }

  process.once('SIGINT', () => {
    sys.destroy();
    devServer && devServer.close();
    exit(0);
  });
}
