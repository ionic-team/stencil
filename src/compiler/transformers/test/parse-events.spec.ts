import { transpileModule } from './transpile';


describe('parse events', () => {

  it('events', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Event() thingChanged: EventEmitter<string>;
      }
    `);

    expect(t.event.name).toBe('thingChanged');
    expect(t.event.method).toBe('thingChanged');
    expect(t.event.bubbles).toBe(true);
    expect(t.event.cancelable).toBe(true);
    expect(t.event.composed).toBe(true);
  });

});
