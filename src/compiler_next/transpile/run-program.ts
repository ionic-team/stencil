import * as d from '../../declarations';
import { buildError, loadTypeScriptDiagnostics } from '@utils';
import { convertDecoratorsToStatic } from '../../compiler/transformers/decorators-to-static/convert-decorators';
import { generateAppTypes } from '../../compiler/types/generate-app-types';
import { getComponentsFromModules, isOutputTargetDistTypes } from '../../compiler/output-targets/output-utils';
import { resolveComponentDependencies } from '../../compiler/entries/resolve-component-dependencies';
import { updateComponentBuildConditionals } from '../build/app-data';
import { updateModule } from './static-to-meta/parse-static';
import path from 'path';
import ts from 'typescript';


export const runTsProgram = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
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
  const emitCallback: ts.WriteFileCallback = (filepath, data, _w, _e, tsSourceFiles) => {
    filepath = filepath.replace(config.cacheDir, '');
    if (filepath.endsWith('.js')) {
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, filepath, tsTypeChecker, null);
    } else if (filepath.endsWith('.d.ts')) {
      typesOutputTarget.forEach(o => {
        compilerCtx.fs.writeFile(
          path.join(o.typesDir, filepath),
          data
        );
      });
    }
  };

  // Emit files that changed
  tsBuilder.emit(
    undefined,
    emitCallback,
    undefined,
    false,
    getCustomTransforms(config, buildCtx, tsTypeChecker)
  );

  // Finalize components metadata
  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());
  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);
  updateComponentBuildConditionals(compilerCtx.moduleMap, buildCtx.components);
  resolveComponentDependencies(buildCtx.components);

  validateUniqueTagNames(config, buildCtx);

  if (buildCtx.hasError) {
    return false;
  }

  // create the components.d.ts file and write to disk
  const hasTypesChanged = await generateAppTypes(config, compilerCtx, buildCtx, 'src');
  if (hasTypesChanged) {
    return true;
  }

  const tsSemantic = loadTypeScriptDiagnostics(tsBuilder.getSemanticDiagnostics());
  if (config.devMode) {
    tsSemantic.forEach(semanticDiagnostic => {
      // Unused variable errors become warnings in dev mode
      if (semanticDiagnostic.code === '6133') {
        semanticDiagnostic.level = 'warn';
      }
    });
  }
  buildCtx.diagnostics.push(...tsSemantic);

  return false;
};

const getCustomTransforms = (config: d.Config, buildCtx: d.BuildCtx, tsTypeChecker: ts.TypeChecker) => {
  return {
    before: [
      convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker),
    ]
  };
};

const validateUniqueTagNames = (config: d.Config, buildCtx: d.BuildCtx) => {
  buildCtx.components.forEach(cmp => {
    const tagName = cmp.tagName;
    const cmpsWithTagName = buildCtx.components.filter(c => c.tagName === tagName);
    if (cmpsWithTagName.length > 1) {
      const err = buildError(buildCtx.diagnostics);
      err.header = `Component Tag Name "${tagName}" Must Be Unique`;
      err.messageText = `Please update the components so "${tagName}" is only used once: ${
        cmpsWithTagName.map(c => path.relative(config.rootDir, c.sourceFilePath)).join(' ')
      }`;
    }
  });
};
