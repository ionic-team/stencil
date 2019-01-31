import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { registerConstructor } from '../register-constructor';
import { registerStyle } from '../register-style';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { removeStencilImport } from '../remove-stencil-import';
import ts from 'typescript';


export function transformToNativeComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  if (buildCtx.shouldAbort) {
    return null;
  }

  let outputText: string = null;

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ModuleKind,
        target: getBuildScriptTarget(build)
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          nativeComponentTransform(compilerCtx)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError && typeof transpileOutput.outputText === 'string') {
      outputText = transpileOutput.outputText;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return outputText;
}


function nativeComponentTransform(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(moduleFile, node);
          if (cmp != null) {
            return updateComponentClass(node, cmp);
          }

        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return removeStencilImport(node as ts.ImportDeclaration);
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      const importFns = [
        'connectedCallback',
        'h',
        'registerInstance',
        'getElement as __stencil_getElement',
        'getConnect as __stencil_getConnect',
        'getContext as __stencil_getContext',
        'createEvent as __stencil_createEvent'
      ];

      tsSourceFile = addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/runtime');

      if (moduleFile != null) {
        tsSourceFile = registerStyle(transformCtx, tsSourceFile, moduleFile.cmps);
      }

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}


function updateComponentClass(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    updateHostComponentHeritageClauses(),
    updateHostComponentMembers(classNode, cmp)
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


function updateHostComponentMembers(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  addSuperToConstructor(classMembers);
  addConnectedCallback(classMembers);
  registerConstructor(classMembers, cmp);
  registerElementGetter(classMembers, cmp);

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

function registerElementGetter(classMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  // @Element() element;
  // is transformed into:
  // get element() { return this; }
  if (cmpMeta.elementRef) {
    classMembers.push(
      ts.createGetAccessor(
        undefined,
        undefined,
        cmpMeta.elementRef,
        [],
        undefined,
        ts.createBlock([
          ts.createReturn(
            ts.createThis()
          )
        ])
      )
    );
  }
}
