import { addBundleExportsFromTags, addComponentExport } from '../add-component-exports';
import { addStaticMeta } from '../add-component-metadata';
import { BuildConfig, ComponentMeta, ManifestBundle } from '../../../../util/interfaces';
import { dashToPascalCase } from '../../../../util/helpers';
import { normalizePath } from '../../../util';
import * as ts from 'typescript';


export default function upgradeFromMetadata(config: BuildConfig, manifestBundles: ManifestBundle[]) {

  return (tsSourceFile: ts.SourceFile) => {
    const tsFilePath = normalizePath(tsSourceFile.fileName);

    const manifestBundle = manifestBundles.find(m => {
      return m.moduleFiles.some(m => m.cmpMeta && normalizePath(m.jsFilePath) === tsFilePath);
    });

    if (!manifestBundle) {
      return tsSourceFile;
    }

    const moduleFile = manifestBundle.moduleFiles.find(m => m.cmpMeta && normalizePath(m.jsFilePath) === tsFilePath);
    const cmpMeta = moduleFile.cmpMeta;

    if (moduleFile) {
      tsSourceFile = upgradeModuleFile(tsSourceFile, cmpMeta);
      tsSourceFile = upgradeExport(tsSourceFile, cmpMeta);
      tsSourceFile = upgradeBundleExports(config, tsSourceFile, manifestBundle, cmpMeta.tagNameMeta);
    }

    return tsSourceFile;
  };
}


function upgradeModuleFile(tsSourceFile: ts.SourceFile, cmpMeta: ComponentMeta) {
  const staticMembers = addStaticMeta(cmpMeta);

  const newStatements: any = Object.keys(staticMembers).map(memberName => {
    return ts.createBinary(
      ts.createPropertyAccess(ts.createIdentifier(cmpMeta.componentClass), memberName),
      ts.createToken(ts.SyntaxKind.EqualsToken),
      (staticMembers as any)[memberName]
    );
  });

  return ts.updateSourceFileNode(tsSourceFile, [
    ...tsSourceFile.statements,
    ...newStatements
  ]);
}


function upgradeExport(tsSourceFile: ts.SourceFile, cmpMeta: ComponentMeta) {
  const pascalCaseTagName = dashToPascalCase(cmpMeta.tagNameMeta);

  const hasExportDeclaration = tsSourceFile.statements.some(s => {
    if (s.kind === ts.SyntaxKind.ExportDeclaration) {
      const n = s as ts.ExportDeclaration;
      return n.exportClause.elements.some(e => {
        return e.name.text === pascalCaseTagName;
      });
    }
    return false;
  });

  if (hasExportDeclaration) {
    return tsSourceFile;
  }

  return addComponentExport(tsSourceFile, cmpMeta.componentClass, cmpMeta.tagNameMeta);
}


function upgradeBundleExports(_config: BuildConfig, tsSourceFile: ts.SourceFile, manifestBundle: ManifestBundle, tagName: string) {
  const bundleTagNames = manifestBundle.moduleFiles
    .filter(m => {
      if (m.cmpMeta && m.jsFilePath.indexOf('__tests__') === -1) {
        return true;
      }
      return false;
    })
    .map(m => m.cmpMeta.tagNameMeta);
  return addBundleExportsFromTags(tsSourceFile, bundleTagNames, tagName);
}
