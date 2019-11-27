import * as d from '../../../declarations';
import { getAbsolutePath } from '../utils';
import { isOutputTargetDistCollection } from '../../../compiler/output-targets/output-utils';
import { normalizePath } from '@utils';
import path from 'path';


export const validateCollection = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs
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
