import type * as d from '../../../declarations';
import { DIST_LAZY, isOutputTargetDistLazy } from '../../output-targets/output-utils';
import { getAbsolutePath } from '../config-utils';
import { isBoolean } from '@utils';
import { join } from 'path';

export const validateLazy = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistLazy).map(o => {
    const dir = getAbsolutePath(config, o.dir || join('dist', config.fsNamespace));
    const lazyOutput: d.OutputTargetDistLazy = {
      type: DIST_LAZY,
      esmDir: dir,
      systemDir: config.buildEs5 ? dir : undefined,
      systemLoaderFile: config.buildEs5 ? join(dir, `${config.fsNamespace}.js`) : undefined,
      polyfills: !!o.polyfills,
      isBrowserBuild: true,
      empty: isBoolean(o.empty) ? o.empty : true,
    };
    return lazyOutput;
  });
};
