import * as d from '../../../declarations';
import { DIST_LAZY, isOutputTargetDistLazy } from '../../../compiler/output-targets/output-utils';
import { isBoolean } from '@utils';
import { getAbsolutePath } from '../utils';
import path from 'path';


export const validateLazy = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs
    .filter(isOutputTargetDistLazy)
    .map(o => {
      const dir = getAbsolutePath(config, o.dir || path.join('dist', config.fsNamespace));
      const lazyOutput: d.OutputTargetDistLazy = {
        type: DIST_LAZY,
        esmDir: dir,
        systemDir: config.buildEs5 ? dir : undefined,
        systemLoaderFile: config.buildEs5 ? config.sys.path.join(dir, `${config.fsNamespace}.js`) : undefined,
        polyfills: !!o.polyfills,
        isBrowserBuild: true,
        empty: isBoolean(o.empty) ? o.empty : true,
      };
      return lazyOutput;
    });
};
