import { Diagnostic, MembersMeta } from '../../../../util/interfaces';
import { transformSourceFile } from '../util';
import { getPropDecoratorMeta } from '../prop-decorator';
import { MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import * as ts from 'typescript';

function customJsxTransform(source) {
  let metadata: MembersMeta = {};

  function visitFile(): ts.TransformerFactory<ts.SourceFile> {
    return (transformContext) => {
      function visit(node: ts.Node): ts.VisitResult<ts.Node> {
        switch (node.kind) {
          case ts.SyntaxKind.ClassDeclaration:
            return visitClass(node as ts.ClassDeclaration);

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

    function visitClass(classNode: ts.ClassDeclaration) {
      metadata = getPropDecoratorMeta('/tsfilepath.ts', [] as Diagnostic[], classNode);
      return classNode;
    }
  }


  transformSourceFile(source, {
    before: [
      visitFile()
    ]
  });

  return metadata;
}

describe('prop-decorator transform', () => {
  it('simple test for baseline', () => {
    const source = `
      class Redirect {
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
    });
  });

  it('@Prop( context )', () => {
    const source = `
      class Redirect {
        @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
      'activeRouter': {
        'ctrlId': 'activeRouter',
        'memberType': MEMBER_TYPE.PropContext
      }
    });
  });

  it('@Prop() type defined as string ', () => {
    const source = `
      class Redirect {
        @Prop() url: string;
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
      'url': {
        'attribName': 'url',
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.String
      }
    });
  });

  it('@Prop() type defined as boolean', () => {
    const source = `
      class Redirect {
        @Prop() show: boolean;
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
      'show': {
        'attribName': 'show',
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.Boolean
      }
    });
  });
  it('@Prop() type defined as number', () => {
    const source = `
      class Redirect {
        @Prop() count: number;
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
      'count': {
        'attribName': 'count',
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.Number
      }
    });
  });
  it('@Prop() type defined as any', () => {
    const source = `
      class Redirect {
        @Prop() objectAnyThing: any;
      }
    `;
    const metadata = customJsxTransform(source);

    expect(metadata).toEqual({
      'objectAnyThing': {
        'attribName': 'objectAnyThing',
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.Any
      }
    });
  });
});
