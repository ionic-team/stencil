import * as d from '../../declarations';
import { attachStyles, initStyleTemplate } from '../styles';
import { mockDomApi, mockElement, mockPlatform } from '../../testing/mocks';
import { ENCAPSULATION } from '../../util/constants';


describe('styles', () => {

  let plt: d.PlatformApi;
  let domApi: d.DomApi;
  let elm: d.HostElement;
  let cmpMeta: d.ComponentMeta;

  beforeEach(() => {
    plt = mockPlatform();
    domApi = mockDomApi();
    elm = mockElement() as any;
    cmpMeta = {
      tagNameMeta: 'cmp-a'
    };
  });

  it('should place the styles in the head below multiple existing <styles data-styles>', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
      static get style() {
        return `my-style { color: red; }`;
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    const visibilityStyles = domApi.$createElement('style');
    visibilityStyles.setAttribute('data-styles', '');
    visibilityStyles.innerHTML = `cmp-a { visibility: hidden; }`;
    domApi.$appendChild(domApi.$head, visibilityStyles);

    const prerenderStyles = domApi.$createElement('style');
    prerenderStyles.setAttribute('data-styles', '');
    prerenderStyles.innerHTML = `body { color: blue; }`;
    domApi.$appendChild(domApi.$head, prerenderStyles);

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, cmpConstructor.style, cmpConstructor.styleMode);
    attachStyles(plt, domApi, cmpMeta, elm);

    const styles = domApi.$head.querySelectorAll('style');
    expect(styles).toHaveLength(3);

    expect(styles[0].innerHTML).toBe('cmp-a { visibility: hidden; }');
    expect(styles[1].innerHTML).toBe('body { color: blue; }');
    expect(styles[2].innerHTML).toBe('my-style { color: red; }');
  });

  it('should place the styles in the head below an existing <styles data-styles>', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
      static get style() {
        return `my-style { color: red; }`;
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    const prerenderStyles = domApi.$createElement('style');
    prerenderStyles.setAttribute('data-styles', '');
    prerenderStyles.innerHTML = `body { color: blue; }`;
    domApi.$appendChild(domApi.$head, prerenderStyles);

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, cmpConstructor.style, cmpConstructor.styleMode);
    attachStyles(plt, domApi, cmpMeta, elm);

    const styles = domApi.$head.querySelectorAll('style');
    expect(styles).toHaveLength(2);

    expect(styles[0].innerHTML).toBe('body { color: blue; }');
    expect(styles[1].innerHTML).toBe('my-style { color: red; }');
  });

  it('should place the styles in the head w/out an existing <styles data-styles>', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
      static get style() {
        return `my-style { color: red; }`;
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, cmpConstructor.style, cmpConstructor.styleMode);
    attachStyles(plt, domApi, cmpMeta, elm);

    const style = domApi.$head.querySelector('style');
    expect(style.innerHTML).toBe(cmpConstructor.style);
  });

  it('should use all styles templates for each mode', () => {
    const mdStyle = '.md { color: green; }';
    const mdMode = 'md';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, mdStyle, mdMode);

    const iosStyle = '.ios { color: blue; }';
    const iosMode = 'ios';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, iosStyle, iosMode);

    const defaultStyle = ':host { color: red; }';
    const defaultMode = '$';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, defaultStyle, defaultMode);

    elm.mode = 'ios';
    attachStyles(plt, domApi, cmpMeta, elm);

    elm.mode = 'md';
    attachStyles(plt, domApi, cmpMeta, elm);

    elm.mode = null;
    attachStyles(plt, domApi, cmpMeta, elm);

    const styles = domApi.$head.querySelectorAll('style');
    expect(styles[0].innerHTML).toBe(':host { color: red; }');
    expect(styles[1].innerHTML).toBe('.md { color: green; }');
    expect(styles[2].innerHTML).toBe('.ios { color: blue; }');
  });

  it('should use the style template w/ a ios mode', () => {
    const mdStyle = '.md { color: green; }';
    const mdMode = 'md';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, mdStyle, mdMode);

    const iosStyle = '.ios { color: blue; }';
    const iosMode = 'ios';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, iosStyle, iosMode);

    const defaultStyle = ':host { color: red; }';
    const defaultMode = '$';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, defaultStyle, defaultMode);

    elm.mode = 'ios';
    attachStyles(plt, domApi, cmpMeta, elm);

    const style = domApi.$head.querySelector('style');
    expect(style.innerHTML).toBe('.ios { color: blue; }');
  });

  it('should use the style template w/ a default mode', () => {
    const mdStyle = '.md { color: green; }';
    const mdMode = 'md';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, mdStyle, mdMode);

    const iosStyle = '.ios { color: blue; }';
    const iosMode = 'ios';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, iosStyle, iosMode);

    const defaultStyle = ':host { color: red; }';
    const defaultMode = '$';
    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, defaultStyle, defaultMode);

    elm.mode = undefined;
    attachStyles(plt, domApi, cmpMeta, elm);

    const style = domApi.$head.querySelector('style');
    expect(style.innerHTML).toBe(':host { color: red; }');
  });

  it('should append component styles template to head, with styleMode and scoped css', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
      static get style() {
        return `my-style { color: red; }`;
      }
      static get styleMode() {
        return `ios`;
      }
      static get encapsulation() {
        return `scoped` as any;
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.ScopedCss, cmpConstructor.style, cmpConstructor.styleMode);

    const template = domApi.$head.querySelector('template');
    expect(template.innerHTML).toBe(`<style data-style-tag="cmp-a" data-style-mode="ios" data-style-scoped="true">${cmpConstructor.style}</style>`);
    expect(cmpMeta[`cmp-aios`]).toBe(template);
  });

  it('should append component styles template to head, no styleMode', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
      static get style() {
        return `my-style { color: red; }`;
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, cmpConstructor.style, cmpConstructor.styleMode);

    const template = domApi.$head.querySelector('template');
    expect(template.innerHTML).toBe(`<style data-style-tag="cmp-a">${cmpConstructor.style}</style>`);
    expect(cmpMeta[`cmp-a$`]).toBe(template);
  });

  it('should not append component styles template when no styles', () => {
    const cmpConstructor: d.ComponentConstructor = class {
      static get is() {
        return 'cmp-a';
      }
    };
    cmpMeta.componentConstructor = cmpConstructor;

    initStyleTemplate(domApi, cmpMeta, ENCAPSULATION.NoEncapsulation, cmpConstructor.style, cmpConstructor.styleMode);

    const template = domApi.$head.querySelector('template');
    expect(template).toBe(null);
  });

});
