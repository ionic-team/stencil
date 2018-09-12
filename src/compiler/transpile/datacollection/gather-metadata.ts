import * as d from '../../../declarations';
import { getCollections } from './discover-collections';
import { getComponentDecoratorMeta } from './component-decorator';
import { getElementDecoratorMeta } from './element-decorator';
import { getEventDecoratorMeta } from './event-decorator';
import { getListenDecoratorMeta } from './listen-decorator';
import { getMethodDecoratorMeta } from './method-decorator';
import { getModuleFile } from '../../build/compiler-ctx';
import { getPropDecoratorMeta } from './prop-decorator';
import { getStateDecoratorMeta } from './state-decorator';
import { getWatchDecoratorMeta } from './watch-decorator';
import { normalizeAssetsDir } from '../../component-plugins/assets-plugin';
import { normalizeStyles } from '../../style/normalize-styles';
import { validateComponentClass } from './validate-component';
import * as ts from 'typescript';
import { buildError, buildWarn } from '../../util';
import { isDecoratorNamed } from './utils';


export function gatherMetadata(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node, tsSourceFile: ts.SourceFile, moduleFile: d.ModuleFile) {

      try {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          getCollections(config, compilerCtx, buildCtx.collections, moduleFile, node as ts.ImportDeclaration);
        }

        if (ts.isClassDeclaration(node)) {
          const cmpMeta = visitClass(config, buildCtx.diagnostics, typeChecker, node as ts.ClassDeclaration, tsSourceFile);
          if (cmpMeta) {
            if (moduleFile.cmpMeta) {
              throw new Error(`More than one @Component() class in a single file is not valid`);
            }
            moduleFile.cmpMeta = cmpMeta;

            cmpMeta.stylesMeta = normalizeStyles(config, moduleFile.sourceFilePath, cmpMeta.stylesMeta);
            cmpMeta.assetsDirsMeta = normalizeAssetsDir(config, moduleFile.sourceFilePath, cmpMeta.assetsDirsMeta);
          }
        }
        return node;

      } catch ({message}) {
        const error = buildError(buildCtx.diagnostics);
        error.messageText = message;
        error.relFilePath = tsSourceFile.fileName;
      }
      return undefined;
    }

    return (tsSourceFile) => {
      const moduleFile = getModuleFile(compilerCtx, tsSourceFile.fileName);
      moduleFile.externalImports.length = 0;
      moduleFile.localImports.length = 0;
      moduleFile.cmpMeta = undefined;

      const results = ts.visitEachChild(tsSourceFile, (node) => {
        return visit(node, tsSourceFile, moduleFile);
      }, transformContext);

      if (moduleFile.cmpMeta) {
        const fileSymbol = typeChecker.getSymbolAtLocation(tsSourceFile);
        const fileExports = (fileSymbol && typeChecker.getExportsOfModule(fileSymbol)) || [];

        if (fileExports.length > 1) {
          const warn = buildWarn(buildCtx.diagnostics);
          warn.messageText = `@Component() should be the only export of the module.
Numerous export statements within a component module may cause undesirable bundling output, leading to unoptimized lazy loading.
Create a new auxiliar \`.ts\` file in order to export shared functionality.`;
          warn.relFilePath = tsSourceFile.fileName;

        }

        if (
          fileExports.length === 0 ||
          !isComponentClass(fileExports[0])
        ) {
          const error = buildError(buildCtx.diagnostics);
          error.messageText = `Missing export in @Component() class`;
          error.relFilePath = tsSourceFile.fileName;
        }
      }
      return results;
    };
  };
}

function isComponentClass(symbol: ts.Symbol) {
  const decorators = symbol.valueDeclaration && symbol.valueDeclaration.decorators;
  if (!decorators) {
    return false;
  }
  return isDecoratorNamed('Component')(decorators[0]);
}


export function visitClass(
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker,
  classNode: ts.ClassDeclaration,
  sourceFile: ts.SourceFile,
): d.ComponentMeta | undefined {
  const cmpMeta = getComponentDecoratorMeta(diagnostics, typeChecker, classNode);

  if (!cmpMeta) {
    return null;
  }

  const componentClass = classNode.name.getText().trim();

  cmpMeta.componentClass = componentClass;

  cmpMeta.membersMeta = {
    // membersMeta is shared with @Prop, @State, @Method, @Element
    ...getElementDecoratorMeta(typeChecker, classNode),
    ...getMethodDecoratorMeta(config, diagnostics, typeChecker, classNode, sourceFile, componentClass),
    ...getStateDecoratorMeta(classNode),
    ...getPropDecoratorMeta(diagnostics, typeChecker, classNode, sourceFile, componentClass)
  };

  cmpMeta.eventsMeta = getEventDecoratorMeta(diagnostics, typeChecker, classNode, sourceFile);
  cmpMeta.listenersMeta = getListenDecoratorMeta(typeChecker, classNode);

  // watch meta collection MUST happen after prop/state decorator meta collection
  getWatchDecoratorMeta(diagnostics, classNode, cmpMeta);

  // validate the user's component class for any common errors
  validateComponentClass(diagnostics, cmpMeta, classNode);

  // Return Class Declaration with Decorator removed and as default export
  return cmpMeta;
}
