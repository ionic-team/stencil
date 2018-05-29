const nodeSys = require('../../../sys/node/index.js');


describe('test/sys/node', () => {
  let sys;

  beforeAll(() => {
    sys = new nodeSys.NodeSystem(2);
  });

  afterAll(() => {
    sys.destroy();
  });


  it('autoprefixCss', () => {
    const input = `
      div {
        flex: 1;
      }
    `;
    return sys.autoprefixCss(input).then(output => {
      expect(output).toContain('-webkit-box-flex: 1');
      expect(output).toContain('-ms-flex: 1');
      expect(output).toContain('flex: 1');
    });
  });

  it('gzipSize', () => {
    return sys.gzipSize('88888888888888888888888888888888888888888888888888').then(size => {
      expect(size).toBe(24);
    });
  });

  it('minifyCss', () => {
    const input = `
      /** comment **/
      body {
        color: #FF0000;
      }
    `;

    return sys.minifyCss(input).then(results => {
      expect(results.output).toBe(`body{color:red}`);
    });
  });

  it('minifyJs', () => {
    const input = `
      /** plz minify me **/
      (function($$WINDOW$$) {
        // be gone with you!!!
        /****/$$WINDOW$$.test      =      'yup'   ;;;;;;;;;;
      })(window)
    `;

    return sys.minifyJs(input).then(results => {
      expect(results.output).toBe(`window.test="yup";`);
    });
  });

  it('scopeCss', () => {
    const cssText = `::slotted(*) {}`;
    const scopeAttribute = `data-ion-tag`;
    const hostScopeAttr = `data-ion-tag-host`;
    const slotScopeAttr = `data-ion-tag-slot`;

    return sys.scopeCss(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr).then(scopeCss => {
      expect(scopeCss).toBe(`[data-ion-tag-slot] > * {}`);
    });
  });

});
