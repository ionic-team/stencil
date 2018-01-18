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

    // just update the existing config in place
    // not everything should be overwritten or merged
    // pick and choose what's ok to update
    config.buildDir = updatedConfig.buildDir;
    config.distDir = updatedConfig.distDir;
    config.bundles = updatedConfig.bundles;
    config.collectionDir = updatedConfig.collectionDir;
    config.collections = updatedConfig.collections;
    config.includeSrc = updatedConfig.includeSrc;
    config.excludeSrc = updatedConfig.excludeSrc;
    config.generateDistribution = updatedConfig.generateDistribution;
    config.generateWWW = updatedConfig.generateWWW;
    config.globalScript = updatedConfig.globalScript;
    config.globalStyle = updatedConfig.globalStyle;
    config.hashedFileNameLength = updatedConfig.hashedFileNameLength;
    config.hashFileNames = updatedConfig.hashFileNames;
    config.wwwIndexHtml = updatedConfig.wwwIndexHtml;
    config.srcIndexHtml = updatedConfig.srcIndexHtml;
    config.minifyCss = updatedConfig.minifyCss;
    config.minifyJs = updatedConfig.minifyJs;
    config.namespace = updatedConfig.namespace;
    config.preamble = updatedConfig.preamble;
    config.prerender = updatedConfig.prerender;
    config.publicPath = updatedConfig.publicPath;
    config.srcDir = updatedConfig.srcDir;
    config.watchIgnoredRegex = updatedConfig.watchIgnoredRegex;

    config._isValidated = false;
    validateBuildConfig(config);

  } catch (e) {
    config.logger.error(e);
  }
}
