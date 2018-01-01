import { BuildConfig, SourceTarget } from '../../util/interfaces';
import { pathJoin } from '../util';


export function getAppWWWBuildDir(config: BuildConfig) {
  return pathJoin(config, config.buildDir, config.fsNamespace);
}


export function getAppDistDir(config: BuildConfig) {
  return pathJoin(config, config.distDir, config.fsNamespace);
}


export function getRegistryJsonWWW(config: BuildConfig) {
  return pathJoin(config, getAppWWWBuildDir(config), `${config.fsNamespace}.registry.json`);
}


export function getRegistryJsonDist(config: BuildConfig) {
  return pathJoin(config, config.distDir, `${config.fsNamespace}.registry.json`);
}


export function getLoaderFileName(config: BuildConfig) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderWWW(config: BuildConfig) {
  return pathJoin(config, config.buildDir, getLoaderFileName(config));
}


export function getLoaderDist(config: BuildConfig) {
  return pathJoin(config, config.distDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: BuildConfig) {
  return `${config.fsNamespace}.global.js`;
}


export function getGlobalWWW(config: BuildConfig) {
  return pathJoin(config, getAppWWWBuildDir(config), getGlobalFileName(config));
}


export function getGlobalDist(config: BuildConfig) {
  return pathJoin(config, getAppDistDir(config), getGlobalFileName(config));
}


export function getCoreFilename(config: BuildConfig, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = config.sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${config.fsNamespace}.${contentHash}.js`;
  }

  // dev file name
  return `${config.fsNamespace}.${coreId}.js`;
}


export function getGlobalStyleFilename(config: BuildConfig) {
  return `${config.fsNamespace}.css`;
}


export function getBundleFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.js`;
}


export function getAppPublicPath(config: BuildConfig) {
  return pathJoin(config, config.publicPath, config.fsNamespace) + '/';
}
