import { ENCAPSULATION } from '../../../../util/constants';
import { getComponentDecoratorMeta } from '../componentDecorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './testUtils';

describe('component decorator', () => {

  describe('getComponentDecoratorMeta', () => {
    it('default no encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './exampleComponent');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
        response = getComponentDecoratorMeta(checker, classNode);
      });

      expect(response.tagNameMeta).toEqual('ion-action-sheet');
      expect(response.encapsulation).toEqual(ENCAPSULATION.NoEncapsulation);
      expect(response.jsdoc).toEqual({
        documentation: 'This is an actionSheet class',
        name: 'ActionSheet',
        type: 'typeof ActionSheet'
      });
      expect(response.hostMeta).toEqual({
        theme: 'action-sheet'
      });
      expect(response.stylesMeta).toEqual({
        ios: {
          styleUrls: ['action-sheet.ios.scss']
        },
        md: {
          styleUrls: ['action-sheet.md.scss']
        }
      });
    });
  });

});
