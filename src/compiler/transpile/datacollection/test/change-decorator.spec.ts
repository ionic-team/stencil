import { ComponentMeta } from '../../../../util/interfaces';
import { gatherMetadata } from './test-utils';
import { getChangeDecoratorMeta } from '../change-decorator';
import { MEMBER_TYPE } from '../../../../util/constants';
import * as path from 'path';
import * as ts from 'typescript';


describe('@PropDidChange/@PropWillChange decorator', () => {

  it('simple decorator', () => {
    const sourceFilePath = path.resolve(__dirname, './fixtures/propchange-simple');
    const cmpMeta: ComponentMeta = {};
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      getChangeDecoratorMeta(classNode, cmpMeta);
    });

    expect(cmpMeta.membersMeta.checked.willChangeMethodNames[0]).toBe('checkedWillChange');
    expect(cmpMeta.membersMeta.event3.willChangeMethodNames[0]).toBe('method');

    expect(cmpMeta.membersMeta.checked.didChangeMethodNames[0]).toBe('checkedChanged');
    expect(cmpMeta.membersMeta.event1.didChangeMethodNames[0]).toBe('method');
    expect(cmpMeta.membersMeta.event2.didChangeMethodNames[0]).toBe('method');
  });

});
