import { catchError } from '@utils';

import type * as d from '../../../declarations';
import { Diagnostic } from '../../diagnostic';
import { COPY, isOutputTargetCustom } from '../../output-targets/output-utils';

export const validateCustomOutput = (
  config: d.ValidatedConfig,
  diagnostics: Diagnostic[],
  userOutputs: d.OutputTarget[]
) => {
  return userOutputs.filter(isOutputTargetCustom).map((o) => {
    if (o.validate) {
      const localDiagnostics: Diagnostic[] = [];
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
