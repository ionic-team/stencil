import type * as d from '../../../declarations';
import { generateMethodTypes } from '../generate-method-types';
import * as Util from '../../../utils/util';
import { stubComponentCompilerMeta } from './ComponentCompilerMeta.stub';
import { stubComponentCompilerMethod } from './ComponentCompilerMethod.stub';

describe('generate-method-types', () => {
  describe('generateMethodTypes', () => {
    let getTextDocsSpy: jest.SpyInstance<ReturnType<typeof Util.getTextDocs>, Parameters<typeof Util.getTextDocs>>;

    beforeEach(() => {
      getTextDocsSpy = jest.spyOn(Util, 'getTextDocs');
      getTextDocsSpy.mockReturnValue('');
    });

    afterEach(() => {
      getTextDocsSpy.mockRestore();
    });

    it('returns an empty array when no methods are provided', () => {
      const componentMeta = stubComponentCompilerMeta();

      expect(generateMethodTypes(componentMeta)).toEqual([]);
    });

    it('returns the correct type info for a single method', () => {
      const componentMethod = stubComponentCompilerMethod();
      const componentMeta = stubComponentCompilerMeta({
        methods: [componentMethod],
      });

      const expectedTypeInfo: d.TypeInfo = [
        {
          jsdoc: '',
          internal: false,
          name: 'myMethod',
          optional: false,
          required: false,
          type: '(name: Foo) => Promise<void>',
        },
      ];

      const actualTypeInfo = generateMethodTypes(componentMeta);

      expect(actualTypeInfo).toEqual(expectedTypeInfo);
    });

    it('returns the correct type info for multiple methods', () => {
      const componentMethod1 = stubComponentCompilerMethod();
      const componentMethod2 = stubComponentCompilerMethod({
        name: 'myOtherMethod',
        internal: true,
        complexType: {
          parameters: [{ tags: [], text: '' }],
          references: { Bar: { location: 'local', path: './other-resources' } },
          return: 'Promise<boolean>',
          signature: '(age: Bar) => Promise<boolean>',
        },
        docs: undefined,
      });
      const componentMeta = stubComponentCompilerMeta({
        methods: [componentMethod1, componentMethod2],
      });

      const expectedTypeInfo: d.TypeInfo = [
        {
          jsdoc: '',
          internal: false,
          name: 'myMethod',
          optional: false,
          required: false,
          type: '(name: Foo) => Promise<void>',
        },
        {
          jsdoc: '',
          internal: true,
          name: 'myOtherMethod',
          optional: false,
          required: false,
          type: '(age: Bar) => Promise<boolean>',
        },
      ];

      const actualTypeInfo = generateMethodTypes(componentMeta);

      expect(actualTypeInfo).toEqual(expectedTypeInfo);
    });
  });
});
