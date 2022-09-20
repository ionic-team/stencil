import type * as d from '@stencil/core/declarations';

import { validateNamespace } from '../validate-namespace';

describe('validateNamespace', () => {
  let config: d.Config;
  const diagnostics: d.Diagnostic[] = [];
  beforeEach(() => {
    config = {};
    diagnostics.length = 0;
  });

  it('should not allow special characters in namespace', () => {
    config.namespace = 'My/Namespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);

    diagnostics.length = 0;
    config.namespace = 'My%20Namespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);

    diagnostics.length = 0;
    config.namespace = 'My:Namespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should not allow spaces in namespace', () => {
    config.namespace = 'My Namespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should not allow dash for last character of namespace', () => {
    config.namespace = 'MyNamespace-';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should not allow dash for first character of namespace', () => {
    config.namespace = '-MyNamespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should not allow number for first character of namespace', () => {
    config.namespace = '88MyNamespace';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should enforce namespace being at least 3 characters', () => {
    config.namespace = 'ab';
    validateNamespace(config, diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  it('should allow $ in the namespace', () => {
    config.namespace = '$MyNamespace';
    validateNamespace(config, diagnostics);
    expect(config.namespace).toBe('$MyNamespace');
    expect(config.fsNamespace).toBe('$mynamespace');
  });

  it('should allow underscore in the namespace', () => {
    config.namespace = 'My_Namespace';
    validateNamespace(config, diagnostics);
    expect(config.namespace).toBe('My_Namespace');
    expect(config.fsNamespace).toBe('my_namespace');
  });

  it('should allow dash in the namespace', () => {
    config.namespace = 'My-Namespace';
    validateNamespace(config, diagnostics);
    expect(config.namespace).toBe('MyNamespace');
    expect(config.fsNamespace).toBe('my-namespace');
  });

  it('should set user namespace', () => {
    config.namespace = 'MyNamespace';
    validateNamespace(config, diagnostics);
    expect(config.namespace).toBe('MyNamespace');
    expect(config.fsNamespace).toBe('mynamespace');
  });

  it('should set default namespace', () => {
    validateNamespace(config, diagnostics);
    expect(config.namespace).toBe('App');
    expect(config.fsNamespace).toBe('app');
  });
});
