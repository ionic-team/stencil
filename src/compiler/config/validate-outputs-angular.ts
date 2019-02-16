import * as d from '@declarations';
import { isOutputTargetAngular } from '../output-targets/output-utils';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export function validateOutputTargetAngular(config: d.Config) {
  const angularOutputTargets = config.outputTargets.filter(isOutputTargetAngular);

  angularOutputTargets.forEach(outputTarget => {
    outputTarget.excludeComponents = outputTarget.excludeComponents || [];

    if (outputTarget.directivesProxyFile && !sys.path.isAbsolute(outputTarget.directivesProxyFile)) {
      outputTarget.directivesProxyFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesProxyFile));
    }

    if (outputTarget.directivesArrayFile && !sys.path.isAbsolute(outputTarget.directivesArrayFile)) {
      outputTarget.directivesArrayFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesArrayFile));
    }

    if (outputTarget.directivesUtilsFile && !sys.path.isAbsolute(outputTarget.directivesUtilsFile)) {
      outputTarget.directivesUtilsFile = normalizePath(sys.path.join(config.rootDir, outputTarget.directivesUtilsFile));
    }

    if (outputTarget.serverModuleFile && !sys.path.isAbsolute(outputTarget.serverModuleFile)) {
      outputTarget.serverModuleFile = normalizePath(sys.path.join(config.rootDir, outputTarget.serverModuleFile));
    }
  });
}
