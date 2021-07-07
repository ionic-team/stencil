import { getStaticGetter, transpileModule } from './transpile';

describe('parse styles', () => {
  it('add static "styleUrl"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrl: 'style.css'
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'styleUrls')).toEqual({ $: ['style.css'] });
  });

  it('add static "styleUrls"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styleUrls: ['style.css']
      })
      export class CmpA {}
    `);
    expect(getStaticGetter(t.outputText, 'styleUrls')).toEqual({ $: ['style.css'] });
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

  it('add static "styles" as object', () => {
    const t = transpileModule(`
      const md = 'p{color:red}';
      const ios = 'p{color:black}';
      @Component({
        tag: 'cmp-a',
        styles: {
          md: md,
          ios: ios,
        }
      })
      export class CmpA {}
    `);
    expect(t.outputText).toEqual(
      `const md = 'p{color:red}';const ios = 'p{color:black}';export class CmpA { static get is() { return "cmp-a"; } static get styles() { return { "md": md, "ios": ios }; }}`,
    );
  });

  it('add static "styles" as object (2)', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        styles: {
          md: 'p{color:red}',
          ios: 'p{color:black}',
        }
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'styles')).toEqual({
      ios: 'p{color:black}',
      md: 'p{color:red}',
    });
  });

  it('add static "styles" const', () => {
    const t = transpileModule(`
      const styles = 'p{color:red}';
      @Component({
        tag: 'cmp-a',
        styles,
      })
      export class CmpA {}
    `);
    expect(t.outputText).toEqual(
      `const styles = 'p{color:red}';export class CmpA { static get is() { return "cmp-a"; } static get styles() { return styles; }}`,
    );
  });
});
