import type * as d from '../../declarations';
import {
  isOutputTargetDist,
  isOutputTargetDistLazyLoader,
  isOutputTargetHydrate,
  isOutputTargetWww,
  isOutputTargetDistCustomElements,
  isOutputTargetDistCustomElementsBundle,
  isOutputTargetDistLazy,
} from './output-utils';
import { isString } from '@utils';

type OutputTargetEmptiable =
  | d.OutputTargetDist
  | d.OutputTargetWww
  | d.OutputTargetDistLazyLoader
  | d.OutputTargetHydrate;

const isEmptable = (o: d.OutputTarget): o is OutputTargetEmptiable =>
  isOutputTargetDist(o) ||
  isOutputTargetDistCustomElements(o) ||
  isOutputTargetDistCustomElementsBundle(o) ||
  isOutputTargetWww(o) ||
  isOutputTargetDistLazy(o) ||
  isOutputTargetDistLazyLoader(o) ||
  isOutputTargetHydrate(o);

export const emptyOutputTargets = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (buildCtx.isRebuild) {
    return;
  }
  const cleanDirs = config.outputTargets
    .filter(isEmptable)
    .filter((o) => o.empty === true)
    .map((o) => o.dir || (o as any).esmDir)
    .filter(isString);

  if (cleanDirs.length === 0) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`cleaning ${cleanDirs.length} dirs`, true);
  await compilerCtx.fs.emptyDirs(cleanDirs);

  timeSpan.finish('cleaning dirs finished');
};
