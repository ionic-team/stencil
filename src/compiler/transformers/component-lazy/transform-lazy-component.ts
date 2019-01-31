import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { registerLazyComponentInConstructor } from './register-lazy-constructor';
import { registerConstructor } from '../register-constructor';
import { registerLazyElementGetter } from './register-lazy-element-getter';
import { registerStyle } from '../register-style';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { removeStencilImport } from '../remove-stencil-import';
import ts from 'typescript';


export function transformToLazyComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputText: string) {
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
          lazyComponentTransform(compilerCtx)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError && typeof transpileOutput.outputText === 'string') {
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
        'h',
        'registerInstance',
        'getElement as __stencil_getElement',
        'getConnect as __stencil_getConnect',
        'getContext as __stencil_getContext',
        'createEvent as __stencil_createEvent'
      ];

      tsSourceFile = addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');

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
    classNode.heritageClauses,
    updateLazyComponentMembers(classNode, cmp)
  );
}


function updateLazyComponentMembers(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  registerLazyComponentInConstructor(classMembers);
  registerLazyElementGetter(classMembers, cmp);
  registerConstructor(classMembers, cmp);

  return classMembers;
}
