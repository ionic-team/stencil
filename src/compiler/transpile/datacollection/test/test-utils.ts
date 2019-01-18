import * as d from '@declarations';
import { getComponentDecoratorMeta } from '../component-decorator';
import * as path from 'path';
import ts from 'typescript';


const compilerOptions: ts.CompilerOptions = {
  'allowJs': true,
  'string': true,
  'strictPropertyInitialization': false,
  'allowSyntheticDefaultImports': true,
  'allowUnreachableCode': false,
  'alwaysStrict': true,
  'experimentalDecorators': true,
  'forceConsistentCasingInFileNames': true,
  'jsx': ts.JsxEmit.React,
  'jsxFactory': 'h',
  'lib': [
    'dom',
    'es2017'
  ],
  'module': ts.ModuleKind.ESNext,
  'moduleResolution': ts.ModuleResolutionKind.NodeJs,
  'noImplicitAny': true,
  'noImplicitReturns': true,
  'noUnusedLocals': true,
  'noUnusedParameters': true,
  'outDir': '.tmp',
  'pretty': true,
  'removeComments': false,
  'target': ts.ScriptTarget.ES2017
};

export type GatherMetadataCallback = (
  checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile?: ts.SourceFile, diagnostics?: d.Diagnostic[]
) => void;

export function gatherMetadata(sourceFilePath: string, callback: GatherMetadataCallback) {
  const program = ts.createProgram([sourceFilePath], compilerOptions);
  const checker = program.getTypeChecker();
  const componentMetaList: d.ComponentMeta[] = [];
  const diagnostics: d.Diagnostic[] = [];

  const visitFile = visitFactory(checker, componentMetaList, diagnostics, callback);

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.endsWith('.d.ts')) {
      visitFile(sourceFile, sourceFile as ts.SourceFile);
    }
  }
  return diagnostics;
}

function visitFactory(checker: ts.TypeChecker, componentMetaList: d.ComponentMeta[], diagnostics: d.Diagnostic[], callback: GatherMetadataCallback) {
  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isClassDeclaration(node)) {
      callback(checker, node, sourceFile, diagnostics);
      return node;
    }
    return ts.forEachChild(node, (node) => {
      return visit(node, sourceFile);
    });
  };
}
