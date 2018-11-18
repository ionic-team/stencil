import * as d from '../../declarations';
import { pathJoin } from '../util';
import { _deprecatedDocsConfig } from './_deprecated-validate-docs';


export function validateDocs(config: d.Config) {
  _deprecatedDocsConfig(config);
  config.outputTargets = config.outputTargets || [];

  let buildDocs = !config.devMode;

  // api docs flag
  if (typeof config.flags.docsApi === 'string') {
    buildDocs = true;
    config.outputTargets.push({
      type: 'docs-api',
      file: config.flags.docsApi
    });
  }
  const apiDocsOutputs = config.outputTargets.filter(o => o.type === 'docs-api') as d.OutputTargetDocsApi[];
  apiDocsOutputs.forEach(apiDocsOutput => {
    validateApiDocsOutputTarget(config, apiDocsOutput);
  });

  // json docs flag
  if (typeof config.flags.docsJson === 'string') {
    buildDocs = true;
    config.outputTargets.push({
      type: 'docs-json',
      file: config.flags.docsJson
    });
  }
  const jsonDocsOutputs = config.outputTargets.filter(o => o.type === 'docs-json') as d.OutputTargetDocsJson[];
  jsonDocsOutputs.forEach(jsonDocsOutput => {
    validateJsonDocsOutputTarget(config, jsonDocsOutput);
  });

  // readme docs flag
  if (config.flags.docs) {
    buildDocs = true;
    if (!config.outputTargets.some(o => o.type === 'docs')) {
      // didn't provide a docs config, so let's add one
      config.outputTargets.push({ type: 'docs' });
    }
  }

  const readmeDocsOutputs = config.outputTargets.filter(o => o.type === 'docs') as d.OutputTargetDocsReadme[];
  readmeDocsOutputs.forEach(readmeDocsOutput => {
    validateReadmeOutputTarget(config, readmeDocsOutput);
  });

  config.buildDocs = buildDocs;
}


function validateReadmeOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsReadme) {
  if (typeof outputTarget.dir !== 'string') {
    outputTarget.dir = config.srcDir;
  }

  if (!config.sys.path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = pathJoin(config, config.rootDir, outputTarget.dir);
  }
  outputTarget.strict = !!outputTarget.strict;
}


function validateJsonDocsOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsJson) {
  if (typeof outputTarget.file !== 'string') {
    throw new Error(`docs-json outputTarget missing the "file" option`);
  }

  outputTarget.file = pathJoin(config, config.rootDir, outputTarget.file);
  outputTarget.strict = !!outputTarget.strict;
}


function validateApiDocsOutputTarget(config: d.Config, outputTarget: d.OutputTargetDocsApi) {
  if (typeof outputTarget.file !== 'string') {
    throw new Error(`docs-api outputTarget missing the "file" option`);
  }

  outputTarget.file = pathJoin(config, config.rootDir, outputTarget.file);
  outputTarget.strict = !!outputTarget.strict;
}
