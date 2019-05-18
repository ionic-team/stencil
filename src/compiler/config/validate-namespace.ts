import * as d from '../../declarations';
import { dashToPascalCase, buildError } from '@utils';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { setStringConfig } from './config-utils';


export function validateNamespace(config: d.Config, diagnostics: d.Diagnostic[]) {
  setStringConfig(config, 'namespace', DEFAULT_NAMESPACE);
  config.namespace = config.namespace.trim();

  const invalidNamespaceChars = config.namespace.replace(/(\w)|(\-)|(\$)/g, '');
  if (invalidNamespaceChars !== '') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${config.namespace}" contains invalid characters: ${invalidNamespaceChars}`;
  }
  if (config.namespace.length < 3) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${config.namespace}" must be at least 3 characters`;
  }
  if (/^\d+$/.test(config.namespace.charAt(0))) {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${config.namespace}" cannot have a number for the first character`;
  }
  if (config.namespace.charAt(0) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${config.namespace}" cannot have a dash for the first character`;
  }
  if (config.namespace.charAt(config.namespace.length - 1) === '-') {
    const err = buildError(diagnostics);
    err.messageText = `Namespace "${config.namespace}" cannot have a dash for the last character`;
  }

  // the file system namespace is the one
  // used in filenames and seen in the url
  setStringConfig(config, 'fsNamespace', config.namespace.toLowerCase());


  if (config.namespace.includes('-')) {
    // convert to PascalCase
    // this is the same namespace that gets put on "window"
    config.namespace = dashToPascalCase(config.namespace);
  }
}

export function validateDistNamespace(config: d.Config, diagnostics: d.Diagnostic[]) {
  const hasDist = config.outputTargets.some(isOutputTargetDist);
  if (hasDist) {
    if (typeof config.namespace !== 'string' || config.namespace.toLowerCase() === 'app') {
      const err = buildError(diagnostics);
      err.messageText = `When generating a distribution it is recommended to choose a unique namespace rather than the default setting "App". Please updated the "namespace" config property within the stencil config.`;
    }
  }
}

const DEFAULT_NAMESPACE = 'App';
