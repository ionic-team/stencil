import * as d from '@declarations';
import { sys } from '@sys';


export function getDistEsmDir(outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return sys.path.join(outputTarget.buildDir, 'esm', sourceTarget || '');
}

export function getDistEsmComponentsDir(outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), 'build');
}

export function getDistEsmIndexPath(outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), 'index.js');
}

export function getDefineCustomElementsPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getDefineEsmFilename(config));
}

export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getComponentsEsmFileName(config));
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

export function getLoaderEsmPath(outputTarget: d.OutputTargetDist) {
  return sys.path.join(outputTarget.buildDir, outputTarget.esmLoaderPath);
}

export function getComponentsDtsSrcFilePath(config: d.Config) {
  return sys.path.join(config.srcDir, GENERATED_DTS);
}

export function getComponentsDtsTypesFilePath(outputTarget: d.OutputTargetDist) {
  return sys.path.join(outputTarget.typesDir, GENERATED_DTS);
}

export function isOutputTargetDist(o: d.OutputTarget): o is d.OutputTargetDist {
  return o.type === 'dist';
}

export function isOutputTargetWww(o: d.OutputTarget): o is d.OutputTargetWww {
  return o.type === 'www';
}

export function isOutputTargetBuild(o: d.OutputTarget): o is d.OutputTargetBuild {
  return o.type === 'dist' || o.type === 'www';
}

export function isOutputTargetSelfcontained(o: d.OutputTarget): o is d.OutputTargetSelfContained {
  return o.type === 'selfcontained';
}

export function isOutputTargetStats(o: d.OutputTarget): o is d.OutputTargetStats {
  return o.type === 'stats';
}

export function isOutputTargetDocs(o: d.OutputTarget): o is d.OutputTargetDocsReadme {
  return o.type === 'docs';
}

export function isOutputTargetAngular(o: d.OutputTarget): o is d.OutputTargetAngular {
  return o.type === 'angular';
}

export function isOutputTargetDocsJson(o: d.OutputTarget): o is d.OutputTargetDocsJson {
  return o.type === 'docs-json';
}

export function isOutputTargetDocsCustom(o: d.OutputTarget): o is d.OutputTargetDocsCustom {
  return o.type === 'docs-custom';
}

export const GENERATED_DTS = 'components.d.ts';
