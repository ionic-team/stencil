import * as d from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isOutputTargetDistCollection } from '../../output-targets/output-utils';
import { join } from 'path';
import { normalizePath } from '@utils';

export const validateCollection = (config: d.Config, userOutputs: d.OutputTarget[]) => {
  return userOutputs.filter(isOutputTargetDistCollection).map(o => {
    return {
      ...o,
      dir: getAbsolutePath(config, o.dir || 'dist/collection'),
    };
  });
};

export const getCollectionDistDir = (config: d.Config) => {
  const collectionOutputTarget = config.outputTargets.find(isOutputTargetDistCollection);
  if (collectionOutputTarget) {
    return normalizePath(collectionOutputTarget.dir);
  }
  return normalizePath(join(config.rootDir, 'dist', 'collection'));
};
