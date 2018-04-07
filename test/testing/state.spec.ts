import { flush, render } from '../../dist/testing/index';
import { StateCmp } from './fixtures/state-cmp';


describe('@State', () => {

  it('should build', () => {
    expect(new StateCmp()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;

    beforeEach(async () => {
      element = await render({
        components: [StateCmp],
        html: '<state-cmp></state-cmp>'
      });
    });

    it('should render all weekdays', async () => {
      await flush(element);
      expect(element.querySelectorAll('.day-button').length).toEqual(7);
    })
  });

});
