import * as d from '../../../declarations';
import { gatherMeta } from '../static-to-meta/gather-meta';
import { noop } from '../../../util/helpers';
import { parseComponentsDeprecated } from './parse-collection-deprecated';
import { pathJoin } from '../../util';
import ts from 'typescript';


export function parseCollectionComponents(config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) {
  collection.moduleFiles = collection.moduleFiles || [];

  parseComponentsDeprecated(config, compilerCtx, collection, collectionDir, collectionManifest);

  if (collectionManifest.entries) {
    collectionManifest.entries.forEach(entryPath => {
      const componentPath = pathJoin(config, collectionDir, entryPath);
      const sourceText = compilerCtx.fs.readFileSync(componentPath);
      transpileCollectionEntry(config, compilerCtx, collection, componentPath, sourceText);
    });
  }
}


function transpileCollectionEntry(config: d.Config, compilerCtx: d.CompilerCtx, collection: d.CollectionCompilerMeta, inputFileName: string, sourceText: string) {
  const options = ts.getDefaultCompilerOptions();
  options.isolatedModules = true;
  options.suppressOutputPathCheck = true;
  options.allowNonTsExtensions = true;
  options.noLib = true;
  options.lib = undefined;
  options.types = undefined;
  options.noEmit = undefined;
  options.noEmitOnError = undefined;
  options.paths = undefined;
  options.rootDirs = undefined;
  options.declaration = undefined;
  options.composite = undefined;
  options.declarationDir = undefined;
  options.out = undefined;
  options.outFile = undefined;
  options.noResolve = true;

  options.module = ts.ModuleKind.ESNext;
  options.target = ts.ScriptTarget.ES2017;

  const sourceFile = ts.createSourceFile(inputFileName, sourceText, options.target);

  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName => fileName === inputFileName ? sourceFile : undefined,
    writeFile: noop,
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => '',
    fileExists: fileName => fileName === inputFileName,
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => []
  };

  const program = ts.createProgram([inputFileName], options, compilerHost);

  const typeChecker = program.getTypeChecker();
  const diagnostics: d.Diagnostic[] = [];

  program.emit(undefined, undefined, undefined, undefined, {
    after: [
      gatherMeta(config, compilerCtx, diagnostics, typeChecker, collection)
    ]
  });
}
