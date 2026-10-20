import { styles } from '@platform';

import { appendStyleSourceMap, registerStyle } from '../styles';

describe('style source maps', () => {
  afterEach(() => styles.delete('source-map-test'));

  it('retains the CSS source map when registering a non-constructable style', () => {
    registerStyle('source-map-test', '.button{color:red}', false, 'data:application/json;base64,AAAA');

    expect(styles.get('source-map-test')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */',
    );
  });

  it('adds a CSS source-map annotation to runtime style text', () => {
    expect(appendStyleSourceMap('.button{color:red}', 'data:application/json;base64,AAAA')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */',
    );
  });

  it('does not add an annotation when CSS source maps are disabled', () => {
    expect(appendStyleSourceMap('.button{color:red}', undefined)).toBe('.button{color:red}');
  });

  it('does not duplicate a source-map annotation during HMR updates', () => {
    const style = '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */';
    expect(appendStyleSourceMap(style, 'data:application/json;base64,BBBB')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,BBBB */',
    );
  });

  it('combines source maps for concatenated CSS styles into one index map', () => {
    const firstMap = JSON.stringify({ version: 3, sources: ['first.scss'], names: [], mappings: 'AAAA' });
    const secondMap = JSON.stringify({ version: 3, sources: ['second.scss'], names: [], mappings: 'AAAA' });
    const firstMapUrl = `data:application/json;base64,${Buffer.from(firstMap).toString('base64')}`;
    const secondMapUrl = `data:application/json;base64,${Buffer.from(secondMap).toString('base64')}`;

    const output = appendStyleSourceMap('abcde', [
      { map: firstMapUrl, length: 3 },
      { map: secondMapUrl, length: 2 },
    ]);
    const sourceMapUrl = output.match(/sourceMappingURL=(.*?) \*\//)?.[1];

    expect(sourceMapUrl).toContain('data:application/json,');
    const sourceMap = JSON.parse(decodeURIComponent(sourceMapUrl!.split(',')[1]));
    expect(sourceMap.sections).toEqual([
      expect.objectContaining({ offset: { line: 0, column: 0 } }),
      expect.objectContaining({ offset: { line: 0, column: 3 } }),
    ]);
  });
});
