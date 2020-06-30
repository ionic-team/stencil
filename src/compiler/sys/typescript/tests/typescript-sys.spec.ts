import * as d from '../../../../declarations';
import { createSystem } from '../../../../compiler/sys/stencil-sys';
import { getTypescriptPathFromUrl } from '../typescript-sys';

describe('getTypescriptPathFromUrl', () => {
  const config: d.Config = {
    rootDir: '/some/path/',
    sys: createSystem(),
  };

  it('not typescript, return url', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/something/index.js';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('https://cdn.jsdelivr.net/npm/something/index.js');
  });

  it('ts path from url, version', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/typescript/lib/lib.es2015.proxy.d.ts');
  });

  it('ts path from url, no version', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/typescript/lib/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/typescript/lib/lib.es2015.proxy.d.ts');
  });
});
