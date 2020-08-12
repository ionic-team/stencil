import { getStaticGetter, transpileModule } from './transpile';

describe('parse watch', () => {
  it('watch', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() prop1;
        @Prop() prop2;
        @State() state1;

        @Watch('prop1')
        @Watch('prop2')
        onUpdate() {
          console.log('update');
        }

        @Watch('prop1')
        @Watch('state1')
        onStateUpdated() {
          console.log('state updated');
        }
      }
    `);

    expect(getStaticGetter(t.outputText, 'watchers')).toEqual([
      { methodName: 'onUpdate', propName: 'prop1' },
      { methodName: 'onUpdate', propName: 'prop2' },
      { methodName: 'onStateUpdated', propName: 'prop1' },
      { methodName: 'onStateUpdated', propName: 'state1' },
    ]);
  });
});
