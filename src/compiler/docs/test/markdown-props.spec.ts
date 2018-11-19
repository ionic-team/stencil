import { propsToMarkdown } from '../markdown-props';


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
        reflectToAttr: false
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
        reflectToAttr: false
      }
    ]).join('\n');
    expect(markdown).toEqual(`## Properties

| Property | Attribute | Description    | Type                | Default |
| -------- | --------- | -------------- | ------------------- | ------- |
| \`hello\`  | \`hello\`   | This is a prop | \`boolean \\| string\` | \`false\` |
| \`hello\`  | --        | This is a prop | \`boolean \\| string\` | \`false\` |

`);
  });
});
