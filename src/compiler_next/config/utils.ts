import * as d from '../../declarations';
import path from 'path';
import { normalizePath } from '@utils';

export const getAbsolutePath = (config: d.Config, dir: string) => {
  if (!path.isAbsolute(dir)) {
    dir = path.join(config.rootDir, dir);
  }
  return normalizePath(dir);
};
