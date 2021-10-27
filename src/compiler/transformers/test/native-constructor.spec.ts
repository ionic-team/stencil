import { mockCompilerCtx } from '@stencil/core/testing';
import * as d from '@stencil/core/declarations';
import { transpileModule } from './transpile';
import { nativeComponentTransform } from '../component-native/tranform-to-native-component';

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

      const transpiledModule = transpileModule(code, null, compilerCtx, null, [], [transformer]);

      expect(transpiledModule.outputText).toContain(
        `import { attachShadow as __stencil_attachShadow, defineCustomElement as __stencil_defineCustomElement } from "@stencil/core";`
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

      const transpiledModule = transpileModule(code, null, compilerCtx, null, [], [transformer]);

      expect(transpiledModule.outputText).toContain(
        `import { attachShadow as __stencil_attachShadow, defineCustomElement as __stencil_defineCustomElement } from "@stencil/core";`
      );
      expect(transpiledModule.outputText).toContain(`this.__attachShadow()`);
    });
  });
});
