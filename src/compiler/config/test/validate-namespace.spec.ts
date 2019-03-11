import { Config } from '../../declarations';
import { validateNamespace } from '../validate-namespace';


describe('validateNamespace', () => {

  it('should not allow special characters in namespace', () => {
    expect(() => {
      config.namespace = 'My/Namespace';
      validateNamespace(config);
    }).toThrow();
    expect(() => {
      config.namespace = 'My%20Namespace';
      validateNamespace(config);
    }).toThrow();
    expect(() => {
      config.namespace = 'My:Namespace';
      validateNamespace(config);
    }).toThrow();
  });

  it('should not allow spaces in namespace', () => {
    expect(() => {
      config.namespace = 'My Namespace';
      validateNamespace(config);
    }).toThrow();
  });

  it('should not allow dash for last character of namespace', () => {
    expect(() => {
      config.namespace = 'MyNamespace-';
      validateNamespace(config);
    }).toThrow();
  });

  it('should not allow dash for first character of namespace', () => {
    expect(() => {
      config.namespace = '-MyNamespace';
      validateNamespace(config);
    }).toThrow();
  });

  it('should not allow number for first character of namespace', () => {
    expect(() => {
      config.namespace = '88MyNamespace';
      validateNamespace(config);
    }).toThrow();
  });

  it('should enforce namespace being at least 3 characters', () => {
    expect(() => {
      config.namespace = 'ab';
      validateNamespace(config);
    }).toThrow();
  });

  it('should allow $ in the namespace', () => {
    config.namespace = '$MyNamespace';
    validateNamespace(config);
    expect(config.namespace).toBe('$MyNamespace');
    expect(config.fsNamespace).toBe('$mynamespace');
  });

  it('should allow underscore in the namespace', () => {
    config.namespace = 'My_Namespace';
    validateNamespace(config);
    expect(config.namespace).toBe('My_Namespace');
    expect(config.fsNamespace).toBe('my_namespace');
  });

  it('should allow dash in the namespace', () => {
    config.namespace = 'My-Namespace';
    validateNamespace(config);
    expect(config.namespace).toBe('MyNamespace');
    expect(config.fsNamespace).toBe('my-namespace');
  });

  it('should set user namespace', () => {
    config.namespace = 'MyNamespace';
    validateNamespace(config);
    expect(config.namespace).toBe('MyNamespace');
    expect(config.fsNamespace).toBe('mynamespace');
  });

  it('should set default namespace', () => {
    validateNamespace(config);
    expect(config.namespace).toBe('App');
    expect(config.fsNamespace).toBe('app');
  });

  var config: Config;
  beforeEach(() => {
    config = {};
  });

});
