import { usePolyfills } from '../loader';


describe('usePolyfills', () => {

  let win: any;
  let scriptElm: any;
  let dynamicImportTest: string;

  beforeEach(() => {
    win = {
      customElements: {},
      fetch: {},
      CSS: {
        supports: () => true
      },
      location: {
        protocol: 'http',
        search: ''
      }
    };

    scriptElm = {
      noModule: {}
    };

    dynamicImportTest = '/* mock supports import() */';
  });


  it('supports latest and greatest', () => {
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeFalsy();
  });

  it('polyfill cuz force es5', () => {
    win.location.search = '?core=es5';
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz force es2015', () => {
    win.location.search = '?core=es2015';
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeFalsy();
  });

  it('polyfill cuz file: protocol', () => {
    win.location.protocol = 'file:';
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no customElements support', () => {
    delete win.customElements;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no fetch support', () => {
    delete win.fetch;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no window.CSS', () => {
    delete win.CSS;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no window.CSS.supports', () => {
    delete win.CSS.supports;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no window.CSS.supports() css vars', () => {
    win.CSS.supports = () => false;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz no noModule in scriptElm', () => {
    delete scriptElm.noModule;
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

  it('polyfill cuz does not support dynamic import()', () => {
    dynamicImportTest = 'mockNoImportSupport()"';
    expect(usePolyfills(win, win.location, scriptElm, dynamicImportTest)).toBeTruthy();
  });

});
