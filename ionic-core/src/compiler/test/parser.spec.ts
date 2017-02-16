import { parseFileContent } from '../parser';


describe('parser', () => {

  describe('parseFileContent', () => {

    it('should return empty array for null', () => {
      const items = parseFileContent(null);

      expect(items.length).toEqual(0);
    });

  });

});
