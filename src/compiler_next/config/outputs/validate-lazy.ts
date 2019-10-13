import * as d from '../../../declarations';
import { normalizePath } from '@utils';
import path from 'path';


export function validateLazy(config: d.Config, userOutputs: d.OutputTargetDistLazy[], _diagnostics: d.Diagnostic[]) {
  return userOutputs.map(o => {
    const output = Object.assign({}, o);
    if (typeof output.dir !== 'string') {
      output.dir = path.join('dist', config.fsNamespace);
    }
    if (!path.isAbsolute(output.dir)) {
      output.dir = path.join(config.rootDir, output.dir);
    }
    output.dir = normalizePath(output.dir);
    return output;
  });
}
