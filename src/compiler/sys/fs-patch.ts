import fs from 'fs';

import type * as d from '../../declarations';
import { FsObj } from './modules/fs';

export const patchFs = (userSys: d.CompilerSystem) => {
  const fsObj = fs as any as FsObj;
  Object.assign(fsObj.__sys, userSys);
};
