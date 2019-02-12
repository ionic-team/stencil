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


export const GENERATED_DTS = 'components.d.ts';
