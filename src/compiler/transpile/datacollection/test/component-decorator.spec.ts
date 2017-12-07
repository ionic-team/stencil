import { ENCAPSULATION } from '../../../../util/constants';
import { getComponentDecoratorMeta } from '../component-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('component decorator', () => {

  describe('getComponentDecoratorMeta', () => {
    it('simple decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-simple');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta(checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        encapsulation: ENCAPSULATION.NoEncapsulation,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        },
        assetsDirsMeta: []
      });
    });

    it('shadow encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-shadow');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta(checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        encapsulation: ENCAPSULATION.ShadowDom,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        },
        assetsDirsMeta: []
      });
    });

    it('scoped encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-scoped');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta(checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        hostMeta: {},
        stylesMeta: {},
        assetsDirsMeta: [],
        encapsulation: ENCAPSULATION.ScopedCss,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        }
      });
    });

    it('should gather jsdoc and hostmeta and styles', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta(checker, classNode);
      });

      expect(response).toEqual({
        tagNameMeta: 'ion-action-sheet',
        encapsulation: ENCAPSULATION.NoEncapsulation,
        jsdoc: {
          documentation: 'This is an actionSheet class',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        },
        hostMeta: {
          theme: 'action-sheet'
        },
        stylesMeta: {
          ios: {
            originalComponentPaths: ['action-sheet.ios.scss']
          },
          md: {
            originalComponentPaths: ['action-sheet.md.scss']
          }
        },
        assetsDirsMeta: [],
      });
    });
  });
});
