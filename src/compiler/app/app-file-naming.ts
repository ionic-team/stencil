import * as d from '../../declarations';
import { pathJoin } from '../util';


export function getAppBuildDir(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, outputTarget.buildDir, config.fsNamespace);
}


export function getRegistryFileName(config: d.Config) {
  return `${config.fsNamespace}.registry.json`;
}


export function getRegistryJson(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getRegistryFileName(config));
}


export function getLoaderFileName(config: d.Config) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, outputTarget.buildDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}



export function getGlobalJsBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getGlobalFileName(config));
}


export function getCoreFilename(config: d.Config, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = config.sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${config.fsNamespace}.${contentHash}.js`;
  }

  // dev file name
  return `${config.fsNamespace}.${coreId}.js`;
}


export function getDistCjsIndexPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.buildDir, 'index.js');
}


export function getDistEsmBuildDir(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.buildDir, 'esm');
}


export function getDistEsmIndexPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), 'index.js');
}


export function getCoreEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.core.js`;
}


export function getCoreEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, getCoreEsmFileName(config));
  }
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), getCoreEsmFileName(config));
}


export function getDefineCustomElementsPath(config: d.Config, outputTarget: d.OutputTargetWww, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, `${config.fsNamespace}.define.js`);
  }
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `${config.fsNamespace}.define.js`);
}


export function getGlobalEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}


export function getGlobalEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, getGlobalEsmFileName(config));
  }
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), getGlobalEsmFileName(config));
}


export function getComponentsEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.components.js`;
}


export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, getComponentsEsmFileName(config));
  }
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), getComponentsEsmFileName(config));
}


export function getHyperScriptFnEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.core.js`;
}


export function getHyperScriptFnEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, getHyperScriptFnEsmFileName(config));
  }
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), getHyperScriptFnEsmFileName(config));
}


export function getPolyfillsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, getDistEsmBuildDir(config, outputTarget), `es5`, `polyfills`);
}


export function getGlobalStyleFilename(config: d.Config) {
  return `${config.fsNamespace}.css`;
}


export function getBrowserFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.js`;
}


export function getEsmFilename(bundleId: string, isScopedStyles: boolean) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}.js`;
}
