const nodeSys = require('../../../sys/node/index.js');


describe('test/sys/node', () => {
  let sys;

  beforeAll(() => {
    sys = new nodeSys.NodeSystem();
    sys.initWorkers(2, 1);
  });

  afterAll(() => {
    sys.destroy();
  });


  it('autoprefixCss', () => {
    const input = {
      css: `
        div {
          flex: 1;
        }
      `
    };
    return sys.optimizeCss(input).then(output => {
      expect(output.css).toContain('-ms-flex: 1');
      expect(output.css).toContain('flex: 1');
    });
  });

  it('minifyCss', () => {
    const input = {
      minify: true,
      css: `
        /** comment **/
        body {
          color: #FF0000;
        }
      `
    };

    return sys.optimizeCss(input).then(output => {
      expect(output.css).toBe(`body{color:red}`);
    });
  });

  it('minifyJs, es5 input, to default', () => {
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

  it('minifyJs, es class input, to default', () => {
    const input = `
      /** plz minify me **/
      class MyEs6Class {
        constructor() {
          // plz remove
          console.log('88 mph');
        }
      }
    `;

    return sys.minifyJs(input).then(results => {
      expect(results.output).toBe(`class MyEs6Class{constructor(){console.log("88 mph")}}`);
    });
  });

  it('minifyJs, es class input, to es5 (wasnt transpiled beforehand, dont worry)', () => {
    const opts = {
      ecma: 5,
      output: {
        ecma: 5,
        beautify: false
      },
      compress: {
        ecma: 5,
        arrows: false,
        passes: 2
      },
      mangle: true
    };

    const input = `
      /** plz minify me **/
      class MyEs6Class {
        constructor() {
          // plz remove
          console.log('88 mph');
        }
      }
    `;

    return sys.minifyJs(input).then(results => {
      expect(results.output).toBe(`class MyEs6Class{constructor(){console.log("88 mph")}}`);
    });
  });

  it('minifyJs, minifying const variable with inline parameter', () => {
    const opts = {
      ecma: 5,
      output: {
        ecma: 5,
        beautify: false
      },
      compress: {
        ecma: 5,
        arrows: false,
        passes: 2
      },
      mangle: true
    };

    const input = `
      (function() {
        function inlinedFunction(data) {
            return data[data[0]];
        }
        function testMinify() {
            if (true) {
                const data = inlinedFunction([1, 2, 3]);
                console.log(data);
            }
        }
        return testMinify();
      })();
    `;

    return sys.minifyJs(input, opts).then(results => {
      expect(results.output).toBe(`!function(){{const n=function(n){return n[n[0]]}([1,2,3]);console.log(n)}}();`);
    });
  });

  it('scopeCss', () => {
    const cssText = `::slotted(*) {}`;
    const scopeAttribute = `sc-ion-tag`;
    const hostScopeAttr = `sc-ion-tag-h`;
    const slotScopeAttr = `sc-ion-tag-s`;

    return sys.scopeCss(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr).then(scopeCss => {
      expect(scopeCss).toBe(`/*!@::slotted(*)*/.sc-ion-tag-s > * {}`);
    });
  });

});
