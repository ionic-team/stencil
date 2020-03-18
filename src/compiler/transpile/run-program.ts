import * as d from '../../declarations';
import { basename, join, relative } from 'path';
import { buildError, loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { generateAppTypes } from '../types/generate-app-types';
import { getComponentsFromModules, isOutputTargetDistTypes } from '../output-targets/output-utils';
import { resolveComponentDependencies } from '../entries/resolve-component-dependencies';
import { updateComponentBuildConditionals } from '../app-core/app-data';
import { updateModule } from '../transformers/static-to-meta/parse-static';
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

  const emitCallback: ts.WriteFileCallback = (emitFilePath, data, _w, _e, tsSourceFiles) => {
    if (emitFilePath.endsWith('.js')) {
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, emitFilePath, tsTypeChecker, null);
    } else if (emitFilePath.endsWith('.d.ts')) {
      const relativeEmitFilepath = getRelativeDts(config, tsSourceFiles[0].fileName, emitFilePath);

      typesOutputTarget.forEach(o => {
        compilerCtx.fs.writeFile(join(o.typesDir, relativeEmitFilepath), data);
      });
    }
  };

  // Emit files that changed
  tsBuilder.emit(undefined, emitCallback, undefined, false, {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker)],
  });

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

const validateUniqueTagNames = (config: d.Config, buildCtx: d.BuildCtx) => {
  buildCtx.components.forEach(cmp => {
    const tagName = cmp.tagName;
    const cmpsWithTagName = buildCtx.components.filter(c => c.tagName === tagName);
    if (cmpsWithTagName.length > 1) {
      const err = buildError(buildCtx.diagnostics);
      err.header = `Component Tag Name "${tagName}" Must Be Unique`;
      err.messageText = `Please update the components so "${tagName}" is only used once: ${cmpsWithTagName.map(c => relative(config.rootDir, c.sourceFilePath)).join(' ')}`;
    }
  });
};

const getRelativeDts = (config: d.Config, srcPath: string, emitDtsPath: string) => {
  const parts: string[] = [];
  srcPath = normalizePath(srcPath);
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
