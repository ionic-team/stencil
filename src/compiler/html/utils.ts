import * as d from '../../declarations';

export function getAbsoluteBuildDir(config: d.Config, outputTarget: d.OutputTargetWww) {
  const relBuild = config.sys.path.relative(outputTarget.dir, outputTarget.buildDir);
  if (outputTarget.baseUrl) {
    const parsed = config.sys.url.parse(outputTarget.baseUrl);
    return config.sys.path.join(parsed.pathname, relBuild);
  }
  return '/' + relBuild;
}
