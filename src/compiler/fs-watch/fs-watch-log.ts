import * as d from '@declarations';
import { logger, sys } from '@sys';


export function logFsWatchMessage(buildCtx: d.BuildCtx) {
  const msg = getMessage(buildCtx);

  if (msg.length > 0) {
    logger.info(logger.cyan(msg.join(', ')));
  }
}


function getMessage(buildCtx: d.BuildCtx) {
  const msgs: string[] = [];
  const filesChanged = buildCtx.filesChanged;

  if (filesChanged.length > MAX_FILE_PRINT) {
    const trimmedChangedFiles = filesChanged.slice(0, MAX_FILE_PRINT - 1);
    const otherFilesTotal = filesChanged.length - trimmedChangedFiles.length;

    let msg = `changed files: ${getBaseName(trimmedChangedFiles)}`;
    if (otherFilesTotal > 0) {
      msg += `, +${otherFilesTotal} other${otherFilesTotal > 1 ? 's' : ''}`;
    }
    msgs.push(msg);
  } else if (filesChanged.length > 1) {
    msgs.push(`changed files: ${getBaseName(filesChanged)}`);
  } else  if (filesChanged.length > 0) {
    msgs.push(`changed file: ${getBaseName(filesChanged)}`);
  }

  if (buildCtx.dirsAdded.length > 1) {
    msgs.push(`added directories: ${getBaseName(buildCtx.dirsAdded)}`);
  } else if (buildCtx.dirsAdded.length > 0) {
    msgs.push(`added directory: ${getBaseName(buildCtx.dirsAdded)}`);
  }

  if (buildCtx.dirsDeleted.length > 1) {
    msgs.push(`deleted directories: ${getBaseName(buildCtx.dirsDeleted)}`);
  } else if (buildCtx.dirsDeleted.length > 0) {
    msgs.push(`deleted directory: ${getBaseName(buildCtx.dirsDeleted)}`);
  }

  return msgs;
}

function getBaseName(items: string[]) {
  return items.map(f => sys.path.basename(f)).join(', ');
}

const MAX_FILE_PRINT = 5;
