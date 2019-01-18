import { logger, printUpdateMessage, requestLatestCompilerVersion, sys } from '@sys';
import exit from 'exit';


export function taskVersion() {
  console.log(sys.compiler.version);
}


export async function taskCheckVersion() {
  try {
    const currentVersion = sys.compiler.version;
    const latestVersion = await requestLatestCompilerVersion();

    if (sys.semver.lt(currentVersion, latestVersion)) {
      printUpdateMessage(logger, currentVersion, latestVersion);

    } else {
      console.log(`${logger.cyan(sys.compiler.name)} version ${logger.green(sys.compiler.version)} is the latest version`);
    }

  } catch (e) {
    logger.error(`unable to load latest compiler version: ${e}`);
    exit(1);
  }
}
