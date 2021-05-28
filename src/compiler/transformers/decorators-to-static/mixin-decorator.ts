import type * as d from '../../../declarations';
import { createStaticGetter, convertValueToLiteral, findImportDeclsWithMemberNames, getImportNamedBindings, getMixinsFromDecorator, MixinDecorators, ImportDeclObj, findImportDeclObjWithModPath, TSsourceFileWithModules, TSModule } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';
import { augmentDiagnosticWithNode, buildError, buildWarn } from '@utils';
import { cloneNode } from '@wessberg/ts-clone-node';
import { dirname, join } from 'path';

/**
 * These methods are used within 2 AST node visits. 1) SourceFile, 2) ClassDeclaration.
 * The tsProgram typeChecker is defined on init and doesn't update on-the-fly when cloning nodes.
 * The typeChecker is used to reference meta within the ClassDeclaration and because the members of our
 * updated class can be from multiple files, the required original meta is lost when we merge new members.
 * So, we keep class members seperate (keeping all original typeChecker refs in place) until stencil has done it's thing.
 *
 * 1. Visit the host file - Setup and Inject Dependencies.
 * Workout the mixin names, their associated import declarations and the real class found within the imported module source.
 * Can be named or default.
 * Find any imported module dependencies and other declarations so we can add them to the host statements.
 *
 * 2. Visit the host class - Inject Class Members.
 * Use the classes we found during phase 1. De-dupe and merge members with host.
 */
interface FoundMixin {
  identifier: string, // the string used in the @Mixin
  importDeclaration: ts.ImportDeclaration, // the matching import declaration
  importAbsPath: string, // abs path to import
  mixinIdentifier: string, // the class identifier used to find the mixin. Either named or default.
  mixinClass: ts.ClassDeclaration, // the found mixinClass
  mixinSrc: TSsourceFileWithModules, // the found mixin source file
  mixinClassMembers: null | ts.ClassElement[] // a picked or filtered list of named class members
};

export type FoundMixins = Map<string, FoundMixin[]>;
export type VisitedFiles = Map<string, ts.SourceFile>;

/**
 * Visit 1) setup. Find mixins within imported modules.
 */
export const hasMixins = (
  sourceNode: ts.SourceFile,
  diagnostics: d.Diagnostic[],
  sourceFiles: VisitedFiles,
  compilerHost: ts.CompilerHost
) => {
  const classNode = sourceNode.statements.find(st => (
    ts.isClassDeclaration(st) &&
    st.decorators &&
    st.decorators.find(isDecoratorNamed('Component'))
  )) as ts.ClassDeclaration;
  if (!classNode) return false;

  const mixinDecorators = classNode.decorators.filter(isDecoratorNamed('Mixin'));
  if (!mixinDecorators || !mixinDecorators.length) return false;

  const {mixinMap, mixinClassNames} = getMixinsFromDecorator(mixinDecorators);
  if (!mixinClassNames || !mixinClassNames.length) return false;

  // used to setup and cache all mixin meta for efficiency.
  // e.g. we'll need to get the class members later on our second visit
  const foundMixins = getMixinsInSources(sourceNode as TSsourceFileWithModules, sourceFiles, diagnostics, classNode, mixinMap, mixinClassNames, compilerHost);
  if (!foundMixins || !foundMixins.length) return false;

  return foundMixins;
}

/**
 * Visit 1) add and merge all mixin statements with host.
 */
export const mixinStatements = (sourceNode: ts.SourceFile, foundMixins: FoundMixin[], diagnostics: d.Diagnostic[]) => {
  const dedupeNamedStatements = (
    baseMembers: {name: string, statement: ts.Statement}[],
    mainMembers: {name: string, statement: ts.Statement}[],
    toStripMembers: {name: string, statement: ts.Statement}[]
  ) => {
    const mainMemberNames = [...baseMembers, ...mainMembers].flatMap(({name}) => [name]);
    const newMembers = toStripMembers.filter(member => !mainMemberNames.find(mn => member.name === mn));
    return [...mainMembers, ...newMembers];
  }

  const getNamedStatments = (source: ts.SourceFile, isHost: boolean = false) => {
    const statements: {name: string, statement: ts.Statement}[] = [];
    source.statements.forEach(st => {
      if (!isHost && st.modifiers && st.modifiers.find(md => md.kind === ts.SyntaxKind.ExportKeyword)) return;

      if (
        ts.isVariableStatement(st) &&
        ts.isVariableDeclarationList(st.declarationList) &&
        st.declarationList.declarations
      ) {
        st.declarationList.declarations.forEach(dc => statements.push({name: dc.name.getText(), statement: st}));
      } else if (
        (ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) &&
        st.name
      ) {
        statements.push({name: st.name.getText(), statement: st});
      }
    })
    return statements;
  }
  // merge impport statements
  const importStatements = collateImportDecls(sourceNode as TSsourceFileWithModules, foundMixins, diagnostics);

  // merge the rest (private variables and functions mainly)
  const hostStatements = getNamedStatments(sourceNode, true);
  let allStatements: {name: string, statement: ts.Statement}[] = [];
  foundMixins.forEach(mixinObj => {
    allStatements = dedupeNamedStatements(hostStatements, allStatements, getNamedStatments(mixinObj.mixinSrc));
  });

  return [
    ...importStatements.map(st => cloneNode(st, {typescript: ts, preserveSymbols: false, setOriginalNodes: true, setParents: true }) ),
    ...sourceNode.statements.filter(st => !ts.isImportDeclaration(st)),
    ...allStatements.map(st => cloneNode(st.statement, {typescript: ts, preserveSymbols: true, setOriginalNodes: true, setParents: true }) )
  ];
}

/**
 * Visit 2) merge class members from all mixin sources
 */
 export const mixinClassMembers = (hostNode: ts.ClassDeclaration, mixinClasses: FoundMixins) => {
  const mixinDecorators = hostNode.decorators.filter(isDecoratorNamed('Mixin'));
  if (!mixinDecorators || !mixinDecorators.length) return hostNode.members;

  const {mixinClassNames} = getMixinsFromDecorator(mixinDecorators);
  if (!mixinClassNames.length) return hostNode.members;

  const foundMixinsClasses = mixinClasses.get(hostNode.getSourceFile().fileName);
  if (!foundMixinsClasses || !foundMixinsClasses.length) return hostNode.members;

  const classDecls = collateMixinClassesMembers(mixinClassNames, foundMixinsClasses);
  if (!classDecls.length) return hostNode.members;

  // filter out any named members from the mixin classes that are in our host
  const mergedMembers = dedupeClassMembers(hostNode.members, classDecls);
  mergedMembers.push(createStaticGetter('mixinFilePaths', convertValueToLiteral(foundMixinsClasses.map(cl => cl.importAbsPath))));

  return ts.factory.createNodeArray(mergedMembers);
};

export const getMixinsInSources = (
  source: TSsourceFileWithModules,
  sourceFiles: VisitedFiles,
  diagnostics: d.Diagnostic[],
  sourceClassNode: ts.ClassDeclaration,
  decoratorMap: MixinDecorators,
  decoratorNames: string[],
  compilerHost: ts.CompilerHost
) => {
  const importDeclMap = findImportDeclsWithMemberNames(source, decoratorNames);
  const foundMixins: FoundMixin[] = [];

  if (importDeclMap.size !== decoratorMap.size) {
    const notFound = decoratorNames.filter(incl => !importDeclMap.get(incl));

    if (notFound.length) {
      const warn = buildWarn(diagnostics);
      warn.messageText = `@Mixin decorator/s have class references to ${notFound.join(', ')} that cannot be found within imported declarations. Are you sure you imported them?`;
      augmentDiagnosticWithNode(warn, decoratorMap.get(notFound[0]));
    }
  }

  // read & fetch the SourceFiles for all mixin classes via imported modules
  for (const [modName, mod] of source.resolvedModules.entries()) {
    const {classNames, importObjs} = findImportDeclObjWithModPath(importDeclMap, modName);
    if (!classNames.length) continue;

    classNames.forEach((className, i) => {
      if (!mod || !mod.resolvedFileName) {
        const error = buildError(diagnostics);
        error.messageText = `@Mixin module (${modName}) cannot be found and resolved within the current fileSystem.`;
        augmentDiagnosticWithNode(error, decoratorMap.get(className));
        return;
      }

      const {foundClass, sourceFile} = findMixedInClassInImport(mod.resolvedFileName, compilerHost || sourceFiles, importObjs[i]);

      if (!foundClass) {
        const warn = buildWarn(diagnostics);
        warn.messageText = `@Mixin decorator references a class (${className}) that cannot be found within imported modules.`;
        augmentDiagnosticWithNode(warn, decoratorMap.get(className));
        return;
      }

      const mixinMixin = foundClass.decorators?.filter(isDecoratorNamed('Mixin', sourceFile));
      if (mixinMixin && mixinMixin.length) {
        const {mixinClassNames} = getMixinsFromDecorator(mixinMixin)
        const error = buildError(diagnostics);
        error.messageText = `@Mixin decorator references a class (${className}) that is itself decorated with a @Mixin (${mixinClassNames[0]}).
        In order to keep design and behaviour transparent, mixins cannot be nested. Consider refacoring.`;
        augmentDiagnosticWithNode(error, foundClass);
        return;
      }

      foundMixins.push({
        identifier: className,
        importDeclaration: importObjs[i].declaration,
        importAbsPath: mod.resolvedFileName,
        mixinIdentifier: importObjs[i].identifier,
        mixinClass: foundClass,
        mixinSrc: sourceFile as TSsourceFileWithModules,
        mixinClassMembers: filterClassMemebers(source, sourceClassNode, className, foundClass)
      });
    })
  }
  return foundMixins;
}

const filterClassMemebers = (
  sourceNode: ts.SourceFile,
  sourceClassNode: ts.ClassDeclaration,
  importedClassName: string,
  mixinClassNode: ts.ClassDeclaration
) => {
  let toReturn: null | ts.ClassElement[] = null;
  sourceNode.statements.forEach(st => {
    if (
      !ts.isInterfaceDeclaration(st) ||
      st.name.getText() !== sourceClassNode.name.getText() ||
      !st.heritageClauses
    ) return;

    st.heritageClauses.forEach(hc => {
      hc.types.forEach(hct => {
        if (
          ts.isExpressionWithTypeArguments(hct) &&
          hct.expression.getText().match(/^(Pick|Omit)$/) &&
          hct.typeArguments.length &&
          ts.isTypeReferenceNode(hct.typeArguments[0])
        ) {
          const className = hct.typeArguments[0].getText();
          if (importedClassName !== className) return;

          const filterMembers = hct.typeArguments[1];
          let filteredMemberNames: string[] = [];

          if (ts.isLiteralTypeNode(filterMembers)) {
            filteredMemberNames.push((<ts.StringLiteral>filterMembers.literal).text);
          } else if (ts.isUnionTypeNode(filterMembers)) {
            filteredMemberNames = filterMembers.types.flatMap(type => ts.isLiteralTypeNode(type) ? (<ts.StringLiteral>type.literal).text : [])
          }

          if (hct.expression.getText() === 'Omit') {
            toReturn = mixinClassNode.members.filter(mb => (
              !mb.name || !filteredMemberNames.includes(mb.name.getText())
            ));
          } else if (hct.expression.getText() === 'Pick') {
            toReturn = mixinClassNode.members.filter(mb => (
              mb.name && filteredMemberNames.includes(mb.name.getText())
            ));
          }
        }
      })
    })
  })
  return toReturn;
}

const setUniqueImportNames = (modId: string, importNames: string[], hostImportNames: Map<string, string[]>) => {
  const foundHostImport = hostImportNames.get(modId);
  if (foundHostImport) {
    foundHostImport.push(...importNames);
  } else {
    hostImportNames.set(modId, importNames)
  }
  return hostImportNames
}

const collateImportDecls = (
  hostSource: TSsourceFileWithModules,
  foundMixins: FoundMixin[],
  diagnostics: d.Diagnostic[]
): ts.ImportDeclaration[] => {
  const imports: ts.ImportDeclaration[] = [];
  let hostImportNames: Map<string, string[]> = new Map();

  for (const [modName, mod] of hostSource.resolvedModules.entries()) {
    const decl = hostSource.statements.find(st => (
        ts.isImportDeclaration(st) &&
        (<ts.StringLiteral>st.moduleSpecifier).text === modName
      )
    ) as ts.ImportDeclaration;
    if (!decl) continue;

    // strip out mixin imports
    if (mod && foundMixins.find(mx => mx.importAbsPath === mod.resolvedFileName)) continue;
    // host imports
    if (hostSource === hostSource) {
      const hostNameBindings = getImportNamedBindings(decl);

      if (hostNameBindings && hostNameBindings.length) {
        hostImportNames = setUniqueImportNames(
          !modName.match(/^(\/|\.|\\)/) ? modName : (mod ? mod.resolvedFileName : modName),
          hostNameBindings.map(nb => nb.name.text),
          hostImportNames
        );
        // hostImportNames.push(...hostNameBindings.map(nb => nb.name.text));
      } else if (decl.importClause.name) {
        hostImportNames = setUniqueImportNames(
          !modName.match(/^(\/|\.|\\)/) ? modName : (mod ? mod.resolvedFileName : modName),
          [decl.importClause.name.text],
          hostImportNames
        );
      }
      imports.push(decl);
    }
  }

  // mixin imports. Update all names to be unique to remove clashes
  foundMixins.forEach(mx => {
    if (!mx.mixinSrc.resolvedModules) return;
    for (const [modName, mod] of mx.mixinSrc.resolvedModules.entries()) {
      const decl = mx.mixinSrc.statements.find(st => (
        ts.isImportDeclaration(st) &&
        (<ts.StringLiteral>st.moduleSpecifier).text === modName)
      ) as ts.ImportDeclaration;
      if (!decl) continue;

      const updatedMixin = updateMixinImportDecl(
        (<ts.StringLiteral>mx.importDeclaration.moduleSpecifier).text,
        decl,
        {mod, modName},
        hostImportNames,
        diagnostics
      );
      if (updatedMixin) {
        hostImportNames = updatedMixin.importNames;
        imports.push(updatedMixin.mxImport);
      }
    }
  })

  return imports;
}

let counter = 0;
const updateMixinImportDecl = (
  srcFile: string,
  decl: ts.ImportDeclaration,
  module: {mod: TSModule, modName: string},
  hostImportNames: Map<string, string[]>,
  diagnostics: d.Diagnostic[]
) => {
  if (decl.importClause.isTypeOnly) return undefined;

  counter++;
  let modId: string;

  if (!module.modName.match(/^(\/|\.|\\)/)) modId = module.modName;
  else if (module.modName.startsWith('.') && !srcFile.match(/^(\/|\.|\\)/)) modId = join(dirname(srcFile), module.modName).replace(/^(\.\/)/, '');
  else if (module.mod && module.mod.resolvedFileName) modId = module.mod.resolvedFileName;

  // if module can't be resolved & it's relative, it's best to not include it ¯\_(ツ)_/¯
  if (!modId) return undefined;
  modId = modId.replace(/(.ts|.tsx)$/, '');

  const createUniqueImportName = (importName: string, decl: ts.ImportDeclaration) => {
    let foundName: boolean;
    for (let [modKey, importNames] of hostImportNames.entries()) {
      foundName = !!importNames.find(hin => hin === importName);

      if (foundName && modKey !== modId) {
        const warn = buildWarn(diagnostics);
        warn.messageText = `@Mixin import uses a name already used by another import (either within the host component or another @Mixin) which can lead to unexpected results. Consider renaming.`;
        augmentDiagnosticWithNode(warn, decl);
      }
      if (foundName) break;
    }
    if (!foundName) hostImportNames = setUniqueImportNames(modId, [importName], hostImportNames);
    return ts.factory.createUniqueName(
      foundName ? importName + '_' + counter : importName
    );
  }

  const updatedDecl = ts.factory.updateImportDeclaration(
    decl,
    decl.decorators,
    decl.modifiers,
    ts.factory.updateImportClause(
      decl.importClause,
      false,
      (decl.importClause.name ? createUniqueImportName(decl.importClause.name.text, decl) : undefined),
      (
        decl.importClause.namedBindings &&
        ts.isNamedImports(decl.importClause.namedBindings) ?
        ts.factory.updateNamedImports(
          decl.importClause.namedBindings,
          decl.importClause.namedBindings.elements.flatMap(bnd => {
            return ts.factory.updateImportSpecifier(
              bnd,
              bnd.propertyName ? bnd.propertyName : bnd.name,
              createUniqueImportName(bnd.name.text, decl)
            )
        })
      ) : undefined)
    ),
    ts.factory.createStringLiteral(modId)
  )



  return {
    mxImport: updatedDecl,
    importNames: hostImportNames
  }
}

/* find and return sourceFile using imported module filename.
 * getting a sourceFile that's within the tsProgram allows typeChecker references to be maintained. */
const findMixedInClassInImport = (
  currFileName: string,
  hostOrFiles: ts.CompilerHost | VisitedFiles,
  importObj: ImportDeclObj
) => {
  // attempts to get the class via name or default
  const getClassByName = (sourceFile: ts.SourceFile, toFind: string) => {
    return (sourceFile as ts.SourceFile).statements.find(st => (
      ts.isClassDeclaration(st) &&
      (toFind === 'default'
        ? ( st.modifiers && st.modifiers.find(mod => mod.kind === ts.SyntaxKind.DefaultKeyword))
        : (st.name && toFind === st.name.getText(sourceFile))
      )
    )) as ts.ClassDeclaration
  }

  let sourceFile: ts.SourceFile;

  if (hostOrFiles instanceof Map) {
    for (let [src, fSourceFile] of hostOrFiles.entries()) {
      if (src !== currFileName) continue;
      sourceFile = fSourceFile;
      break;
    }
  } else {
    sourceFile = (hostOrFiles as ts.CompilerHost).getSourceFile(currFileName, ts.ScriptTarget.Latest);
  }

  if (sourceFile) {
    let foundClass: ts.ClassDeclaration;
    const toFind = importObj.identifier;
    foundClass = getClassByName(sourceFile, toFind);

    if (!foundClass && toFind === 'default') {
      // attmpt to find class using export expression
      let toFindClass = (sourceFile).statements.find(st => (
        ts.isExportAssignment(st) &&
        st.modifiers &&
        st.modifiers.find(mod => mod.kind === ts.SyntaxKind.DefaultKeyword)
      )) as ts.ExportAssignment;

      if (toFindClass) {
        foundClass = getClassByName(sourceFile, toFindClass.expression.getText(sourceFile));
      }
    }
    return {foundClass, sourceFile};
  }
  return {foundClass: undefined, sourceFile: undefined};
}

const collateMixinClassesMembers = (decoratorNames: string[], mixinClasses: FoundMixin[]) => {
  // sort map into the order of added declarations
  let deDupedMembers: ts.ClassElement[] = [];
  decoratorNames.reverse().forEach(
    dec => {
      const foundClass = mixinClasses.find(mixin => mixin.identifier === dec);
      if (foundClass) deDupedMembers = dedupeClassMembers(deDupedMembers, (foundClass.mixinClassMembers || foundClass.mixinClass.members));
    }
  );
  return deDupedMembers;
}

/** filter out any named members from toStrip class members that are in the main */
const dedupeClassMembers = (
  mainMembers: ts.ClassElement[] | ts.NodeArray<ts.ClassElement>,
  toStripMembers: ts.ClassElement[] | ts.NodeArray<ts.ClassElement>
) => {
  const mainMemberNames = mainMembers.flatMap(({name}) => !name || !ts.isIdentifier(name) ? [] : [name.getText()]);
  const newMembers = toStripMembers.filter(member => !mainMemberNames.find(hmn => !member.name || member.name.getText() === hmn));
  return [...mainMembers, ...newMembers];
}
