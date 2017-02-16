import { transformIfConditionals } from '../transformer';


describe('transformer', () => {

  describe('transformIfConditionals', () => {

    it('should rename *ngIf', () => {
      let content = '<div *ngIf="shouldShow"></div>';

      let transformedContent = transformIfConditionals(content);

      expect(transformedContent).toEqual('<div v-if="shouldShow"></div>');
    });

    it('should rename ng-if', () => {
      let content = '<div *ngIf="shouldShow"></div>';

      let transformedContent = transformIfConditionals(content);

      expect(transformedContent).toEqual('<div v-if="shouldShow"></div>');
    });

  });

});
