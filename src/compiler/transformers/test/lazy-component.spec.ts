import { mockCompilerCtx } from '@stencil/core/testing';

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

    const t = transpileModule(code, null, compilerCtx, [], [transformer]);

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

  it('allows to define multiple styleUrls', async () => {
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
        styleUrls: ['./foo/bar.css', './bar/foo.css'],
        tag: 'cmp-a'
      })
      export class CmpA {}
    `;
    const transformer = lazyComponentTransform(compilerCtx, transformOpts);
    const t = transpileModule(code, null, compilerCtx, [], [transformer]);
    expect(await formatCode(t.outputText)).toBe(
      await c`import { registerInstance as __stencil_registerInstance } from "@stencil/core";
      import _FooBarCssStyle from './foo/bar.css';
      import _BarFooCssStyle from './bar/foo.css';
      export const CmpA = class {
        constructor(hostRef) {
          __stencil_registerInstance(this, hostRef);
        }
      }
      CmpA.style = _FooBarCssStyle + _BarFooCssStyle;`,
    );
  });

  it('allows to define multiple styleUrls in CJS', async () => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      module: 'cjs',
      style: 'static',
      styleImportData: null,
    };
    const code = `
      @Component({
        styleUrls: ['./foo/bar.css', './bar/foo.css'],
        tag: 'cmp-a'
      })
      export class CmpA {}
    `;
    const transformer = lazyComponentTransform(compilerCtx, transformOpts);
    const t = transpileModule(code, null, compilerCtx, [], [transformer]);
    expect(await formatCode(t.outputText)).toBe(
      await c`const _FooBarCssStyle = require('./foo/bar.css');
      const _BarFooCssStyle = require('./bar/foo.css');
      const { registerInstance: __stencil_registerInstance } = require('@stencil/core');
      export class CmpA {
        constructor(hostRef) {
          __stencil_registerInstance(this, hostRef);
        }
      };
      CmpA.style = _FooBarCssStyle + _BarFooCssStyle;`,
    );
  });

  it('allows to define multiple platform styles', async () => {
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
        styleUrls: {
          foo: './foo/bar.css',
          bar: './bar/foo.css'
        },
        tag: 'cmp-a'
      })
      export class CmpA {}
    `;
    const transformer = lazyComponentTransform(compilerCtx, transformOpts);
    const t = transpileModule(code, null, compilerCtx, [], [transformer]);
    expect(await formatCode(t.outputText)).toBe(
      await c`import { registerInstance as __stencil_registerInstance } from "@stencil/core";
      import _BarFooCssStyle from './bar/foo.css';
      import _FooBarCssStyle from './foo/bar.css';
      export const CmpA = class {
        constructor(hostRef) {
          __stencil_registerInstance(this, hostRef);
        }
      }
      CmpA.style = { bar: _BarFooCssStyle, foo: _FooBarCssStyle }`,
    );
  });
});
