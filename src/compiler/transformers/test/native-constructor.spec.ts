import * as d from '@stencil/core/declarations';
import { mockCompilerCtx } from '@stencil/core/testing';

import { nativeComponentTransform } from '../component-native/tranform-to-native-component';
import { transpileModule } from './transpile';

describe('nativeComponentTransform', () => {
  let compilerCtx: d.CompilerCtx;
  let transformOpts: d.TransformOptions;

  beforeEach(() => {
    compilerCtx = mockCompilerCtx();
    transformOpts = {
      coreImportPath: '@stencil/core',
      componentExport: 'customelement',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
      styleImportData: undefined,
    };
  });

  describe('updateNativeComponentClass', () => {
    it("adds __attachShadow() calls when a component doesn't have a constructor", () => {
      const code = `
          @Component({
            tag: 'cmp-a',
            shadow: true,
          })
          export class CmpA {
            @Prop() foo: number;
          }
        `;

      const transformer = nativeComponentTransform(compilerCtx, transformOpts);

      const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);

      expect(transpiledModule.outputText).toContain(
        `import { defineCustomElement as __stencil_defineCustomElement, HTMLElement } from "@stencil/core";`,
      );
      expect(transpiledModule.outputText).toContain(`this.__attachShadow()`);
    });

    it('adds __attachShadow() calls when a component has a constructor', () => {
      const code = `
          @Component({
            tag: 'cmp-a',
            shadow: true,
          })
          export class CmpA {
            @Prop() foo: number;

            constructor() {
              super();
            }
          }
        `;

      const transformer = nativeComponentTransform(compilerCtx, transformOpts);

      const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);

      expect(transpiledModule.outputText).toContain(
        `import { defineCustomElement as __stencil_defineCustomElement, HTMLElement } from "@stencil/core";`,
      );
      expect(transpiledModule.outputText).toContain(`this.__attachShadow()`);
    });

    it('adds a getter for an @Element() reference', () => {
      const code = `
        @Component({
          tag: 'cmp-a'
        })
        export class CmpA {
          @Element() el: HtmlElement;
        }
      `;

      const transformer = nativeComponentTransform(compilerCtx, transformOpts);

      const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);

      expect(transpiledModule.outputText).toContain(`get el() { return this; }`);
      expect(transpiledModule.outputText).not.toContain(`el;`);
    });
  });
});
