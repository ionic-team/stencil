import * as ts from 'typescript';
import * as d from '../../../declarations';

export default  (moduleFiles: d.ModuleFiles): ts.TransformerFactory<ts.SourceFile> => {
  const convertibleTagNames: { [key: string]: d.ComponentMeta } = {};
  Object.keys(moduleFiles).map(key => {
    const metas = moduleFiles[key].cmpMeta
    if(metas) {
      convertibleTagNames[metas.originalTagNameMeta] = metas
    }
  });

  function getNewTagName(tagName: string) {
    if (convertibleTagNames[tagName]) {
      return convertibleTagNames[tagName].tagNameMeta;
    }
    return tagName;
  }

  function visitJsxElement(node: ts.JsxElement) {
    const { openingElement, closingElement, children } = node;
    const oTagName = openingElement.tagName;
    openingElement.tagName = ts.createLiteral(
      getNewTagName(oTagName.getText())
    );
    closingElement.tagName = ts.createLiteral(
      getNewTagName(oTagName.getText())
    );
    return ts.updateJsxElement(node, openingElement, children, closingElement);
  }

  function visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    node.tagName = ts.createLiteral(getNewTagName(node.tagName.getText()));
    return node;
  }

  return (context: ts.TransformationContext) => {
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.JsxElement:
          return ts.visitEachChild(
            visitJsxElement(<ts.JsxElement>node),
            visitor,
            context
          );

        case ts.SyntaxKind.JsxSelfClosingElement:
          return ts.visitEachChild(
            visitJsxSelfClosingElement(<ts.JsxSelfClosingElement>node),
            visitor,
            context
          );

        default:
      }
      return ts.visitEachChild(node, visitor, context);
    }
    return (node: ts.SourceFile) => {
      if (node.isDeclarationFile) {
        return node;
      }
      return ts.visitEachChild(node, visitor, context);
    };
  };
};
