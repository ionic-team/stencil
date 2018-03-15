import * as d from '../../declarations';
import { pathJoin } from '../util';
import { setBooleanConfig, setStringConfig } from './config-utils';
import { validatePrerender } from './validate-prerender';


export function validateOutputTargetWww(config: d.Config) {
  if (!Array.isArray(config.outputTargets)) {
    config.outputTargets = [
      { type: 'www' }
    ];
  }

  const wwwOutputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www');

  wwwOutputTargets.forEach(outputTarget => {
    validateOutputTarget(config, outputTarget);
  });
}


function validateOutputTarget(config: d.Config, outputTarget: d.OutputTargetWww) {
  const path = config.sys.path;

  setStringConfig(outputTarget, 'dir', DEFAULT_DIR);

  if (!path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = pathJoin(config, config.rootDir, outputTarget.dir);
  }

  setStringConfig(outputTarget, 'buildDir', DEFAULT_BUILD_DIR);

  if (!path.isAbsolute(outputTarget.buildDir)) {
    outputTarget.buildDir = pathJoin(config, outputTarget.dir, outputTarget.buildDir);
  }

  setStringConfig(outputTarget, 'indexHtml', DEFAULT_INDEX_HTML);

  if (!path.isAbsolute(outputTarget.indexHtml)) {
    outputTarget.indexHtml = pathJoin(config, outputTarget.dir, outputTarget.indexHtml);
  }

  setBooleanConfig(outputTarget, 'empty', null, DEFAULT_EMPTY_DIR);

  validatePrerender(config, outputTarget);
}


const DEFAULT_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_EMPTY_DIR = true;
