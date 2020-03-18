import { getStaticGetter, transpileModule } from './transpile';

describe('parse deprecated props', () => {

  it('should parse connect and context', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {
        @Prop({ context: 'isServer' }) isServer: boolean;
        @Prop({ connect: 'ion-menu-controller' }) menuController: HTMLElement;
      }
    `);
    expect(getStaticGetter(t.outputText, 'contextProps')).toEqual([
      {'context': 'isServer', 'name': 'isServer'}
    ]);
    expect(getStaticGetter(t.outputText, 'connectProps')).toEqual([
      {'connect': 'ion-menu-controller', 'name': 'menuController'}
    ]);
    expect(t.legacyContext).toEqual([
      {'context': 'isServer', 'name': 'isServer'}
    ]);
    expect(t.legacyConnect).toEqual([
      {'connect': 'ion-menu-controller', 'name': 'menuController'}
    ]);
  });

});
