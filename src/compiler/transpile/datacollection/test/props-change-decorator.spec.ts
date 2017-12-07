import { MEMBER_TYPE } from '../../../../util/constants';
import { getPropChangeDecoratorMeta } from '../prop-change-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('@PropDidChange/@PropWillChange decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/propchange-simple');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getPropChangeDecoratorMeta(classNode);
    });

    expect(response).toEqual({
      propsDidChangeMeta: [
         {
           '0': 'checked',
           '1': 'checkedChanged'
         },
       ],
       propsWillChangeMeta: [
         {
           '0': 'checked',
           '1': 'checkedWillChange'
         },
       ],
    });
  });

});
