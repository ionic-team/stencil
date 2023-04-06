import { buildError, dashToPascalCase, isOutputTargetDist, isString } from '@utils';

import type * as d from '../../declarations';

export const validateNamespace = (c: d.UnvalidatedConfig, diagnostics: d.Diagnostic[]) => {
  c.namespace = isString(c.namespace) ? c.namespace : DEFAULT_NAMESPACE;
  c.namespace = c.namespace.trim();

  const invalidNamespaceChars = c.namespace.replace(/(\w)|(\-)|(\$)/g, '');
  if (invalidNamespaceChars !== '') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${c.namespace}" contains invalid characters: ${invalidNamespaceChars}`;
  }
  if (c.namespace.length < 3) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${c.namespace}" must be at least 3 characters`;
  }
  if (/^\d+$/.test(c.namespace.charAt(0))) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${c.namespace}" cannot have a number for the first character`;
  }
  if (c.namespace.charAt(0) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${c.namespace}" cannot have a dash for the first character`;
  }
  if (c.namespace.charAt(c.namespace.length - 1) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${c.namespace}" cannot have a dash for the last character`;
  }

  // the file system namespace is the one
  // used in filenames and seen in the url
  if (!isString(c.fsNamespace)) {
    c.fsNamespace = c.namespace.toLowerCase().trim();
  }

  if (c.namespace.includes('-')) {
    // convert to PascalCase
    c.namespace = dashToPascalCase(c.namespace);
  }
};

export const validateDistNamespace = (config: d.UnvalidatedConfig, diagnostics: d.Diagnostic[]) => {
  const hasDist = (config.outputTargets ?? []).some(isOutputTargetDist);
  if (hasDist) {
    if (!isString(config.namespace) || config.namespace.toLowerCase() === 'app') {
      const err = buildError(diagnostics);
      err.messageText = `When generating a distribution it is recommended to choose a unique namespace rather than the default setting "App". Please updated the "namespace" config property within the stencil config.`;
    }
  }
};

const DEFAULT_NAMESPACE = 'App';
