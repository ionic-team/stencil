import { MEMBER_TYPE } from '../../../../util/constants';
import { getStateDecoratorMeta } from '../state-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('state decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/state-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getStateDecoratorMeta(null, classNode);
    });

    expect(response).toEqual({
      thing: {
        memberType: MEMBER_TYPE.State,
      }
    });
  });

});
