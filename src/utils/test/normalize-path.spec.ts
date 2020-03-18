import { normalizePath } from '../normalize-path';

describe('normalizePath', () => {
  it('node module', () => {
    expect(normalizePath('lodash')).toBe('lodash');
    expect(normalizePath('   lodash    ')).toBe('lodash');
    expect(normalizePath('@angular/core')).toBe('@angular/core');
  });

  it('empty', () => {
    expect(normalizePath('')).toBe('.');
    expect(normalizePath('.')).toBe('.');
    expect(normalizePath('..')).toBe('..');
    expect(normalizePath('./')).toBe('.');
    expect(normalizePath('./././')).toBe('.');
  });

  it('relative ./ posix', () => {
    expect(normalizePath('./dir/basename.ext')).toBe('./dir/basename.ext');
    expect(normalizePath('./dir')).toBe('./dir');
  });

  it('relative ./ win32', () => {
    expect(normalizePath('.\\dir\\basename.ext')).toBe('./dir/basename.ext');
    expect(normalizePath('.\\dir')).toBe('./dir');
  });

  it('relative ../ posix', () => {
    expect(normalizePath('../dir/basename.ext')).toBe('../dir/basename.ext');
    expect(normalizePath('../../dir/basename.ext')).toBe('../../dir/basename.ext');
    expect(normalizePath('../dir1/dir2')).toBe('../dir1/dir2');
  });

  it('relative ../ win32', () => {
    expect(normalizePath('..\\dir\\basename.ext')).toBe('../dir/basename.ext');
    expect(normalizePath('..\\..\\dir\\basename.ext')).toBe('../../dir/basename.ext');
    expect(normalizePath('..\\dir1\\dir2')).toBe('../dir1/dir2');
  });

  it('absolute posix', () => {
    expect(normalizePath('/dir/basename.ext')).toBe('/dir/basename.ext');
    expect(normalizePath('/dir')).toBe('/dir');
    expect(normalizePath('/./dir')).toBe('/dir');
  });

  it('absolute win32', () => {
    expect(normalizePath('C:\\dir\\basename.ext')).toBe('C:/dir/basename.ext');
    expect(normalizePath('C:\\dir')).toBe('C:/dir');
  });

  it('non-ascii', () => {
    expect(normalizePath('/中文/basename.ext')).toBe('/中文/basename.ext');
    expect(normalizePath('C:\\中文\\basename.ext')).toBe('C:/中文/basename.ext');
  });

  it('remove trailing slash, windows', () => {
    const path = normalizePath(`C:\\Johnny\\B\\Goode\\`);
    expect(path).toBe(`C:/Johnny/B/Goode`);
  });

  it('normalize file, windows', () => {
    const path = normalizePath(`C:\\Johnny\\B\\Goode.js`);
    expect(path).toBe(`C:/Johnny/B/Goode.js`);
  });

  it('not remove trailing slash for root dir, windows', () => {
    const path = normalizePath(`C:\\`);
    expect(path).toBe(`C:/`);
  });

  it('not remove trailing slash for root dir, unix', () => {
    const path = normalizePath(`/`);
    expect(path).toBe(`/`);
  });

  it('remove trailing slash, unix', () => {
    const path = normalizePath(`/Johnny/B/Goode/`);
    expect(path).toBe(`/Johnny/B/Goode`);
  });

  it('normalize file, unix', () => {
    const path = normalizePath(`/Johnny/B/Goode.js`);
    expect(path).toBe(`/Johnny/B/Goode.js`);
  });

  it('normalize file with spaces to trim', () => {
    const path = normalizePath(`    /Johnny/B/Goode.js    `);
    expect(path).toBe(`/Johnny/B/Goode.js`);
  });

  it('throw error when invalid string', () => {
    expect(() => {
      const path = normalizePath(null);
      expect(path).toBe(`/Johnny/B/Goode.js`);
    }).toThrow();
  });
});
