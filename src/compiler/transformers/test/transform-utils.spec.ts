import { mapJSDocTagInfo } from '../transform-utils';

describe('transform utils', () => {
  it('flattens TypeScript JSDocTagInfo to Stencil JSDocTagInfo', () => {
    // tags corresponds to the following JSDoc
    /*
     * @param foo the first parameter
     * @param bar
     * @returns
     * @see {@link https://example.com}
     */
    const tags = [
      {
        name: 'param',
        text: [
          { text: 'foo', kind: 'parameterName' },
          { text: ' ', kind: 'space' },
          { text: 'the first parameter', kind: 'text' },
        ],
      },
      { name: 'param', text: [{ text: 'bar', kind: 'text' }] },
      { name: 'returns', text: undefined },
      {
        name: 'see',
        text: [
          { text: '', kind: 'text' },
          { text: '{@link ', kind: 'link' },
          { text: 'https://example.com', kind: 'linkText' },
          { text: '}', kind: 'link' },
        ],
      },
    ];

    expect(mapJSDocTagInfo(tags)).toEqual([
      { name: 'param', text: 'foo the first parameter' },
      { name: 'param', text: 'bar' },
      { name: 'returns', text: undefined },
      { name: 'see', text: '{@link https://example.com}' },
    ]);
  });
});
