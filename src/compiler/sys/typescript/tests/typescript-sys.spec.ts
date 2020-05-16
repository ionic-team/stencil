import { getTypescriptPathFromUrl } from '../typescript-sys';

describe('getTypescriptPathFromUrl', () => {
  it('not typescript, return url', () => {
    const rootDir = '/some/path/';
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/something/index.js';
    const r = getTypescriptPathFromUrl(rootDir, tsExecutingUrl, url);
    expect(r).toBe('https://cdn.jsdelivr.net/npm/something/index.js');
  });

  it('ts path from url, version', () => {
    const rootDir = '/some/path/';
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/typescript@3.8.3/lib/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(rootDir, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/typescript/lib/lib.es2015.proxy.d.ts');
  });

  it('ts path from url, no version', () => {
    const rootDir = '/some/path/';
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/typescript/lib/typescript.js';
    const url = 'https://cdn.jsdelivr.net/npm/typescript/lib/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(rootDir, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/typescript/lib/lib.es2015.proxy.d.ts');
  });
});
