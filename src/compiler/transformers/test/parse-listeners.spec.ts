import { transpileModule } from './transpile';


describe('parse listeners', () => {

  it('listeners', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('click')
        onClick(ev: UIEvent) {
          console.log('hi!');
        }
      }
    `);

    expect(t.listener.name).toBe('click');
    expect(t.listener.method).toBe('onClick');
  });

});
