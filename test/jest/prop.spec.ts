import { TestWindow } from '../../dist/testing/index';
import { PropCmp } from './fixtures/prop-cmp';


describe('@Prop', () => {

  describe('properties', () => {

    it('should set props from property', async () => {
      const window = new TestWindow();
      const element = await window.load({
        components: [PropCmp],
        html: '<prop-cmp></prop-cmp>'
      });
      element.first = 'Marty';
      element.lastName = 'McFly';
      await window.flush();
      expect(element.textContent).toEqual('Hello, my name is Marty McFly');
    });

  });

  describe('attributes', () => {

    it('should set props from attributes', async () => {
      const window = new TestWindow();
      const element = await window.load({
        components: [PropCmp],
        html: '<prop-cmp first="Marty" last-name="McFly"></prop-cmp>'
      });
      expect(element.textContent).toEqual('Hello, my name is Marty McFly');
    });

  });

});
