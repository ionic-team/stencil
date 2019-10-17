import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import { join } from 'path';

const alias = new Map([
  ['@app-data', '@stencil/core/internal/app-data'],
  ['@mock-doc', '@stencil/core/mock-doc'],
  ['@platform', '@stencil/core/internal/platform'],
  ['@runtime', '@stencil/core/internal/runtime'],
  ['@testing', '@stencil/core/testing'],
]);

export function aliasPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'aliasPlugin',
    resolveId(id) {
      const externalId = alias.get(id);
      if (externalId) {
        return {
          id: externalId,
          external: true,
        };
      }
      if (id === '@utils') {
        return join(opts.transpiledDir, 'utils', 'index.js');
      }
      return null;
    }
  }
}
