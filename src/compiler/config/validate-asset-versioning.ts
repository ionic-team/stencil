import { Config, ConfigAssetVersioning } from '@declarations';
import { setArrayConfig, setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';


export function validateAssetVerioning(config: Config) {
  if (!config.assetVersioning) {
    config.assetVersioning = null;
    return;
  }

  if (((config.assetVersioning) as boolean) === true) {
    config.assetVersioning = {};
  }

  const hashLength = config.hashedFileNameLength > 3 ? config.hashedFileNameLength : DEFAULTS.hashLength;

  setArrayConfig(config.assetVersioning, 'cssProperties', DEFAULTS.cssProperties);
  setNumberConfig(config.assetVersioning, 'hashLength', null, hashLength);
  setBooleanConfig(config.assetVersioning, 'queryMode', null, DEFAULTS.queryMode);
  setStringConfig(config.assetVersioning, 'prefix', DEFAULTS.separator);
  setStringConfig(config.assetVersioning, 'separator', DEFAULTS.separator);
  setBooleanConfig(config.assetVersioning, 'versionHtml', null, DEFAULTS.versionHtml);
  setBooleanConfig(config.assetVersioning, 'versionManifest', null, DEFAULTS.versionManifest);
  setBooleanConfig(config.assetVersioning, 'versionCssProperties', null, DEFAULTS.versionCssProperties);
}


const DEFAULTS: ConfigAssetVersioning = {
  cssProperties: ['background', 'background-url', 'url'],
  hashLength: 8,
  queryMode: false,
  pattern: '**/*.{css,js,png,jpg,jpeg,gif,svg,json,woff,woff2,ttf,eot}',
  prefix: '',
  separator: '.',
  versionHtml: true,
  versionManifest: true,
  versionCssProperties: true,
};
