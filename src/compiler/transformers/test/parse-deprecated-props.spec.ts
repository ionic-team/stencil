import { transpileModule } from './transpile';

describe('parse deprecated props', () => {

  it('should parse all comments', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {
        @Prop({ context: 'isServer' }) isServer: boolean;
        @Prop({ connect: 'ion-menu-controller' }) menuController: HTMLElement;
      }
    `);
    expect(t.outputText).toEqual('export class CmpA { constructor() { this.isServer = __stencil_getContext("isServer"); this.menuController = __stencil_getConnect("ion-menu-controller"); } static get is() { return "cmp-a"; }}');
  });

});
