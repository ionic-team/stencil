import { CompilerCtx, Config, WatcherResults } from '../../declarations';
import { configFileReload } from  '../../compiler/config/config-reload';


export function rebuild(config: Config, compilerCtx: CompilerCtx, w: WatcherResults) {

  // files changed include updated, added and deleted
  w.filesChanged = w.filesUpdated.concat(w.filesAdded, w.filesDeleted),

  // collect up all the file extensions from changed files
  w.filesChanged.forEach(filePath => {
    const ext = config.sys.path.extname(filePath).toLowerCase();
    if (!w.changedExtensions.includes(ext)) {
      w.changedExtensions.push(ext);
    }
  });

  // figure out what type of changes this watch build has from the changed file extension
  w.hasScriptChanges = w.changedExtensions.some(ext => SCRIPT_EXT.includes(ext));
  w.hasStyleChanges = w.changedExtensions.some(ext => STYLE_EXT.includes(ext));

  // a script change or style change is a "build" change
  w.hasBuildChanges = (w.hasScriptChanges || w.hasStyleChanges);

  // print out a pretty message about the changed files
  printWatcherMessage(config, w);

  if (w.configUpdated) {
    configFileReload(config, compilerCtx);
  }

  // kick off the rebuild
  compilerCtx.events.emit('buildStart', w);
}


const SCRIPT_EXT = ['ts', 'tsx', 'js', 'jsx'];
const STYLE_EXT = ['css', 'scss', 'pcss', 'styl', 'stylus', 'less'];


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
