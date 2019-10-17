import * as d from '../../../declarations';
import { getAbsolutePath } from '../utils';
import { isOutputTargetDistCustomElements } from '../../../compiler/output-targets/output-utils';


export function validateCustomElement(config: d.Config, _diagnostics: d.Diagnostic[]) {
  return config.outputTargets
    .filter(isOutputTargetDistCustomElements)
    .map(o => {
      return {
        ...o,
        dir: getAbsolutePath(config, o.dir || 'dist/components')
      };
    });
}


