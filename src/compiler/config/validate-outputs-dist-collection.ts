import * as d from '../../declarations';
import { isOutputTargetDistCollectionExperimental } from '../output-targets/output-utils';
import { normalizePath } from '@utils';


export function validateOutputTargetDistCollection(config: d.Config) {
  const path = config.sys.path;

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollectionExperimental);

  outputTargets.forEach(outputTarget => {

    if (typeof outputTarget.dir !== 'string') {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }
  });
}

const DEFAULT_DIR = 'dist/collection_x';
