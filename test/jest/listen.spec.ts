import { TestWindow } from '../../dist/testing/index';
import { ListenCmp } from './fixtures/listen-cmp';


describe('@Listen', () => {

  it('host listener toggles "opened" from "click" event', async () => {
    const window = new TestWindow();

    const element = await window.load({
      components: [ListenCmp],
      html: `<listen-cmp></listen-cmp>`
    });

    expect(element.opened).toEqual(false);

    element.dispatchEvent(new window.Event('click'));
    expect(element.opened).toEqual(true);

    element.dispatchEvent(new window.Event('click'));
    expect(element.opened).toEqual(false);
  });

});
