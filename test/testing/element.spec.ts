import { TestWindow } from '../../dist/testing/index';
import { ElementCmp } from './fixtures/element-cmp';


describe('@Element', () => {

  it('should read the host elements attribute', async () => {
    const window = new TestWindow();
    const element = await window.load({
      components: [ElementCmp],
      html: '<element-cmp host-element-attr="Marty McFly"></element-cmp>'
    });
    expect(element.textContent).toEqual('Hello, my name is Marty McFly');
  });

});
