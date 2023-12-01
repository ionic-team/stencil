import { DEFAULT_STYLE_MODE } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { scopeCss } from '../../utils/shadow-css';
import { getScopeId } from '../style/scope-css';
import { createStaticGetter, getIdentifierFromResourceUrl } from './transform-utils';

/**
 * Adds static "style" getter within the class
 * ```typescript
 * const MyComponent = class {
 *   static get style() { return "styles"; }
 * }
 * ```
 * @param classMembers a class to existing members of a class. **this parameter will be mutated** rather than returning
 * a cloned version
 * @param cmp the metadata associated with the component being evaluated
 * @param commentOriginalSelector if `true`, add a comment with the original CSS selector to the style.
 */
export const addStaticStyleGetterWithinClass = (
  classMembers: ts.ClassElement[],
  cmp: d.ComponentCompilerMeta,
  commentOriginalSelector: boolean,
): void => {
  const styleLiteral = getStyleLiteral(cmp, commentOriginalSelector);
  if (styleLiteral) {
    classMembers.push(createStaticGetter('style', styleLiteral));
  }
};

/**
 * Adds static "style" property to the class variable.
 *
 * ```typescript
 * const MyComponent = class {}
 * MyComponent.style = "styles";
 * ```
 *
 * @param styleStatements a list of statements containing style assignments to a class
 * @param cmp the metadata associated with the component being evaluated
 */
export const addStaticStylePropertyToClass = (styleStatements: ts.Statement[], cmp: d.ComponentCompilerMeta): void => {
  const styleLiteral = getStyleLiteral(cmp, false);
  if (styleLiteral) {
    const statement = ts.factory.createExpressionStatement(
      ts.factory.createAssignment(
        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(cmp.componentClassName), 'style'),
        styleLiteral,
      ),
    );
    styleStatements.push(statement);
  }
};

const getStyleLiteral = (cmp: d.ComponentCompilerMeta, commentOriginalSelector: boolean) => {
  if (Array.isArray(cmp.styles) && cmp.styles.length > 0) {
    if (cmp.styles.length > 1 || (cmp.styles.length === 1 && cmp.styles[0].modeName !== DEFAULT_STYLE_MODE)) {
      // multiple style modes
      return getMultipleModeStyle(cmp, cmp.styles, commentOriginalSelector);
    } else {
      // single style
      return getSingleStyle(cmp, cmp.styles[0], commentOriginalSelector);
    }
  }
  return null;
};

const getMultipleModeStyle = (
  cmp: d.ComponentCompilerMeta,
  styles: d.StyleCompiler[],
  commentOriginalSelector: boolean,
) => {
  const styleModes: ts.ObjectLiteralElementLike[] = [];

  styles.forEach((style) => {
    if (typeof style.styleStr === 'string') {
      // inline the style string
      // static get style() { return { ios: "string" }; }
      const styleLiteral = createStyleLiteral(cmp, style, commentOriginalSelector);
      const propStr = ts.factory.createPropertyAssignment(style.modeName, styleLiteral);
      styleModes.push(propStr);
    } else if (typeof style.styleIdentifier === 'string') {
      // direct import already written in the source code
      // import myTagIosStyle from './import-path.css';
      // static get style() { return { ios: myTagIosStyle }; }
      const styleIdentifier = ts.factory.createIdentifier(style.styleIdentifier);
      const propIdentifier = ts.factory.createPropertyAssignment(style.modeName, styleIdentifier);
      styleModes.push(propIdentifier);
    } else if (Array.isArray(style.externalStyles) && style.externalStyles.length > 0) {
      // import generated from @Component() styleUrls option
      // import myTagIosStyle from './import-path.css';
      // static get style() { return { ios: myTagIosStyle }; }
      const externalStyles = Array.from(new Set(style.externalStyles.map((s) => s.absolutePath)));
      const styleUrlIdentifier = createStyleIdentifierFromUrl(style.styleId, externalStyles);
      const propUrlIdentifier = ts.factory.createPropertyAssignment(style.modeName, styleUrlIdentifier);
      styleModes.push(propUrlIdentifier);
    }
  });

  return ts.factory.createObjectLiteralExpression(styleModes, true);
};

const getSingleStyle = (cmp: d.ComponentCompilerMeta, style: d.StyleCompiler, commentOriginalSelector: boolean) => {
  if (typeof style.styleStr === 'string') {
    // inline the style string
    // static get style() { return "string"; }
    return createStyleLiteral(cmp, style, commentOriginalSelector);
  }

  if (typeof style.styleIdentifier === 'string') {
    // direct import already written in the source code
    // import myTagStyle from './import-path.css';
    // static get style() { return myTagStyle; }
    return ts.factory.createIdentifier(style.styleIdentifier);
  }

  if (Array.isArray(style.externalStyles) && style.externalStyles.length > 0) {
    // import generated from @Component() styleUrls option
    // import myTagStyle from './import-path.css';
    // static get style() { return myTagStyle; }
    const externalStyles = Array.from(new Set(style.externalStyles.map((s) => s.absolutePath)));
    return createStyleIdentifierFromUrl(style.styleId, externalStyles);
  }

  return null;
};

const createStyleLiteral = (cmp: d.ComponentCompilerMeta, style: d.StyleCompiler, commentOriginalSelector: boolean) => {
  if (cmp.encapsulation === 'scoped' || (commentOriginalSelector && cmp.encapsulation === 'shadow')) {
    // scope the css first
    const scopeId = getScopeId(cmp.tagName, style.modeName);
    return ts.factory.createStringLiteral(scopeCss(style.styleStr, scopeId, commentOriginalSelector));
  }

  return ts.factory.createStringLiteral(style.styleStr);
};

/**
 * Creates an expression to be assigned to the `style` property of a component class. For example
 * given the following component:
 *
 * ```ts
 * @Component({
 *  styleUrls: ['my-component.css', 'my-component.ios.css']
 *  tag: 'cmp',
 * })
 * export class MyComponent {
 *   // ...
 * }
 * ```
 *
 * it would generate the following expression:
 *
 * ```ts
 * import CMP_my_component_css from './my-component.css';
 * import CMP_my_component_ios_css from './my-component.ios.css';
 * export class MyComponent {
 *   // ...
 * }
 * MyComponent.style = CMP_my_component_css + CMP_my_component_ios_css;
 * ```
 *
 * Note: style imports are made in [`createEsmStyleImport`](src/compiler/transformers/style-imports.ts).
 *
 * @param styleId a unique identifier for the component style
 * @param externalStyles a list of external styles to be applied the component
 * @returns an assignment expression to be applied to the `style` property of a component class (e.g. `_myComponentCssStyle + _myComponentIosCssStyle` based on the example)
 */
export const createStyleIdentifierFromUrl = (
  styleId: string,
  externalStyles: string[],
): ts.Identifier | ts.BinaryExpression => {
  if (externalStyles.length === 1) {
    return ts.factory.createIdentifier(getIdentifierFromResourceUrl(styleId + externalStyles[0]));
  }

  const firstExternalStyle = externalStyles[0];
  return ts.factory.createBinaryExpression(
    createStyleIdentifierFromUrl(styleId, [firstExternalStyle]),
    ts.SyntaxKind.PlusToken,
    createStyleIdentifierFromUrl(styleId, externalStyles.slice(1)),
  );
};
