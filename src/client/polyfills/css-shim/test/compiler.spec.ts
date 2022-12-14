// TODO(STENCIL-659): Remove code implementing the CSS variable shim
import { compileTemplate, compileVar, executeTemplate, findVarEndIndex, parseVar } from '../template';

describe('compiler', () => {
  describe('findVarEndIndex', () => {
    it('should work without fallback', () => {
      const text = 'var(--bar);';
      expect(findVarEndIndex(text, 0)).toBe(text.length - 1);
    });

    it('should work with fallback', () => {
      const text = 'var(--foo, var(--bar, 12px));';
      expect(findVarEndIndex(text, 0)).toBe(text.length - 1);
    });
  });

  describe('parseVar', () => {
    it('should work without fallback', () => {
      const css = `.class { color: var(--color); }`;
      const var1 = parseVar(css, 0);
      expect(var1.fallback).toBe(undefined);
      expect(var1.start).toBe(16);
      expect(var1.end).toBe(28);
    });

    it('should work with fallback', () => {
      const css = `.class { color: var(--color, "();{}"); }`;
      const var1 = parseVar(css, 0);
      expect(var1.fallback).toBe('"();{}"');
      expect(var1.start).toBe(16);
      expect(var1.end).toBe(37);
    });

    it('should work with fallback + nested var + calc', () => {
      const css = `.class { color: var(--color,calc(var(--color2) + 12px)); }`;
      const var1 = parseVar(css, 0);
      expect(var1.fallback).toBe('calc(var(--color2) + 12px)');
      expect(var1.start).toBe(16);
      expect(var1.end).toBe(55);
    });

    it('should work with commans in fallback', () => {
      const css = `var(--font, 255, 255, 255)`;
      const var1 = parseVar(css, 0);
      expect(var1.propName).toBe('--font');
      expect(var1.fallback).toBe('255, 255, 255');
    });

    it('should work with fallback + nested var + calc (2)', () => {
      const css = `var(--font, calc(var(--ion-font, 0px) + 12px))`;
      const var1 = parseVar(css, 0);
      expect(var1.fallback).toBe('calc(var(--ion-font, 0px) + 12px)');
      expect(var1.start).toBe(0);
    });
  });

  describe('compileCSS', () => {
    it('should compile CSS without vars', () => {
      const text = `
      .class {
        font-size: 12px;
      }`;
      const template = compileTemplate(text);
      expect(executeTemplate(template, {})).toEqual(text);
    });

    it('should compile CSS without context', () => {
      const text = `calc(var(--ion-font, 0px) + 12px)`;
      const template = compileTemplate(text);
      expect(executeTemplate(template, {})).toEqual(`calc(0px + 12px)`);
    });

    it('should compile nested var without context', () => {
      const text = `var(--font, calc(var(--ion-font, 0px) + 12px))`;
      const template = compileTemplate(text);
      expect(executeTemplate(template, {})).toEqual(`calc(0px + 12px)`);
    });

    it('should compile CSS and execute changes', () => {
      const template = compileTemplate(`
      .class {
        font-size: var(--font, calc(var(--ion-font, 0px) + 12px));
        --color: 12px;
      }

      :host {
        --ion-font: 12px;font-size: var(--font, calc(var(--ion-font2, 0px) + 12px));
        --color: 12px
      }

      :host(.class3) {
        font-size: var(--font2, calc(var(--ion-font2, 0px) + 12px + var(--ion-font2)));
        --color: 12px}
    `);

      expect(executeTemplate(template, {})).toEqual(`
      .class {
        font-size: calc(0px + 12px);
      }

      :host {
        font-size: calc(0px + 12px);
        }

      :host(.class3) {
        font-size: calc(0px + 12px + );
        }
    `);

      expect(
        executeTemplate(template, {
          '--ion-font2': '100px',
          '--font2': '200px',
        })
      ).toEqual(`
      .class {
        font-size: calc(0px + 12px);
      }

      :host {
        font-size: calc(100px + 12px);
        }

      :host(.class3) {
        font-size: 200px;
        }
    `);
    });
  });

  describe('compileVar', () => {
    it('should compile nested Var', () => {
      const css = `
      .class {
        font-size: var(--font, calc(var(--ion-font, 0px, 1px) + 12px));
      }`;
      const segments: any = [];
      compileVar(css, segments, 0);

      expect(segments[1]({})).toEqual(`calc(0px, 1px + 12px)`);
      expect(segments[1]({ '--ion-font': '10px' })).toEqual(`calc(10px + 12px)`);
      expect(segments[1]({ '--font': '11px' })).toEqual(`11px`);
      expect(segments[1]({ '--font': '0', '--ion-font': '11px' })).toEqual(`0`);
    });
    it('should work compile vars step by step', () => {
      const css = `
.class {
  color: var(--color);
  font-size: var(--font-size, 12px) var( --font , 12px);
}`;

      const segments: any[] = [];

      // STEP 1
      let index = compileVar(css, segments, 0);
      expect(segments[0]).toBe(`
.class {
  color: `);
      expect(segments[1]({ '--color': 'hola' })).toBe(`hola`);

      // STEP 2
      index = compileVar(css, segments, index);
      expect(segments[2]).toBe(`;
  font-size: `);
      expect(segments[3]({})).toBe(`12px`);

      // STEP 3
      index = compileVar(css, segments, index);
      expect(segments[4]).toBe(' ');
      expect(segments[5]({ '--font': 'sans' })).toBe('sans');

      // STEP 4
      compileVar(css, segments, index);
      expect(segments.length).toBe(7);
      expect(segments[6]).toBe(`;
}`);
    });
  });
});
