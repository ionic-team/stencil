import { dashToPascalCase, DEFAULT_STYLE_MODE } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { scopeCss } from '../../utils/shadow-css';
import { getScopeId } from '../style/scope-css';
import { createStaticGetter } from './transform-utils';

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
  commentOriginalSelector: boolean
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
        styleLiteral
      )
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
  commentOriginalSelector: boolean
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
      const styleUrlIdentifier = createStyleIdentifierFromUrl(cmp, style);
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
    return createStyleIdentifierFromUrl(cmp, style);
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

const createStyleIdentifierFromUrl = (cmp: d.ComponentCompilerMeta, style: d.StyleCompiler) => {
  style.styleIdentifier = dashToPascalCase(cmp.tagName);
  style.styleIdentifier = style.styleIdentifier.charAt(0).toLowerCase() + style.styleIdentifier.substring(1);

  if (style.modeName !== DEFAULT_STYLE_MODE) {
    style.styleIdentifier += dashToPascalCase(style.modeName);
  }

  style.styleIdentifier += 'Style';
  style.externalStyles = [style.externalStyles[0]];

  return ts.factory.createIdentifier(style.styleIdentifier);
};
