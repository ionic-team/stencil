import { Config, OutputTarget, SourceTarget } from '../../declarations';
import { pathJoin } from '../util';


export function getAppBuildDir(config: Config, outputTarget: OutputTarget) {
  return pathJoin(config, outputTarget.buildDir, config.fsNamespace);
}


function getRegistryFileName(config: Config) {
  return `${config.fsNamespace}.registry.json`;
}


export function getRegistryJson(config: Config, outputTarget: OutputTarget) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getRegistryFileName(config));
}


export function getLoaderFileName(config: Config) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderPath(config: Config, outputTarget: OutputTarget) {
  return pathJoin(config, outputTarget.buildDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: Config) {
  return `${config.fsNamespace}.global.js`;
}


export function getGlobalBuildPath(config: Config, outputTarget: OutputTarget) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getGlobalFileName(config));
}


export function getCoreFilename(config: Config, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = config.sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${config.fsNamespace}.${contentHash}.js`;
  }

  // dev file name
  return `${config.fsNamespace}.${coreId}.js`;
}


export function getGlobalStyleFilename(config: Config) {
  return `${config.fsNamespace}.css`;
}


export function getBundleFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.js`;
}
