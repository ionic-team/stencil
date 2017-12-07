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
      response = getPropChangeDecoratorMeta(null, classNode);
    });

    expect(response).toEqual({
      propsDidChangeMeta: [
        {
           '0': 'checked',
           '1': 'checkedChanged'
        }, {
          '0': 'event1',
          '1': 'method'
        }, {
          '0': 'event2',
          '1': 'method'
        }
      ],
      propsWillChangeMeta: [
        {
          '0': 'checked',
          '1': 'checkedWillChange'
        }, {
          '0': 'event3',
          '1': 'method'
        }
      ],
    });
  });

});
