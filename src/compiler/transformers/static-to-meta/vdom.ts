import * as d from '../../../declarations';
import ts from 'typescript';


export function gatherVdomMeta(cmpMeta: d.ComponentCompilerMeta, args: ts.NodeArray<ts.Expression>) {
  cmpMeta.hasVdomRender = true;

  if (args[0].kind === ts.SyntaxKind.Identifier) {
    cmpMeta.hasVdomFunctional = true;
  }

  if (args.length > 1) {
    if (ts.isObjectLiteralExpression(args[1])) {
      const props: ts.ObjectLiteralElementLike[] = ((args[1] as ts.ObjectLiteralExpression).properties as any);

      const propsWithText = props
        .filter(p => p.name && (p.name as any).text && (p.name as any).text.length > 0)
        .map(p => (p.name as any).text as string);

      if (propsWithText.length > 0) {
        const attrs = new Set(Array.from(propsWithText));

        if (attrs.has('key')) {
          cmpMeta.hasVdomKey = true;
          attrs.delete('key');
        }

        if (attrs.has('ref')) {
          cmpMeta.hasVdomRef = true;
          attrs.delete('ref');
        }

        attrs.forEach(attr => {
          if (attr.startsWith('on') && attr.length > 2 && /[A-Z]/.test(attr.charAt(2))) {
            cmpMeta.hasVdomListener = true;
            attrs.delete(attr);
          }
        });

        if (attrs.size > 0) {
          cmpMeta.hasVdomAttribute = true;

          if (attrs.has('class') || attrs.has('className')) {
            cmpMeta.hasVdomClass = true;
          }
          if (attrs.has('style')) {
            cmpMeta.hasVdomStyle = true;
          }

          attrs.forEach(attrName => {
            if (!cmpMeta.htmlAttrNames.includes(attrName)) {
              cmpMeta.htmlAttrNames.push(attrName);
            }
          });
        }
      }
    }

    if (!cmpMeta.hasVdomText) {
      for (let i = 2; i < args.length; i++) {
        if (ts.isStringLiteral(args[i])) {
          cmpMeta.hasVdomText = true;
          break;
        }
      }
    }
  }
}

