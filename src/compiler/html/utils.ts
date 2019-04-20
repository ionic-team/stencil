import * as d from '../../declarations';

export function getRelativeBuildDir(config: d.Config, outputTarget: d.OutputTargetWww) {
  return config.sys.path.relative(outputTarget.dir, outputTarget.buildDir);
}
