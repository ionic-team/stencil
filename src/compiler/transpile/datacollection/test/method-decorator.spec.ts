import { MEMBER_TYPE } from '../../../../util/constants';
import { getMethodDecoratorMeta } from '../method-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('method decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getMethodDecoratorMeta(checker, classNode);
    });

    expect(response).toEqual({
      create: {
        memberType: 6,
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          type: '(opts?: any) => any',
        }
      }
    });
  });

});
