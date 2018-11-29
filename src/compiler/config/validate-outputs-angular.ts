import * as d from '../../declarations';
import { normalizePath } from '../util';


export function validateOutputTargetAngular(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(o => o.type === 'angular') as d.OutputTargetAngular[];

  distOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];
    outputTarget.useDirectives = !!outputTarget.useDirectives;

    if (!path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(path.join(config.rootDir, outputTarget.directivesProxyFile));
    }

    if (!path.isAbsolute(outputTarget.directivesArrayFile)) {
      outputTarget.directivesArrayFile = normalizePath(path.join(config.rootDir, outputTarget.directivesArrayFile));
    }
  });
}
