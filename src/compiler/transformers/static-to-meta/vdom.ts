import * as d from '../../../declarations';
import ts from 'typescript';


export const gatherVdomMeta = (m: d.Module | d.ComponentCompilerMeta, args: ts.NodeArray<ts.Expression>) => {
  m.hasVdomRender = true;

  if (args[0].kind === ts.SyntaxKind.Identifier) {
    m.hasVdomFunctional = true;
  }

  if (args.length > 1) {
    const objectLiteral = args[1];

    if (ts.isObjectLiteralExpression(objectLiteral)) {
      const props = objectLiteral.properties;

      const propsWithText = props
        .filter(p => p.name && (p.name as any).text && (p.name as any).text.length > 0)
        .map(p => (p.name as any).text as string);

      if (propsWithText.length > 0) {
        const attrs = new Set(Array.from(propsWithText));

        if (attrs.has('key')) {
          m.hasVdomKey = true;
          attrs.delete('key');
        }

        if (attrs.has('ref')) {
          m.hasVdomRef = true;
          attrs.delete('ref');
        }

        attrs.forEach(attr => {
          if (attr.startsWith('on') && attr.length > 2 && /[A-Z]/.test(attr.charAt(2))) {
            m.hasVdomListener = true;
            attrs.delete(attr);
          }
          if (attr.startsWith('xlink')) {
            m.hasVdomXlink = true;
          }
        });

        if (attrs.size > 0) {
          m.hasVdomAttribute = true;

          if (attrs.has('class') || attrs.has('className')) {
            m.hasVdomClass = true;
          }
          if (attrs.has('style')) {
            m.hasVdomStyle = true;
          }

          attrs.forEach(attrName => {
            m.htmlAttrNames.push(attrName);
          });
        }
      }
    }

    if (!m.hasVdomText) {
      for (let i = 2; i < args.length; i++) {
        if (ts.isStringLiteral(args[i])) {
          m.hasVdomText = true;
          break;
        }
      }
    }
  }
};
