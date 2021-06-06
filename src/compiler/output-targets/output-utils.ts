import type * as d from '../../declarations';
import { basename, dirname, join, relative } from 'path';
import { flatOne, normalizePath, sortBy } from '@utils';

export const relativeImport = (pathFrom: string, pathTo: string, ext?: string, addPrefix = true) => {
  let relativePath = relative(dirname(pathFrom), dirname(pathTo));
  if (addPrefix) {
    if (relativePath === '') {
      relativePath = '.';
    } else if (relativePath[0] !== '.') {
      relativePath = './' + relativePath;
    }
  }
  return normalizePath(`${relativePath}/${basename(pathTo, ext)}`);
};

export const getDistEsmDir = (outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) =>
  join(outputTarget.buildDir, 'esm', sourceTarget || '');

export const getDistEsmComponentsDir = (outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) =>
  join(getDistEsmDir(outputTarget, sourceTarget), 'build');

export const getDistEsmIndexPath = (outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) =>
  join(getDistEsmDir(outputTarget, sourceTarget), 'index.js');

export const getDefineCustomElementsPath = (
  config: d.Config,
  outputTarget: d.OutputTargetDist,
  sourceTarget: d.SourceTarget,
) => join(getDistEsmDir(outputTarget, sourceTarget), getDefineEsmFilename(config));

export const getComponentsEsmBuildPath = (
  config: d.Config,
  outputTarget: d.OutputTargetDist,
  sourceTarget: d.SourceTarget,
) => join(getDistEsmDir(outputTarget, sourceTarget), getComponentsEsmFileName(config));

export const getCoreEsmFileName = (config: d.Config) => `${config.fsNamespace}.core.js`;

export const getDefineEsmFilename = (config: d.Config) => `${config.fsNamespace}.define.js`;

export const getComponentsEsmFileName = (config: d.Config) => `${config.fsNamespace}.components.js`;

export const getLoaderEsmPath = (outputTarget: d.OutputTargetDist) =>
  join(outputTarget.buildDir, outputTarget.esmLoaderPath);

export const getComponentsDtsSrcFilePath = (config: d.Config) => join(config.srcDir, GENERATED_DTS);

export const getComponentsDtsTypesFilePath = (outputTarget: d.OutputTargetDist | d.OutputTargetDistTypes) =>
  join(outputTarget.typesDir, GENERATED_DTS);

export const isOutputTargetDist = (o: d.OutputTarget): o is d.OutputTargetDist => o.type === DIST;

export const isOutputTargetDistCollection = (o: d.OutputTarget): o is d.OutputTargetDistCollection =>
  o.type === DIST_COLLECTION;

export const isOutputTargetDistCustomElements = (o: d.OutputTarget): o is d.OutputTargetDistCustomElements =>
  o.type === DIST_CUSTOM_ELEMENTS;

export const isOutputTargetDistCustomElementsBundle = (
  o: d.OutputTarget,
): o is d.OutputTargetDistCustomElementsBundle => o.type === DIST_CUSTOM_ELEMENTS_BUNDLE;

export const isOutputTargetCopy = (o: d.OutputTarget): o is d.OutputTargetCopy => o.type === COPY;

export const isOutputTargetDistLazy = (o: d.OutputTarget): o is d.OutputTargetDistLazy => o.type === DIST_LAZY;

export const isOutputTargetAngular = (o: d.OutputTarget): o is d.OutputTargetAngular => o.type === ANGULAR;

export const isOutputTargetDistLazyLoader = (o: d.OutputTarget): o is d.OutputTargetDistLazyLoader =>
  o.type === DIST_LAZY_LOADER;

export const isOutputTargetDistGlobalStyles = (o: d.OutputTarget): o is d.OutputTargetDistGlobalStyles =>
  o.type === DIST_GLOBAL_STYLES;

export const isOutputTargetHydrate = (o: d.OutputTarget): o is d.OutputTargetHydrate => o.type === DIST_HYDRATE_SCRIPT;

export const isOutputTargetCustom = (o: d.OutputTarget): o is d.OutputTargetCustom => o.type === CUSTOM;

export const isOutputTargetDocs = (
  o: d.OutputTarget,
): o is d.OutputTargetDocsJson | d.OutputTargetDocsReadme | d.OutputTargetDocsVscode | d.OutputTargetDocsCustom =>
  o.type === DOCS_README || o.type === DOCS_JSON || o.type === DOCS_CUSTOM || o.type === DOCS_VSCODE;

export const isOutputTargetDocsReadme = (o: d.OutputTarget): o is d.OutputTargetDocsReadme => o.type === DOCS_README;

export const isOutputTargetDocsJson = (o: d.OutputTarget): o is d.OutputTargetDocsJson => o.type === DOCS_JSON;

export const isOutputTargetDocsCustom = (o: d.OutputTarget): o is d.OutputTargetDocsCustom => o.type === DOCS_CUSTOM;

export const isOutputTargetDocsVscode = (o: d.OutputTarget): o is d.OutputTargetDocsVscode => o.type === DOCS_VSCODE;

export const isOutputTargetWww = (o: d.OutputTarget): o is d.OutputTargetWww => o.type === WWW;

export const isOutputTargetStats = (o: d.OutputTarget): o is d.OutputTargetStats => o.type === STATS;

export const isOutputTargetDistTypes = (o: d.OutputTarget): o is d.OutputTargetDistTypes => o.type === DIST_TYPES;

export const getComponentsFromModules = (moduleFiles: d.Module[]) =>
  sortBy(flatOne(moduleFiles.map(m => m.cmps)), (c: d.ComponentCompilerMeta) => c.tagName);

export const canSkipOutputTargets = (buildCtx: d.BuildCtx) => {
  if (buildCtx.components.length === 0) {
    return true;
  }
  if (buildCtx.requiresFullBuild) {
    return false;
  }
  if (buildCtx.isRebuild && (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges || buildCtx.hasHtmlChanges)) {
    return false;
  }
  return true;
};

export const ANGULAR = `angular`;
export const COPY = 'copy';
export const CUSTOM = `custom`;
export const DIST = `dist`;
export const DIST_COLLECTION = `dist-collection`;
export const DIST_CUSTOM_ELEMENTS = `dist-custom-elements`;
export const DIST_CUSTOM_ELEMENTS_BUNDLE = `dist-custom-elements-bundle`;

export const DIST_TYPES = `dist-types`;
export const DIST_HYDRATE_SCRIPT = `dist-hydrate-script`;
export const DIST_LAZY = `dist-lazy`;
export const DIST_LAZY_LOADER = `dist-lazy-loader`;
export const DIST_GLOBAL_STYLES = 'dist-global-styles';
export const DOCS_CUSTOM = 'docs-custom';
export const DOCS_JSON = `docs-json`;
export const DOCS_README = `docs-readme`;
export const DOCS_VSCODE = `docs-vscode`;
export const STATS = `stats`;
export const WWW = `www`;

export const VALID_TYPES = [
  // DIST
  WWW,
  DIST,
  DIST_COLLECTION,
  DIST_CUSTOM_ELEMENTS,
  DIST_CUSTOM_ELEMENTS_BUNDLE,
  DIST_LAZY,
  DIST_HYDRATE_SCRIPT,

  // DOCS
  DOCS_JSON,
  DOCS_README,
  DOCS_VSCODE,
  DOCS_CUSTOM,

  // MISC
  ANGULAR,
  COPY,
  CUSTOM,
  STATS,
];

export const GENERATED_DTS = 'components.d.ts';
