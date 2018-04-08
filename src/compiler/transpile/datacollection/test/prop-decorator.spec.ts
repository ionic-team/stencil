import { gatherMetadata } from './test-utils';
import { getPropDecoratorMeta } from '../prop-decorator';
import { MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import * as path from 'path';


describe('props decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/prop-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
      response = getPropDecoratorMeta(diagnostics, checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      objectAnyThing: {
        attribName: 'object-any-thing',
        attribType: {
          text: '(_) => Promise<OtherThing>',
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
          type: '(_: any) => any',
        },
        memberType: 1,
        propType: PROP_TYPE.Unknown,
        reflectToAttr: false
      },
      size: {
        attribName: 'size',
        attribType: {
          text: 'string',
          typeReferences: {}
        },
        jsdoc: {
          documentation: '',
          name: 'size',
          type: 'string',
        },
        memberType: 1,
        propType: PROP_TYPE.String,
        reflectToAttr: false
      },
      withOptions: {
        attribName: 'my-custom-attr-name',
        attribType: {
          text: 'number',
        },
        jsdoc: {
          documentation: '',
          name: 'withOptions',
          type: 'number',
        },
        memberType: 1,
        propType: PROP_TYPE.Number,
        reflectToAttr: true
      },
    });
  });

});
