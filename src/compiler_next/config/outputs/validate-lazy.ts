import * as d from '../../../declarations';
import path from 'path';
import { isOutputTargetDistLazy } from '../../../compiler/output-targets/output-utils';
import { getAbsolutePath } from '../utils';


export function validateLazy(config: d.Config, _diagnostics: d.Diagnostic[]) {
  return config.outputTargets
    .filter(isOutputTargetDistLazy)
    .map(o => {
      return {
        ...o,
        dir: getAbsolutePath(config, o.dir || path.join('dist', config.fsNamespace))
      };
    });
}
