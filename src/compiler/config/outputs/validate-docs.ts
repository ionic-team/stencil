import {
  buildError,
  DOCS_JSON,
  DOCS_README,
  isFunction,
  isOutputTargetDocsCustom,
  isOutputTargetDocsJson,
  isOutputTargetDocsReadme,
  isOutputTargetDocsVscode,
  isString,
  join,
} from '@utils';
import { isAbsolute } from 'path';

import type * as d from '../../../declarations';
import { NOTE } from '../../docs/constants';

export const validateDocs = (config: d.ValidatedConfig, diagnostics: d.Diagnostic[], userOutputs: d.OutputTarget[]) => {
  const docsOutputs: d.OutputTarget[] = [];

  // json docs flag
  if (isString(config.flags.docsJson)) {
    docsOutputs.push(
      validateJsonDocsOutputTarget(config, diagnostics, {
        type: DOCS_JSON,
        file: config.flags.docsJson,
      }),
    );
  }

  // json docs
  const jsonDocsOutputs = userOutputs.filter(isOutputTargetDocsJson);
  jsonDocsOutputs.forEach((jsonDocsOutput) => {
    docsOutputs.push(validateJsonDocsOutputTarget(config, diagnostics, jsonDocsOutput));
  });

  // readme docs flag
  if (config.flags.docs || config.flags.task === 'docs') {
    if (!userOutputs.some(isOutputTargetDocsReadme)) {
      // didn't provide a docs config, so let's add one
      docsOutputs.push(validateReadmeOutputTarget(config, { type: DOCS_README }));
    }
  }

  // readme docs
  const readmeDocsOutputs = userOutputs.filter(isOutputTargetDocsReadme);
  readmeDocsOutputs.forEach((readmeDocsOutput) => {
    docsOutputs.push(validateReadmeOutputTarget(config, readmeDocsOutput));
  });

  // custom docs
  const customDocsOutputs = userOutputs.filter(isOutputTargetDocsCustom);
  customDocsOutputs.forEach((jsonDocsOutput) => {
    docsOutputs.push(validateCustomDocsOutputTarget(diagnostics, jsonDocsOutput));
  });

  // vscode docs
  const vscodeDocsOutputs = userOutputs.filter(isOutputTargetDocsVscode);
  vscodeDocsOutputs.forEach((vscodeDocsOutput) => {
    docsOutputs.push(validateVScodeDocsOutputTarget(diagnostics, vscodeDocsOutput));
  });
  return docsOutputs;
};

export const validateReadmeOutputTarget = (config: d.ValidatedConfig, outputTarget: d.OutputTargetDocsReadme) => {
  if (!isString(outputTarget.dir)) {
    outputTarget.dir = config.srcDir;
  }

  if (!isAbsolute(outputTarget.dir)) {
    outputTarget.dir = join(config.rootDir, outputTarget.dir);
  }

  if (outputTarget.footer == null) {
    outputTarget.footer = NOTE;
  }

  outputTarget.strict = !!outputTarget.strict;

  if (!outputTarget.colors) {
    outputTarget.colors = DEFAULT_DOCS_README_COLORS;
  } else {
    let invalidColor = false;

    if (!outputTarget.colors.background || (invalidColor = !isHexColor(outputTarget.colors.background))) {
      if (invalidColor) {
        config.logger.warn(
          `'${outputTarget.colors.background}' is not a valid hex color. The default value for diagram backgrounds ('${DEFAULT_DOCS_README_COLORS.background}') will be used.`,
        );
      }
      outputTarget.colors.background = DEFAULT_DOCS_README_COLORS.background;
    }

    if (!outputTarget.colors.text || (invalidColor = !isHexColor(outputTarget.colors.text))) {
      if (invalidColor) {
        config.logger.warn(
          `'${outputTarget.colors.text}' is not a valid hex color. The default value for diagram text ('${DEFAULT_DOCS_README_COLORS.text}') will be used.`,
        );
      }
      outputTarget.colors.text = DEFAULT_DOCS_README_COLORS.text;
    }
  }

  return outputTarget;
};

const validateJsonDocsOutputTarget = (
  config: d.ValidatedConfig,
  diagnostics: d.Diagnostic[],
  outputTarget: d.OutputTargetDocsJson,
) => {
  if (!isString(outputTarget.file)) {
    const err = buildError(diagnostics);
    err.messageText = `docs-json outputTarget missing the "file" option`;
  }

  outputTarget.file = join(config.rootDir, outputTarget.file);
  if (isString(outputTarget.typesFile)) {
    outputTarget.typesFile = join(config.rootDir, outputTarget.typesFile);
  } else if (outputTarget.typesFile !== null && outputTarget.file.endsWith('.json')) {
    outputTarget.typesFile = outputTarget.file.replace(/\.json$/, '.d.ts');
  }
  outputTarget.strict = !!outputTarget.strict;
  return outputTarget;
};

const validateCustomDocsOutputTarget = (diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsCustom) => {
  if (!isFunction(outputTarget.generator)) {
    const err = buildError(diagnostics);
    err.messageText = `docs-custom outputTarget missing the "generator" function`;
  }

  outputTarget.strict = !!outputTarget.strict;
  return outputTarget;
};

const validateVScodeDocsOutputTarget = (diagnostics: d.Diagnostic[], outputTarget: d.OutputTargetDocsVscode) => {
  if (!isString(outputTarget.file)) {
    const err = buildError(diagnostics);
    err.messageText = `docs-vscode outputTarget missing the "file" path`;
  }
  return outputTarget;
};

/**
 * Checks if a given string is a valid hexadecimal color representation.
 *
 * @param str - The string to be checked.
 * @returns `true` if the string is a valid hex color (e.g., '#FF00AA', '#f0f'), `false` otherwise.
 *
 * @example
 * isHexColor('#FF00AA'); // true
 * isHexColor('#f0f');    // true
 * isHexColor('#abcde');  // false (too many characters)
 * isHexColor('FF00AA');  // false (missing #)
 */
export const isHexColor = (str: string): boolean => {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexColorRegex.test(str);
};

export const DEFAULT_DOCS_README_COLORS: d.OutputTargetDocsReadme['colors'] = {
  background: '#f9f',
  text: '#333',
};
