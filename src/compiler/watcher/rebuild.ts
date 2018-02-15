import { build } from '../build/build';
import { BuildResults, CompilerCtx, Config, WatcherResults } from '../../util/interfaces';
import { validateBuildConfig } from '../../compiler/config/validate-config';


export function rebuild(config: Config, ctx: CompilerCtx, watcher: WatcherResults): Promise<BuildResults> {

  // print out a pretty message about the changed files
  printWatcherMessage(config, watcher);

  if (watcher.configUpdated) {
    configFileReload(config);
  }

  // kick off the rebuild
  return build(config, ctx, watcher);
}


function printWatcherMessage(config: Config, watcherResults: WatcherResults) {
  const changedFiles = watcherResults.filesChanged;

  const totalChangedFiles = changedFiles.length;
  let msg: string = null;

  if (totalChangedFiles > 6) {
    const trimmedChangedFiles = changedFiles.slice(0, 5);
    const otherFilesTotal = totalChangedFiles - trimmedChangedFiles.length;
    msg = `changed files: ${trimmedChangedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;
    if (otherFilesTotal > 0) {
      msg += `, +${otherFilesTotal} other${otherFilesTotal > 1 ? 's' : ''}`;
    }

  } else if (totalChangedFiles > 1) {
    msg = `changed files: ${changedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;

  } else if (totalChangedFiles > 0) {
    msg = `changed file: ${changedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;

  } else if (watcherResults.dirsAdded.length > 1) {
    msg = `added directories: ${watcherResults.dirsAdded.map(f => config.sys.path.basename(f)).join(', ')}`;

  } else if (watcherResults.dirsAdded.length > 0) {
    msg = `added directory: ${watcherResults.dirsAdded.map(f => config.sys.path.basename(f)).join(', ')}`;

  } else if (watcherResults.dirsDeleted.length > 1) {
    msg = `deleted directories: ${watcherResults.dirsAdded.map(f => config.sys.path.basename(f)).join(', ')}`;

  } else if (watcherResults.dirsDeleted.length > 0) {
    msg = `deleted directory: ${watcherResults.dirsAdded.map(f => config.sys.path.basename(f)).join(', ')}`;
  }

  if (msg != null) {
    config.logger.info(config.logger.cyan(msg));
  }
}


export function configFileReload(config: Config) {
  config.logger.debug(`reload config file: ${config.configPath}`);

  try {
    const updatedConfig = config.sys.loadConfigFile(config.configPath);

    // keepers
    const sys = config.sys;
    const logger = config.logger;
    const rootDir = config.rootDir;

    // empty it out cuz we're gonna use the same object
    for (const key in config) {
      delete (config as any)[key];
    }

    // fill it back up with the keepers
    config.sys = sys;
    config.logger = logger;
    config.rootDir = rootDir;

    // fill it up with the newly loaded config
    Object.assign(config, updatedConfig);

    // validate our new config data
    validateBuildConfig(config);

  } catch (e) {
    config.logger.error(e);
  }
}
