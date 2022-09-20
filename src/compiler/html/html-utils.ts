import { join, relative } from 'path';

import type * as d from '../../declarations';

export const getAbsoluteBuildDir = (outputTarget: d.OutputTargetWww) => {
  const relativeBuildDir = relative(outputTarget.dir, outputTarget.buildDir);
  return join('/', relativeBuildDir) + '/';
};
