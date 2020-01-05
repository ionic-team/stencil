import * as d from '../../declarations';
import { validateManifestJson } from '../../compiler/html/validate-manifest-json';
import { validatePackageJson } from '../../compiler/types/validate-package-json';


export const validateBuildFiles = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (buildCtx.hasError) {
    return null;
  }

  return Promise.all([
    validateManifestJson(config, compilerCtx, buildCtx),
    validatePackageJson(config, compilerCtx, buildCtx)
  ]);
};
