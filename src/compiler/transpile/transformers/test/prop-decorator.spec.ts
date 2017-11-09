import { Diagnostic, MembersMeta } from '../../../../util/interfaces';
import { transformSourceFile } from '../util';
import { getPropDecoratorMeta } from '../prop-decorator';
import { MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import * as ts from 'typescript';

function customJsxTransform(source): [MembersMeta, Diagnostic[]] {
  let metadata: MembersMeta = {};
  let diagnosticList: Diagnostic[] = [];

  function visitFile(): ts.TransformerFactory<ts.SourceFile> {
    let sourceFile: ts.SourceFile;
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
        sourceFile = tsSourceFile;
        return visit(tsSourceFile) as ts.SourceFile;
      };
    };

    function visitClass(classNode: ts.ClassDeclaration) {
      metadata = getPropDecoratorMeta('/tsfilepath.ts', diagnosticList, classNode, sourceFile);
      return classNode;
    }
  }


  transformSourceFile(source, {
    before: [
      visitFile()
    ]
  });

  return [ metadata, diagnosticList ];
}

describe('prop-decorator transform', () => {
  it('simple test for baseline', () => {
    const source = `
      class Redirect {
      }
    `;
    const [ metadata, diagnostics ] = customJsxTransform(source);
    expect(diagnostics.length).toBe(0);
    expect(metadata).toEqual({
    });
  });

  it('@Prop( context )', () => {
    const source = `
      class Redirect {
        @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
      }
    `;
    const [ metadata, diagnostics ] = customJsxTransform(source);
    expect(diagnostics.length).toBe(0);
    expect(metadata).toEqual({
      'activeRouter': {
        'ctrlId': 'activeRouter',
        'memberType': MEMBER_TYPE.PropContext
      }
    });
  });
  it('@Prop() no type defined', () => {
    const source = `
      class Redirect {
        @Prop() url;
      }
    `;
    const [ metadata, diagnostics ] = customJsxTransform(source);
    expect(diagnostics.length).toBe(1);
    expect(metadata).toEqual({
      'url': {
        'attribName': 'url',
        'attribType': {
          'text': 'any',
          'isReferencedType': false
        },
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.Any
      }
    });
  });

  describe('String Props', () => {
    it('@Prop() type defined as string ', () => {
      const source = `
        class Redirect {
          @Prop() url: string;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'url': {
          'attribName': 'url',
          'attribType': {
            'text': 'string',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.String
        }
      });
    });
    it('@Prop() inferred as a string ', () => {
      const source = `
        class Redirect {
          @Prop() url = '';
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'url': {
          'attribName': 'url',
          'attribType': {
            'text': 'string',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.String
        }
      });
    });
  });

  describe('Boolean Props', () => {
    it('@Prop() type defined as boolean', () => {
      const source = `
        class Redirect {
          @Prop() show: boolean;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'show': {
          'attribName': 'show',
          'attribType': {
            'text': 'boolean',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Boolean
        }
      });
    });
    it('@Prop() inferred as a boolean', () => {
      const source = `
        class Redirect {
          @Prop() show = true;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'show': {
          'attribName': 'show',
          'attribType': {
            'text': 'boolean',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Boolean
        }
      });
    });
  });

  describe('Numberic Props', () => {
    it('@Prop() type defined as number', () => {
      const source = `
        class Redirect {
          @Prop() count: number;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'count': {
          'attribName': 'count',
          'attribType': {
            'text': 'number',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Number
        }
      });
    });
    it('@Prop() inferred as a number', () => {
      const source = `
        class Redirect {
          @Prop() count = 0;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'count': {
          'attribName': 'count',
          'attribType': {
            'text': 'number',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Number
        }
      });
    });
    it('@Prop() union as a number', () => {
      const source = `
        class Redirect {
          @Prop() count: 1 | 2;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'count': {
          'attribName': 'count',
          'attribType': {
            'text': '1 | 2',
            'isReferencedType': false
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Any
        }
      });
    });
  });

  it('@Prop() type defined as any', () => {
    const source = `
      class Redirect {
        @Prop() objectAnyThing: any;
      }
    `;
    const [ metadata, diagnostics ] = customJsxTransform(source);
    expect(diagnostics.length).toBe(0);
    expect(metadata).toEqual({
      'objectAnyThing': {
        'attribName': 'objectAnyThing',
        'attribType': {
          'text': 'any',
          'isReferencedType': false
        },
        'memberType': MEMBER_TYPE.Prop,
        'propType': PROP_TYPE.Any
      }
    });
  });

  describe('Reference type exports', () => {
    it('@Prop() type defined and not exported', () => {
      const source = `
        interface Thing {
          red: boolean;
        }
        class Redirect {
          @Prop() objectAnyThing: Thing;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(1);
      expect(diagnostics[0].header).toEqual('Prop has referenced interface that is not exported, defaulting type to any');
    });

    it('@Prop() type as a referenced interface that is exported', () => {
      const source = `
        export interface Thing {
          red: boolean;
        }
        class Redirect {
          @Prop() objectAnyThing: Thing;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'objectAnyThing': {
          'attribName': 'objectAnyThing',
          'attribType': {
            'text': 'Thing',
            'isReferencedType': true
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Any
        }
      });
    });
    it('@Prop() type as a referenced interface that is not exported', () => {
      const source = `
        interface Thing {
          red: boolean;
        }
        export { Thing };
        class Redirect {
          @Prop() objectAnyThing: Thing;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'objectAnyThing': {
          'attribName': 'objectAnyThing',
          'attribType': {
            'text': 'Thing',
            'isReferencedType': true
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Any
        }
      });
    });
    it('@Prop() type as a referenced interface that is imported and exported', () => {
      const source = `
        import { Thing } from '../../interfaces';
        export { Thing };
        class Redirect {
          @Prop() objectAnyThing: Thing;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'objectAnyThing': {
          'attribName': 'objectAnyThing',
          'attribType': {
            'text': 'Thing',
            'isReferencedType': true
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Any
        }
      });
    });
    it('@Prop() type as a referenced interface that is imported and not exported', () => {
      const source = `
        import { Thing } from '../../interfaces';
        class Redirect {
          @Prop() objectAnyThing: Thing;
        }
      `;
      const [ metadata, diagnostics ] = customJsxTransform(source);
      expect(diagnostics.length).toBe(0);
      expect(metadata).toEqual({
        'objectAnyThing': {
          'attribName': 'objectAnyThing',
          'attribType': {
            'text': 'Thing',
            'isReferencedType': true,
            'importedFrom': '../../interfaces'
          },
          'memberType': MEMBER_TYPE.Prop,
          'propType': PROP_TYPE.Any
        }
      });
    });
  });
});
