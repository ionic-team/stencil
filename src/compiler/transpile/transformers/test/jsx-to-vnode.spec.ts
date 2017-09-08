import { jsxToVNode } from '../jsx-to-vnode';
import { DEFAULT_COMPILER_OPTIONS } from '../../compiler-options';
import * as ts from 'typescript';


function customJsxTransform(source) {
  return ts.transpileModule(source, {
    transformers: {
        after: [jsxToVNode]
    },
    compilerOptions: Object.assign({}, DEFAULT_COMPILER_OPTIONS, {
      target: ts.ScriptTarget.ES2017
    })
  }).outputText;
}

function transform(source) {
  return ts.transpileModule(source, {
    compilerOptions: Object.assign({}, DEFAULT_COMPILER_OPTIONS, {
      target: ts.ScriptTarget.ES2017
    })
  }).outputText;
}

describe('jsx-to-vnode transform', () => {

  describe('baseline tests for custom elements', () => {
    it('simple test', () => {
      const source =
        `<example-element class='red'>HI</example-element>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `h("example-element", { "c": { "red": true } }, t("HI"));\n`
      );
    });

    it('simple test with classes', () => {
      const source =
        `<example-element class="test">HI</example-element>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `h("example-element", { "c": { "test": true } }, t("HI"));\n`
      );
    });

    it('simple test with attributes (string)', () => {
      const source =
        `<example-element id="test">HI</example-element>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `h("example-element", { "a": { "id": "test" } }, t("HI"));\n`
      );
    });

    it('simple test with custom props (array)', () => {
      const source =
        `<example-element red={['blue']}>HI</example-element>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `h("example-element", { "p": { "red": ['blue'] } }, t("HI"));\n`
      );
    });

    it('simple test with custom props spread attribute (array)', () => {
      const source =
        `var props = { 'red': ['blue'] };\n` +
        `<example-element {spreadProps(props)}}>HI</example-element>\n`
        ;
      expect(customJsxTransform(source)).toEqual(
        `var props = { 'red': ['blue'] };\n` +
        `h("example-element", Object.assign({}, spreadProps(props)), t("HI"));\n`
      );
    });
  });

  describe('dynamic element name', () => {
    it('simple test', () => {
      const source =
        `var TagName = "span";\n` +
        `<TagName>HI</TagName>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var TagName = "span";\n` +
        `h(TagName, 0, t("HI"));\n`
      );
    });

    it('simple test with classes', () => {
      const source =
        `var TagName = "span";\n` +
        `<TagName class="test">HI</TagName>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var TagName = "span";\n` +
        `h(TagName, { "c": { "test": true } }, t("HI"));\n`
      );
    });

    it('simple test with attributes (string)', () => {
      const source =
        `var TagName = "span";\n` +
        `<TagName id="test">HI</TagName>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var TagName = "span";\n` +
        `h(TagName, { "a": { "id": "test" } }, t("HI"));\n`
      );
    });

    it('simple test with custom props (array)', () => {
      const source =
        `var TagName = "span";\n` +
        `<TagName red={['blue']}>HI</TagName>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var TagName = "span";\n` +
        `h(TagName, { "p": { "red": ['blue'] } }, t("HI"));\n`
      );
    });

    it('simple test with custom props spread attribute (array)', () => {
      const source =
        `var TagName = "span";\n` +
        `var props = { 'red': ['blue'] };\n` +
        `<TagName {spreadProps(props)}}>HI</TagName>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var TagName = "span";\n` +
        `var props = { 'red': ['blue'] };\n` +
        `h(TagName, Object.assign({}, spreadProps(props)), t("HI"));\n`
      );
    });
  });

  describe('user defined stateless component', () => {
    it('simple test', () => {
      const source =
        `var UserComponent = function () { };\n` +
        `<UserComponent>HI</UserComponent>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var UserComponent = function () { };\n` +
        `h(UserComponent, 0, t("HI"));\n`
      );
    });

    it('simple test with classes', () => {
      const source =
        `var UserComponent = function () { };\n` +
        `<UserComponent class="test">HI</UserComponent>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var UserComponent = function () { };\n` +
        `h(UserComponent, { "c": { "test": true } }, t("HI"));\n`
      );
    });

    it('simple test with attributes (string)', () => {
      const source =
        `var UserComponent = function () { };\n` +
        `<span id="test">HI</span>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var UserComponent = function () { };\n` +
        `h("span", { "a": { "id": "test" } }, t("HI"));\n`
      );
    });

    it('simple test with custom props (array)', () => {
      const source =
        `var UserComponent = function () { };\n` +
        `<UserComponent red={['blue']}>HI</UserComponent>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var UserComponent = function () { };\n` +
        `h(UserComponent, { "p": { "red": ['blue'] } }, t("HI"));\n`
      );
    });

    it('simple test with custom props spread attribute (array)', () => {
      const source =
        `var UserComponent = function () { };\n` +
        `var props = { 'red': ['blue'] };\n` +
        `<UserComponent {spreadProps(props)}}>HI</UserComponent>\n`
        ;

      expect(customJsxTransform(source)).toEqual(
        `var UserComponent = function () { };\n` +
        `var props = { 'red': ['blue'] };\n` +
        `h(UserComponent, Object.assign({}, spreadProps(props)), t("HI"));\n`
      );
    });
  });


  describe('children -> jsx', () => {
  });
  describe('children -> javascript expressions', () => {
  });
  describe('children -> functions', () => {
  });

});
