import { catchError } from '@utils';

import type * as d from '../../../declarations';
import { COPY, isOutputTargetCustom } from '../../output-targets/output-utils';

export const validateCustomOutput = (
  config: d.ValidatedConfig,
  diagnostics: d.Diagnostic[],
  userOutputs: d.OutputTarget[]
) => {
  return userOutputs.filter(isOutputTargetCustom).map((o) => {
    if (o.validate) {
      const localDiagnostics: d.Diagnostic[] = [];
      try {
        o.validate(config, diagnostics);
      } catch (e: any) {
        catchError(localDiagnostics, e);
      }
      if (o.copy && o.copy.length > 0) {
        config.outputTargets.push({
          type: COPY,
          dir: config.rootDir,
          copy: [...o.copy],
        });
      }
      diagnostics.push(...localDiagnostics);
    }
    return o;
  });
};
