import * as d from '@declarations';
import { gatherMetadata } from './test-utils';
import { getWatchDecoratorMeta } from '../watch-decorator';
import * as path from 'path';
import { getPropDecoratorMeta } from '../prop-decorator';
import { getStateDecoratorMeta } from '../state-decorator';
import { hasError } from '../../../util';


describe('@Watch decorator', () => {

  describe('fixtures/watch-simple', () => {

    let cmpMeta: d.ComponentMeta;
    let diagnostics: d.Diagnostic[];

    beforeAll(() => {
      const results = getMetadata('./fixtures/watch-simple');
      cmpMeta = results.cmpMeta;
      diagnostics = results.diagnostics;
    });

    it('should not error', () => {
      expect(hasError(diagnostics)).toBeFalsy();
    });

    it('adds same callback to multiple props', () => {
      expect(cmpMeta.membersMeta.prop1.watchCallbacks[0]).toBe('propWatchCallback');
      expect(cmpMeta.membersMeta.prop2.watchCallbacks[0]).toBe('propWatchCallback');
      expect(cmpMeta.membersMeta.prop3.watchCallbacks[0]).toBe('propWatchCallback');
    });

    it('adds multiple watch callbacks to same prop', () => {
      expect(cmpMeta.membersMeta.someProp.watchCallbacks[0]).toBe('stateWatchCallback1');
      expect(cmpMeta.membersMeta.someProp.watchCallbacks[1]).toBe('stateWatchCallback2');
    });

    it('old @PropWillChange/@PropDidChange decorators still work', () => {
      expect(cmpMeta.membersMeta.checked.watchCallbacks[0]).toBe('checkedWillChange');
      expect(cmpMeta.membersMeta.checked.watchCallbacks[1]).toBe('checkedChanged');

      expect(cmpMeta.membersMeta.someProp1.watchCallbacks[0]).toBe('method');
      expect(cmpMeta.membersMeta.someProp2.watchCallbacks[0]).toBe('method');
      expect(cmpMeta.membersMeta.someProp3.watchCallbacks[0]).toBe('method');
    });
  });

  describe('fixture/watch-error', () => {
    let cmpMeta: d.ComponentMeta;
    let diagnostics: d.Diagnostic[];

    beforeAll(() => {
      const results = getMetadata('./fixtures/watch-error');
      diagnostics = results.diagnostics;
      cmpMeta = results.cmpMeta;
    });

    it('should error', () => {
      expect(Object.keys(cmpMeta.membersMeta).length).toBe(0);

      expect(hasError(diagnostics)).toBeTruthy();

      expect(diagnostics[0].messageText).toEqual(`@Watch('prop3') is trying to watch for changes in a property that does not exist.\nMake sure only properties decorated with @State() or @Prop() are watched.`);
      expect(diagnostics[1].messageText).toEqual(`@Watch('prop1') is trying to watch for changes in a property that does not exist.\nMake sure only properties decorated with @State() or @Prop() are watched.`);
      expect(diagnostics[2].messageText).toEqual(`@Watch('prop2') is trying to watch for changes in a property that does not exist.\nMake sure only properties decorated with @State() or @Prop() are watched.`);
    });
  });
});

function getMetadata(filepath: string) {
  const cmpMeta: d.ComponentMeta = {};
  const sourceFilePath = path.resolve(__dirname, filepath);
  const diagnostics = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
    cmpMeta.membersMeta = {
    ...getStateDecoratorMeta(classNode),
    ...getPropDecoratorMeta(diagnostics, checker, classNode, sourceFile, 'ClassName')
    };
    getWatchDecoratorMeta(diagnostics, classNode, cmpMeta);
  });
  return {
    cmpMeta,
    diagnostics
  };
}
