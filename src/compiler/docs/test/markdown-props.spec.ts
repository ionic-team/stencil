import { propsToMarkdown } from '../../docs/readme/markdown-props';

describe('markdown props', () => {
  it('advanced union types', () => {
    const markdown = propsToMarkdown([
      {
        name: 'hello',
        attr: 'hello',
        docs: 'This is a prop',
        default: 'false',
        type: 'boolean | string',
        mutable: false,
        optional: false,
        required: false,
        reflectToAttr: false,
        docsTags: [],
        values: [],
      },
      {
        name: 'hello',
        attr: undefined,
        docs: 'This is a prop',
        default: 'false',
        type: 'boolean | string',
        mutable: false,
        optional: false,
        required: false,
        reflectToAttr: false,
        docsTags: [],
        values: [],
      },
    ]).join('\n');
    expect(markdown).toEqual(`## Properties

| Property           | Attribute          | Description    | Type                               | Default            |
| ------------------ | ------------------ | -------------- | ---------------------------------- | ------------------ |
| <code>hello</code> | <code>hello</code> | This is a prop | <code>boolean &#124; string</code> | <code>false</code> |
| <code>hello</code> | --                 | This is a prop | <code>boolean &#124; string</code> | <code>false</code> |

`);
  });
});
