import * as d from '../../../declarations';
import { isAbsolute, join } from 'path';

export const getSrcAbsPath = (config: d.Config, src: string) => {
  if (isAbsolute(src)) {
    return src;
  }
  return join(config.srcDir, src);
};

export const getDestAbsPath = (src: string, destAbsPath: string, destRelPath: string) => {
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
};
