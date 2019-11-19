import * as d from '../../declarations';
import { isOutputTargetCustom, COPY } from '../output-targets/output-utils';
import { catchError } from '@utils';
import { validateCopy } from './validate-copy';


export async function validateOutputTargetCustom(config: d.Config, diagnostics: d.Diagnostic[]) {
  const customOutputTargets = config.outputTargets.filter(isOutputTargetCustom);

  await Promise.all(
    customOutputTargets.map(async outputTarget => {
      if (outputTarget.validate) {
        const localDiagnostics: d.Diagnostic[] = [];
        try {
          outputTarget.validate(config, diagnostics);
        } catch (e) {
          catchError(diagnostics, e);
        }
        if (localDiagnostics.length > 0) {
          diagnostics.push(...localDiagnostics);

        } else if (outputTarget.copy && outputTarget.copy.length > 0) {
          config.outputTargets.push({
            type: COPY,
            dir: config.rootDir,
            copy: [
              ...outputTarget.copy
            ]
          });
        }
      }
    })
  );
}
