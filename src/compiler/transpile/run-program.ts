import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { basename, join, relative } from 'path';
import type ts from 'typescript';

import type * as d from '../../declarations';
import { updateComponentBuildConditionals } from '../app-core/app-data';
import { resolveComponentDependencies } from '../entries/resolve-component-dependencies';
import { getComponentsFromModules, isOutputTargetDistTypes } from '../output-targets/output-utils';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
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

  // Emit files that changed
  tsBuilder.emit(undefined, emitCallback, undefined, false, {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker)],
  });

  const changedmodules = Array.from(compilerCtx.changedModules.keys());
  buildCtx.debug('Transpiled modules: ' + JSON.stringify(changedmodules, null, '\n'));

  // Finalize components metadata
  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());

  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);
  // To fix an issue with custom event type name collisions
  // when the types are defined in the same file as components,
  // we need to "hack" adding the file path to the custom type reference so that our
  // name collisions prevention logic in the type generation code can
  // correctly identify when to use an aliased type name.
  //
  // We can not add this as a part of the actual TS transpilation
  // process because that process analyzes the AST to generate static
  // Stencil event metadata (i.e. this is not something we control).
  //
  // These mutations happen on the original component object references
  // to prevent breaking logic down the pipeline that relies on these
  // references to the original objects staying in tact.
  buildCtx.components.forEach((component) => {
    component.events.forEach((event) => {
      Object.keys(event.complexType.references)?.forEach((key) => {
        const reference = JSON.parse(JSON.stringify(event.complexType.references[key]));
        if (reference.location === 'local') {
          reference.path = component.sourceFilePath;
        }

        event.complexType.references[key] = reference;
      });
    });
  });

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
