import type * as d from '../../declarations';
import { basename, join, relative } from 'path';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { generateAppTypes } from '../types/generate-app-types';
import { getComponentsFromModules, isOutputTargetDistTypes } from '../output-targets/output-utils';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { resolveComponentDependencies } from '../entries/resolve-component-dependencies';
import type ts from 'typescript';
import { updateComponentBuildConditionals } from '../app-core/app-data';
import { updateModule } from '../transformers/static-to-meta/parse-static';
import { updateStencilTypesImports } from '../types/stencil-types';
import { validateTranspiledComponents } from './validate-components';

export const runTsProgram = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  tsBuilder: ts.BuilderProgram,
) => {
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
    const tsSourceFile = tsSourceFiles[0]?.fileName;

    if (tsSourceFile.endsWith('.tsx') && tsSourceFile.match('/node_modules/') && emitFilePath.endsWith('.js')) return;

    if (emitFilePath.endsWith('.js')) {
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, emitFilePath, tsTypeChecker, null);

      // re-reun transpile for any mixin dependents
      let mixinDependents: ts.SourceFile[] = [];
      for (const mod of buildCtx.compilerCtx.moduleMap.values()) {
        if (
          mod.mixinFilePaths.length &&
          mod.mixinFilePaths.find(file => file === tsSourceFile)
        ) {
          mixinDependents = [
            ...mixinDependents,
            ...mod.cmps
              .filter(cmp => cmp.mixinFilePaths.find(file => file === tsSourceFile))
              .map(cmp => tsProgram.getSourceFile(cmp.sourceFilePath))
          ];
        }
      }

      mixinDependents.forEach(dep => tsProgram.emit(dep, emitCallback, undefined, false, {
        before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker)]
      }));
    } else if (emitFilePath.endsWith('.d.ts')) {
      const srcDtsPath = normalizePath(tsSourceFile);
      const relativeEmitFilepath = getRelativeDts(config, srcDtsPath, emitFilePath);

      emittedDts.push(srcDtsPath);
      typesOutputTarget.forEach(o => {
        const distPath = join(o.typesDir, relativeEmitFilepath);
        data = updateStencilTypesImports(o.typesDir, distPath, data);
        compilerCtx.fs.writeFile(distPath, data);
      });
    }
  };

  // Emit files that changed
  tsBuilder.emit(undefined, emitCallback, undefined, false, {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker)],
  });

  const changedmodules = Array.from(compilerCtx.changedModules.keys());
  buildCtx.debug('Transpiled modules: ' + JSON.stringify(changedmodules, null, '\n'));

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
      .filter(f => f.endsWith('.d.ts') && !f.endsWith('components.d.ts'))
      .map(normalizePath)
      .filter(f => !emittedDts.includes(f))
      .map(srcRootDtsFilePath => {
        const relativeEmitFilepath = relative(config.srcDir, srcRootDtsFilePath);
        return Promise.all(
          typesOutputTarget.map(async o => {
            const distPath = join(o.typesDir, relativeEmitFilepath);
            let dtsContent = await compilerCtx.fs.readFile(srcRootDtsFilePath);
            dtsContent = updateStencilTypesImports(o.typesDir, distPath, dtsContent);
            await compilerCtx.fs.writeFile(distPath, dtsContent);
          }),
        );
      });

    await Promise.all(srcRootDtsFiles);
  }

  if (config.validateTypes) {
    const tsSemantic = loadTypeScriptDiagnostics(tsBuilder.getSemanticDiagnostics());
    if (config.devMode) {
      tsSemantic.forEach(semanticDiagnostic => {
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

const getRelativeDts = (config: d.Config, srcPath: string, emitDtsPath: string) => {
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
  return join.apply(null, parts.reverse());
};
