import { mockCompilerCtx } from '@stencil/core/testing';
import { ScriptTarget } from 'typescript';

import type * as d from '../../../declarations';
import { lazyComponentTransform } from '../component-lazy/transform-lazy-component';
import { transpileModule } from './transpile';
import { c, formatCode } from './utils';

describe('lazy-component', () => {
  it('add registerInstance() to constructor w/ decorator on class', () => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
      styleImportData: null,
    };

    const code = `
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {
        @format something = '12';
      }
    `;

    const transformer = lazyComponentTransform(compilerCtx, transformOpts);

    const t = transpileModule(code, null, compilerCtx, [], [transformer], []);

    expect(t.outputText).toContain(`import { registerInstance as __stencil_registerInstance } from "@stencil/core"`);
    expect(t.outputText).toContain(`__stencil_registerInstance(this, hostRef)`);
  });

  it('adds a getter for an @Element() reference', () => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
      styleImportData: null,
    };

    const code = `
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {
        @Element() el: HtmlElement;
      }
    `;

    const transformer = lazyComponentTransform(compilerCtx, transformOpts);

    const t = transpileModule(code, null, compilerCtx, [], [transformer]);

    expect(t.outputText).toContain(`get el() { return __stencil_getElement(this); } };`);
    expect(t.outputText).not.toContain(`el;`);
  });

  it('adds an `attachInternals` call with a `@AttachInternals` decoration', async () => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
      styleImportData: null,
    };

    const code = `
      @Component({
        tag: 'cmp-a',
        formAssociated: true
      })
      export class CmpA {
        @AttachInternals() internals: ElementInternals;
      }
    `;

    const transformer = lazyComponentTransform(compilerCtx, transformOpts);
    const t = transpileModule(code, null, compilerCtx, [], [transformer]);

    expect(await formatCode(t.outputText)).toBe(
      await c`import { registerInstance as __stencil_registerInstance } from "@stencil/core";
      export const CmpA = class {
        constructor (hostRef) {
          __stencil_registerInstance(this, hostRef);
          if (hostRef.$hostElement$["s-ei"]) {
            this.internals = hostRef.$hostElement$["s-ei"];
          } else {
            this.internals = hostRef.$hostElement$.attachInternals();
            hostRef.$hostElement$["s-ei"] = this.internals;
          }
        }
        static get formAssociated() {
          return true;
        }
      }`,
    );
  });

  it('adds constructor statements appropriately for `@Prop` decorators', async () => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
      styleImportData: null,
    };

    const code = `
      const anotherProp = 'dynamic-string'
      @Component({
        tag: 'cmp-a',
      })
      export class CmpA {
        @Prop() aProp = 'prop';
        @Prop() [anotherProp] = 'prop 2';
        @State() aState = 'state';
        #aPrivateField = 'private';
      }
    `;

    const transformer = lazyComponentTransform(compilerCtx, transformOpts);
    const t2022 = transpileModule(code, null, compilerCtx, [], [transformer], [], {
      target: ScriptTarget.ES2022,
    });

    expect(await formatCode(t2022.outputText)).toContain(
      await c`import { registerInstance as __stencil_registerInstance } from '@stencil/core';
    const anotherProp = 'dynamic-string';  
    export const CmpA = class {
      constructor(hostRef) {
        __stencil_registerInstance(this, hostRef);
        this.aProp = hostRef.$instanceValues$.has('aProp') ? hostRef.$instanceValues$.get('aProp') : 'prop';
        this[anotherProp] = hostRef.$instanceValues$.has('dynamic-string') ? hostRef.$instanceValues$.get('dynamic-string') : 'prop 2';
      }
      aProp = 'prop';
      [anotherProp] = 'prop 2';
      aState = 'state';
      #aPrivateField = 'private';
    }`,
    );

    const t2017 = transpileModule(code, null, compilerCtx, [], [transformer], [], {
      target: ScriptTarget.ES2017,
    });

    expect(await formatCode(t2017.outputText)).toContain(
      await c`import { registerInstance as __stencil_registerInstance } from '@stencil/core';
    var _CmpA_aPrivateField, _a;
    const anotherProp = 'dynamic-string';
    export const CmpA = class {
      constructor(hostRef) {
        __stencil_registerInstance(this, hostRef);
        this.aProp = 'prop';
        this[_a] = 'prop 2';
        this.aState = 'state';
        _CmpA_aPrivateField.set(this, 'private');
      }
    };
    (_CmpA_aPrivateField = new WeakMap()), (_a = anotherProp);`,
    );
  });

  describe('styling', () => {
    function verifyStylingUsingComponent(inputComponent: string, expectedOutput: string) {
      return async () => {
        const compilerCtx = mockCompilerCtx();
        const transformOpts: d.TransformOptions = {
          coreImportPath: '@stencil/core',
          componentExport: 'lazy',
          componentMetadata: null,
          currentDirectory: '/',
          proxy: null,
          style: 'static',
          styleImportData: null,
        };

        const transformer = lazyComponentTransform(compilerCtx, transformOpts);
        const t = transpileModule(inputComponent, null, compilerCtx, [], [transformer]);
        expect(await formatCode(t.outputText)).toBe(await formatCode(expectedOutput));
      };
    }

    // eslint-disable-next-line jest/expect-expect
    it(
      'using `styleUrl` parameter',
      verifyStylingUsingComponent(
        `
        @Component({
          tag: 'cmp-a',
          styleUrl: 'cmp-a.css'
        })
        export class CmpA {}
      `,
        `
        import { registerInstance as __stencil_registerInstance } from "@stencil/core";
        import CmpAStyle0 from './cmp-a.css';
        export const CmpA = class {
          constructor (hostRef) {
            __stencil_registerInstance(this, hostRef);
          }
        };
        CmpA.style = CmpAStyle0;
      `,
      ),
    );

    // eslint-disable-next-line jest/expect-expect
    it(
      'using `styleUrls` parameter as object',
      verifyStylingUsingComponent(
        `
        @Component({
          tag: 'cmp-a',
          styleUrls: {
            foo: 'cmp-a.foo.css',
            bar: 'cmp-a.bar.css',
          }
        })
        export class CmpA {}
      `,
        `
        import { registerInstance as __stencil_registerInstance } from "@stencil/core";
        import CmpABarStyle0 from './cmp-a.bar.css';
        import CmpAFooStyle0 from './cmp-a.foo.css';
        export const CmpA = class {
          constructor (hostRef) {
            __stencil_registerInstance(this, hostRef);
          }
        };
        CmpA.style = { bar: CmpABarStyle0, foo: CmpAFooStyle0 };
      `,
      ),
    );

    // eslint-disable-next-line jest/expect-expect
    it(
      'using `styleUrls` parameter as array',
      verifyStylingUsingComponent(
        `
        @Component({
          tag: 'cmp-a',
          styleUrls: ['cmp-a.foo.css', 'cmp-a.bar.css', 'cmp-a.foo.css'],
        })
        export class CmpA {}
      `,
        `
        import { registerInstance as __stencil_registerInstance } from "@stencil/core";
        import CmpAStyle0 from './cmp-a.bar.css';
        import CmpAStyle1 from './cmp-a.foo.css';
        export const CmpA = class {
          constructor (hostRef) {
            __stencil_registerInstance(this, hostRef);
          }
        };
        CmpA.style = CmpAStyle0 + CmpAStyle1;
      `,
      ),
    );
  });
});
