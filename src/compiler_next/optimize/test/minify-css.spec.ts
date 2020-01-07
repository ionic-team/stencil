import { minifyCss } from '../minify-css';


describe('minify css', () => {

  it('excess whitespace', () => {
    const i = `
      body  \n    { \t  color    :    red    ;  \t  }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red;}
    `.trim());
  });

  it('remove oneline comments', () => {
    const i = `
      /* comment*/
      body { color: red; }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red;}
    `.trim());
  });

  it('remove multiline comments', () => {
    const i = `
      /* multi
      line
      */
      body { color: red; }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red;}
    `.trim());
  });


});
