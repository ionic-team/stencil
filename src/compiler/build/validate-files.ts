import * as d from '../../declarations';
import { validateManifestJson } from '../html/validate-manifest-json';
import { validateBuildPackageJson } from '../types/validate-build-package-json';


export function validateBuildFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.hasError) {
    return null;
  }

  return Promise.all([
    validateManifestJson(config, compilerCtx, buildCtx),
    validateBuildPackageJson(config, compilerCtx, buildCtx)
  ]);
}
