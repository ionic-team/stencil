import { addBundleExportsFromTags, addComponentExport } from '../add-component-exports';
import { addStaticMeta } from '../add-component-metadata';
import { BuildConfig, ComponentMeta, Bundle } from '../../../../util/interfaces';
import { dashToPascalCase } from '../../../../util/helpers';
import { normalizePath } from '../../../util';
import * as ts from 'typescript';


export default function upgradeFromMetadata(config: BuildConfig, bundles: Bundle[]) {

  return (tsSourceFile: ts.SourceFile) => {
    const tsFilePath = normalizePath(tsSourceFile.fileName);

    const bundle = bundles.find(m => {
      return m.moduleFiles.some(m => m.cmpMeta && normalizePath(m.jsFilePath) === tsFilePath);
    });

    if (!bundle) {
      return tsSourceFile;
    }

    const moduleFile = bundle.moduleFiles.find(m => m.cmpMeta && normalizePath(m.jsFilePath) === tsFilePath);

    if (moduleFile) {
      tsSourceFile = upgradeModuleFile(config, tsSourceFile, moduleFile.cmpMeta);
      tsSourceFile = upgradeExport(tsSourceFile, moduleFile.cmpMeta);
      tsSourceFile = upgradeBundleExports(config, tsSourceFile, bundle, moduleFile.cmpMeta.tagNameMeta);
    }

    return tsSourceFile;
  };
}


function upgradeModuleFile(config: BuildConfig, tsSourceFile: ts.SourceFile, cmpMeta: ComponentMeta) {
  const staticMembers = addStaticMeta(config, cmpMeta);

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

  return addComponentExport(tsSourceFile, cmpMeta);
}


function upgradeBundleExports(_config: BuildConfig, tsSourceFile: ts.SourceFile, bundle: Bundle, tagName: string) {
  const bundleTagNames = bundle.moduleFiles
    .filter(m => {
      if (m.cmpMeta && m.jsFilePath.indexOf('__tests__') === -1) {
        return true;
      }
      return false;
    })
    .map(m => m.cmpMeta.tagNameMeta);
  return addBundleExportsFromTags(tsSourceFile, bundleTagNames, tagName);
}
