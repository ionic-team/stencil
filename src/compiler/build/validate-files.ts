import type * as d from '../../declarations';
import { validateBuildPackageJson } from '../types/validate-build-package-json';
import { validateManifestJson } from '../html/validate-manifest-json';

export const validateBuildFiles = (config: d.Config, buildCtx: d.BuildCtx) => {
  if (buildCtx.hasError) {
    return null;
  }

  return Promise.all([validateBuildPackageJson(config, buildCtx), validateManifestJson(config, buildCtx)]);
};
