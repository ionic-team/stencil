import { generateJsDocMembers } from '../generate-json-doc'
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { ComponentMeta } from '../../../declarations';


describe('generateJsonDoc', () => {
  it('advanced union types', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          attribType: {
            text: `(AlertButton | string)[]`,
            optional: false
          },
          memberType: MEMBER_TYPE.Prop
        }
      }
    }
    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('(AlertButton | string)[]');
  });

  it('union types', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          attribType: {
            text: `string | string[]`,
            optional: false
          },
          memberType: MEMBER_TYPE.Prop
        }
      }
    }
    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('string, string[]');
  });
  it('string union types', () => {

    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          attribType: {
            text: `'submit' | 'reset' | 'button'`,
            optional: false
          },
          memberType: MEMBER_TYPE.Prop
        }
      }
    }
    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('"submit", "reset", "button"');
  });

  it('any type', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.Any,
          memberType: MEMBER_TYPE.Prop,
          attribType: {
            text: '',
            optional: false
          },
        }
      }
    }
    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('any');
  });

  it('string type', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.String,
          memberType: MEMBER_TYPE.Prop,
          attribType: {
            text: '',
            optional: false
          },
        }
      }
    }

    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('string');
  });

  it('number type', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.Number,
          memberType: MEMBER_TYPE.Prop,
          attribType: {
            text: '',
            optional: false
          },
        }
      }
    }

    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('number');
  });

  it('boolean type', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.Boolean,
          memberType: MEMBER_TYPE.Prop,
          attribType: {
            text: '',
            optional: false
          },
        }
      }
    }

    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].type).toBe('boolean');
  });

  it('optional attribute', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.Boolean,
          memberType: MEMBER_TYPE.Prop,
          attribType: {
            text: '',
            optional: true
          },
        }
      }
    }

    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].optional).toBe(true);
  });

  it('optional attribute', () => {
    const componentMeta: ComponentMeta = {
      membersMeta: {
        name1: {
          propType: PROP_TYPE.Boolean,
          memberType: MEMBER_TYPE.PropMutable,
          attribType: {
            text: '',
            optional: true
          },
        }
      }
    }

    const jsonCmp = { props: [] }
    generateJsDocMembers(componentMeta, jsonCmp)
    expect(jsonCmp.props[0].mutable).toBe(true);
  });
})
