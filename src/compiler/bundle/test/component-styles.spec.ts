import { cleanStyle } from '../component-styles';


describe('component-styles', () => {

  describe('cleanStyle', () => {

    it(`should allow @ in selectors`, () => {
      const cleaned = cleanStyle('.container--small\@tablet{}');
      expect(cleaned).toBe(`.container--small\\@tablet{}`);
    });

  });

});
