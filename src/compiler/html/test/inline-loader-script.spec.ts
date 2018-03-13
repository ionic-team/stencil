import { isLoaderScriptSrc } from '../inline-loader-script';


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
