import * as d from '../../../declarations';
import { isOutputTargetDistCollection } from '../../../compiler/output-targets/output-utils';
import { normalizePath } from '@utils';
import { getAbsolutePath } from '../utils';
import path from 'path';


export const validateCollection = (config: d.Config, _diagnostics: d.Diagnostic[]) => {
  return config.outputTargets
    .filter(isOutputTargetDistCollection)
    .map(o => {
      return {
        ...o,
        dir: getAbsolutePath(config, o.dir || 'dist/collection')
      };
    });
};


export const getCollectionDistDir = (config: d.Config) => {
  const collectionOutputTarget = config.outputTargets.find(isOutputTargetDistCollection);
  if (collectionOutputTarget) {
    return normalizePath(collectionOutputTarget.dir);
  }
  return normalizePath(path.join(config.rootDir, 'dist', 'collection'));
};
