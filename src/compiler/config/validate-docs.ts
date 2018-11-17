import * as d from '../../declarations';
import { pathJoin } from '../util';
import { _deprecatedDocsConfig } from './_deprecated-validate-docs';


export function validateDocs(config: d.Config) {
  _deprecatedDocsConfig(config);

  if (typeof config.flags.docsApi === 'string') {
    // api docs flag
    config.outputTargets = config.outputTargets || [];

    if (!(config.outputTargets as d.OutputTargetDocsApi[]).some(o => o.type === 'docs-api')) {
      // didn't provide a docs config, so let's add one
      const outputTarget: d.OutputTargetDocsApi = {
        type: 'docs-api'
      };
      config.outputTargets.push(outputTarget);
    }

    const apiDocsOutputs = (config.outputTargets as d.OutputTargetDocsApi[]).filter(o => o.type === 'docs-api');
    apiDocsOutputs.forEach(apiDocsOutput => {
      validateApiDocsOutputTarget(config, apiDocsOutput);
    });

  }

  if (typeof config.flags.docsJson === 'string') {
    // json docs flag
    config.outputTargets = config.outputTargets || [];

    if (!(config.outputTargets as d.OutputTargetDocsJson[]).some(o => o.type === 'docs-json')) {
      // didn't provide a docs config, so let's add one
      const outputTarget: d.OutputTargetDocsJson = {
        type: 'docs-json'
      };
      config.outputTargets.push(outputTarget);
    }

    const jsonDocsOutputs = (config.outputTargets as d.OutputTargetDocsJson[]).filter(o => o.type === 'docs-json');
    jsonDocsOutputs.forEach(jsonDocsOutput => {
      validateJsonDocsOutputTarget(config, jsonDocsOutput);
    });

  } else if (config.outputTargets) {
    // remove json docs if there is no flag
    config.outputTargets = (config.outputTargets as d.OutputTargetDocsJson[]).filter(o => o.type !== 'docs-json');
  }

  if (config.flags.docs) {
    // readme docs flag
    config.outputTargets = config.outputTargets || [];

    if (!(config.outputTargets as d.OutputTargetDocsReadme[]).some(o => o.type === 'docs')) {
      // didn't provide a docs config, so let's add one
      const outputTarget: d.OutputTargetDocsReadme = {
        type: 'docs'
      };
      config.outputTargets.push(outputTarget);
    }

    const readmeDocsOutputs = (config.outputTargets as d.OutputTargetDocsReadme[]).filter(o => o.type === 'docs');
    readmeDocsOutputs.forEach(readmeDocsOutput => {
      validateReadmeOutputTarget(config, readmeDocsOutput);
    });

  } else if (config.outputTargets) {
    // remove json docs if there is no flag
    config.outputTargets = (config.outputTargets as d.OutputTargetDocsReadme[]).filter(o => o.type !== 'docs');
  }
}


function validateReadmeOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsReadme) {
  if (config.flags.docs && typeof outputTarget.dir !== 'string') {
    outputTarget.dir = config.srcDir;
  }

  if (typeof outputTarget.dir === 'string' && !config.sys.path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = pathJoin(config, config.rootDir, outputTarget.dir);
  }

  outputTarget.strict = !!outputTarget.strict;
}


function validateJsonDocsOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsJson) {
  if (typeof config.flags.docsJson === 'string' && typeof outputTarget.file !== 'string') {
    outputTarget.file = config.flags.docsJson;
  }

  if (typeof outputTarget.file === 'string') {
    outputTarget.file = pathJoin(config, config.rootDir, outputTarget.file);
  }

  outputTarget.strict = !!outputTarget.strict;
}


function validateApiDocsOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsApi) {
  if (typeof config.flags.docsApi === 'string' && typeof outputTarget.file !== 'string') {
    outputTarget.file = config.flags.docsApi;
  }

  if (typeof outputTarget.file === 'string') {
    outputTarget.file = pathJoin(config, config.rootDir, outputTarget.file);
  }

  outputTarget.strict = !!outputTarget.strict;
}
