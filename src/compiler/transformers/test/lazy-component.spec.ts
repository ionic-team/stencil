import type * as d from '../../../declarations';
import { transpileModule } from './transpile';
import { lazyComponentTransform } from '../component-lazy/transform-lazy-component';
import { mockCompilerCtx } from '@stencil/core/testing';

describe('lazy-component', () => {
  let t: ReturnType<typeof transpileModule>;

  beforeEach(() => {
    const compilerCtx = mockCompilerCtx();
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: 'lazy',
      componentMetadata: null,
      currentDirectory: '/',
      proxy: null,
      style: 'static',
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

    t = transpileModule(code, null, compilerCtx, null, [], [transformer]);
  });

  it('add registerInstance() to constructor w/ decorator on class', () => {
    expect(t.outputText).toContain(`import { registerInstance as __stencil_registerInstance } from "@stencil/core"`);
    expect(t.outputText).toContain(`__stencil_registerInstance(this, hostRef)`);
  });

  it('has `static get is()` which returns correct component tag name', () => {
    expect(t.outputText).toContain(`static get is() { return "cmp-a"; }`);
  });
});
