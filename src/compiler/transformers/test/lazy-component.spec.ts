import type * as d from '../../../declarations';
import { transpileModule } from './transpile';
import { lazyComponentTransform } from '../component-lazy/transform-lazy-component';
import { mockCompilerCtx } from '@stencil/core/testing';
import { getStencilCompilerContext, initializeStencilCompilerContext } from '@utils';

describe('lazy-component', () => {
  it('add registerInstance() to constructor w/ decorator on class', () => {
    initializeStencilCompilerContext({ compilerCtx: mockCompilerCtx() });

    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      styleImportData: null,
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

    const transformer = lazyComponentTransform(transformOpts);

    const t = transpileModule(code, null, getStencilCompilerContext(), null, [transformer]);

    expect(t.outputText).toContain(`import { registerInstance as __stencil_registerInstance } from "@stencil/core"`);
    expect(t.outputText).toContain(`__stencil_registerInstance(this, hostRef)`);
  });
});
