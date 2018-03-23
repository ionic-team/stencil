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
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getMethodDecoratorMeta(config, checker, classNode);
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
