import * as d from '../../../../declarations';
import { gatherMetadata } from './test-utils';
import { getWatchDecoratorMeta } from '../watch-decorator';
import * as path from 'path';


describe('@Watch decorator', () => {

  it('adds same callback to multiple props', () => {
    const sourceFilePath = path.resolve(__dirname, './fixtures/watch-simple');
    const cmpMeta: d.ComponentMeta = {};
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      getWatchDecoratorMeta([], classNode, cmpMeta);
    });

    expect(cmpMeta.membersMeta.prop1.watchCallbacks[0]).toBe('propWatchCallback');
    expect(cmpMeta.membersMeta.prop2.watchCallbacks[0]).toBe('propWatchCallback');
    expect(cmpMeta.membersMeta.prop3.watchCallbacks[0]).toBe('propWatchCallback');
  });

  it('adds multiple watch callbacks to same prop', () => {
    const sourceFilePath = path.resolve(__dirname, './fixtures/watch-simple');
    const cmpMeta: d.ComponentMeta = {};
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      getWatchDecoratorMeta([], classNode, cmpMeta);
    });

    expect(cmpMeta.membersMeta.someProp.watchCallbacks[0]).toBe('stateWatchCallback1');
    expect(cmpMeta.membersMeta.someProp.watchCallbacks[1]).toBe('stateWatchCallback2');
  });

  it('old @PropWillChange/@PropDidChange decorators still work', () => {
    const sourceFilePath = path.resolve(__dirname, './fixtures/watch-simple');
    const cmpMeta: d.ComponentMeta = {};
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      getWatchDecoratorMeta([], classNode, cmpMeta);
    });

    expect(cmpMeta.membersMeta.checked.watchCallbacks[0]).toBe('checkedWillChange');
    expect(cmpMeta.membersMeta.checked.watchCallbacks[1]).toBe('checkedChanged');

    expect(cmpMeta.membersMeta.someProp1.watchCallbacks[0]).toBe('method');
    expect(cmpMeta.membersMeta.someProp2.watchCallbacks[0]).toBe('method');
    expect(cmpMeta.membersMeta.someProp3.watchCallbacks[0]).toBe('method');
  });

});
