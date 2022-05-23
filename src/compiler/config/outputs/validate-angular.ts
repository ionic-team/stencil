import type * as d from '../../../declarations';
import { isOutputTargetAngular } from '../../output-targets/output-utils';
import { isAbsolute, join } from 'path';
import { OutputTargetAngular } from '../../../declarations';

export const validateAngular = (userConfig: d.Config, userOutputs: d.OutputTarget[]): OutputTargetAngular[] => {
  const angularOutputTargets = userOutputs.filter(isOutputTargetAngular);
  return angularOutputTargets.map((outputTarget) => {
    let directivesProxyFile = outputTarget.directivesProxyFile;
    if (directivesProxyFile && !isAbsolute(directivesProxyFile)) {
      directivesProxyFile = join(userConfig.rootDir, directivesProxyFile);
    }

    let directivesArrayFile = outputTarget.directivesArrayFile;
    if (directivesArrayFile && !isAbsolute(directivesArrayFile)) {
      directivesArrayFile = join(userConfig.rootDir, directivesArrayFile);
    }

    let directivesUtilsFile = outputTarget.directivesUtilsFile;
    if (directivesUtilsFile && !isAbsolute(directivesUtilsFile)) {
      directivesUtilsFile = join(userConfig.rootDir, directivesUtilsFile);
    }
    return {
      type: 'angular',
      componentCorePackage: outputTarget.componentCorePackage,
      directivesProxyFile,
      directivesArrayFile,
      directivesUtilsFile,
      excludeComponents: outputTarget.excludeComponents || [],
    };
  });
};
