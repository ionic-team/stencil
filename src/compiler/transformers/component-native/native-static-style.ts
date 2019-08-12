import * as d from '../../../declarations';
import { createStaticGetter } from '../transform-utils';
import { DEFAULT_STYLE_MODE, dashToPascalCase } from '@utils';
import { getScopeId } from '../../style/scope-css';
import { scopeCss } from '../../../utils/shadow-css';
import ts from 'typescript';


export const addNativeStaticStyle = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (Array.isArray(cmp.styles) && cmp.styles.length > 0) {
    if (cmp.styles.length > 1 || (cmp.styles.length === 1 && cmp.styles[0].modeName !== DEFAULT_STYLE_MODE)) {
      // multiple style modes
      addMultipleModeStyleGetter(classMembers, cmp, cmp.styles);

    } else {
      // single style
      addSingleStyleGetter(classMembers, cmp, cmp.styles[0]);
    }
  }
};


const addMultipleModeStyleGetter = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, styles: d.StyleCompiler[]) => {
  const styleModes: ts.ObjectLiteralElementLike[] = [];

  styles.forEach(style => {
    if (typeof style.styleStr === 'string') {
      // inline the style string
      // static get style() { return { "ios": "string" }; }
      const styleLiteral = createStyleLiteral(cmp, style);
      const propStr = ts.createPropertyAssignment(style.modeName, styleLiteral);
      styleModes.push(propStr);

    } else if (typeof style.styleIdentifier === 'string') {
      // direct import already written in the source code
      // import myTagIosStyle from './import-path.css';
      // static get style() { return { "ios": myTagIosStyle }; }
      const styleIdentifier = ts.createIdentifier(style.styleIdentifier);
      const propIdentifier = ts.createPropertyAssignment(style.modeName, styleIdentifier);
      styleModes.push(propIdentifier);

    } else if (Array.isArray(style.externalStyles) && style.externalStyles.length > 0) {
      // import generated from @Component() styleUrls option
      // import myTagIosStyle from './import-path.css';
      // static get style() { return { "ios": myTagIosStyle }; }
      const styleUrlIdentifier = createStyleIdentifierFromUrl(cmp, style);
      const propUrlIdentifier = ts.createPropertyAssignment(style.modeName, styleUrlIdentifier);
      styleModes.push(propUrlIdentifier);
    }
  });

  const styleObj = ts.createObjectLiteral(styleModes, true);

  classMembers.push(createStaticGetter('style', styleObj));
};


const addSingleStyleGetter = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, style: d.StyleCompiler) => {
  if (typeof style.styleStr === 'string') {
    // inline the style string
    // static get style() { return "string"; }
    const styleLiteral = createStyleLiteral(cmp, style);
    classMembers.push(createStaticGetter('style', styleLiteral));

  } else if (typeof style.styleIdentifier === 'string') {
    // direct import already written in the source code
    // import myTagStyle from './import-path.css';
    // static get style() { return myTagStyle; }
    const styleIdentifier = ts.createIdentifier(style.styleIdentifier);
    classMembers.push(createStaticGetter('style', styleIdentifier));

  } else if (Array.isArray(style.externalStyles) && style.externalStyles.length > 0) {
    // import generated from @Component() styleUrls option
    // import myTagStyle from './import-path.css';
    // static get style() { return myTagStyle; }
    const styleUrlIdentifier = createStyleIdentifierFromUrl(cmp, style);
    classMembers.push(createStaticGetter('style', styleUrlIdentifier));
  }
};


const createStyleLiteral = (cmp: d.ComponentCompilerMeta, style: d.StyleCompiler) => {
  if (cmp.encapsulation === 'scoped') {
    // scope the css first
    const scopeId = getScopeId(cmp.tagName, style.modeName);
    return ts.createStringLiteral(
      scopeCss(style.styleStr, scopeId, false)
    );
  }

  return ts.createStringLiteral(style.styleStr);
};


const createStyleIdentifierFromUrl = (cmp: d.ComponentCompilerMeta, style: d.StyleCompiler) => {
  style.styleIdentifier = dashToPascalCase(cmp.tagName);
  style.styleIdentifier = style.styleIdentifier.charAt(0).toLowerCase() + style.styleIdentifier.substring(1);

  if (style.modeName !== DEFAULT_STYLE_MODE) {
    style.styleIdentifier += dashToPascalCase(style.modeName);
  }

  style.styleIdentifier += 'Style';
  style.externalStyles = [style.externalStyles[0]];

  return ts.createIdentifier(style.styleIdentifier);
};
