import { canMinifyInlineScript, canMinifyInlineStyle } from '../minify-inline-content';
import { mockElement } from '../../../testing/mocks';


describe('canMinifyInlineStyle', () => {

  it('minify when it has a multiple spaces in content', () => {
    const styleElm = mockElement('style') as HTMLStyleElement;
    styleElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('minify when it has a /* in content', () => {
    const styleElm = mockElement('style') as HTMLStyleElement;
    styleElm.innerHTML = '/* minify plz */';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('minify when it has a tab in content', () => {
    const styleElm = mockElement('style') as HTMLStyleElement;
    styleElm.innerHTML = '\t body { color: red; }\t';
    expect(canMinifyInlineStyle(styleElm)).toBe(true);
  });

  it('cannot minify when no content', () => {
    const styleElm = mockElement('style') as HTMLStyleElement;
    styleElm.innerHTML = '';
    expect(canMinifyInlineStyle(styleElm)).toBe(false);

    styleElm.innerHTML = '               ';
    expect(canMinifyInlineStyle(styleElm)).toBe(false);

    styleElm.innerHTML = null;
    expect(canMinifyInlineStyle(styleElm)).toBe(false);
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
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/ecmascript"', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', 'application/ecmascript');
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has type="application/javascript"', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('type', 'application/javascript');
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a multiple spaces in content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = ' function minifyPlz(){   } ';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('minify when it has a tab in content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = '\tfunction minifyPlz(){}\t';
    expect(canMinifyInlineScript(scriptElm)).toBe(true);
  });

  it('cannot minify when no content', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.innerHTML = '';
    expect(canMinifyInlineScript(scriptElm)).toBe(false);

    scriptElm.innerHTML = '               ';
    expect(canMinifyInlineScript(scriptElm)).toBe(false);

    scriptElm.innerHTML = null;
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

  it('cannot minify when it has a "src" attr', () => {
    const scriptElm = mockElement('script') as HTMLScriptElement;
    scriptElm.setAttribute('src', '/external.js');
    expect(canMinifyInlineScript(scriptElm)).toBe(false);
  });

});
