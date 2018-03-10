import { Config, OutputTarget } from '../../declarations';
import { pathJoin } from '../util';


export function validateDocs(config: Config) {
  if (config.flags.docs) {
    if (config.outputTargets) {
      if (!config.outputTargets.some(o => o.type === 'docs')) {
        config.outputTargets.push({ type: 'docs' });
      }

      config.outputTargets.forEach(outputTarget => {
        validateDocsOutputTarget(config, outputTarget);
      });
    }

  } else {
    if (config.outputTargets) {
      config.outputTargets = config.outputTargets.filter(o => o.type !== 'docs');
    }
  }
}


function validateDocsOutputTarget(config: Config, outputTarget: OutputTarget) {
  if (outputTarget.format === 'json') {
    if (!outputTarget.path) {
      outputTarget.path = 'dist/docs';
    }
    if (!config.sys.path.isAbsolute(outputTarget.path)) {
      outputTarget.path = pathJoin(config, config.rootDir, outputTarget.path);
    }

  } else {
    outputTarget.format = 'readme';
  }
}
