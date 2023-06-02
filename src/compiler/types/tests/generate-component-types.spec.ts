import type * as d from '../../../declarations';
import { generateComponentTypes } from '../generate-component-types';
import { stubComponentCompilerMeta } from './ComponentCompilerMeta.stub';
import { stubTypesImportData } from './TypesImportData.stub';

describe('generate-component-types', () => {
  describe('generateComponentTypes', () => {
    it('default', () => {
      // given
      const componentCompilerMeta = stubComponentCompilerMeta();
      const typeImportData = stubTypesImportData();

      // when
      const typesModule: d.TypesModule = generateComponentTypes(componentCompilerMeta, typeImportData, false);

      // then
      expect(typesModule).toEqual<d.TypesModule>({
        component: `        interface StubCmp {
        }`,
        element: `        interface HTMLStubCmpElement extends Components.StubCmp, HTMLStencilElement {
                prototype: HTMLStubCmpElement;
                new (): HTMLStubCmpElement;
        }
        var HTMLStubCmpElement: HTMLStubCmpElement;`,
        htmlElementName: `HTMLStubCmpElement`,
        isDep: false,
        jsx: `    interface StubCmp {
        }`,
        tagName: 'stub-cmp',
        tagNameAsPascal: 'StubCmp',
      });
    });

    it('with type parameters', () => {
      // given
      const componentCompilerMeta = stubComponentCompilerMeta();
      const typeImportData = stubTypesImportData();
      componentCompilerMeta.componentClassTypeParameters = ['a', 'b'];

      // when
      const typesModule: d.TypesModule = generateComponentTypes(componentCompilerMeta, typeImportData, false);

      // then
      expect(typesModule).toEqual<d.TypesModule>({
        component: `        interface StubCmp<a,b> {
        }`,
        element: `        interface HTMLStubCmpElement<a,b> extends Components.StubCmp<a,b>, HTMLStencilElement {
                prototype: HTMLStubCmpElement<a,b>;
                new (): HTMLStubCmpElement<a,b>;
        }
        var HTMLStubCmpElement: HTMLStubCmpElement<any,any>;`,
        htmlElementName: `HTMLStubCmpElement<any,any>`,
        isDep: false,
        jsx: `    interface StubCmp<a,b> {
        }`,
        tagName: 'stub-cmp',
        tagNameAsPascal: 'StubCmp<any,any>',
      });
    });
  });
});
