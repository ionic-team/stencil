import * as d from '../../declarations';


export function logFsWatchMessage(config: d.Config, buildCtx: d.BuildCtx) {
  const msg = getMessage(config, buildCtx);

  if (msg.length > 0) {
    config.logger.info(config.logger.cyan(msg.join(', ')));
  }
}


function getMessage(config: d.Config, buildCtx: d.BuildCtx) {
  const msgs: string[] = [];
  const filesChanged = buildCtx.filesChanged;

  if (filesChanged.length > MAX_FILE_PRINT) {
    const trimmedChangedFiles = filesChanged.slice(0, MAX_FILE_PRINT - 1);
    const otherFilesTotal = filesChanged.length - trimmedChangedFiles.length;

    let msg = `changed files: ${getBaseName(config, trimmedChangedFiles)}`;
    if (otherFilesTotal > 0) {
      msg += `, +${otherFilesTotal} other${otherFilesTotal > 1 ? 's' : ''}`;
    }
    msgs.push(msg);
  } else if (filesChanged.length > 1) {
    msgs.push(`changed files: ${getBaseName(config, filesChanged)}`);
  } else  if (filesChanged.length > 0) {
    msgs.push(`changed file: ${getBaseName(config, filesChanged)}`);
  }

  if (buildCtx.dirsAdded.length > 1) {
    msgs.push(`added directories: ${getBaseName(config, buildCtx.dirsAdded)}`);
  } else if (buildCtx.dirsAdded.length > 0) {
    msgs.push(`added directory: ${getBaseName(config, buildCtx.dirsAdded)}`);
  }

  if (buildCtx.dirsDeleted.length > 1) {
    msgs.push(`deleted directories: ${getBaseName(config, buildCtx.dirsDeleted)}`);
  } else if (buildCtx.dirsDeleted.length > 0) {
    msgs.push(`deleted directory: ${getBaseName(config, buildCtx.dirsDeleted)}`);
  }

  return msgs;
}

function getBaseName(config: d.Config, items: string[]) {
  return items.map(f => config.sys.path.relative(config.srcDir, f)).join(', ');
}

const MAX_FILE_PRINT = 5;
