import * as d from '../../declarations';

export function getSrcAbsPath(config: d.Config, src: string) {
  if (config.sys.path.isAbsolute(src)) {
    return src;
  }
  return config.sys.path.join(config.srcDir, src);
}


export function getDestAbsPath(config: d.Config, src: string, destAbsPath: string, destRelPath: string) {
  if (destRelPath) {
    if (config.sys.path.isAbsolute(destRelPath)) {
      return destRelPath;

    } else {
      return config.sys.path.join(destAbsPath, destRelPath);
    }
  }

  if (config.sys.path.isAbsolute(src)) {
    throw new Error(`copy task, "dest" property must exist if "src" property is an absolute path: ${src}`);
  }

  return destAbsPath;
}
