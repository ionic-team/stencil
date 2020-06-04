import * as d from '../../declarations';
import {
  isOutputTargetDist,
  isOutputTargetDistLazyLoader,
  isOutputTargetDistSelfContained,
  isOutputTargetHydrate,
  isOutputTargetWww,
  isOutputTargetDistCustomElements,
  isOutputTargetDistCustomElementsBundle,
  isOutputTargetDistLazy,
} from './output-utils';
import { isString } from '@utils';
import { join } from 'path';

type OutputTargetEmptiable = d.OutputTargetDist | d.OutputTargetWww | d.OutputTargetDistLazyLoader | d.OutputTargetDistSelfContained | d.OutputTargetHydrate;

const isEmptable = (o: d.OutputTarget): o is OutputTargetEmptiable =>
  isOutputTargetDist(o) ||
  isOutputTargetDistCustomElements(o) ||
  isOutputTargetDistCustomElementsBundle(o) ||
  isOutputTargetWww(o) ||
  isOutputTargetDistLazy(o) ||
  isOutputTargetDistLazyLoader(o) ||
  isOutputTargetDistSelfContained(o) ||
  isOutputTargetHydrate(o);

export const emptyOutputTargets = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (buildCtx.isRebuild) {
    return;
  }
  const cleanDirs = config.outputTargets
    .filter(isEmptable)
    .filter(o => o.empty === true)
    .map(o => o.dir || (o as any).esmDir)
    .filter(isString)
    .reduce((dirs, dir) => {
      if (!dirs.includes(dir)) {
        dirs.push(dir);
      }
      return dirs;
    }, [] as string[]);

  if (cleanDirs.length === 0) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`cleaning ${cleanDirs.length} dirs`, true);
  await Promise.all(cleanDirs.map(dir => emptyDir(compilerCtx, buildCtx, dir)));
  timeSpan.finish('cleaning dirs finished');
};

const emptyDir = async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, dir: string) => {
  buildCtx.debug(`empty dir: ${dir}`);

  // Check if there is a .gitkeep file
  // We want to keep it so people don't have to readd manually
  // to their projects each time.
  const gitkeepPath = join(dir, '.gitkeep');
  const existsGitkeep = await compilerCtx.fs.access(gitkeepPath);

  await compilerCtx.fs.emptyDir(dir);

  // If there was a .gitkeep file, add it again.
  if (existsGitkeep) {
    await compilerCtx.fs.writeFile(gitkeepPath, '', { immediateWrite: true });
  }
};
