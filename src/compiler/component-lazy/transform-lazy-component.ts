import * as d from '../../declarations';
import { catchError } from '../util';
import { isComponentClassNode } from '../transformers/transform-utils';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import ts from 'typescript';


export function transformLazyComponent(config: d.Config, buildCtx: d.BuildCtx, build: d.Build, moduleFile: d.Module, inputJsText: string) {
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
          transformToLazyComponent(build, moduleFile)
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


function transformToLazyComponent(build: d.Build, moduleFile: d.Module): ts.TransformerFactory<ts.SourceFile> {
  const cmp: ComponentData = {
    build: build,
    sourceFileNode: null,
    moduleFile: moduleFile
  };

  return (transformContext) => {

    function visitNode(node: ts.Node) {
      if (isComponentClassNode(node, moduleFile)) {
        return updateComponentClass(cmp, node);
      }
      return node;
    }

    return tsSourceFile => {
      cmp.sourceFileNode = tsSourceFile;

      addImport(build, cmp, 'connectedCallback');

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


function updateComponentClass(cmp: ComponentData, classNode: ts.ClassDeclaration) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    getClassMembers(cmp, classNode)
  );
}


function getClassMembers(_cmp: ComponentData, classNode: ts.ClassDeclaration) {
  const classMembers: ts.ClassElement[] = [];

  classMembers.push(
    addComponentCallback('connectedCallback')
  );

  classNode.members.forEach(classMember => {
    if (classMember.modifiers) {
      const memberName = (classMember.name as any).escapedText;

      if (classMember.modifiers.some(m => m.kind === ts.SyntaxKind.StaticKeyword)) {
        if (REMOVE_STATIC_GETTERS.has(memberName)) {
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


function addComponentCallback(methodName: string) {
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


const REMOVE_STATIC_GETTERS = new Set([
  'is', 'properties', 'encapsulation', 'events', 'listeners', 'states', 'style', 'styleMode', 'styleUrl'
]);


interface ComponentData {
  build: d.Build;
  sourceFileNode: ts.SourceFile;
  moduleFile: d.Module;
}
