import * as d from '../../../declarations';
import { DIST_COLLECTION, isOutputTargetDistCollection } from '../../../compiler/output-targets/output-utils';
import { buildError, normalizePath } from '@utils';
import path from 'path';


export const validateCollection = (config: d.Config, userOutputs: d.OutputTargetDistCollection[], diagnostics: d.Diagnostic[]) => {
  let outputs = userOutputs.map(o => {
    const output = Object.assign({}, o);
    if (typeof output.dir !== 'string') {
      output.dir = path.join('dist', 'collection');
    }
    if (!path.isAbsolute(output.dir)) {
      output.dir = path.join(config.rootDir, output.dir);
    }
    output.dir = normalizePath(output.dir);
    return output;
  });

  if (outputs.length > 1) {
    const err = buildError(diagnostics);
    err.messageText = `Only one "${DIST_COLLECTION}" output target can be added to the stencil config.`;
    outputs = [outputs[0]];
  }

  return outputs;
};


export const getCollectionDistDir = (config: d.Config) => {
  const collectionOutputTarget = config.outputTargets.find(isOutputTargetDistCollection);
  if (collectionOutputTarget) {
    return normalizePath(collectionOutputTarget.dir);
  }
  return normalizePath(path.join(config.rootDir, 'dist', 'collection'));
};
