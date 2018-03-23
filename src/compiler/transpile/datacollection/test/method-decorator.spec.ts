import { MEMBER_TYPE } from '../../../../util/constants';
import { gatherMetadata } from './test-utils';
import { getMethodDecoratorMeta } from '../method-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { mockConfig } from '../../../../testing/mocks';


describe('method decorator', () => {

  const config = mockConfig();

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta(config, checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: 6,
        attribType: {
          text: '(opts?: any) => any',
          typeReferences: {
            ActionSheet: {
              referenceLocation: 'global',
            },
            ActionSheetOptions: {
              referenceLocation: 'global',
            },
            Promise: {
              referenceLocation: 'global',
            }
          }
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          type: '(opts?: any) => any',
        }
      }
    });
  });

});
