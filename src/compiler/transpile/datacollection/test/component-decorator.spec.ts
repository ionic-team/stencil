import { ENCAPSULATION, DEFAULT_SHADOW_ROOT_INIT } from '../../../../util/constants';
import { getComponentDecoratorMeta } from '../component-decorator';
import { gatherMetadata } from './test-utils';
import * as path from 'path';


describe('component decorator', () => {

  describe('getComponentDecoratorMeta', () => {
    it('simple decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-simple');
      gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta([], checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        encapsulationMeta: ENCAPSULATION.NoEncapsulation,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          tags: [],
          type: 'typeof ActionSheet'
        },
        assetsDirsMeta: [],
        dependencies: []
      });
    });

    it('shadow encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-shadow');
      gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta([], checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        encapsulationMeta: ENCAPSULATION.ShadowDom,
        shadowRootInit: DEFAULT_SHADOW_ROOT_INIT,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          tags: [],
          type: 'typeof ActionSheet'
        },
        assetsDirsMeta: [],
        dependencies: []
      });
    });

    it('shadow encapsulation with options', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-shadow-w-options');
      gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta([], checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        encapsulationMeta: ENCAPSULATION.ShadowDom,
        shadowRootInit: Object.assign({}, DEFAULT_SHADOW_ROOT_INIT, { delegatesFocus: true }),
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          tags: [],
          type: 'typeof ActionSheet'
        },
        assetsDirsMeta: [],
        dependencies: []
      });
    });

    it('scoped encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-scoped');
      gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta([], checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        assetsDirsMeta: [],
        encapsulationMeta: ENCAPSULATION.ScopedCss,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          tags: [],
          type: 'typeof ActionSheet'
        },
        dependencies: []
      });
    });

    it('should gather jsdoc and hostmeta and styles', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta([], checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        encapsulationMeta: ENCAPSULATION.NoEncapsulation,
        jsdoc: {
          documentation: 'This is an actionSheet class',
          name: 'ActionSheet',
          tags: [],
          type: 'typeof ActionSheet'
        },
        hostMeta: {
          theme: 'action-sheet'
        },
        stylesMeta: {
          ios: {
            externalStyles: [
              {
                originalComponentPath: 'action-sheet.ios.scss'
              }
            ]
          },
          md: {
            externalStyles: [
              {
                originalComponentPath: 'action-sheet.md.scss'
              }
            ]
          }
        },
        assetsDirsMeta: [],
        dependencies: []
      });
    });
  });
});
