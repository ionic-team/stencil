import { highlight, highlightError } from './highlight';


describe('highlight.js', () => {

  describe('highlightError', () => {

    it('should error highlight unescaped', () => {
      const htmlInput = `x & y`;
      const errorCharStart = 2;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`x <span class="ion-diagnostics-error-chr">&</span> y`);
    });

    it('should error highlight escaped >', () => {
      const sourceText = `x > y`;
      const htmlInput = highlight('typescript', sourceText, true).value;
      const errorCharStart = 2;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`x <span class="ion-diagnostics-error-chr">&gt;</span> y`);
    });

    it('should error highlight before escaped >', () => {
      const sourceText = `if (x > y) return;`;
      const htmlInput = highlight('typescript', sourceText, true).value;
      const errorCharStart = 4;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`<span class="hljs-keyword">if</span> (<span class="ion-diagnostics-error-chr">x</span> &gt; y) <span class="hljs-keyword">return</span>;`);
    });

    it('should error highlight after escaped <', () => {
      const sourceText = `if (x < y) return;`;
      const htmlInput = highlight('typescript', sourceText, true).value;
      const errorCharStart = 8;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`<span class="hljs-keyword">if</span> (x &lt; <span class="ion-diagnostics-error-chr">y</span>) <span class="hljs-keyword">return</span>;`);
    });

    it('should error highlight first 3 chars', () => {
      // var name: string = 'Ellie';
      const htmlInput = `<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`;
      const errorCharStart = 0;
      const errorLength = 3;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`<span class="hljs-keyword"><span class="ion-diagnostics-error-chr">v</span><span class="ion-diagnostics-error-chr">a</span><span class="ion-diagnostics-error-chr">r</span></span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`);
    });

    it('should error highlight second char', () => {
      // var name: string = 'Ellie';
      const htmlInput = `<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`;
      const errorCharStart = 1;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`<span class="hljs-keyword">v<span class="ion-diagnostics-error-chr">a</span>r</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`);
    });

    it('should error highlight first char', () => {
      // var name: string = 'Ellie';
      const htmlInput = `<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`;
      const errorCharStart = 0;
      const errorLength = 1;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(`<span class="hljs-keyword"><span class="ion-diagnostics-error-chr">v</span>ar</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`);
    });

    it('should return the same if there are is no errorLength', () => {
      // textInput = `var name: string = 'Ellie';`;
      const htmlInput = `<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`;
      const errorCharStart = 10;
      const errorLength = 0;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(htmlInput);
    });

    it('should return the same if there are is no errorCharStart', () => {
      // textInput = `var name: string = 'Ellie';`;
      const htmlInput = `<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`;
      const errorCharStart = -1;
      const errorLength = 10;
      const v = highlightError(htmlInput, errorCharStart, errorLength);
      expect(v).toEqual(htmlInput);
    });

  });

  describe('typescript', () => {

    it('should replace typescript with <', () => {
      const sourceText = `if (x < y) return;`;
      const v = highlight('typescript', sourceText, true).value;
      expect(v).toEqual(`<span class="hljs-keyword">if</span> (x &lt; y) <span class="hljs-keyword">return</span>;`);
    });

    it('should replace typescript', () => {
      const sourceText = `var name: string = 'Ellie';`;
      const v = highlight('typescript', sourceText, true).value;
      expect(v).toEqual(`<span class="hljs-keyword">var</span> name: <span class="hljs-built_in">string</span> = <span class="hljs-string">'Ellie'</span>;`);
    });

  });

  describe('html', () => {

    it('should replace html', () => {
      const sourceText = `<div key="value">Text</div>`;
      const v = highlight('html', sourceText, true).value;
      expect(v).toEqual(`<span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">key</span>=<span class="hljs-string">"value"</span>&gt;</span>Text<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>`);
    });

  });

  describe('scss', () => {

    it('should replace scss', () => {
      const sourceText = `.className { color: $red; }`;
      const v = highlight('scss', sourceText, true).value;
      expect(v).toEqual(`<span class="hljs-selector-class">.className</span> { <span class="hljs-attribute">color</span>: <span class="hljs-variable">$red</span>; }`);
    });

  });

});
