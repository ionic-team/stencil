import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, isComponentClassNode } from '../transform-utils';
import { REGISTER_INSTANCE_METHOD, registerLazyComponentInConstructor } from './register-lazy-constructor';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { removeStencilImport } from '../remove-stencil-import';
import ts from 'typescript';


export function transformToLazyComponentText(config: d.Config, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  if (buildCtx.hasError) {
    return '';
  }

  let outputText = '';

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
          lazyComponentTransform()
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError) {
      outputText = transpileOutput.outputText;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return outputText;
}


export function lazyComponentTransform(): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visitNode(node: ts.Node): any {
      if (isComponentClassNode(node)) {
        return updateComponentClass(node);

      } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        return removeStencilImport(node as ts.ImportDeclaration);
      }

      return ts.visitEachChild(node, visitNode, transformCtx);
    }

    return tsSourceFile => {
      tsSourceFile = addImports(transformCtx, tsSourceFile,
        [REGISTER_INSTANCE_METHOD],
        '@stencil/core/platform',
      );

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
    classNode.heritageClauses,
    updateLazyComponentMembers(classNode)
  );
}


function updateLazyComponentMembers(classNode: ts.ClassDeclaration) {
  const classMembers = removeStaticMetaProperties(classNode);

  registerLazyComponentInConstructor(classMembers);

  return classMembers;
}
