import * as d from '../../../declarations';
import { isLoaderScriptSrc, setDataResourcesUrlAttr } from '../inline-loader-script';
import { TestingConfig } from '../../../testing/testing-config';
import { validateConfig } from '../../config/validate-config';


describe('isLoaderScriptSrc', () => {

  it('should be true, with hash', () => {
    const loaderFileName = 'app.js#like-a=prayer';
    const scriptSrc = '/build/app.js#balloons=99';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, with querystring', () => {
    const loaderFileName = 'app.js?like-a=prayer';
    const scriptSrc = '/build/app.js?balloons=99';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, exact file', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = 'app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, case insensitive', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = '/buIld/apP.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, w/out starting slash', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = 'build/app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, w/ starting slash', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = '/build/app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be false, w/ file://', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = 'file:///build/app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should be false, w/ https://', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = 'https://cdn.com/build/app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should be false, w/ http://', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = 'http://cdn.com/build/app.js';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should do nothing for empty src', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = '';
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should do nothing for null src', () => {
    const loaderFileName = 'app.js';
    const scriptSrc = null;
    const r = isLoaderScriptSrc(loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

});


describe('setDataResourcesUrlAttr',  () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetHydrate;

  beforeEach(() => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets[0];
  });

  it('add baseUrl', () => {
    outputTarget.baseUrl = '/my/base/url/';
    const r = setDataResourcesUrlAttr(config, outputTarget);
    expect(r).toBe('/my/base/url/build/app/');
  });

  it('use config.resourcesUrl if given', () => {
    outputTarget.resourcesUrl = '/my/resource/path/';
    const r = setDataResourcesUrlAttr(config, outputTarget);
    expect(r).toBe('/my/resource/path/');
  });

  it('custom namespace', () => {
    config.fsNamespace = 'my-namespace';
    const r = setDataResourcesUrlAttr(config, outputTarget);
    expect(r).toBe('/build/my-namespace/');
  });

  it('defaults', () => {
    const r = setDataResourcesUrlAttr(config, outputTarget);
    expect(r).toBe('/build/app/');
  });

});
