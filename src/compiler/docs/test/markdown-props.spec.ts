import { PropRow } from '../markdown-props';
import { PROP_TYPE } from '../../../util/constants';
import { JsDoc } from '../../../declarations';


describe('markdown props', () => {

  it('advanced union types', () => {
    const row = new PropRow('name', {
      attribType: {
        text: `(AlertButton | string)[]`,
        optional: false
      },
      jsdoc: {
        type: '(AlertButton | string)[]'
      } as JsDoc
    });

    expect(row.type).toBe('`(AlertButton | string)[]`');
  });

  it('description', () => {
    const row = new PropRow('name', {
      propType: PROP_TYPE.String,
      jsdoc: {
        documentation: 'Description',
        tags: [],
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
