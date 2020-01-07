import { minifyCss } from '../minify-css';


describe('minify css', () => {

  it('background urls', () => {
    const i = `
    .test   {
      background :   url(top.png) no-repeat, url(bottom.png) no-repeat, url(middle.png) no-repeat;
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    .test{background:url(top.png) no-repeat, url(bottom.png) no-repeat, url(middle.png) no-repeat}
    `.trim());
  });

  it('@import url', () => {
    const i = `
      @import   url('./one.css') ;
      @import  url('./three.css')  ;
      /*some comment!*/
      #imports-with-comment   {   color  : #999;   }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    @import url('./one.css');@import url('./three.css');#imports-with-comment{color:#999}
    `.trim());
  });

  it('vars', () => {
    const i = `
    :root {
      --color  : red  ;
    }
    body {
      color:    var(--color);
      nowrap: '';
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    :root{--color:red}body{color:var(--color);nowrap:''}
    `.trim());
  });

  it('input[type=text]', () => {
    const i = `
    input[type=text], input[type=password]  ,
    input.text,   input.title,
    textarea,   select {
      margin:  0.5em 0;
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    input[type=text],input[type=password],input.text,input.title,textarea,select{margin:0.5em 0}
    `.trim());
  });

  it('.clearfix:before{content:"\\0020"}', () => {
    const i = `
    .clearfix:before{content:"\\0020"}
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    .clearfix:before{content:"\\0020"}
    `.trim());
  });

  it('attr title', () => {
    const i = `
    a   #i[title="my \\] long title"]  { color:red ;;}
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    a #i[title="my \\] long title"]{color:red}
    `.trim());
  });

  it(':focus, :hover', () => {
    const i = `
    :focus   , :hover   {
      outline   : 0   ;
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    :focus,:hover{outline:0}
    `.trim());
  });

  it('.clear:after', () => {
    const i = `
    blockquote   , q {
      quotes: "" "";
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    blockquote,q{quotes:\"\" \"\"}
    `.trim());
  });

  it('.clear:after', () => {
    const i = `
    .clear:after   ,    .container:before   {
      content: ".";
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    .clear:after,.container:before{content:"."}
    `.trim());
  });

  it('* html .clear', () => {
    const i = `
    *   html  .clear  {
      height  :  1%;
    }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    * html .clear{height:1%}
    `.trim());
  });

  it(':not()', () => {
    const i = `
    a  :not(b >  w):not( #c )    :nth(2 ) {  color  :  red  ;  }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    a :not(b>w):not(#c) :nth(2){color:red}
    `.trim());
  });

  it('::slotted', () => {
    const i = `
    :host ( .a )     ::slotted( b    ),
        div   {  color : red ;  }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
    :host(.a) ::slotted(b),div{color:red}
    `.trim());
  });

  it('excess whitespace', () => {
    const i = `
      body  \n    { \t  color    :    red    ;  \t  }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red}
    `.trim());
  });

  it('excess whitespace', () => {
    const i = `
      body  \n    { \t  color    :    red    ;  \t  }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red}
    `.trim());
  });

  it('remove oneline comments', () => {
    const i = `
      /* comment*/
      body { color: red; }
    `.trim();

    const o = minifyCss(i);
    expect(o).toBe(`
      body{color:red}
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
      body{color:red}
    `.trim());
  });


});
