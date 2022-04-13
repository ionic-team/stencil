import type * as d from '../../../declarations';
import { generatePropTypes } from '../generate-prop-types';
import * as Util from '../../../utils/util';
import { stubComponentCompilerMeta } from './ComponentCompilerMeta.stub';
import { stubComponentCompilerProperty } from './ComponentCompilerProperty.stub';
import { stubComponentCompilerVirtualProperty } from './ComponentCompilerVirtualProperty.stub';

describe('generate-prop-types', () => {
  describe('generatePropTypes', () => {
    let getTextDocsSpy: jest.SpyInstance<ReturnType<typeof Util.getTextDocs>, Parameters<typeof Util.getTextDocs>>;

    beforeEach(() => {
      getTextDocsSpy = jest.spyOn(Util, 'getTextDocs');
      getTextDocsSpy.mockReturnValue('');
    });

    afterEach(() => {
      getTextDocsSpy.mockRestore();
    });

    it('returns an empty array when no props are provided', () => {
      const componentMeta = stubComponentCompilerMeta();

      expect(generatePropTypes(componentMeta)).toEqual([]);
    });

    it('returns the correct type information for a single property', () => {
      const componentMeta = stubComponentCompilerMeta({
        properties: [stubComponentCompilerProperty()],
      });

      const expectedTypeInfo: d.TypeInfo = [
        {
          jsdoc: '',
          internal: false,
          name: 'propName',
          optional: false,
          required: false,
          type: 'UserCustomPropType',
        },
      ];

      const actualTypeInfo = generatePropTypes(componentMeta);

      expect(actualTypeInfo).toEqual(expectedTypeInfo);
    });

    it('returns the correct type information for a single virtual property', () => {
      const componentMeta = stubComponentCompilerMeta({
        virtualProperties: [stubComponentCompilerVirtualProperty()],
      });

      const expectedTypeInfo: d.TypeInfo = [
        {
          jsdoc: 'this is a doc string',
          internal: false,
          name: 'virtualPropName',
          optional: true,
          required: false,
          type: 'number',
        },
      ];

      const actualTypeInfo = generatePropTypes(componentMeta);

      expect(actualTypeInfo).toEqual(expectedTypeInfo);
    });

    it('returns the correct type information for concrete and virtual properties', () => {
      const componentMeta = stubComponentCompilerMeta({
        properties: [stubComponentCompilerProperty()],
        virtualProperties: [stubComponentCompilerVirtualProperty()],
      });

      const expectedTypeInfo: d.TypeInfo = [
        {
          jsdoc: '',
          internal: false,
          name: 'propName',
          optional: false,
          required: false,
          type: 'UserCustomPropType',
        },
        {
          jsdoc: 'this is a doc string',
          internal: false,
          name: 'virtualPropName',
          optional: true,
          required: false,
          type: 'number',
        },
      ];

      const actualTypeInfo = generatePropTypes(componentMeta);

      expect(actualTypeInfo).toEqual(expectedTypeInfo);
    });
  });
});
