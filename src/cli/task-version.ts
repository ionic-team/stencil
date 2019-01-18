import * as d from '@declarations';
import { printUpdateMessage, requestLatestCompilerVersion } from '../sys/node/check-version';
import exit from 'exit';


export function taskVersion(config: d.Config) {
  console.log(config.sys.compiler.version);
}


export async function taskCheckVersion(config: d.Config) {
  try {
    const currentVersion = config.sys.compiler.version;
    const latestVersion = await requestLatestCompilerVersion();

    if (config.sys.semver.lt(currentVersion, latestVersion)) {
      printUpdateMessage(config.logger, currentVersion, latestVersion);

    } else {
      console.log(`${config.logger.cyan(config.sys.compiler.name)} version ${config.logger.green(config.sys.compiler.version)} is the latest version`);
    }

  } catch (e) {
    config.logger.error(`unable to load latest compiler version: ${e}`);
    exit(1);
  }
}
