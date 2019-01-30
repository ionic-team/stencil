import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, getComponentMeta } from '../transform-utils';
import { REGISTER_INSTANCE_METHOD, registerLazyComponentInConstructor } from './register-lazy-constructor';
import { registerLazyElementGetter } from './register-lazy-element-getter';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { removeStencilImport } from '../remove-stencil-import';
import { registerConstructor } from '../register-constructor';
import ts from 'typescript';


export function transformToLazyComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  if (buildCtx.hasError) {
    return '';
  }

  let outputText = '';

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ModuleKind,
        target: getBuildScriptTarget(build)
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          lazyComponentTransform(compilerCtx)
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


export function lazyComponentTransform(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {
    return tsSourceFile => {

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmpMeta = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmpMeta) {
            return updateComponentClass(node, cmpMeta);
          }
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return removeStencilImport(node as ts.ImportDeclaration);
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }
      const importFnNames = [
        REGISTER_INSTANCE_METHOD,
        'h',
        '__stencil_getElement',
        '__stencil_getConnect',
        '__stencil_getContext',
        '__stencil_createEvent'
      ];

      tsSourceFile = addImports(transformCtx, tsSourceFile,
        importFnNames,
        '@stencil/core/app',
      );

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}


function updateComponentClass(classNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateLazyComponentMembers(classNode, cmpMeta)
  );
}


function updateLazyComponentMembers(classNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  registerLazyComponentInConstructor(classMembers);
  registerLazyElementGetter(classMembers, cmpMeta);
  registerConstructor(classMembers, cmpMeta);

  return classMembers;
}
