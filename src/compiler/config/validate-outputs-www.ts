import { Config } from '../../declarations';
import { pathJoin } from '../util';


export function validateWwwOutputTarget(config: Config) {
  const path = config.sys.path;

  if (!Array.isArray(config.outputTargets)) {
    config.outputTargets = [
      { type: 'www' }
    ];
  }

  const wwwOutputTargets = config.outputTargets.filter(o => o.type === 'www');

  wwwOutputTargets.forEach(outputTarget => {
    if (!outputTarget.path) {
      outputTarget.path = DEFAULT_WWW_DIR;
    }

    if (!path.isAbsolute(outputTarget.path)) {
      outputTarget.path = pathJoin(config, config.rootDir, outputTarget.path);
    }

    if (!outputTarget.buildPath) {
      outputTarget.buildPath = DEFAULT_WWW_BUILD_DIR;
    }

    if (!path.isAbsolute(outputTarget.buildPath)) {
      outputTarget.buildPath = pathJoin(config, outputTarget.path, outputTarget.buildPath);
    }

    if (!outputTarget.indexHtml) {
      outputTarget.indexHtml = DEFAULT_INDEX_HTML;
    }

    if (!path.isAbsolute(outputTarget.indexHtml)) {
      outputTarget.indexHtml = pathJoin(config, outputTarget.path, outputTarget.indexHtml);
    }

    if (outputTarget.collectionDir && !path.isAbsolute(outputTarget.collectionDir)) {
      outputTarget.collectionDir = pathJoin(config, outputTarget.path, outputTarget.collectionDir);
    }

    if (outputTarget.typesDir && !path.isAbsolute(outputTarget.typesDir)) {
      outputTarget.typesDir = pathJoin(config, outputTarget.path, outputTarget.typesDir);
    }

    if (typeof outputTarget.empty !== 'boolean') {
      outputTarget.empty = DEFAULT_WWW_EMPTY_DIR;
    }
  });
}

const DEFAULT_WWW_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_WWW_BUILD_DIR = 'build';
const DEFAULT_WWW_EMPTY_DIR = true;
