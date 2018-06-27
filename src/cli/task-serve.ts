import * as d from '../declarations';
import { normalizePath } from '../compiler/util';


export async function taskServe(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  const { Compiler } = require('../compiler/index.js');

  config.flags.serve = true;
  config.devServer.openBrowser = false;
  config.devServer.hotReplacement = false;
  config.maxConcurrentWorkers = 1;

  config.devServer.root = process.cwd();

  if (typeof flags.root === 'string') {
    if (!config.sys.path.isAbsolute(config.flags.root)) {
      config.devServer.root = config.sys.path.relative(process.cwd(), flags.root);
    }
  }
  config.devServer.root = normalizePath(config.devServer.root);

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    process.exit(1);
  }

  const clientConfig = await compiler.startDevServer();
  compiler.config.logger.info(`dev server: ${clientConfig.browserUrl}`);

  process.once('SIGINT', () => {
    compiler.config.sys.destroy();
    process.exit(0);
  });
}
