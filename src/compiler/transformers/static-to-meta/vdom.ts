import * as d from '../../../declarations';
import ts from 'typescript';


export function gatherVdomMeta(moduleFile: d.Module, args: ts.NodeArray<ts.Expression>) {
  moduleFile.hasVdomRender = true;

  if (args[0].kind === ts.SyntaxKind.Identifier) {
    moduleFile.hasVdomFunctional = true;
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
          moduleFile.hasVdomKey = true;
          attrs.delete('key');
        }

        if (attrs.has('ref')) {
          moduleFile.hasVdomRef = true;
          attrs.delete('ref');
        }

        attrs.forEach(attr => {
          if (attr.startsWith('on') && attr.length > 2 && /[A-Z]/.test(attr.charAt(2))) {
            moduleFile.hasVdomListener = true;
            attrs.delete(attr);
          }
        });

        if (attrs.size > 0) {
          moduleFile.hasVdomAttribute = true;

          if (attrs.has('class') || attrs.has('className')) {
            moduleFile.hasVdomClass = true;
          }
          if (attrs.has('style')) {
            moduleFile.hasVdomStyle = true;
          }

          attrs.forEach(attrName => {
            if (!moduleFile.htmlAttrNames.includes(attrName)) {
              moduleFile.htmlAttrNames.push(attrName);
            }
          });
        }
      }
    }

    if (!moduleFile.hasVdomText) {
      for (let i = 2; i < args.length; i++) {
        if (ts.isStringLiteral(args[i])) {
          moduleFile.hasVdomText = true;
          break;
        }
      }
    }
  }
}

