import { isLoaderScriptSrc } from '../inline-loader-script';


describe('isLoaderScriptSrc', () => {

  it('should be true, case insensitive', () => {
    const publicPath = '/BuIlD/';
    const loaderFileName = 'app.js';
    const scriptSrc = '/buIld/apP.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, w/out starting slash', () => {
    const publicPath = 'build/';
    const loaderFileName = 'app.js';
    const scriptSrc = 'build/app.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be true, w/ starting slash', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = '/build/app.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(true);
  });

  it('should be false, w/ file://', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = 'file:///build/app.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should be false, w/ https://', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = 'https://cdn.com/build/app.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should be false, w/ http://', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = 'http://cdn.com/build/app.js';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should do nothing for empty src', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = '';
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

  it('should do nothing for null src', () => {
    const publicPath = '/build/';
    const loaderFileName = 'app.js';
    const scriptSrc = null;
    const r = isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc);
    expect(r).toBe(false);
  });

});
