import { buildError, dashToPascalCase, isOutputTargetDist, isString } from '@utils';

import type * as d from '../../declarations';

export const validateNamespace = (
  config: d.Config,
  diagnostics: d.Diagnostic[]
): { namespace: string; fsNamespace: string } => {
  let namespace = isString(config.namespace) ? config.namespace : DEFAULT_NAMESPACE;
  namespace = namespace.trim();

  const invalidNamespaceChars = namespace.replace(/(\w)|(\-)|(\$)/g, '');
  if (invalidNamespaceChars !== '') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${namespace}" contains invalid characters: ${invalidNamespaceChars}`;
  }
  if (namespace.length < 3) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${namespace}" must be at least 3 characters`;
  }
  if (/^\d+$/.test(namespace.charAt(0))) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${namespace}" cannot have a number for the first character`;
  }
  if (namespace.charAt(0) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${namespace}" cannot have a dash for the first character`;
  }
  if (namespace.charAt(namespace.length - 1) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${namespace}" cannot have a dash for the last character`;
  }

  return {
    namespace: namespace.includes('-') ? dashToPascalCase(namespace) : namespace,
    fsNamespace: isString(config.fsNamespace) ? config.fsNamespace : namespace.toLocaleLowerCase().trim(),
  };
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
