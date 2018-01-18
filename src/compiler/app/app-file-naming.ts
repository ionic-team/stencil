import { Config, SourceTarget } from '../../util/interfaces';
import { pathJoin } from '../util';


export function getAppWWWBuildDir(config: Config) {
  return pathJoin(config, config.buildDir, config.fsNamespace);
}


export function getAppDistDir(config: Config) {
  return pathJoin(config, config.distDir, config.fsNamespace);
}


function getRegistryFileName(config: Config) {
  return `${config.fsNamespace}.registry.json`;
}


export function getRegistryJsonWWW(config: Config) {
  return pathJoin(config, getAppWWWBuildDir(config), getRegistryFileName(config));
}


export function getLoaderFileName(config: Config) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderWWW(config: Config) {
  return pathJoin(config, config.buildDir, getLoaderFileName(config));
}


export function getLoaderDist(config: Config) {
  return pathJoin(config, config.distDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: Config) {
  return `${config.fsNamespace}.global.js`;
}


export function getGlobalWWW(config: Config) {
  return pathJoin(config, getAppWWWBuildDir(config), getGlobalFileName(config));
}


export function getGlobalDist(config: Config) {
  return pathJoin(config, getAppDistDir(config), getGlobalFileName(config));
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


export function getAppPublicPath(config: Config) {
  return pathJoin(config, config.publicPath, config.fsNamespace) + '/';
}
