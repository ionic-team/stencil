import * as d from '../../declarations';
import { validatePackageJson } from '../types/validate-package-json';


export function validateFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  return Promise.all([
    validatePackageJson(config, compilerCtx, buildCtx)
  ]);
}
