import { TestWindow } from '../../dist/testing/index';
import { StateCmp } from './fixtures/state-cmp';


describe('@State', () => {

  it('should render all weekdays', async () => {
    const window = new TestWindow();
    const element = await window.load({
      components: [StateCmp],
      html: '<state-cmp></state-cmp>'
    });
    expect(element.querySelectorAll('.day-button').length).toEqual(7);
  });

});
