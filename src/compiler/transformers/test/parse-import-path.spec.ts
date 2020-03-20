import { parseImportPath, serializeImportPath } from '../stencil-import-path';

describe('stencil-import-path', () => {
  it('serialize/parse absolute, no data ext', () => {
    const s = serializeImportPath({
      importeePath: '/path/to/some-file.css',
      importerPath: '/path/to/some-file.js',
    });
    expect(s).toBe('./some-file.css');
    const p = parseImportPath(s);
    expect(p.importPath).toBe('./some-file.css');
    expect(p.basename).toBe('some-file.css');
    expect(p.ext).toBe('css');
    expect(p.data).toBe(null);
  });

  it('serialize/parse relative, tag, no ext', () => {
    const s = serializeImportPath({
      importeePath: './some-file',
      tag: 'my-tag',
    });
    expect(s).toBe('./some-file?tag=my-tag');
    const p = parseImportPath(s);
    expect(p.importPath).toBe('./some-file?tag=my-tag');
    expect(p.basename).toBe('some-file');
    expect(p.ext).toBe(null);
    expect(p.data.tag).toBe('my-tag');
  });

  it('serialize/parse relative, tag, css ext, no encapsulation, default mode', () => {
    const s = serializeImportPath({
      importeePath: './some-file.CSS',
      tag: 'my-tag',
      encapsulation: 'none',
      mode: '$',
    });
    expect(s).toBe('./some-file.CSS?tag=my-tag');
    const p = parseImportPath(s);
    expect(p.importPath).toBe('./some-file.CSS?tag=my-tag');
    expect(p.basename).toBe('some-file.CSS');
    expect(p.ext).toBe('css');
    expect(p.data.tag).toBe('my-tag');
    expect(p.data.encapsulation).toBe('none');
    expect(p.data.mode).toBe('$');
  });

  it('serialize/parse relative, tag, css ext, shadow encapsulation, mode', () => {
    const s = serializeImportPath({
      importeePath: './some-file.CSS',
      tag: 'my-tag',
      encapsulation: 'scoped',
      mode: 'ios',
    });
    expect(s).toBe('./some-file.CSS?tag=my-tag&mode=ios&encapsulation=scoped');
    const p = parseImportPath(s);
    expect(p.importPath).toBe('./some-file.CSS?tag=my-tag&mode=ios&encapsulation=scoped');
    expect(p.basename).toBe('some-file.CSS');
    expect(p.ext).toBe('css');
    expect(p.data.tag).toBe('my-tag');
    expect(p.data.encapsulation).toBe('scoped');
    expect(p.data.mode).toBe('ios');
  });

  it('serialize/parse dts ext', () => {
    const s = serializeImportPath({
      importeePath: './some-file.d.ts',
    });
    expect(s).toBe('./some-file.d.ts');
    const p = parseImportPath(s);
    expect(p.importPath).toBe('./some-file.d.ts');
    expect(p.basename).toBe('some-file.d.ts');
    expect(p.ext).toBe('d.ts');
    expect(p.data).toBe(null);
  });
});
