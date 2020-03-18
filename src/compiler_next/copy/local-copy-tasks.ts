import * as d from '../../declarations';

export function getSrcAbsPath(config: d.Config, src: string) {
  if (isAbsolute(src)) {
    return src;
  }
  return join(config.srcDir, src);
}


export function getDestAbsPath(config: d.Config, src: string, destAbsPath: string, destRelPath: string) {
  if (destRelPath) {
    if (isAbsolute(destRelPath)) {
      return destRelPath;

    } else {
      return join(destAbsPath, destRelPath);
    }
  }

  if (isAbsolute(src)) {
    throw new Error(`copy task, "dest" property must exist if "src" property is an absolute path: ${src}`);
  }

  return destAbsPath;
}
