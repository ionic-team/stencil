import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, isComponentClassNode } from '../transform-utils';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { removeStencilImport } from '../remove-stencil-import';
import ts from 'typescript';


export function transformToNativeComponentText(config: d.Config, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  if (buildCtx.hasError) {
    return '';
  }

  const c: string[] = [];

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ModuleKind,
        removeComments: (build.isDev || config.logLevel === 'debug') ? false : true,
        target: getBuildScriptTarget(build)
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          nativeComponentTransform(build)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError) {
      c.push(transpileOutput.outputText);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return c.join('\n');
}


function nativeComponentTransform(build: d.Build): ts.TransformerFactory<ts.SourceFile> {
  return transformCtx => {

    function visitNode(node: ts.Node) {
      if (isComponentClassNode(node)) {
        return updateComponentClass(node);

      } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        return removeStencilImport(node as ts.ImportDeclaration);
      }

      return node;
    }

    return tsSourceFile => {
      const importFns = ['connectedCallback'];

      if (build.vdomRender) {
        importFns.push('h');
      }

      tsSourceFile = addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/runtime');

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}


function updateComponentClass(classNode: ts.ClassDeclaration) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    updateHostComponentHeritageClauses(),
    updateHostComponentMembers(classNode)
  );
}


function updateHostComponentHeritageClauses() {
  const heritageClause = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments([], ts.createIdentifier('HTMLElement'))
    ]
  );

  return [heritageClause];
}


function updateHostComponentMembers(classNode: ts.ClassDeclaration) {
  const classMembers = removeStaticMetaProperties(classNode);

  addSuperToConstructor(classMembers);
  addConnectedCallback(classMembers);

  return classMembers;
}


function addSuperToConstructor(classMembers: ts.ClassElement[]) {
  const cstrMethod = classMembers.find(classMember => {
    return (classMember.kind === ts.SyntaxKind.Constructor);
  }) as ts.ConstructorDeclaration;

  if (cstrMethod) {
    const superCall = ts.createCall(
      ts.createIdentifier('super'),
      undefined,
      undefined
    );

    cstrMethod.body = ts.updateBlock(cstrMethod.body, [
      ts.createExpressionStatement(superCall),
      ...cstrMethod.body.statements
    ]);
  }
}


function addConnectedCallback(classMembers: ts.ClassElement[]) {
  // function call to stencil's exported connectedCallback(elm, plt)
  const methodName = 'connectedCallback';

  const args: any = [
    ts.createThis()
  ];

  const fnCall = ts.createCall(
    ts.createIdentifier(methodName), undefined, args
  );

  const connectedCallback = classMembers.find(classMember => {
    return (classMember.kind === ts.SyntaxKind.MethodDeclaration && (classMember.name as any).escapedText === methodName);
  }) as ts.MethodDeclaration;

  if (connectedCallback != null) {
    // class already has a connectedCallback(), so update it
    connectedCallback.body = ts.updateBlock(connectedCallback.body, [
      ts.createExpressionStatement(fnCall),
      ...connectedCallback.body.statements
    ]);

  } else {
    // class doesn't have a connectedCallback(), so add it
    const body = ts.createBlock([
      ts.createExpressionStatement(fnCall)
    ], true);

    const callbackMethod = ts.createMethod(undefined, undefined, undefined,
      methodName, undefined, undefined, undefined, undefined,
      body
    );
    classMembers.push(callbackMethod);
  }
}
