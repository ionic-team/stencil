import { getHydratedFlagHead, getStencilInternalModule } from '../core-resolve-plugin';


describe('core resolve plugin', () => {
  const rootDir = '/';

  it('http localhost with port url path', () => {
    const compilerExe = 'http://localhost:3333/@stencil/core/compiler/stencil.js?v=1.2.3';
    const internalModule = 'hydrate';
    const m = getStencilInternalModule(rootDir, compilerExe, internalModule);
    expect(m).toBe('/node_modules/@stencil/core/internal/hydrate/index.mjs');
  });

  it('node path', () => {
    const compilerExe = '/Users/me/node_modules/stencil/compiler/stencil.js';
    const internalModule = 'client';
    const m = getStencilInternalModule(rootDir, compilerExe, internalModule);
    expect(m).toBe('/Users/me/node_modules/stencil/internal/client/index.mjs');
  });

  it('should not set initialValue', () => {
    const o = getHydratedFlagHead({
      name: 'yup',
      selector: 'class',
      property: 'display',
      initialValue: null,
      hydratedValue: 'block',
    });
    expect(o).toBe(`.yup{display:block}`);
  });

  it('should not set hydratedValue', () => {
    const o = getHydratedFlagHead({
      name: 'yup',
      selector: 'class',
      property: 'display',
      initialValue: 'none',
      hydratedValue: null,
    });
    expect(o).toBe(`{display:none}`);
  });

  it('should set class selector', () => {
    const o = getHydratedFlagHead({
      name: 'yup',
      selector: 'class',
      property: 'display',
      initialValue: 'none',
      hydratedValue: 'block',
    });
    expect(o).toBe(`{display:none}.yup{display:block}`);
  });

  it('should set attribute selector', () => {
    const o = getHydratedFlagHead({
      name: 'yup',
      selector: 'attribute',
      property: 'display',
      initialValue: 'none',
      hydratedValue: 'block',
    });
    expect(o).toBe(`{display:none}[yup]{display:block}`);
  });

});
