import { updateStencilTypesImports } from '../stencil-types';
import { mockConfig } from '../../../testing/mocks';
import * as path from 'path';
import { normalizePath } from '../../util';


describe('stencil-types', () => {
  const config = mockConfig();
  const root = path.resolve('/');
  const typesDir = normalizePath(path.join(root, 'my-app', 'dist', 'types'));
  const dtsFilePath = normalizePath(path.join(root, 'my-app', 'dist', 'types', 'components', 'badge', 'badge.d.ts'));

  it('should add both local side-effect import and exact stencil types', () => {
    const input = `
    import { EventEmitter, QueueApi } from '@stencil/core';
    export declare class Badge {
      render(): JSX.Element;
    }
    `;
    const output = updateStencilTypesImports(config, typesDir, dtsFilePath, input);
    expect(output).toContain(`import { EventEmitter, QueueApi } from '../../stencil.core'`);
    expect(output).toContain(`import '../../stencil.core'`);
  });

  it('should add local import for exact stencil types with JSX in dts file', () => {
    const input = `
    import { EventEmitter, QueueApi } from '@stencil/core';
    export declare class Badge {}
    `;
    const output = updateStencilTypesImports(config, typesDir, dtsFilePath, input);
    expect(output).toContain(`import { EventEmitter, QueueApi } from '../../stencil.core'`);
    expect(output).not.toContain(`import '../../stencil.core'`);
  });

  it('should add local side-effect import for stencil types with JSX in dts file', () => {
    const input = `
    export declare class Badge {
      render(): JSX.Element;
    }
    `;
    const output = updateStencilTypesImports(config, typesDir, dtsFilePath, input);
    expect(output).toContain(`import '../../stencil.core'`);
  });

  it('should do nothing when no JSX or @stencil/core', () => {
    const input = `
    export declare class Badge {}
    `;
    const output = updateStencilTypesImports(config, typesDir, dtsFilePath, input);
    expect(input).toBe(output);
    expect(output).not.toContain(`import '../../stencil.core'`);
  });

});
