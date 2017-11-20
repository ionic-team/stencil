import { ENCAPSULATION } from '../../../../util/constants';
import { getComponentDecoratorMeta } from '../componentDecorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './testUtils';

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
        stylesMeta: {},
        encapsulation: ENCAPSULATION.NoEncapsulation,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        }
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
        stylesMeta: {},
        encapsulation: ENCAPSULATION.ShadowDom,
        jsdoc: {
          documentation: '',
          name: 'ActionSheet',
          type: 'typeof ActionSheet'
        }
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
        stylesMeta: {},
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
            styleUrls: ['action-sheet.ios.scss']
          },
          md: {
            styleUrls: ['action-sheet.md.scss']
          }
        }
      });
    });
  });
});
