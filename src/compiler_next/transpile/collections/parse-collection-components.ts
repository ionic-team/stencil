import * as d from '../../../declarations';
import { parseComponentsDeprecated } from './parse-collection-deprecated';
import ts from 'typescript';
import { updateModule } from '../static-to-meta/parse-static';


export function parseCollectionComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  parseComponentsDeprecated(config, compilerCtx, collection, collectionDir, collectionManifest);

  if (collectionManifest.entries) {
    collectionManifest.entries.forEach(entryPath => {
      const componentPath = config.sys.path.join(collectionDir, entryPath);
      transpileCollectionModule(config, compilerCtx, buildCtx, collection, componentPath);
    });
  }
}


export function transpileCollectionModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collection: d.CollectionCompilerMeta, inputFileName: string) {
  const sourceText = compilerCtx.fs.readFileSync(inputFileName);
  const sourceFile = ts.createSourceFile(inputFileName, sourceText, ts.ScriptTarget.ES2017, true, ts.ScriptKind.JS);
  return updateModule(config, compilerCtx, buildCtx, sourceFile, sourceText, inputFileName, undefined, collection);
}
