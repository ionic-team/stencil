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
    if (!outputTarget.dir) {
      outputTarget.dir = DEFAULT_WWW_DIR;
    }

    if (!path.isAbsolute(outputTarget.dir)) {
      outputTarget.dir = pathJoin(config, config.rootDir, outputTarget.dir);
    }

    if (!outputTarget.buildDir) {
      outputTarget.buildDir = DEFAULT_WWW_BUILD_DIR;
    }

    if (!path.isAbsolute(outputTarget.buildDir)) {
      outputTarget.buildDir = pathJoin(config, outputTarget.dir, outputTarget.buildDir);
    }

    if (!outputTarget.indexHtml) {
      outputTarget.indexHtml = DEFAULT_INDEX_HTML;
    }

    if (!path.isAbsolute(outputTarget.indexHtml)) {
      outputTarget.indexHtml = pathJoin(config, outputTarget.dir, outputTarget.indexHtml);
    }

    if (outputTarget.collectionDir && !path.isAbsolute(outputTarget.collectionDir)) {
      outputTarget.collectionDir = pathJoin(config, outputTarget.dir, outputTarget.collectionDir);
    }

    if (outputTarget.typesDir && !path.isAbsolute(outputTarget.typesDir)) {
      outputTarget.typesDir = pathJoin(config, outputTarget.dir, outputTarget.typesDir);
    }

    if (typeof outputTarget.emptyDir !== 'boolean') {
      outputTarget.emptyDir = DEFAULT_WWW_EMPTY_DIR;
    }
  });
}

const DEFAULT_WWW_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_WWW_BUILD_DIR = 'build';
const DEFAULT_WWW_EMPTY_DIR = true;
