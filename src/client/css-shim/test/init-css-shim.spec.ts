import { hasCssVariables } from '../init-css-shim';


describe('hasCssVariables', () => {

  it('false for standard css', () => {
    const text = `
    .my-classname {
      color: brown;
    }
    #myid {
      color: brown;
    }
    [my="attr"] {
      color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for -- in classname or attribute', () => {
    const text = `
    .my--classname {
      color: brown;
    }
    [my="attr--ibute"] {
      color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for normal CSS with a pseudo class', () => {
    const text = `
      .test--el:hover {
        background-color: green
      }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for minified CSS with a pseudo class', () => {
    const text = `
      .test--el:hover{background-color: green}
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('true for -- declaration w/ spaces', () => {
    const text = `
    element {
      --main-bg-color      : brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for -- declaration', () => {
    const text = `
    element {
      --main-bg-color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for css var() and -- declaration', () => {
    const text = `
      element {
        background-color: var(--main-bg-color);
      }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for minified CSS with a semicolon', () => {
    const text = `element{background-color: green;--main-text-color: black}`;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for minified CSS without a semicolon', () => {
    const text = `element{--main-text-color: black}`;
    expect(hasCssVariables(text)).toBe(true);
  });
   
  it('true for var()', () => {
    const text = `
      element {
        background-color: var(derp);
      }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

});
