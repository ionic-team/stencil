import * as d from '@stencil/core/declarations';
import { optimizeCss } from '../optimize-css';
import { mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import path from 'path';
import os from 'os';


describe('optimizeCss',  () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let diagnostics: d.Diagnostic[];
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  beforeEach(() => {
    config = mockConfig();
    compilerCtx = mockCompilerCtx();
    diagnostics = [];
  });


  it('handles error', async () => {
    const filePath = path.join(os.tmpdir(), 'my.css');
    config.minifyCss = true;
    const styleText = `/* css */ body color: #ff0000; }`;
    await optimizeCss(config, compilerCtx, diagnostics, styleText, filePath, true);

    expect(diagnostics).toHaveLength(1);
  });

  it('discard-comments', async () => {
    config.minifyCss = true;
    const styleText = `/* css */ body { color: #ff0000; }`;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`body{color:red}`);
  });

  it('minify-gradients', async () => {
    config.autoprefixCss = false;
    config.minifyCss = true;
    const styleText = `
      h1 {
        background: linear-gradient(to bottom, #ffe500 0%, #ffe500 50%, #121 50%, #121 100%);
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{background:linear-gradient(180deg,#ffe500 0,#ffe500 50%,#121 0,#121)}`);
  });

  it('reduce-initial', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        min-width: initial;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{min-width:0}`);
  });

  it('normalize-display-values', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        display: inline flow-root;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{display:inline-block}`);
  });

  it('reduce-transforms', async () => {
    config.autoprefixCss = false;
    config.minifyCss = true;
    const styleText = `
      h1 {
        transform: rotate3d(0, 0, 1, 20deg);
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{transform:rotate(20deg)}`);
  });

  it('colormin', async () => {
    config.minifyCss = true;
    const styleText = `body { color: #ff0000; }`;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`body{color:red}`);
  });

  it('convert-values', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        width: 0em;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{width:0}`);
  });

  it('ordered-values', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        border: red solid .5em;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{border:.5em solid red}`);
  });

  it('minify-selectors', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 + p, h2, h3, h2{color:red}
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1+p,h2,h3{color:red}`);
  });

  it('minify-params', async () => {
    config.minifyCss = true;
    const styleText = `
      @media only screen   and ( min-width: 400px, min-height: 500px ) {
        h2 {
          color: red;
        }
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`@media only screen and (min-width:400px,min-height:500px){h2{color:red}}`);
  });

  it('normalize-string', async () => {
    config.minifyCss = true;
    const styleText = `
      p:after {
        content: '\\'string\\' is intact';
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`p:after{content:"'string' is intact"}`);
  });

  it('minify-font-values', async () => {
    config.minifyCss = true;
    const styleText = `
      p {
        font-family: "Helvetica Neue", Arial, sans-serif, Helvetica;
        font-weight: normal;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`p{font-family:Helvetica Neue,Arial,sans-serif,Helvetica;font-weight:400}`);
  });

  it('normalize-url', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        background: url("http://site.com:80/image.jpg");
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{background:url(http://site.com/image.jpg)}`);
  });

  it('normalize-repeat-style', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        background: url(image.jpg) repeat no-repeat;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{background:url(image.jpg) repeat-x}`);
  });

  it('normalize-positions', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        background-position: bottom left;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{background-position:0 100%}`);
  });

  it('normalize-whitespace', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        width: calc(10px -  ( 100px / var(--test)  )) ;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{width:calc(10px - (100px / var(--test)))}`);
  });

  it('normalize-whitespace', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        width: calc(10px -  ( 100px / var(--test)  )) ;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{width:calc(10px - (100px / var(--test)))}`);
  });

  // it('merge-longhand', async () => {
  //   config.minifyCss = true;
  //   const styleText = `
  //     h1 {
  //       margin-top: 10px;
  //       margin-right: 20px;
  //       margin-bottom: 10px;
  //       margin-left: 20px;
  //     }
  //   `;
  //   const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

  //   expect(diagnostics).toHaveLength(0);
  //   expect(output).toBe(`h1{margin:10px 20px}`);
  // });

  // it('merge-longhand w/ css vars', async () => {
  //   config.minifyCss = true;
  //   const styleText = `
  //     a {
  //       border-width: var(--border-width);
  //       border-style: var(--border-style);
  //       border-color: var(--btn-border-color);
  //     }
  //   `;
  //   const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

  //   expect(diagnostics).toHaveLength(0);
  //   expect(output).toBe(`a{border:var(--border-width) var(--border-style) var(--btn-border-color)}`);
  // });

  it('discard-duplicates', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        margin: 0 auto;
        margin: 0 auto
      }
      h1 {
        margin: 0 auto;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{margin:0 auto}`);
  });

  it('merge-rules', async () => {
    config.minifyCss = true;
    const styleText = `
      a {
        color: red;
        font-weight: bold
      }
      p {
        color: red;
        font-weight: bold
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`a,p{color:red;font-weight:700}`);
  });

  it('discard-empty', async () => {
    config.minifyCss = true;
    const styleText = `
      @font-face;
      h1 {}
      {color:blue}
      h3 {color:red}
      h2 {color:}
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h3{color:red}`);
  });

  it('unique-selectors', async () => {
    config.minifyCss = true;
    const styleText = `
      h1, h3, h2, h1 {
        color: red;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1,h2,h3{color:red}`);
  });

  it('prevent autoprefix with null', async () => {
    config.autoprefixCss = null;
    config.minifyCss = true;
    const styleText = `
      h1 {
        box-shadow: 1px;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{box-shadow:1px}`);
  });

  it('prevent autoprefix with false', async () => {
    config.autoprefixCss = false;
    config.minifyCss = true;
    const styleText = `
      h1 {
        box-shadow: 1px;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{box-shadow:1px}`);
  });

  it('autoprefix by default', async () => {
    config.minifyCss = true;
    const styleText = `
      h1 {
        box-shadow: 1px;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{-webkit-box-shadow:1px;box-shadow:1px}`);
  });

  it('runs autoprefixerCss true config', async () => {
    config.autoprefixCss = true;
    config.minifyCss = true;
    const styleText = `
      h1 {
        box-shadow: 1px;
      }
    `;
    const output = await optimizeCss(config, compilerCtx, diagnostics, styleText, null, true);

    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(`h1{-webkit-box-shadow:1px;box-shadow:1px}`);
  });

  it('do nothing for invalid data', async () => {
    let output = await optimizeCss(config, compilerCtx, diagnostics, null, null, true);
    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(null);

    output = await optimizeCss(config, compilerCtx, diagnostics, undefined, null, true);
    expect(diagnostics).toHaveLength(0);
    expect(output).toBe(undefined);

    output = await optimizeCss(config, compilerCtx, diagnostics, '', null, true);
    expect(diagnostics).toHaveLength(0);
    expect(output).toBe('');
  });

});
