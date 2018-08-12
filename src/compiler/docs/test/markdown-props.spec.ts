import { PropRow } from '../markdown-props';
import { PROP_TYPE } from '../../../util/constants';


describe('markdown props', () => {

  it('advanced union types', () => {
    const row = new PropRow('name', {
      attribType: {
        text: `(AlertButton | string)[]`
      }
    });

    expect(row.type).toBe('`(AlertButton | string)[]`');
  });

  it('union types', () => {
    const row = new PropRow('name', {
      attribType: {
        text: `string | string[]`
      }
    });

    expect(row.type).toBe('`string`, `string[]`');
  });

  it('string union types', () => {
    const row = new PropRow('name', {
      attribType: {
        text: `'submit' | 'reset' | 'button'`
      }
    });

    expect(row.type).toBe('`"submit"`, `"reset"`, `"button"`');
  });

  it('any type', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.Any
    });

    expect(row.type).toBe('`any`');
  });

  it('string type', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.String
    });

    expect(row.type).toBe('`string`');
  });

  it('number type', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.Number
    });

    expect(row.type).toBe('`number`');
  });

  it('boolean type', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.Boolean
    });

    expect(row.type).toBe('`boolean`');
  });

  it('description', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.String,
      jsdoc: {
        documentation: 'Description',
        name: '',
        type: ''
      }
    });

    expect(row.propName).toBe('`name`');
    expect(row.description).toBe('Description');
  });

  it('no description', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.String
    });

    expect(row.propName).toBe('`name`');
    expect(row.description).toBe('');
  });

});
