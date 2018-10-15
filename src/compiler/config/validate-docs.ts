import * as d from '../../declarations';
import { pathJoin } from '../util';


export function validateDocs(config: d.Config) {
  if (config.flags.docs || typeof config.flags.docsJson === 'string') {
    // docs flag
    config.outputTargets = config.outputTargets || [];

    if (!config.outputTargets.some(o => o.type === 'docs')) {
      // didn't provide a docs config, so let's add one
      const outputTarget: d.OutputTargetDocs = {
        type: 'docs'
      };
      config.outputTargets.push(outputTarget);
    }

    const docsOutputTargets = config.outputTargets.filter(o => o.type === 'docs') as d.OutputTargetDocs[];
    docsOutputTargets.forEach(outputTarget => {
      if (typeof outputTarget.jsonFile !== 'string' && typeof config.flags.docsJson === 'string') {
        outputTarget.jsonFile = config.flags.docsJson;
      }

      if (typeof outputTarget.readmeDir !== 'string' && config.flags.docs) {
        outputTarget.readmeDir = config.srcDir;
      }
    });

    const docsOutputs = config.outputTargets.filter(o => o.type === 'docs') as d.OutputTargetDocs[];
    docsOutputs.forEach(outputTarget => {
      validateDocsOutputTarget(config, outputTarget);
    });

  } else {
    if (config.outputTargets) {
      // remove docs if there is no docs flag
      config.outputTargets = config.outputTargets.filter(o => o.type !== 'docs');
    }
  }
}


function validateDocsOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocs) {
  if (typeof outputTarget.readmeDir === 'string' && !config.sys.path.isAbsolute(outputTarget.readmeDir)) {
    outputTarget.readmeDir = pathJoin(config, config.rootDir, outputTarget.readmeDir);
  }

  if (typeof outputTarget.jsonFile === 'string') {
    outputTarget.jsonFile = pathJoin(config, config.rootDir, outputTarget.jsonFile);
  }

  outputTarget.strict = !!outputTarget.strict;
}
