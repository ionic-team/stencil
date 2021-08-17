import type * as d from '../../../declarations';
import { join } from 'path';
import { updateModule } from '../static-to-meta/parse-static';
import ts from 'typescript';
import { getStencilCompilerContext } from '@utils';

export const parseCollectionComponents = (
  config: d.Config,
  buildCtx: d.BuildCtx,
  collectionDir: string,
  collectionManifest: d.CollectionManifest,
  collection: d.CollectionCompilerMeta
) => {
  if (collectionManifest.entries) {
    collectionManifest.entries.forEach((entryPath) => {
      const componentPath = join(collectionDir, entryPath);
      transpileCollectionModule(config, buildCtx, collection, componentPath);
    });
  }
};

export const transpileCollectionModule = (
  config: d.Config,
  buildCtx: d.BuildCtx,
  collection: d.CollectionCompilerMeta,
  inputFileName: string
) => {
  const sourceText = getStencilCompilerContext().fs.readFileSync(inputFileName);
  const sourceFile = ts.createSourceFile(inputFileName, sourceText, ts.ScriptTarget.ES2017, true, ts.ScriptKind.JS);
  return updateModule(config, buildCtx, sourceFile, sourceText, inputFileName, undefined, collection);
};
