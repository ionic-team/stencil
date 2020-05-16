import * as d from '../../../declarations';
import { buildError } from '@utils';
import { isAbsolute, join } from 'path';
import { isOutputTargetDocsCustom, isOutputTargetDocsJson, isOutputTargetDocsReadme, isOutputTargetDocsVscode } from '../../output-targets/output-utils';
import { NOTE } from '../../docs/constants';

export const validateDocs = (config: d.Config, diagnostics: d.Diagnostic[], userOutputs: d.OutputTarget[]) => {
  const docsOutputs: d.OutputTarget[] = [];

  // json docs flag
  if (typeof config.flags.docsJson === 'string') {
    docsOutputs.push(
      validateJsonDocsOutputTarget(config, diagnostics, {
        type: 'docs-json',
        file: config.flags.docsJson,
      }),
    );
  }

  // json docs
  const jsonDocsOutputs = userOutputs.filter(isOutputTargetDocsJson);
  jsonDocsOutputs.forEach(jsonDocsOutput => {
    docsOutputs.push(validateJsonDocsOutputTarget(config, diagnostics, jsonDocsOutput));
  });

  // readme docs flag
  if (config.flags.docs || config.flags.task === 'docs') {
    if (!userOutputs.some(isOutputTargetDocsReadme)) {
      // didn't provide a docs config, so let's add one
      docsOutputs.push(validateReadmeOutputTarget(config, diagnostics, { type: 'docs-readme' }));
    }
  }

  // readme docs
  const readmeDocsOutputs = userOutputs.filter(isOutputTargetDocsReadme);
  readmeDocsOutputs.forEach(readmeDocsOutput => {
    docsOutputs.push(validateReadmeOutputTarget(config, diagnostics, readmeDocsOutput));
  });

  // custom docs
  const customDocsOutputs = userOutputs.filter(isOutputTargetDocsCustom);
  customDocsOutputs.forEach(jsonDocsOutput => {
    docsOutputs.push(validateCustomDocsOutputTarget(diagnostics, jsonDocsOutput));
  });

  // vscode docs
  const vscodeDocsOutputs = userOutputs.filter(isOutputTargetDocsVscode);
  vscodeDocsOutputs.forEach(vscodeDocsOutput => {
    docsOutputs.push(validateVScodeDocsOutputTarget(diagnostics, vscodeDocsOutput));
  });
  return docsOutputs;
};

const validateReadmeOutputTarget = (config: d.Config, diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsReadme) => {
  if (outputTarget.type === 'docs') {
    diagnostics.push({
      type: 'config',
      level: 'warn',
      header: 'Deprecated "docs"',
      messageText: `The output target { type: "docs" } has been deprecated, please use "docs-readme" instead.`,
      absFilePath: config.configPath,
    });
    outputTarget.type = 'docs-readme';
  }
  if (typeof outputTarget.dir !== 'string') {
    outputTarget.dir = config.srcDir;
  }

  if (!isAbsolute(outputTarget.dir)) {
    outputTarget.dir = join(config.rootDir, outputTarget.dir);
  }

  if (outputTarget.footer == null) {
    outputTarget.footer = NOTE;
  }
  outputTarget.strict = !!outputTarget.strict;
  return outputTarget;
};

const validateJsonDocsOutputTarget = (config: d.Config, diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsJson) => {
  if (typeof outputTarget.file !== 'string') {
    const err = buildError(diagnostics);
    err.messageText = `docs-json outputTarget missing the "file" option`;
  }

  outputTarget.file = join(config.rootDir, outputTarget.file);
  if (typeof outputTarget.typesFile === 'string') {
    outputTarget.typesFile = join(config.rootDir, outputTarget.typesFile);
  } else if (outputTarget.typesFile !== null && outputTarget.file.endsWith('.json')) {
    outputTarget.typesFile = outputTarget.file.replace(/\.json$/, '.d.ts');
  }
  outputTarget.strict = !!outputTarget.strict;
  return outputTarget;
};

const validateCustomDocsOutputTarget = (diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsCustom) => {
  if (typeof outputTarget.generator !== 'function') {
    const err = buildError(diagnostics);
    err.messageText = `docs-custom outputTarget missing the "generator" function`;
  }

  outputTarget.strict = !!outputTarget.strict;
  return outputTarget;
};

const validateVScodeDocsOutputTarget = (diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsVscode) => {
  if (typeof outputTarget.file !== 'string') {
    const err = buildError(diagnostics);
    err.messageText = `docs-vscode outputTarget missing the "file" path`;
  }
  return outputTarget;
};
