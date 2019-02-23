import * as d from '@declarations';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { isOutputTargetDistModule } from '../output-targets/output-utils';


export function validateOutputTargetDistModule(config: d.Config) {
  const path = sys.path;

  const moduleOutputTargets = config.outputTargets.filter(isOutputTargetDistModule);

  moduleOutputTargets.forEach(outputTarget => {

    if (!outputTarget.file) {
      outputTarget.file = DEFAULT_DIR;
    }

    if (!path.isAbsolute(outputTarget.file)) {
      outputTarget.file = normalizePath(path.join(config.rootDir, outputTarget.file));
    }

  });
}

const DEFAULT_DIR = 'dist/module/index.js';
