import * as d from '../../declarations';
import addComponentMetadata from './transformers/add-component-metadata';
import { gatherMetadata } from './datacollection/index';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { normalizeAssetsDir } from '../component-plugins/assets-plugin';
import { normalizeStyles } from '../style/normalize-styles';
import { normalizePath } from '../util';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import * as ts from 'typescript';


/**
 * This is only used during TESTING
 */
export function transpileModuleForTesting(config: d.Config, compilerOptions: ts.CompilerOptions, path: string, input: string) {
  const moduleFiles: d.ModuleFiles = {};
  const diagnostics: d.Diagnostic[] = [];
  const compilerCtx: d.CompilerCtx = null;
  const collections: d.Collection[] = [];
  const results: d.TranspileResults = {
    code: null,
    diagnostics: [],
    cmpMeta: null
  };
  path = normalizePath(path);
  const checkProgram = ts.createProgram([path], compilerOptions);

  // Gather component metadata and type info
  const files = checkProgram.getSourceFiles().filter(sf => sf.getSourceFile().fileName === path);
  const metadata = gatherMetadata(config, compilerCtx, diagnostics, collections, checkProgram.getTypeChecker(), files);

  if (Object.keys(metadata).length > 0) {
    const fileMetadata = metadata[path];

    // normalize metadata
    fileMetadata.stylesMeta = normalizeStyles(config, path, fileMetadata.stylesMeta);
    fileMetadata.assetsDirsMeta = normalizeAssetsDir(config, path, fileMetadata.assetsDirsMeta);

    // assign metadata to module files
    moduleFiles['module.tsx'] = {
      cmpMeta: fileMetadata
    };
  }

  const transpileOpts = {
    compilerOptions: compilerOptions,
    transformers: {
      before: [
        removeDecorators(),
        addComponentMetadata(moduleFiles)
      ],
      after: [
        removeStencilImports()
      ]
    }
  };
  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics('', diagnostics, tsResults.diagnostics);

  if (diagnostics.length > 0) {
    results.diagnostics.push(...diagnostics);
  }

  results.code = tsResults.outputText;
  results.cmpMeta = moduleFiles['module.tsx'] ? moduleFiles['module.tsx'].cmpMeta : null;

  return results;
}
