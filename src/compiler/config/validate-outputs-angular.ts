import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export function validateOutputTargetAngular(config: d.Config) {
  const distOutputTargets = config.outputTargets.filter(o => o.type === 'angular') as d.OutputTargetAngular[];

  distOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];

    if (!sys.path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesProxyFile));
    }

    if (outputTarget.directivesArrayFile && !sys.path.isAbsolute(outputTarget.directivesArrayFile)) {
      outputTarget.directivesArrayFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesArrayFile));
    }

    if (outputTarget.directivesUtilsFile && !sys.path.isAbsolute(outputTarget.directivesUtilsFile)) {
      outputTarget.directivesUtilsFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesUtilsFile));
    }
  });
}
