import { addStaticMeta } from '../add-component-metadata';
import { ComponentMeta, ModuleFiles } from '../../../../declarations';
import { normalizePath } from '../../../util';
import * as ts from 'typescript';


export default function upgradeFromMetadata(moduleFiles: ModuleFiles) {
  const allModuleFiles = Object.keys(moduleFiles).map(filePath => {
    return moduleFiles[filePath];
  });

  return (tsSourceFile: ts.SourceFile) => {
    const tsFilePath = normalizePath(tsSourceFile.fileName);

    let moduleFile = moduleFiles[tsFilePath];
    if (!moduleFile || !moduleFile.cmpMeta) {
      moduleFile = allModuleFiles.find(m => m.jsFilePath === tsFilePath);
    }

    if (moduleFile) {
      tsSourceFile = upgradeModuleFile(tsSourceFile, moduleFile.cmpMeta);
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
