import { getStencilInternalModule } from '../core-resolve-plugin';


describe('core resolve plugin', () => {

  it('https cdn url path', () => {
    const compilerExe = 'https://cdn.jsdelivr.net/npm/@stencil/core@1.2.0-0/compiler/stencil.js';
    const internalModule = 'runtime';
    const m = getStencilInternalModule(compilerExe, internalModule);
    expect(m).toBe('/node_modules/@stencil/core/internal/runtime/index.mjs');
  });

  it('http localhost with port url path', () => {
    const compilerExe = 'http://localhost:3333/@stencil/core/compiler/stencil.js?v=1.2.3';
    const internalModule = 'hydrate';
    const m = getStencilInternalModule(compilerExe, internalModule);
    expect(m).toBe('/node_modules/@stencil/core/internal/hydrate/index.mjs');
  });

  it('node path', () => {
    const compilerExe = '/Users/me/node_modules/stencil/compiler/stencil.js';
    const internalModule = 'client';
    const m = getStencilInternalModule(compilerExe, internalModule);
    expect(m).toBe('/Users/me/node_modules/stencil/internal/client/index.mjs');
  });

});
