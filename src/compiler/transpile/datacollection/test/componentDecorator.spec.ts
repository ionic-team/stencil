import { ComponentMeta, Diagnostic } from '../../../../util/interfaces';
import { ENCAPSULATION } from '../../../../util/constants';
import { getComponentDecoratorMeta } from '../componentDecorator';
import * as path from 'path';
import * as ts from 'typescript';
import { CompilerOptions } from 'typescript';

const compilerOptions: CompilerOptions = {
  'allowJs': true,
  'allowSyntheticDefaultImports': true,
  'allowUnreachableCode': false,
  'alwaysStrict': true,
  'experimentalDecorators': true,
  'forceConsistentCasingInFileNames': true,
  'jsx': ts.JsxEmit.React,
  'jsxFactory': 'h',
  'lib': [
    'dom',
    'es2015'
  ],
  'module': ts.ModuleKind.ES2015,
  'moduleResolution': ts.ModuleResolutionKind.NodeJs,
  'noImplicitAny': true,
  'noImplicitReturns': true,
  'noUnusedLocals': true,
  'noUnusedParameters': true,
  'outDir': '.tmp',
  'pretty': true,
  'removeComments': false,
  'target': ts.ScriptTarget.ES2015
};

type NodeCallback = (classNode: ts.ClassDeclaration) => void;


function gatherMetadata(sourceFilePath: string, callback: NodeCallback) {
  const program = ts.createProgram([sourceFilePath], compilerOptions);
  const checker = program.getTypeChecker();
  const componentMetaList: ComponentMeta[] = [];
  const diagnostics: Diagnostic[] = [];

  const visitFile = visitFactory(checker, componentMetaList, diagnostics, callback);

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.endsWith('.d.ts')) {
      visitFile(sourceFile, sourceFile as ts.SourceFile);
    }
  }
}

function visitFactory(checker: ts.TypeChecker, componentMetaList: ComponentMeta[], diagnostics: Diagnostic[], callback: NodeCallback) {
  return function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isClassDeclaration(node)) {
      callback(node);
      return node;
    }
    return ts.forEachChild(node, (node) => {
      return visit(node, sourceFile);
    });
  };
}

describe('component decorator', () => {

  describe('getComponentDecoratorMeta', () => {
    it('default no encapsulation', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './exampleComponent');
      const metadata = gatherMetadata(sourceFilePath, (classNode) => {
        response = getComponentDecoratorMeta(classNode);
      });
      console.log(response);
      expect(typeof response).toBe('object');
    });
  });

});
