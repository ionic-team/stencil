import * as d from '../../declarations';
import { isOutputTargetDocsCustom, isOutputTargetDocsJson, isOutputTargetDocsReadme } from '../output-targets/output-utils';
import { NOTE } from '../docs/constants';
import { buildError } from '@utils';

export function validateDocs(config: d.Config, diagnostics: d.Diagnostic[]) {
  config.outputTargets = config.outputTargets || [];

  let buildDocs = !config.devMode;

  // json docs flag
  if (typeof config.flags.docsJson === 'string') {
    buildDocs = true;
    config.outputTargets.push({
      type: 'docs-json',
      file: config.flags.docsJson
    });
  }
  const jsonDocsOutputs = config.outputTargets.filter(isOutputTargetDocsJson);
  jsonDocsOutputs.forEach(jsonDocsOutput => {
    validateJsonDocsOutputTarget(config, diagnostics, jsonDocsOutput);
  });

  // readme docs flag
  if (config.flags.docs) {
    buildDocs = true;
    if (!config.outputTargets.some(isOutputTargetDocsReadme)) {
      // didn't provide a docs config, so let's add one
      config.outputTargets.push({ type: 'docs-readme' });
    }
  }
  const readmeDocsOutputs = config.outputTargets.filter(isOutputTargetDocsReadme);
  readmeDocsOutputs.forEach(readmeDocsOutput => {
    validateReadmeOutputTarget(config, diagnostics, readmeDocsOutput);
  });

  // custom docs
  const customDocsOutputs = config.outputTargets.filter(isOutputTargetDocsCustom);
  customDocsOutputs.forEach(jsonDocsOutput => {
    validateCustomDocsOutputTarget(diagnostics, jsonDocsOutput);
  });

  config.buildDocs = buildDocs;
}


function validateReadmeOutputTarget(config: d.Config, diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsReadme) {
  if (outputTarget.type === 'docs') {
    diagnostics.push({
      type: 'config',
      level: 'warn',
      header: 'Deprecated "docs"',
      messageText: `The output target { type: "docs" } has been deprecated, please use "docs-readme" instead.`,
      absFilePath: config.configPath
    });
    outputTarget.type = 'docs-readme';
  }
  if (typeof outputTarget.dir !== 'string') {
    outputTarget.dir = config.srcDir;
  }

  if (!config.sys.path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = config.sys.path.join(config.rootDir, outputTarget.dir);
  }

  if (outputTarget.footer == null) {
    outputTarget.footer = NOTE;
  }
  outputTarget.strict = !!outputTarget.strict;
}


function validateJsonDocsOutputTarget(config: d.Config, diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsJson) {
  if (typeof outputTarget.file !== 'string') {
    const err = buildError(diagnostics);
    err.messageText = `docs-json outputTarget missing the "file" option`;
  }

  outputTarget.file = config.sys.path.join(config.rootDir, outputTarget.file);
  if (typeof outputTarget.typesFile === 'string') {
    outputTarget.typesFile = config.sys.path.join(config.rootDir, outputTarget.typesFile);
  } else if (outputTarget.typesFile !== null && outputTarget.file.endsWith('.json')) {
    outputTarget.typesFile = outputTarget.file.replace(/\.json$/, '.d.ts');
  }
  outputTarget.strict = !!outputTarget.strict;
}


function validateCustomDocsOutputTarget(diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsCustom) {
  if (typeof outputTarget.generator !== 'function') {
    const err = buildError(diagnostics);
    err.messageText = `docs-custom outputTarget missing the "generator" function`;
  }

  outputTarget.strict = !!outputTarget.strict;
}
