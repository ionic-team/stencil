import { parseCssCustomProperties } from '../css-docs';


describe('css-docs', () => {

  it('no docs', () => {
    const styleText = `
      /**
       * @prop --max-width
       */

      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([
      { name: `--max-width`, docs: `` }
    ]);
  });

  it('multiline', () => {
    const styleText = `
      /**
       * @prop --color:  This is the docs
       * for color.
       @prop    --background   : This is the docs
                           for background. It is two
                           * sentences and some :: man.
       */
      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([
      { name: `--color`, docs: `This is the docs for color.` },
      { name: `--background`, docs: `This is the docs for background. It is two sentences and some :: man.` }
    ]);
  });

  it('docs', () => {
    const styleText = `
      /**
       * @prop --max-width: Max width of the alert
       * @prop --color: Descript with : in it
       * * @prop --background: background docs
       @prop --font-weight: font-weight docs
       */

      html {
        height: 100%;
      }

      /**
       * @prop --border: border docs
       * @prop --font-size: font-size docs
       */

      /** @prop --padding: padding docs */

      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([
      { name: `--max-width`, docs: `Max width of the alert` },
      { name: `--color`, docs: `Descript with : in it` },
      { name: `--background`, docs: `background docs` },
      { name: `--font-weight`, docs: `font-weight docs` },
      { name: `--border`, docs: `border docs` },
      { name: `--font-size`, docs: `font-size docs` },
      { name: `--padding`, docs: `padding docs` },
    ]);
  });

  it('invalid css prop comment', () => {
    const styleText = `
      /**
       * hello
       * @prop max-width: Max width of the alert
       * --max-width: Max width of the alert
       */
      /*
       * @prop --max-width
       */
      /* hi i'm normal comments */
      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([]);
  });

  it('no closing comments', () => {
    const styleText = `
      /**
      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([]);
  });

  it('no comments', () => {
    const styleText = `
      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([]);
  });

  it('empty styleText', () => {
    const styleText = ``;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([]);
  });

  it('null styleText', () => {
    const styleText = null;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([]);
  });

});
