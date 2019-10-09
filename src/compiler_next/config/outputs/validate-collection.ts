import * as d from '../../../declarations';
import { COLLECTION_NEXT, isOutputTargetCollectionNext } from '../../../compiler/output-targets/output-utils';
import { buildError, normalizePath } from '@utils';
import path from 'path';


export const validateCollection = (config: d.Config, userOutputs: d.OutputTargetCollectionNext[], diagnostics: d.Diagnostic[]) => {
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
    err.messageText = `Only one "${COLLECTION_NEXT}" output target can be added to the stencil config.`;
    outputs = [outputs[0]];
  }

  return outputs;
};


export const getCollectionDistDir = (config: d.Config) => {
  const collectionOutputTarget = config.outputTargets.find(isOutputTargetCollectionNext);
  if (collectionOutputTarget) {
    return normalizePath(collectionOutputTarget.dir);
  }
  return normalizePath(path.join(config.rootDir, 'dist', 'collection'));
};
