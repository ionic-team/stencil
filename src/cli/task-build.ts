import * as d from '../declarations';
import { getLatestCompilerVersion, validateCompilerVersion } from '@sys';
import { hasError } from './cli-utils';
import exit from 'exit';


export async function taskBuild(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  const { Compiler } = require('../compiler/index.js');

  const compiler: d.Compiler = new Compiler(config);
  if (!compiler.isValid) {
    exit(1);
  }

  let devServerStart: Promise<d.DevServer> = null;
  if (shouldStartDevServer(config, flags)) {
    try {
      devServerStart = compiler.startDevServer();
    } catch (e) {
      config.logger.error(e);
      exit(1);
    }
  }

  const latestVersion = getLatestCompilerVersion(config.sys, config.logger);

  let devServer: d.DevServer = null;
  if (devServerStart) {
    devServer = await devServerStart;
  }

  const results = await compiler.build();

  if (!config.watch) {
    if (devServer) {
      await devServer.close();
    }

    if (hasError(results && results.diagnostics)) {
      config.sys.destroy();
      exit(1);
    }
  }

  if (config.watch || devServerStart) {
    process.once('SIGINT', () => {
      config.sys.destroy();

      if (devServer != null) {
        devServer.close();
      }
    });
  }

  await validateCompilerVersion(config.sys, config.logger, latestVersion);

  return results;
}

function shouldStartDevServer(config: d.Config, flags: d.ConfigFlags) {
  return (config.devServer && (flags.serve || flags.prerender));
}
