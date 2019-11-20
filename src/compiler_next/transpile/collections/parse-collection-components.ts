import * as d from '../../../declarations';
import { parseComponentsDeprecated } from './parse-collection-deprecated';
import ts from 'typescript';
import { updateModule } from '../static-to-meta/parse-static';


export function parseCollectionComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  collection.moduleFiles = collection.moduleFiles || [];

  parseComponentsDeprecated(config, compilerCtx, collection, collectionDir, collectionManifest);

  if (collectionManifest.entries) {
    collectionManifest.entries.forEach(entryPath => {
      const componentPath = config.sys.path.join(collectionDir, entryPath);
      const sourceText = compilerCtx.fs.readFileSync(componentPath);
      transpileCollectionEntry(config, compilerCtx, buildCtx, collection, componentPath, sourceText);
    });
  }
}


export function transpileCollectionEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collection: d.CollectionCompilerMeta, inputFileName: string, sourceText: string) {
  const sourceFile = ts.createSourceFile(inputFileName, sourceText, ts.ScriptTarget.ES2017, true, ts.ScriptKind.JS);
  return updateModule(config, compilerCtx, buildCtx, sourceFile, sourceText, inputFileName, undefined, collection);
}
