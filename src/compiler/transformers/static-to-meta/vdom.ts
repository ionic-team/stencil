import * as d from '../../../declarations';
import ts from 'typescript';


export const gatherVdomMeta = (m: d.Module | d.ComponentCompilerMeta, args: ts.NodeArray<ts.Expression>) => {
  m.hasVdomRender = true;

  // Parse vdom tag
  const hTag = args[0];
  if (ts.isIdentifier(hTag)) {
    if (hTag.text !== 'Host') {
      m.hasVdomFunctional = true;
    }
  }

  // Parse attributes
  if (args.length > 1) {
    const objectLiteral = args[1];
    if (ts.isCallExpression(objectLiteral) || ts.isIdentifier(objectLiteral)) {
      m.hasVdomAttribute = true;
      m.hasVdomKey = true;
      m.hasVdomClass = true;
      m.hasVdomListener = true;
      m.hasVdomRef = true;
      m.hasVdomXlink = true;
      m.hasVdomStyle = true;

    } else if (ts.isObjectLiteralExpression(objectLiteral)) {
      objectLiteral.properties.forEach(prop => {
        m.hasVdomAttribute = true;
        if (ts.isSpreadAssignment(prop) || ts.isComputedPropertyName(prop.name)) {
          m.hasVdomKey = true;
          m.hasVdomClass = true;
          m.hasVdomListener = true;
          m.hasVdomXlink = true;
          m.hasVdomRef = true;
          m.hasVdomStyle = true;

        } else if (prop.name && (prop.name as any).text && (prop.name as any).text.length > 0) {
          const attrName = (prop.name as any).text;
          if (attrName === 'key') {
            m.hasVdomKey = true;
          }
          if (attrName === 'ref') {
            m.hasVdomRef = true;
          }
          if (attrName === 'class' || attrName === 'className') {
            m.hasVdomClass = true;
          }
          if (attrName === 'style') {
            m.hasVdomStyle = true;
          }
          if (/^on(-|[A-Z])/.test(attrName)) {
            m.hasVdomListener = true;
          }
          if (attrName.startsWith('xlink')) {
            m.hasVdomXlink = true;
          }
          m.htmlAttrNames.push(attrName);
        }
      });
    }
  }

  // Parse children
  if (!m.hasVdomText) {
    for (let i = 2; i < args.length; i++) {
      if (ts.isStringLiteral(args[i]) || ts.isIdentifier(args[i])) {
        m.hasVdomText = true;
        break;
      }
    }
  }
};
