import { updateFileMetaFromSlot } from '../vnode-slots';
import { DEFAULT_COMPILER_OPTIONS } from '../../compiler-options';
import { ModuleFiles, ModuleFile } from '../../../../util/interfaces';
import { transformSourceString } from '../util';
import * as ts from 'typescript';


function update(transformContext: ts.TransformationContext) {

  return (tsSourceFile: ts.SourceFile) => {
    return visit(tsSourceFile) as ts.SourceFile;

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

      case ts.SyntaxKind.ClassDeclaration:
        const meta: ts.Expression = ts.createLiteral('hi');
        return [
          node,
          ts.createVariableStatement(
            [ts.createToken(ts.SyntaxKind.ExportKeyword), ts.createToken(ts.SyntaxKind.ConstKeyword)],
            [ts.createVariableDeclaration('test', undefined, meta)]
          )
        ];

      default:
        return ts.visitEachChild(node, (node) => {
          return visit(node);
        }, transformContext);
      }
    }
  };
}

describe('vnode-slot transform', () => {

  describe('baseline tests for custom elements', () => {
    it('simple test', () => {
      const source =
`import { Component, Prop } from "@stencil/core";
import { ActiveRouter, RouterHistory } from "../../global/interfaces";
@Component({
    tag: "stencil-router-redirect"
})
export class Redirect {
    @Prop({ context: "activeRouter" })
    activeRouter: ActiveRouter;
    @Prop()
    url: string;
    componentWillLoad() {
        const history: RouterHistory = this.activeRouter.get("history");
        if (!history) {
            return;
        }
        return history.replace(this.url, {});
    }
}`;
      const output = transformSourceString('source.ts', source, [update]);

      expect(output).toEqual(source + '\nexport const var test = "hi";\n');
    });
  });
});
