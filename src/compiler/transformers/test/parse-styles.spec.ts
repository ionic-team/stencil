import { transpileModule, getStaticGetter } from './transpile';


describe('parse styles', () => {

  it('add static "styleUrl"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrl: 'style.css'
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'styleUrl')).toEqual('style.css');
  });

  it('add static "styleUrls"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrls: ['style.css']
      })
      export class CmpA {}
    `);
    expect(getStaticGetter(t.outputText, 'styleUrls')).toEqual(['style.css']);
  });

  it('add static "styles"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styles: 'p{color:red}'
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'styles')).toEqual('p{color:red}');
  });

});
