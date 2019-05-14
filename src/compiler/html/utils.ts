import * as d from '../../declarations';

export function getAbsoluteBuildDir(config: d.Config, outputTarget: d.OutputTargetWww) {
  const relativeBuildDir = config.sys.path.relative(outputTarget.dir, outputTarget.buildDir);
  return config.sys.path.join('/', relativeBuildDir) + '/';
}
