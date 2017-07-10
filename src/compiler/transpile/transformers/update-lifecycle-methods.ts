import * as ts from 'typescript';


const LIFECYCLE_MAP: {[methodName: string]: string} = {
  'ionViewWillLoad': 'componentWillLoad',
  'ionViewDidLoad': 'componentDidLoad',
  'ionViewDidUnload': 'componentDidunload',
  'ionViewWillUpdate': 'componentWillUpdate',
  'ionViewDidUpdate': 'componentDidUpdate',
};


export function updateLifecycleMethods(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitMethod(methodNode: ts.MethodDeclaration) {
      let methodName: string = null;

      methodNode.forEachChild(n => {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText();
          return;
        }
      });

      const newName = LIFECYCLE_MAP[methodName];

      if (newName) {
        return ts.updateMethod(
          methodNode,
          methodNode.decorators,
          methodNode.modifiers,
          methodNode.asteriskToken,
          ts.createLiteral(newName),
          methodNode.questionToken,
          methodNode.typeParameters,
          methodNode.parameters,
          methodNode.type,
          methodNode.body
        );
      }

      return methodNode;
    }


    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.MethodDeclaration:
          return visitMethod(node as ts.MethodDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node);
          }, transformContext);
      }
    }


    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };

}
