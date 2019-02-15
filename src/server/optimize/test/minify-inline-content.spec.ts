import { canMinifyInlineScript, canMinifyInlineStyle } from '../minify-inline-content';
import { mockDocument } from '../../../testing/mocks';


describe('canMinifyInlineStyle', () => {
  let styleElm: HTMLStyleElement;
  beforeEach(() => {
    const doc = mockDocument();
    styleElm = doc.createElement('style');
  });

  it('minify when it has a multiple spaces in content', () => {
    styleElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('minify when it has a /* in content', () => {
    styleElm.innerHTML = '/* minify plz */';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('minify when it has a tab in content', () => {
    styleElm.innerHTML = 'body { \t color: red; }';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('cannot minify when no content', () => {
    styleElm.innerHTML = '';
    expect(canMinifyInlineStyle(styleElm)).toBe(false);

    styleElm.innerHTML = '               ';
    expect(canMinifyInlineStyle(styleElm)).toBe(false);

    styleElm.innerHTML = null;
    expect(canMinifyInlineStyle(styleElm)).toBe(false);
  });

});


describe('canMinifyInlineScript', () => {
  let scriptElm: HTMLScriptElement;
  beforeEach(() => {
    const doc = mockDocument();
    scriptElm = doc.createElement('script');
  });

  it('do minify when it has an unknown script type', () => {
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
    scriptElm.setAttribute('type', '');
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/ecmascript"', () => {
    scriptElm.setAttribute('type', 'application/ecmascript');
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/javascript"', () => {
    scriptElm.setAttribute('type', 'application/javascript');
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a multiple spaces in content', () => {
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a tab in content', () => {
    scriptElm.innerHTML = 'function minifyPlz(){\tconsole.log("hi");}';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('cannot minify when no content', () => {
    scriptElm.innerHTML = '';
    expect(canMinifyInlineScript(scriptElm)).toBe(false);

    scriptElm.innerHTML = '               ';
    expect(canMinifyInlineScript(scriptElm)).toBe(false);

    scriptElm.innerHTML = null;
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

  it('cannot minify when it has a "src" attr', () => {
    scriptElm.setAttribute('src', '/external.js');
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

});
