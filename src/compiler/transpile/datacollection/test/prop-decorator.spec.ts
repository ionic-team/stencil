import { gatherMetadata } from './test-utils';
import { getPropDecoratorMeta } from '../prop-decorator';
import { MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import * as path from 'path';


describe('props decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/prop-example');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
      response = getPropDecoratorMeta(diagnostics, checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      objectAnyThing: {
        attribName: 'object-any-thing',
        attribType: {
          text: '(_) => Promise<OtherThing>',
          optional: false,
          typeReferences: {
            OtherThing: {
              importReferenceLocation: '../../../../../index',
              referenceLocation: 'import',
            },
            Promise: {
              referenceLocation: 'global',
            },
          },
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'objectAnyThing',
          tags: [],
          type: '(_: any) => any',
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Unknown,
        reflectToAttrib: false
      },
      size: {
        attribName: 'size',
        attribType: {
          text: 'string',
          optional: false,
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'size',
          tags: [],
          type: 'string',
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String,
        reflectToAttrib: false
      },
      withOptions: {
        attribName: 'my-custom-attr-name',
        attribType: {
          text: 'number',
          optional: false,
        },
        jsdoc: {
          documentation: '',
          name: 'withOptions',
          tags: [],
          type: 'number',
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number,
        reflectToAttrib: true
      },
      width: {
        attribName: 'width',
        attribType: {
          text: 'number',
          optional: true,
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'width',
          tags: [],
          type: 'number',
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number,
        reflectToAttrib: false
      },
      setting: {
        attribName: 'setting',
        attribType: {
          text: `'auto' | 'manual'`,
          optional: true,
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'setting',
          tags: [],
          type: `"auto" | "manual"`,
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String,
        reflectToAttrib: false
      },
      values: {
        attribName: 'values',
        attribType: {
          text: `number | number[]`,
          optional: true,
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'values',
          tags: [],
          type: `number | {}`,
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number,
        reflectToAttrib: false
      },
      enabled: {
        attribName: 'enabled',
        attribType: {
          text: `boolean | string`,
          optional: true,
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'enabled',
          tags: [],
          type: `boolean | string`,
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Any,
        reflectToAttrib: false
      },
      color: {
        attribName: 'color',
        attribType: {
          text: `Color`,
          optional: true,
          typeReferences: {
            Color: {
              referenceLocation: 'global'
            }
          }
        },
        jsdoc: {
          documentation: '',
          name: 'color',
          tags: [],
          type: `"primary" | "secondary"`,
        },
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String,
        reflectToAttrib: false
      }
    });
  });

  it('proper types', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/prop-types');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
      response = getPropDecoratorMeta(diagnostics, checker, classNode, sourceFile, 'ClassName');
    });

    // check strings
    for (let i = 0; i < 14; i++) {
      expect(response[`text${i}`].propType).toEqual(PROP_TYPE.String);
    }

    // number
    for (let i = 0; i < 14; i++) {
      expect(response[`nu${i}`].propType).toEqual(PROP_TYPE.Number);
    }

    // boolean
    for (let i = 0; i < 7; i++) {
      expect(response[`bool${i}`].propType).toEqual(PROP_TYPE.Boolean);
    }

    // TODO: revisit any vs unknown
    // any
    for (let i = 0; i < 12; i++) {
      expect(response[`any${i}`].propType).toEqual(PROP_TYPE.Any);
    }

    // unknown
    for (let i = 0; i < 5; i++) {
      expect(response[`unknown${i}`].propType).toEqual(PROP_TYPE.Unknown);
    }
  });

});
