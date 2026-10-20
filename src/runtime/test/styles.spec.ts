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
});
