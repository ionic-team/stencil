import { transpileModule } from './transpile';


describe('parse styles', () => {

  it('add static "styleUrl"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrl: 'style.css'
      })
      export class CmpA {}
    `);

    expect(t.outputText).toContain(`static get styleUrl() { return 'style.css'; }`);
  });

  it('add static "styleUrls"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrls: ['style.css']
      })
      export class CmpA {}
    `);

    expect(t.outputText).toContain(`static get styleUrls() { return ['style.css']; }`);
  });

  it('add static "styles"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styles: 'p{color:red}'
      })
      export class CmpA {}
    `);

    expect(t.outputText).toContain(`static get styles() { return 'p{color:red}'; }`);
  });

});
