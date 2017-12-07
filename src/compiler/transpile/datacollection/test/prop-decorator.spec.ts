import { MEMBER_TYPE } from '../../../../util/constants';
import { getPropDecoratorMeta } from '../prop-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('props decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/prop-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
      response = getPropDecoratorMeta(checker, classNode, sourceFile, diagnostics);
    });

    expect(response).toEqual({
      objectAnyThing: {
        attribName: 'objectAnyThing',
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
        propType: 1
      }
    });
  });

});
