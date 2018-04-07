import { flush, render } from '../../dist/testing/index';
import { DaysButtonList } from './fixtures/state-cmp';


describe('day-button-list', () => {

  it('should build', () => {
    expect(new DaysButtonList()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;

    beforeEach(async () => {
      element = await render({
        components: [DaysButtonList],
        html: '<day-button-list></day-button-list>'
      });
    });

    it('should render all weekdays', async () => {
      await flush(element);
      expect(element.querySelectorAll('.day-button').length).toEqual(7);
    })
  });

});
