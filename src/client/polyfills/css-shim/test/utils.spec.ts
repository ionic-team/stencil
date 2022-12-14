// TODO(STENCIL-659): Remove code implementing the CSS variable shim
import { CSSSelector, Declaration } from '../interfaces';
import { parseCSS } from '../scope';
import { getDeclarations, normalizeValue, resolveValues } from '../selectors';
import { executeTemplate } from '../template';

describe('utils', () => {
  describe('resolveValues', () => {
    it('should resolve values', () => {
      const css = parseCSS(`
      .class{
        -webkit-color: black;
        --loop: var(--loop2);
        --fallback: var(--unknown, fallback);
        --value: 12px;
        --value2: var(--value);
        --value4: var(--value3);
      }
      .class2 {
        color: black;
        --loop2: var(--loop);
        --value3: 0 0 0 0;
        --value6: var(--value) var(--value2) var(--value4);
      }
      ion-button {
        --ion-color: black;
      }
      .inner-class {
        fallback: var(--fallback);
        ioncolor": var(--fallback);
        loop: var(--loop) end;
        loop2: var(--loop2) end;
        value: var(--value) middle var(--value6) end;
        value2: var(--value2);
        value3: var(--value3);
        value4: var(--value4);
        value6: var(--value6);
      }`);

      const values = resolveValues(css.selectors);
      expect(values).toEqual({
        '--fallback': 'fallback',
        '--ion-color': 'black',
        '--loop': '',
        '--loop2': '',
        '--value': '12px',
        '--value2': '12px',
        '--value3': '0 0 0 0',
        '--value4': '0 0 0 0',
        '--value6': '12px 12px 0 0 0 0',
      });

      expect(executeTemplate(css.template, values)).toEqual(`
      .class{
        -webkit-color: black;
      }
      .class2 {
        color: black;
      }
      ion-button {
      }
      .inner-class {
        fallback: fallback;
        ioncolor": fallback;
        loop:  end;
        loop2:  end;
        value: 12px middle 12px 12px 0 0 0 0 end;
        value2: 12px;
        value3: 0 0 0 0;
        value4: 0 0 0 0;
        value6: 12px 12px 0 0 0 0;
      }`);
    });
  });

  describe('normalizeValue', () => {
    it('should normalize CSS value', () => {
      expect(normalizeValue(' 12px ')).toEqual({
        value: '12px',
        important: false,
      });
      expect(normalizeValue('12 px')).toEqual({
        value: '12 px',
        important: false,
      });

      expect(normalizeValue('0 .1   2 \n 3px  ')).toEqual({
        value: '0 .1 2 3px',
        important: false,
      });

      expect(normalizeValue('233, 244 244\t!important\n')).toEqual({
        value: '233, 244 244',
        important: true,
      });
    });
  });

  describe('getDeclarations', () => {
    it('should get css declarations', () => {
      const declarations = getDeclarations(`
        --var:  12px;
        -webkit: value;
        font-size: 12;
        --var: var(--variable);--color: var(--ion-color, 12);
        --padding: 12
          12
          12
          12;
        --ion-color:calc(12px)
        `);

      expectDeclaration(declarations[0], {
        prop: '--var',
        value: '12px',
        important: false,
      });

      expectDeclaration(
        declarations[1],
        {
          prop: '--var',
          value: 'value',
          important: false,
        },
        { '--variable': 'value' }
      );

      expectDeclaration(declarations[2], {
        prop: '--color',
        value: '12',
        important: false,
      });

      expectDeclaration(declarations[3], {
        prop: '--padding',
        value: '12 12 12 12',
        important: false,
      });

      expectDeclaration(declarations[4], {
        prop: '--ion-color',
        value: 'calc(12px)',
        important: false,
      });
    });
  });

  function expectDeclaration(dec: Declaration, exp: any, props: any = {}) {
    expect(dec.prop).toBe(exp.prop);
    expect(executeTemplate(dec.value, props)).toBe(exp.value);
    expect(dec.important).toBe(exp.important);
  }

  function expectSelector(selector: CSSSelector, expected: any) {
    expect(selector.selector).toBe(expected.selector);
    expect(selector.nu).toBe(expected.nu);
    expect(selector.specificity).toBe(expected.specificity);
    for (let i = 0; i < expected.declarations.length; i++) {
      expectDeclaration(selector.declarations[i], expected.declarations[i]);
    }
  }

  describe('parseCSS', () => {
    it('shoud parse CSS', () => {
      const { selectors } = parseCSS(`
      ion-button {
        --value: transparent;
      }
      ion-button.color {
        --value: black;
        --background: var(--color, transparent);
      }
      .color-background,
      .color-active,:host(.toolbar) .color-focused {
        --stuff: 0 0 10x var(--color);
        --background: #00000
      }
      ion-button .button-inner {
        color: var(--value)
      }`);

      expect(selectors.length).toBe(5);

      expectSelector(selectors[0], {
        selector: 'ion-button',
        declarations: [{ prop: '--value', value: 'transparent', important: false }],
        specificity: 1,
        nu: 0,
      });
      expectSelector(selectors[1], {
        selector: 'ion-button.color',
        declarations: [
          { prop: '--value', value: 'black', important: false },
          { prop: '--background', value: 'transparent', important: false },
        ],
        specificity: 1,
        nu: 1,
      });

      expectSelector(selectors[2], {
        selector: '.color-background',
        declarations: [
          { prop: '--stuff', value: '0 0 10x ', important: false },
          { prop: '--background', value: '#00000', important: false },
        ],
        specificity: 1,
        nu: 2,
      });

      expectSelector(selectors[3], {
        selector: '.color-active',
        declarations: [
          { prop: '--stuff', value: '0 0 10x ', important: false },
          { prop: '--background', value: '#00000', important: false },
        ],
        specificity: 1,
        nu: 2,
      });

      expectSelector(selectors[4], {
        selector: ':host(.toolbar) .color-focused',
        declarations: [
          { prop: '--stuff', value: '0 0 10x ', important: false },
          { prop: '--background', value: '#00000', important: false },
        ],
        specificity: 1,
        nu: 2,
      });
    });
  });
});
