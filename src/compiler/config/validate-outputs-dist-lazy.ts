import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { isOutputTargetDistLazy } from '../output-targets/output-utils';
import { validateResourcesUrl } from './validate-resources-url';


export function validateOutputTargetDistLazy(config: d.Config) {
  const path = sys.path;

  const distOutputTargets = config.outputTargets.filter(isOutputTargetDistLazy);

  distOutputTargets.forEach(outputTarget => {

    outputTarget.resourcesUrl = validateResourcesUrl(outputTarget.resourcesUrl);

    if (!outputTarget.dir) {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = DEFAULT_EMPTY_DIR;
    }
  });
}


const DEFAULT_DIR = 'dist';
const DEFAULT_EMPTY_DIR = true;
