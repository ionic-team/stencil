import * as d from '../../declarations';
import { COPY, isOutputTargetDistModule } from '../output-targets/output-utils';
import { normalizePath } from '@utils';
import { validateCopy } from './validate-copy';


export function validateOutputTargetDistModule(config: d.Config) {
  const path = config.sys.path;

  const moduleOutputTargets = config.outputTargets.filter(isOutputTargetDistModule);

  moduleOutputTargets.forEach(outputTarget => {

    if (!outputTarget.dir) {
      outputTarget.dir = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = normalizePath(path.join(config.rootDir, outputTarget.dir));
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = true;
    }


    outputTarget.copy = validateCopy(outputTarget.copy);

    if (outputTarget.copy.length > 0) {
      config.outputTargets.push({
        type: COPY,
        dir: outputTarget.dir,
        copy: [
          ...outputTarget.copy
        ]
      });
    }
  });
}

const DEFAULT_DIR = 'dist/module/';
