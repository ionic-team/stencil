import {
  getComponentsFromModules,
  isOutputTargetDistTypes,
  loadTypeScriptDiagnostics,
  normalizePath,
  safeJSONStringify,
} from '@utils';
import { basename, join, relative } from 'path';
import ts from 'typescript';

import type * as d from '../../declarations';
import { updateComponentBuildConditionals } from '../app-core/app-data';
import { resolveComponentDependencies } from '../entries/resolve-component-dependencies';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import {
  rewriteAliasedDTSImportPaths,
  rewriteAliasedSourceFileImportPaths,
} from '../transformers/rewrite-aliased-paths';
import { updateModule } from '../transformers/static-to-meta/parse-static';
import { generateAppTypes } from '../types/generate-app-types';
import { updateStencilTypesImports } from '../types/stencil-types';
import { validateTranspiledComponents } from './validate-components';

export const runTsProgram = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  tsBuilder: ts.BuilderProgram
): Promise<boolean> => {
  const tsSyntactic = loadTypeScriptDiagnostics(tsBuilder.getSyntacticDiagnostics());
  const tsGlobal = loadTypeScriptDiagnostics(tsBuilder.getGlobalDiagnostics());
  const tsOptions = loadTypeScriptDiagnostics(tsBuilder.getOptionsDiagnostics());
  buildCtx.diagnostics.push(...tsSyntactic);
  buildCtx.diagnostics.push(...tsGlobal);
  buildCtx.diagnostics.push(...tsOptions);

  if (buildCtx.hasError) {
    return false;
  }

  const tsProgram = tsBuilder.getProgram();

  const tsTypeChecker = tsProgram.getTypeChecker();
  const typesOutputTarget = config.outputTargets.filter(isOutputTargetDistTypes);
  const emittedDts: string[] = [];
  const emitCallback: ts.WriteFileCallback = (emitFilePath, data, _w, _e, tsSourceFiles) => {
    if (emitFilePath.endsWith('.js') || emitFilePath.endsWith('js.map')) {
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, emitFilePath, tsTypeChecker, null);
    } else if (emitFilePath.endsWith('.d.ts')) {
      const srcDtsPath = normalizePath(tsSourceFiles[0].fileName);
      const relativeEmitFilepath = getRelativeDts(config, srcDtsPath, emitFilePath);

      emittedDts.push(srcDtsPath);
      typesOutputTarget.forEach((o) => {
        const distPath = join(o.typesDir, relativeEmitFilepath);
        data = updateStencilTypesImports(o.typesDir, distPath, data);
        compilerCtx.fs.writeFile(distPath, data);
      });
    }
  };

  const transformers: ts.CustomTransformers = {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker)],
    afterDeclarations: [],
  };

  if (config.transformAliasedImportPaths) {
    transformers.before.push(rewriteAliasedSourceFileImportPaths);
    // TypeScript handles the generation of JS and `.d.ts` files through
    // different pipelines. One (possibly surprising) consequence of this is
    // that if you modify a source file using a transforming it will not
    // automatically result in changes to the corresponding `.d.ts` file.
    // Instead, if you want to, for instance, rewrite some import specifiers in
    // both the source file _and_ its typedef you'll need to run a transformer
    // for both of them.
    //
    // See here: https://github.com/itsdouges/typescript-transformer-handbook#transforms
    // and here: https://github.com/microsoft/TypeScript/pull/23946
    //
    // This quirk is not terribly well documented unfortunately.
    transformers.afterDeclarations.push(rewriteAliasedDTSImportPaths);
  }

  // Emit files that changed
  tsBuilder.emit(undefined, emitCallback, undefined, false, transformers);

  const changedmodules = Array.from(compilerCtx.changedModules.keys());
  buildCtx.debug('Transpiled modules: ' + safeJSONStringify(changedmodules, null, '\n'));

  // Finalize components metadata
  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());
  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);

  updateComponentBuildConditionals(compilerCtx.moduleMap, buildCtx.components);
  resolveComponentDependencies(buildCtx.components);

  validateTranspiledComponents(config, buildCtx);

  if (buildCtx.hasError) {
    return false;
  }

  // create the components.d.ts file and write to disk
  const hasTypesChanged = await generateAppTypes(config, compilerCtx, buildCtx, 'src');
  if (hasTypesChanged) {
    return true;
  }

  if (typesOutputTarget.length > 0) {
    // copy src dts files that do not get emitted by the compiler
    // but we still want to ship them in the dist directory
    const srcRootDtsFiles = tsProgram
      .getRootFileNames()
      .filter((f) => f.endsWith('.d.ts') && !f.endsWith('components.d.ts'))
      .map(normalizePath)
      .filter((f) => !emittedDts.includes(f))
      .map((srcRootDtsFilePath) => {
        const relativeEmitFilepath = relative(config.srcDir, srcRootDtsFilePath);
        return Promise.all(
          typesOutputTarget.map(async (o) => {
            const distPath = join(o.typesDir, relativeEmitFilepath);
            let dtsContent = await compilerCtx.fs.readFile(srcRootDtsFilePath);
            dtsContent = updateStencilTypesImports(o.typesDir, distPath, dtsContent);
            await compilerCtx.fs.writeFile(distPath, dtsContent);
          })
        );
      });

    await Promise.all(srcRootDtsFiles);
  }

  if (config.validateTypes) {
    const tsSemantic = loadTypeScriptDiagnostics(tsBuilder.getSemanticDiagnostics());
    if (config.devMode) {
      tsSemantic.forEach((semanticDiagnostic) => {
        // Unused variable errors become warnings in dev mode
        if (semanticDiagnostic.code === '6133' || semanticDiagnostic.code === '6192') {
          semanticDiagnostic.level = 'warn';
        }
      });
    }
    buildCtx.diagnostics.push(...tsSemantic);
  }

  return false;
};

const getRelativeDts = (config: d.Config, srcPath: string, emitDtsPath: string): string => {
  const parts: string[] = [];
  for (let i = 0; i < 30; i++) {
    if (config.srcDir === srcPath) {
      break;
    }
    const b = basename(emitDtsPath);
    parts.push(b);

    emitDtsPath = join(emitDtsPath, '..');
    srcPath = normalizePath(join(srcPath, '..'));
  }
  return join(...parts.reverse());
};
