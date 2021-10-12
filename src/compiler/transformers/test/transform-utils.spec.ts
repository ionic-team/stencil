import { mapJSDocTagInfo } from '../transform-utils';

describe('transform utils', () => {
  it('flattens TypeScript JSDocTagInfo to Stencil JSDocTagInfo', () => {
    const tags = [
      {
        name: 'param',
        text: [
          { kind: 'text', text: 'foo' },
          { kind: 'space', text: ' ' },
          { kind: 'text', text: 'the first parameter' },
        ],
      },
      {
        name: 'param',
        text: [
          { kind: 'text', text: 'bar' },
          { kind: 'space', text: ' ' },
          { kind: 'text', text: 'the second parameter' },
        ],
      },
    ];

    expect(mapJSDocTagInfo(tags)).toEqual([
      { name: 'param', text: 'foo the first parameter' },
      { name: 'param', text: 'bar the second parameter' },
    ]);
  });
});
