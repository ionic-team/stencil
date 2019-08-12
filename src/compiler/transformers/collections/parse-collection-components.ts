import * as d from '../../../declarations';
import { convertStaticToMeta } from '../static-to-meta/visitor';
import { noop } from '@utils';
import { parseComponentsDeprecated } from './parse-collection-deprecated';
import ts from 'typescript';


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


function transpileCollectionEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collection: d.CollectionCompilerMeta, inputFileName: string, sourceText: string) {
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

  program.emit(undefined, undefined, undefined, undefined, {
    after: [
      convertStaticToMeta(config, compilerCtx, buildCtx, typeChecker, collection, {
        coreImportPath: '@stencil/core',
        componentExport: null,
        componentMetadata: null,
        proxy: null,
        style: 'static'
      })
    ]
  });
}
