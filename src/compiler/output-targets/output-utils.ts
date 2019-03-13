import * as d from '../../declarations';
import { flatOne } from '@utils';


export function getDistEsmDir(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return config.sys.path.join(outputTarget.buildDir, 'esm', sourceTarget || '');
}

export function getDistEsmComponentsDir(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return config.sys.path.join(getDistEsmDir(config, outputTarget, sourceTarget), 'build');
}

export function getDistEsmIndexPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return config.sys.path.join(getDistEsmDir(config, outputTarget, sourceTarget), 'index.js');
}

export function getDefineCustomElementsPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return config.sys.path.join(getDistEsmDir(config, outputTarget, sourceTarget), getDefineEsmFilename(config));
}

export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return config.sys.path.join(getDistEsmDir(config, outputTarget, sourceTarget), getComponentsEsmFileName(config));
}

export function getCoreEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.core.js`;
}

export function getDefineEsmFilename(config: d.Config) {
  return `${config.fsNamespace}.define.js`;
}

export function getComponentsEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.components.js`;
}

export function getLoaderEsmPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return config.sys.path.join(outputTarget.buildDir, outputTarget.esmLoaderPath);
}

export function getComponentsDtsSrcFilePath(config: d.Config) {
  return config.sys.path.join(config.srcDir, GENERATED_DTS);
}

export function getComponentsDtsTypesFilePath(config: d.Config, outputTarget: d.OutputTargetDistCollection) {
  return config.sys.path.join(outputTarget.typesDir, GENERATED_DTS);
}

export function isOutputTargetDist(o: d.OutputTarget): o is d.OutputTargetDist {
  return o.type === 'dist';
}

export function isOutputTargetDistCollection(o: d.OutputTarget): o is d.OutputTargetDistCollection {
  return o.type === 'dist-collection';
}

export function isOutputTargetDistLazy(o: d.OutputTarget): o is d.OutputTargetDistLazy {
  return o.type === 'dist-lazy';
}

export function isOutputTargetDistModule(o: d.OutputTarget): o is d.OutputTargetDistModule {
  return o.type === 'dist-module';
}

export function isOutputTargetDistSelfcontained(o: d.OutputTarget): o is d.OutputTargetDistSelfcontained {
  return o.type === 'dist-selfcontained';
}

export function isOutputTargetHydrate(o: d.OutputTarget): o is d.OutputTargetHydrate {
  return o.type === 'hydrate';
}

export function isOutputTargetWww(o: d.OutputTarget): o is d.OutputTargetWww {
  return o.type === 'www';
}

export function isOutputTargetStats(o: d.OutputTarget): o is d.OutputTargetStats {
  return o.type === 'stats';
}

export function isOutputTargetDocs(o: d.OutputTarget): o is d.OutputTargetDocsReadme {
  return o.type === 'docs';
}

export function isOutputTargetDocsJson(o: d.OutputTarget): o is d.OutputTargetDocsJson {
  return o.type === 'docs-json';
}

export function isOutputTargetDocsVscode(o: d.OutputTarget): o is d.OutputTargetDocsVscode {
  return o.type === 'docs-vscode';
}


export function isOutputTargetDocsCustom(o: d.OutputTarget): o is d.OutputTargetDocsCustom {
  return o.type === 'docs-custom';
}

export function isOutputTargetAngular(o: d.OutputTarget): o is d.OutputTargetAngular {
  return o.type === 'angular';
}

export function getComponentsFromModules(moduleFiles: d.Module[]) {
  return flatOne(moduleFiles.map(m => m.cmps));
}

export function canSkipAppCoreBuild(buildCtx: d.BuildCtx) {
  if (buildCtx.requiresFullBuild) {
    return false;
  }
  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges) {
      return false;
    }
  }
  return true;
}

export const GENERATED_DTS = 'components.d.ts';
