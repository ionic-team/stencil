import * as d from '../declarations';


export async function serverTask(config: d.Config, compiler: any) {
  config.devServer = config.devServer || {};
  config.flags = config.flags || {};
  config.flags.serve = true;

  if (typeof config.devServer.openBrowser !== 'boolean') {
    config.devServer.openBrowser = false;
  }

  const clientConfig = await compiler.startDevServer();
  config.logger.info(`dev server: ${clientConfig.browserUrl}`);

  process.once('SIGINT', () => {
    config.sys.destroy();
    process.exit(0);
  });
}
