import * as d from '../../declarations';
import { isOutputTargetDistCustomElementExperimental } from '../output-targets/output-utils';
import { normalizePath } from '@utils';


export function validateOutputTargetDistCustomElement(config: d.Config) {
  const path = config.sys.path;

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementExperimental);

  outputTargets.forEach(outputTarget => {

    if (typeof outputTarget.dir !== 'string') {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }
  });
}

const DEFAULT_DIR = 'dist';
