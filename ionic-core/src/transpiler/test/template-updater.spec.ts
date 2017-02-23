import { updateTemplate } from '../template-updater';


describe('template-updater', () => {

  describe('updateTemplate', () => {

    it('should rename *if', () => {
      let content = '<div *if="shouldShow"></div>';

      let transformedContent = updateTemplate('my-tag', content);

      expect(transformedContent).toEqual('<div v-if="shouldShow"></div>');
    });

  });

});
