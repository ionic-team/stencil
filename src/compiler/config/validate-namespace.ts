import { RawConfig } from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { setStringConfig } from './config-utils';


export function validateNamespace(config: RawConfig) {
  setStringConfig(config, 'namespace', DEFAULT_NAMESPACE);
  config.namespace = config.namespace.trim();

  const invalidNamespaceChars = config.namespace.replace(/(\w)|(\-)|(\$)/g, '');
  if (invalidNamespaceChars !== '') {
    throw new Error(`Namespace "${config.namespace}" contains invalid characters: ${invalidNamespaceChars}`);
  }
  if (config.namespace.length < 3) {
    throw new Error(`Namespace "${config.namespace}" must be at least 3 characters`);
  }
  if (/^\d+$/.test(config.namespace.charAt(0))) {
    throw new Error(`Namespace "${config.namespace}" cannot have a number for the first character`);
  }
  if (config.namespace.charAt(0) === '-') {
    throw new Error(`Namespace "${config.namespace}" cannot have a dash for the first character`);
  }
  if (config.namespace.charAt(config.namespace.length - 1) === '-') {
    throw new Error(`Namespace "${config.namespace}" cannot have a dash for the last character`);
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

const DEFAULT_NAMESPACE = 'App';
