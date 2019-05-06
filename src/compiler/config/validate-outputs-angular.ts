import * as d from '../../declarations';
import { isOutputTargetAngular } from '../output-targets/output-utils';
import { normalizePath } from '@utils';


export function validateOutputTargetAngular(config: d.Config) {
  const angularOutputTargets = config.outputTargets.filter(isOutputTargetAngular);

  angularOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];

    if (outputTarget.directivesProxyFile && !config.sys.path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(config.sys.path.join(config.rootDir, outputTarget.directivesProxyFile));
    }

    if (outputTarget.directivesArrayFile && !config.sys.path.isAbsolute(outputTarget.directivesArrayFile)) {
      outputTarget.directivesArrayFile = normalizePath(config.sys.path.join(config.rootDir, outputTarget.directivesArrayFile));
    }

    if (outputTarget.directivesUtilsFile && !config.sys.path.isAbsolute(outputTarget.directivesUtilsFile)) {
      outputTarget.directivesUtilsFile = normalizePath(config.sys.path.join(config.rootDir, outputTarget.directivesUtilsFile));
    }
  });
}