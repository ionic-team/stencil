import { TestWindow } from '../../dist/testing/index';
import { EventCmp } from './fixtures/event-cmp';


describe('@Event', () => {

  it('should fire custom event w/ no options', async () => {
    const window = new TestWindow();
    const element = await window.load({
      components: [EventCmp],
      html: '<event-cmp></event-cmp>'
    });

    const myEventPromise = new Promise<UIEvent>(resolve => {
      element.addEventListener('myEvent', (ev: UIEvent) => {
        resolve(ev);
      });
    })

    await window.flush();

    element.emitEvent();

    const ev = await myEventPromise;

    expect(ev.type).toBe('myEvent');
    expect(ev.bubbles).toBe(true);
    expect(ev.cancelable).toBe(true);
    expect(ev.detail).toBe(true);
  });

  // it('should fire custom event w/ options', async () => {
  //   const element = await render({
  //     components: [EventCmp],
  //     html: '<event-cmp></event-cmp>'
  //   });

  //   const myEventPromise = new Promise<UIEvent>(resolve => {
  //     element.addEventListener('myEventOne', (ev: UIEvent) => {
  //       resolve(ev);
  //     });
  //   })

  //   await flush(element);

  //   element.fireEventTwo();

  //   const ev = await myEventPromise;

  //   expect(ev.type).toBe('myEventOne');
  //   expect(ev.bubbles).toBe(true);
  //   expect(ev.cancelable).toBe(true);
  //   expect(ev.detail).toBe(true);
  // });

});
