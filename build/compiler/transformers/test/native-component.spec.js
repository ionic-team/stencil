import { mockCompilerCtx } from '@stencil/core/testing';
import { nativeComponentTransform } from '../component-native/tranform-to-native-component';
import { transpileModule } from './transpile';
import { c, formatCode } from './utils';
describe('nativeComponentTransform', () => {
    let compilerCtx;
    let transformOpts;
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
    it('outputs a component extending HTMLElement', async () => {
        const code = `
    @Component({
      tag: 'cmp-a',
    })
    export class CmpA {
    }
    `;
        const transformer = nativeComponentTransform(compilerCtx, transformOpts);
        const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);
        expect(await formatCode(transpiledModule.outputText)).toBe(await c `import { HTMLElement } from "@stencil/core";
        const CmpA = class extends HTMLElement {
          static get is() {
            return 'cmp-a';
          }
        };
        customElements.define("cmp-a", CmpA);`);
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
            expect(transpiledModule.outputText).toContain(`import { defineCustomElement as __stencil_defineCustomElement, HTMLElement } from "@stencil/core";`);
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
            expect(transpiledModule.outputText).toContain(`import { defineCustomElement as __stencil_defineCustomElement, HTMLElement } from "@stencil/core";`);
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
    describe('updateNativeConstructor', () => {
        it('adds a getter for formAssociated', async () => {
            const code = `
        @Component({
          tag: 'cmp-a', formAssociated: true
        })
        export class CmpA {
        }
      `;
            const transformer = nativeComponentTransform(compilerCtx, transformOpts);
            const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);
            await formatCode(transpiledModule.outputText);
            expect(await formatCode(transpiledModule.outputText)).toContain(await c `const CmpA = class extends HTMLElement {
          constructor() {
            super();
            this.__registerHost();
          }
          static get formAssociated() {
            return true;
          }
        }`);
        });
        it('adds a binding for @AttachInternals', async () => {
            const code = `
        @Component({
          tag: 'cmp-a', formAssociated: true
        })
        export class CmpA {
          @AttachInternals() internals;
        }
      `;
            const transformer = nativeComponentTransform(compilerCtx, transformOpts);
            const transpiledModule = transpileModule(code, null, compilerCtx, [], [transformer]);
            expect(await formatCode(transpiledModule.outputText)).toContain(await c `const CmpA = class extends HTMLElement {
          constructor() {
            super();
            this.__registerHost();
            this.internals = this.attachInternals();
          }
          static get formAssociated() {
            return true;
          }
        };`);
        });
    });
});
//# sourceMappingURL=native-component.spec.js.map