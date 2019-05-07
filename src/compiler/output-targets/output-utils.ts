import * as d from '../../declarations';
import { flatOne, sortBy } from '@utils';


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

export function getComponentsDtsTypesFilePath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return config.sys.path.join(outputTarget.typesDir, GENERATED_DTS);
}

export function isOutputTargetDist(o: d.OutputTarget): o is d.OutputTargetDist {
  return o.type === DIST;
}

export function isOutputTargetDistCollection(o: d.OutputTarget): o is d.OutputTargetDistCollection {
  return o.type === DIST_COLLECTION;
}

export function isOutputTargetDistLazy(o: d.OutputTarget): o is d.OutputTargetDistLazy {
  return o.type === DIST_LAZY;
}

export function isOutputTargetAngular(o: d.OutputTarget): o is d.OutputTargetAngular {
  return o.type === 'angular';
}

export function isOutputTargetDistLazyLoader(o: d.OutputTarget): o is d.OutputTargetDistLazyLoader {
  return o.type === DIST_LAZY_LOADER;
}

export function isOutputTargetDistModule(o: d.OutputTarget): o is d.OutputTargetDistModule {
  return o.type === DIST_MODULE;
}

export function isOutputTargetDistSelfContained(o: d.OutputTarget): o is d.OutputTargetDistSelfContained {
  return o.type === DIST_SELF_CONTAINED;
}

export function isOutputTargetHydrate(o: d.OutputTarget): o is d.OutputTargetHydrate {
  return o.type === DIST_HYDRATE_SCRIPT;
}

export function isOutputTargetCustom(o: d.OutputTarget): o is d.OutputTargetCustom {
  return o.type === CUSTOM;
}

export function isOutputTargetDocsReadme(o: d.OutputTarget): o is d.OutputTargetDocsReadme {
  return o.type === DOCS_README || o.type === DOCS;
}

export function isOutputTargetDocsJson(o: d.OutputTarget): o is d.OutputTargetDocsJson {
  return o.type === DOCS_JSON;
}

export function isOutputTargetDocsCustom(o: d.OutputTarget): o is d.OutputTargetDocsCustom {
  return o.type === DOCS_CUSTOM;
}

export function isOutputTargetDocsVscode(o: d.OutputTarget): o is d.OutputTargetDocsVscode {
  return o.type === DOCS_VSCODE;
}

export function isOutputTargetWww(o: d.OutputTarget): o is d.OutputTargetWww {
  return o.type === WWW;
}

export function isOutputTargetStats(o: d.OutputTarget): o is d.OutputTargetStats {
  return o.type === STATS;
}

export function getComponentsFromModules(moduleFiles: d.Module[]) {
  return sortBy(flatOne(moduleFiles.map(m => m.cmps)), (c: d.ComponentCompilerMeta) => c.tagName);
}

export function canSkipAppCoreBuild(buildCtx: d.BuildCtx) {
  if (buildCtx.requiresFullBuild) {
    return false;
  }
  if (buildCtx.isRebuild && (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges || buildCtx.hasIndexHtmlChanges)) {
    return false;
  }
  return true;
}

export const ANGULAR = `angular`;
export const CUSTOM = `custom`;
export const DIST = `dist`;
export const DIST_COLLECTION = `dist-collection`;
export const DIST_HYDRATE_SCRIPT = `dist-hydrate-script`;
export const DIST_LAZY = `dist-lazy`;
export const DIST_LAZY_LOADER = `dist-lazy-loader`;
export const DIST_MODULE = `experimental-dist-module`;
export const DIST_SELF_CONTAINED = `dist-self-contained`;
export const DOCS = `docs`;
export const DOCS_CUSTOM = 'docs-custom';
export const DOCS_JSON = `docs-json`;
export const DOCS_README = `docs-readme`;
export const DOCS_VSCODE = `docs-vscode`;
export const STATS = `stats`;
export const WWW = `www`;

export const VALID_TYPES = [
  ANGULAR,
  CUSTOM,
  DIST,
  DIST_COLLECTION,
  DIST_HYDRATE_SCRIPT,
  DIST_LAZY,
  DIST_MODULE,
  DIST_SELF_CONTAINED,
  DOCS,
  DOCS_JSON,
  DOCS_README,
  DOCS_VSCODE,
  DOCS_CUSTOM,
  STATS,
  WWW,
];

export const GENERATED_DTS = 'components.d.ts';
