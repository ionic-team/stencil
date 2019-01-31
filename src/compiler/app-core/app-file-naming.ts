import * as d from '@declarations';
import { sys } from '@sys';


export function getAppBuildDir(config: d.Config, outputTarget: d.OutputTargetBuild) {
  return sys.path.join(outputTarget.buildDir, config.fsNamespace);
}


export function getRegistryFileName(config: d.Config) {
  return `${config.fsNamespace}.registry.json`;
}


export function getRegistryJson(config: d.Config, outputTarget: d.OutputTargetWww) {
  return sys.path.join(getAppBuildDir(config, outputTarget), getRegistryFileName(config));
}


export function getLoaderFileName(config: d.Config) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderPath(config: d.Config, outputTarget: d.OutputTargetBuild) {
  return sys.path.join(outputTarget.buildDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}



export function getGlobalJsBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return sys.path.join(getAppBuildDir(config, outputTarget), getGlobalFileName(config));
}


export function getCoreFilename(config: d.Config, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${config.fsNamespace}.${contentHash}.js`;
  }

  // dev file name
  return `${config.fsNamespace}.${coreId}.js`;
}


export function getDistCjsIndexPath(outputTarget: d.OutputTargetDist) {
  return sys.path.join(outputTarget.buildDir, 'index.js');
}


export function getDistEsmDir(outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return sys.path.join(outputTarget.buildDir, 'esm', sourceTarget || '');
}

export function getDistEsmComponentsDir(outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), 'build');
}

export function getDistEsmIndexPath(outputTarget: d.OutputTargetDist, sourceTarget?: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), 'index.js');
}

export function getCoreEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getCoreEsmFileName(config));
}

export function getDefineCustomElementsPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getDefineEsmFilename(config));
}

export function getGlobalEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getGlobalEsmFileName(config));
}

export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), getComponentsEsmFileName(config));
}

export function getPolyfillsEsmBuildPath(outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  return sys.path.join(getDistEsmDir(outputTarget, sourceTarget), `polyfills`);
}

export function getCoreEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.core.js`;
}

export function getDefineEsmFilename(config: d.Config) {
  return `${config.fsNamespace}.define.js`;
}

export function getGlobalEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}

export function getComponentsEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.components.js`;
}

export function getLoaderEsmPath(outputTarget: d.OutputTargetDist) {
  return sys.path.join(outputTarget.buildDir, outputTarget.esmLoaderPath);
}

export function getGlobalStyleFilename(config: d.Config) {
  return `${config.fsNamespace}.css`;
}


export function getBrowserFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.entry.js`;
}


export function getEsmFilename(bundleId: string, isScopedStyles: boolean) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}.entry.js`;
}


export function getComponentsDtsSrcFilePath(config: d.Config) {
  return sys.path.join(config.srcDir, GENERATED_DTS);
}


export function getComponentsDtsTypesFilePath(outputTarget: d.OutputTargetDist) {
  return sys.path.join(outputTarget.typesDir, GENERATED_DTS);
}


export const GENERATED_DTS = 'components.d.ts';
