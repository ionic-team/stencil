import { parseCssCustomProperties } from '../css-docs';


describe('css-docs', () => {

  it('no description', () => {
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
      { name: `--max-width`, description: `` }
    ]);
  });

  it('multiline', () => {
    const styleText = `
      /**
       * @prop --color:  This is the description
       * for color.
       @prop    --background   : This is the description
                           for background. It is two
                           * sentences and some :: man.
       */
      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([
      { name: `--color`, description: `This is the description for color.` },
      { name: `--background`, description: `This is the description for background. It is two sentences and some :: man.` }
    ]);
  });

  it('docs', () => {
    const styleText = `
      /**
       * @prop --max-width: Max width of the alert
       * @prop --color: Descript with : in it
       * * @prop --background: background description
       @prop --font-weight: font-weight description
       */

      html {
        height: 100%;
      }

      /**
       * @prop --border: border description
       * @prop --font-size: font-size description
       */

      /** @prop --padding: padding description */

      body {
        color: red;
      }
    `;
    const cssDocs = parseCssCustomProperties(styleText);
    expect(cssDocs).toEqual([
      { name: `--max-width`, description: `Max width of the alert` },
      { name: `--color`, description: `Descript with : in it` },
      { name: `--background`, description: `background description` },
      { name: `--font-weight`, description: `font-weight description` },
      { name: `--border`, description: `border description` },
      { name: `--font-size`, description: `font-size description` },
      { name: `--padding`, description: `padding description` },
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
