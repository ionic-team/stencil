import { updateFileMetaFromSlot } from '../vnode-slots';
import { DEFAULT_COMPILER_OPTIONS } from '../../compiler-options';
import { ModuleFiles, ModuleFile } from '../../../../util/interfaces';
import * as ts from 'typescript';


function customJsxTransform(source, fileMetaArray: ModuleFiles) {
  return ts.transpileModule(source, {
    transformers: {
        after: [updateFileMetaFromSlot(fileMetaArray)]
    },
    compilerOptions: Object.assign({}, DEFAULT_COMPILER_OPTIONS, {
      target: ts.ScriptTarget.ES2017
    })
  }).outputText;
}

describe('vnode-slot transform', () => {
  let fileMetaArray: ModuleFiles;


  beforeEach(() => {
    fileMetaArray = {
      'module.tsx': { cmpMeta: {} }
    };
  });

  describe('baseline tests for custom elements', () => {
    it('simple test', () => {
      const source =
        `<example-element class='red'>HI</example-element>\n`
        ;
      customJsxTransform(source, fileMetaArray);

      expect(fileMetaArray).toEqual({
        'module.tsx': { cmpMeta: {} }
      });
    });
    it('simple test if slot exists', () => {
      const source =
        `<slot></slot>\n`
        ;
      customJsxTransform(source, fileMetaArray);

      expect(fileMetaArray).toEqual({
        'module.tsx': { 'cmpMeta': { 'slotMeta': 1} }
      });
    });
    it('simple test if named slots exist', () => {
      const source =
        `<slot name="first"></slot>\n`
        ;
      customJsxTransform(source, fileMetaArray);

      expect(fileMetaArray).toEqual({
        'module.tsx': { 'cmpMeta': { 'slotMeta': 2} }
      });
    });
  });
});
