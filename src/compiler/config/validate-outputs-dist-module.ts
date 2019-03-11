import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { isOutputTargetDistModule } from '../output-targets/output-utils';


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

  });
}

const DEFAULT_DIR = 'dist/module/';
