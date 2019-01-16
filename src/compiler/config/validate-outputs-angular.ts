import * as d from '../../declarations';
import { normalizePath } from '@stencil/core/utils';


export function validateOutputTargetAngular(config: d.Config) {
  const path = config.sys.path;

  const distOutputTargets = config.outputTargets.filter(o => o.type === 'angular') as d.OutputTargetAngular[];

  distOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];

    if (!path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(path.join(config.rootDir, outputTarget.directivesProxyFile));
    }

    if (outputTarget.directivesArrayFile && !path.isAbsolute(outputTarget.directivesArrayFile)) {
      outputTarget.directivesArrayFile = normalizePath(path.join(config.rootDir, outputTarget.directivesArrayFile));
    }

    if (outputTarget.directivesUtilsFile && !path.isAbsolute(outputTarget.directivesUtilsFile)) {
      outputTarget.directivesUtilsFile = normalizePath(path.join(config.rootDir, outputTarget.directivesUtilsFile));
    }
  });
}
