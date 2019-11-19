import * as d from '../../declarations';
import { COPY, isOutputTargetCustom } from '../output-targets/output-utils';
import { catchError } from '@utils';


export async function validateOutputTargetCustom(config: d.Config, diagnostics: d.Diagnostic[]) {
  const customOutputTargets = config.outputTargets.filter(isOutputTargetCustom);

  await Promise.all(
    customOutputTargets.map(async outputTarget => {
      if (outputTarget.validate) {
        const localDiagnostics: d.Diagnostic[] = [];
        try {
          outputTarget.validate(config, diagnostics);
        } catch (e) {
          catchError(localDiagnostics, e);
        }
        if (outputTarget.copy && outputTarget.copy.length > 0) {
          config.outputTargets.push({
            type: COPY,
            dir: config.rootDir,
            copy: [
              ...outputTarget.copy
            ]
          });
        }
        diagnostics.push(...localDiagnostics);
      }
    })
  );
}
