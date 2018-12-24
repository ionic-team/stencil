import * as d from '../../declarations';
import { catchError } from '../util';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import ts from 'typescript';


export function updateComponentForBuild(moduleFile: d.Module): ts.TransformerFactory<ts.SourceFile> {
  return (transformContext) => {

    function visitNode(node: ts.Node) {
      if (isComponentClassNode(node, moduleFile)) {
        return updateComponentClass(node);
      }
      return node;
    }

    return tsSourceFile => ts.visitEachChild(tsSourceFile, visitNode, transformContext);
  };
}


function updateComponentClass(classNode: ts.ClassDeclaration) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    getClassHeritageClauses(classNode),
    getClassMembers(classNode)
  );
}


function addConnectedCallback() {
  const args: any = [
    ts.createThis()
  ];

  // function call to stencil's exported connectedCallback(elm, plt)
  const stencilConnectedCallbackFnCall = ts.createCall(
    ts.createIdentifier('connectedCallback'), undefined, args
  );

  const body = ts.createBlock([
    ts.createExpressionStatement(stencilConnectedCallbackFnCall)
  ], true);


  // function call to stencil's exported connectedCallback(elm, plt)
  const connectedCallbackMethod = ts.createMethod(undefined, undefined, undefined,
    'connectedCallback', undefined, undefined, undefined, undefined,
    body
  );
  return connectedCallbackMethod;
}


function addDisconnectedCallback() {
  const args: any = [
    ts.createThis()
  ];

  // function call to stencil's exported disconnectedCallback(elm, plt)
  const stencilDisconnectedCallbackFnCall = ts.createCall(
    ts.createIdentifier('disconnectedCallback'), undefined, args
  );

  const body = ts.createBlock([
    ts.createExpressionStatement(stencilDisconnectedCallbackFnCall)
  ], true);

  // function call to stencil's exported connectedCallback(elm, plt)
  const disconnectedCallbackMethod = ts.createMethod(undefined, undefined, undefined,
    'disconnectedCallback', undefined, undefined, undefined, undefined,
    body
  );
  return disconnectedCallbackMethod;
}


function getClassMembers(classNode: ts.ClassDeclaration) {
  const classMembers: ts.ClassElement[] = [];

  classMembers.push(
    addConnectedCallback()
  );

  classMembers.push(
    addDisconnectedCallback()
  );

  classNode.members.forEach(classMember => {
    if (classMember.modifiers) {
      const memberName = (classMember.name as any).escapedText;

      if (classMember.modifiers.some(m => m.kind === ts.SyntaxKind.StaticKeyword)) {
        if (memberName === 'is') {
          return;
        }
        if (memberName === 'properties') {
          return;
        }
        if (memberName === 'encapsulation') {
          return;
        }
        if (memberName === 'style') {
          return;
        }
        if (memberName === 'styleMode') {
          return;
        }
      }
    }

    classMembers.push(
      classMember
    );
  });

  return classMembers;
}


export function updateComponentSource(buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, moduleFile: d.Module, inputJsText: string) {
  if (buildCtx.hasError) {
    return '';
  }

  const c: string[] = [];

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: build.es5 ? ts.ScriptTarget.ES5 : ts.ScriptTarget.ES2017
      },
      fileName: moduleFile.jsFilePath,
      transformers: {
        after: [
          updateComponentForBuild(moduleFile)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(null, buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError) {

      c.push(`import { connectedCallback, disconnectedCallback, attributeChangedCallback } from '${coreImportPath}';`);

      c.push(transpileOutput.outputText);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return c.join('\n');
}


function getClassHeritageClauses(classNode: ts.ClassDeclaration) {
  const heritageClause = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments([], ts.createIdentifier('HTMLElement'))
    ]
  );

  const cstrMethod = classNode.members.find(classMember => {
    return (classMember.kind === ts.SyntaxKind.Constructor);
  }) as ts.MethodDeclaration;

  if (cstrMethod) {
    const superCall = ts.createCall(
      ts.createIdentifier('super'), undefined, undefined
    );

    cstrMethod.body = ts.updateBlock(cstrMethod.body, [
      ts.createExpressionStatement(superCall),
      ...cstrMethod.body.statements
    ]);
  }

  return [heritageClause];
}


function isComponentClassNode(node: ts.Node, moduleFile: d.Module): node is ts.ClassDeclaration {
  if (ts.isClassDeclaration(node)) {
    if (node.name.getText().trim() === moduleFile.cmpCompilerMeta.componentClassName) {
      return true;
    }
  }
  return false;
}
