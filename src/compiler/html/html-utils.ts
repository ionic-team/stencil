import type * as d from '../../declarations';
import { join, relative } from 'path';

export const getAbsoluteBuildDir = (outputTarget: d.OutputTargetWww) => {
  const relativeBuildDir = relative(outputTarget.dir, outputTarget.buildDir);
  return join('/', relativeBuildDir) + '/';
};
