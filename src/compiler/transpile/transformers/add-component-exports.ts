import { BuildConfig, BuildContext } from '../../../util/interfaces';
import { dashToPascalCase } from '../../../util/helpers';
import { getJsPathBundlePlaceholder } from '../../../util/data-serialize';
import * as ts from 'typescript';


export function addComponentExports(config: BuildConfig, ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    let componentClassName: string;

    function visitComponentFile(tsSourceFile: ts.SourceFile, tagName: string): ts.Node {
      tsSourceFile = visit(tsSourceFile, tagName) as ts.SourceFile;
      tsSourceFile = addComponentExport(tsSourceFile, componentClassName, tagName);
      tsSourceFile = addBundleExports(config, tsSourceFile, tagName);
      return tsSourceFile;
    }

    function visitClass(classNode: ts.ClassDeclaration) {
      componentClassName = classNode.name.text;
      classNode = removeComponentExport(classNode);
      return classNode;
    }

    function visit(node: ts.Node, tagName: string): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(node as ts.ClassDeclaration);
        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node, tagName);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const moduleFile = ctx.moduleFiles[tsSourceFile.fileName];
      if (moduleFile && moduleFile.cmpMeta) {
        return visitComponentFile(tsSourceFile, moduleFile.cmpMeta.tagNameMeta) as ts.SourceFile;
      }
      return tsSourceFile;
    };
  };
}


function removeComponentExport(classNode: ts.ClassDeclaration) {
  if (classNode.modifiers) {
    classNode.modifiers = ts.createNodeArray(
      classNode.modifiers.filter(m => {
        return m.kind !== ts.SyntaxKind.ExportKeyword && m.kind !== ts.SyntaxKind.DefaultKeyword;
      })
    );
  }
  return classNode;
}


export function addComponentExport(tsSourceFile: ts.SourceFile, componentClassName: string, tagName: string) {
  const componentName = ts.createIdentifier(componentClassName);
  const exportAsName = ts.createIdentifier(dashToPascalCase(tagName));

  return ts.updateSourceFileNode(tsSourceFile, [
    ...tsSourceFile.statements,
    ts.createExportDeclaration(
      undefined,
      undefined,
      ts.createNamedExports([
        ts.createExportSpecifier(componentName, exportAsName)
      ])
    )
  ]);
}


function addBundleExports(config: BuildConfig, tsSourceFile: ts.SourceFile, tagName: string) {
  const containingBundle = config.bundles.find(b => Array.isArray(b.components) && b.components.indexOf(tagName) > -1);
  if (!containingBundle) {
    return tsSourceFile;
  }

  return addBundleExportsFromTags(tsSourceFile, containingBundle.components, tagName);
}


export function addBundleExportsFromTags(tsSourceFile: ts.SourceFile, bundleTagNames: string[], tagName: string) {
  if (bundleTagNames && bundleTagNames.length > 1) {
    bundleTagNames.filter(t => t !== tagName).forEach(tagName => {
      const pascalCaseComponentName = ts.createIdentifier(dashToPascalCase(tagName));

      tsSourceFile = ts.updateSourceFileNode(tsSourceFile, [
        ...tsSourceFile.statements,
        ts.createExportDeclaration(
          undefined,
          undefined,
          ts.createNamedExports([
            ts.createExportSpecifier(pascalCaseComponentName, pascalCaseComponentName)
          ]),
          ts.createLiteral(getJsPathBundlePlaceholder(tagName))
        )
      ]);
    });
  }

  return tsSourceFile;
}
