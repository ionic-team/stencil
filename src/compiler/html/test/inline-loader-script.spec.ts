import * as d from '../../../declarations';
import { canMinifyInlineScript } from '../minify-inline-scripts';
import { isLoaderScriptSrc, setDataResourcesUrlAttr } from '../inline-loader-script';
import { mockElement } from '../../../testing/mocks';
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


describe('canMinifyInlineScript', () => {

  it('do minify when it has an unknown script type', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', 'application/ld+json');
    scriptElm.innerHTML = `
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "url": "https://www.example.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://query.example.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    `;
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

  it('minify when it has type=""', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', '');
    scriptElm.innerHTML = ' /* minifyplz */ ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/ecmascript"', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', 'application/ecmascript');
    scriptElm.innerHTML = ' /* minifyplz */ ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/javascript"', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', 'application/javascript');
    scriptElm.innerHTML = ' /* minifyplz */ ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a comments in content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = ' /* minifyplz */ ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a multiple spaces in content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = '  ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a tab in content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = '\t';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('cannot minify when no content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = '';
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

  it('cannot minify when it has a "src" attr', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('src', '/external.js');
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

});
