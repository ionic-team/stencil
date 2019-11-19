import * as d from '../../declarations';
import { isOutputTargetDist, isOutputTargetDistLazyLoader, isOutputTargetDistSelfContained, isOutputTargetHydrate, isOutputTargetWww, isOutputTargetDistCustomElements } from './output-utils';


type OutputTargetEmptiable =
  d.OutputTargetDist |
  d.OutputTargetWww |
  d.OutputTargetDistLazyLoader |
  d.OutputTargetDistSelfContained |
  d.OutputTargetHydrate;

export function isEmptable(o: d.OutputTarget): o is OutputTargetEmptiable {
  return (
    isOutputTargetDist(o) ||
    isOutputTargetDistCustomElements(o) ||
    isOutputTargetWww(o) ||
    isOutputTargetDistLazyLoader(o) ||
    isOutputTargetDistSelfContained(o) ||
    isOutputTargetHydrate(o)
  );
}

export async function emptyOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.isRebuild || config.logLevel === 'debug') {
    return;
  }
  const cleanDirs = config.outputTargets
    .filter(isEmptable)
    .filter(o => o.empty)
    .map(({dir}) => dir);

  if (cleanDirs.length === 0) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`cleaning ${cleanDirs.length} dirs`, true);
  await Promise.all(
    cleanDirs.map(dir => emptyDir(config, compilerCtx, buildCtx, dir))
  );
  timeSpan.finish('cleaning dirs finished');
}

export async function emptyDir(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, dir: string) {
  buildCtx.debug(`empty dir: ${dir}`);

  // Check if there is a .gitkeep file
  // We want to keep it so people don't have to readd manually
  // to their projects each time.
  const gitkeepPath = config.sys.path.join(dir, '.gitkeep');
  const existsGitkeep = await compilerCtx.fs.access(gitkeepPath);

  await compilerCtx.fs.emptyDir(dir);

  // If there was a .gitkeep file, add it again.
  if (existsGitkeep) {
    await compilerCtx.fs.writeFile(gitkeepPath, '', { immediateWrite: true });
  }
}
