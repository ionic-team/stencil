import * as d from '../../declarations';
import { isOutputTargetCustom } from '../output-targets/output-utils';
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
          catchError(diagnostics, e);
        }
        diagnostics.push(...localDiagnostics);
      }
    })
  );
}
