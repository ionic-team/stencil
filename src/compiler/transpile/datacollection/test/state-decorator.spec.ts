import { gatherMetadata } from './test-utils';
import { getStateDecoratorMeta } from '../state-decorator';
import { MEMBER_TYPE } from '@utils';
import * as path from 'path';


describe('state decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/state-example');
    gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getStateDecoratorMeta(classNode);
    });

    expect(response).toEqual({
      thing: {
        memberType: MEMBER_TYPE.State,
      }
    });
  });

});
