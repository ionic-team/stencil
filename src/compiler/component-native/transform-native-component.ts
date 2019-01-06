import * as d from '../../declarations';
import { catchError } from '../util';
import { isComponentClassNode } from '../transformers/transform-utils';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { removeStaticMetaProperties } from '../transformers/remove-static-meta-properties';
import { removeStencilImport } from '../transformers/remove-stencil-import';
import ts from 'typescript';


export function transformNativeComponent(config: d.Config, buildCtx: d.BuildCtx, build: d.Build, moduleFile: d.Module, inputJsText: string) {
  if (buildCtx.hasError) {
    return '';
  }

  const c: string[] = [];

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        removeComments: (build.isDev || config.logLevel === 'debug') ? false : true,
        target: build.es5 ? ts.ScriptTarget.ES5 : ts.ScriptTarget.ES2017
      },
      fileName: moduleFile.jsFilePath,
      transformers: {
        after: [
          transformToNativeComponent(build, moduleFile)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(null, buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError) {
      c.push(transpileOutput.outputText);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return c.join('\n');
}


function transformToNativeComponent(build: d.Build, moduleFile: d.Module): ts.TransformerFactory<ts.SourceFile> {
  const cmp: ComponentData = {
    build: build,
    sourceFileNode: null,
    moduleFile: moduleFile
  };

  return (transformContext) => {

    function visitNode(node: ts.Node) {
      if (isComponentClassNode(node, moduleFile)) {
        return updateComponentClass(node);

      } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        return removeStencilImport(node as ts.ImportDeclaration);
      }

      return node;
    }

    return tsSourceFile => {
      cmp.sourceFileNode = tsSourceFile;

      addImport(build, cmp, 'connectedCallback');

      if (build.vdomRender) {
        addImport(build, cmp, 'h');
      }

      return ts.visitEachChild(cmp.sourceFileNode, visitNode, transformContext);
    };
  };
}


function addImport(build: d.Build, cmp: ComponentData, importFnName: string) {
  const importDeclaration = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(undefined, ts.createNamedImports([
      ts.createImportSpecifier(undefined, ts.createIdentifier(importFnName))
    ])),
    ts.createLiteral(build.coreImportPath)
  );

  cmp.sourceFileNode = ts.updateSourceFileNode(cmp.sourceFileNode, [
    importDeclaration,
    ...cmp.sourceFileNode.statements
  ]);
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

  addSuperToHostConstructor(classMembers);

  classMembers.push(
    addHostComponentCallback('connectedCallback')
  );

  return classMembers;
}


function addSuperToHostConstructor(classMembers: ts.ClassElement[]) {
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


function addHostComponentCallback(methodName: string) {
  const args: any = [
    ts.createThis()
  ];

  const stencilCallbackFnCall = ts.createCall(
    ts.createIdentifier(methodName), undefined, args
  );

  const body = ts.createBlock([
    ts.createExpressionStatement(stencilCallbackFnCall)
  ], true);

  // function call to stencil's exported connectedCallback(elm, plt)
  const callbackMethod = ts.createMethod(undefined, undefined, undefined,
    methodName, undefined, undefined, undefined, undefined,
    body
  );
  return callbackMethod;
}


interface ComponentData {
  build: d.Build;
  sourceFileNode: ts.SourceFile;
  moduleFile: d.Module;
}
