import type * as d from '../../../declarations';
import { createStaticGetter, convertValueToLiteral } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';
import { augmentDiagnosticWithNode, buildError, buildWarn } from '@utils';
import { cloneNode } from '@wessberg/ts-clone-node';

/**
 * These methods are used within 2 AST node visits. 1) SourceFile, 2) ClassDeclaration.
 * Reason being, the tsProgram typeChecker is defined on init and doesn't update on-the-fly when cloning nodes.
 * The typeChecker is used to reference meta within the ClassDeclaration and because the members of our
 * updated class can be from multiple files, the required original meta is lost when we merge new members.
 * So, we keep class members seperate (keeping all original typeChecker refs in place) until stencil has done it's thing.
 *
 * 1. Visit the host file - Setup and Inject Dependencies.
 * Workout the mixin names, their associated import declarations and the real class found within the imported module source.
 * Can be named or default.
 * Find any imported module dependencies and private declarations so we can add them to the host statements.
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
interface TSModule {
  resolvedFileName: string,
  originalPath: string | undefined,
  extension: string,
  isExternalLibraryImport: boolean,
  packageId: {
    name: string,
    subModuleName: string,
    version: string
  } | undefined
}
interface ImportDeclObj {declaration: ts.ImportDeclaration, identifier: string};
interface ImportMeta {
  decl: ts.ImportDeclaration,
  clauseName: string,
  namedBindings: ts.ImportSpecifier[],
  module: TSModule
}
type MixinDecorators = Map<string, ts.Decorator>;

export interface TSsourceFileWithModules extends ts.SourceFile { resolvedModules: Map<string, TSModule> }
export type FoundMixins = Map<string, FoundMixin[]>;
export type VisitedFiles = Map<string, ts.SourceFile>;

/**
 * Visit 1) setup. Find mixins within imported modules.
 */
export const hasMixins = (
  sourceNode: ts.SourceFile,
  diagnostics: d.Diagnostic[],
  sourceFiles: VisitedFiles
) => {
  const classNode = sourceNode.statements.find(st => (
    ts.isClassDeclaration(st) &&
    st.decorators &&
    st.decorators.find(isDecoratorNamed('Component'))
  )) as ts.ClassDeclaration;

  if (!classNode) return false;

  const mixinDecorators = classNode.decorators.filter(isDecoratorNamed('Mixin'));
  if (!mixinDecorators) return false;

  const {mixinMap, mixinClassNames} = getMixinsFromDecorator(mixinDecorators);
  if (!mixinClassNames || !mixinClassNames.length) return false;

  // used to setup and cache all mixin meta for efficiency.
  // e.g. we'll need to get the class members later on our second visit
  const foundMixins = getMixinsInSources(sourceNode as TSsourceFileWithModules, mixinMap, mixinClassNames, sourceFiles, diagnostics, classNode);
  if (!foundMixins || !foundMixins.length) return false;

  return foundMixins;
}

/**
 * Visit 1) add and merge all mixin statements with host.
 */
export const mixinStatements = (sourceNode: ts.SourceFile, foundMixins: FoundMixin[]) => {
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
  const importStatements = collateImportDecls(sourceNode as TSsourceFileWithModules, foundMixins);

  // merge the rest (private variables and functions mainly)
  const hostStatements = getNamedStatments(sourceNode, true);
  let allStatements: {name: string, statement: ts.Statement}[] = [];
  foundMixins.forEach(mixinObj => {
    allStatements = dedupeNamedStatements(hostStatements, allStatements, getNamedStatments(mixinObj.mixinSrc));
  });

  return [
    ...importStatements,
    ...sourceNode.statements.filter(st => !ts.isImportDeclaration(st)),
    ...allStatements.map(stOb =>  cloneNode(stOb.statement, {typescript: ts}) )
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

const getMixinsInSources = (
  source: TSsourceFileWithModules,
  decoratorMap: MixinDecorators,
  decoratorNames: string[],
  sourceFiles: VisitedFiles,
  diagnostics: d.Diagnostic[],
  sourceClassNode: ts.ClassDeclaration
) => {
  // find an import declarations from a Map via module name
  const findImportDeclObjWithModule = (declarationMap: Map<string, ImportDeclObj>, moduleName: string) => {
    const classNames: string[] = [];
    const foundImportObjs: ImportDeclObj[] = [];

    for (const [className, importObj] of declarationMap.entries()) {
      if ((<ts.StringLiteral>importObj.declaration.moduleSpecifier).text === moduleName) {
        classNames.push(className);
        foundImportObjs.push(importObj);
      }
    }
    return {classNames: classNames, importObjs: foundImportObjs};
  }

  const importDeclMap: Map<string, {declaration: ts.ImportDeclaration, identifier: string}> = new Map();
  const foundMixins: FoundMixin[] = [];
  let foundClassName: string;
  let impSpecs: ts.ImportSpecifier[];

  // loop through all host imports and get those that contain mixin classes
  source.statements.filter(st => ts.isImportDeclaration(st)).forEach((st: ts.ImportDeclaration) => {
    foundClassName = null;
    impSpecs = [];

    if (
      st.importClause &&
      ts.isImportClause(st.importClause) &&
      (impSpecs = getImportNamedBindings(st)) &&
      impSpecs.length
    ) {
      // named modules
      impSpecs.forEach(nbe => {
        if (foundClassName = decoratorNames.find(dec => dec === nbe.name.getText())) {
          importDeclMap.set(foundClassName, {
            declaration: st,
            identifier: resolveClassName(nbe)
          });
        }
      })
    }
    // default modules
    if (
      st.importClause.name &&
      ts.isIdentifier(st.importClause.name) &&
      (foundClassName = decoratorNames.find(dec => dec === st.importClause.name.getText()))
    ) {
      importDeclMap.set(foundClassName, {
        declaration: st,
        identifier: 'default'
      });
    }
  });


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
    const {classNames, importObjs} = findImportDeclObjWithModule(importDeclMap, modName);
    if (!classNames.length) continue;

    classNames.forEach((className, i) => {
      if (!mod || !mod.resolvedFileName) {
        const error = buildError(diagnostics);
        error.messageText = `@Mixin module (${modName}) cannot be found and resolved within the current fileSystem.`;
        augmentDiagnosticWithNode(error, decoratorMap.get(className));
        return;
      }

      const {foundClass, sourceFile} = findMixedInClassInImport(mod.resolvedFileName, sourceFiles, importObjs[i]);

      if (!foundClass) {
        const warn = buildWarn(diagnostics);
        warn.messageText = `@Mixin decorator references a class (${className}) that cannot be found within imported module.`;
        augmentDiagnosticWithNode(warn, decoratorMap.get(className));
        return;
      }

      const mixinMixin = foundClass.decorators?.filter(isDecoratorNamed('Mixin'));
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

          const filteredMemberNames = hct.typeArguments
            .slice(1)
            .map(ta => ta.getText().replace(/^('|"|`)(.*)('|"|`)$/, '$2'));

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

const collateImportDecls = (
  hostSource: TSsourceFileWithModules,
  foundMixins: FoundMixin[]
) => {
  const imports: ImportMeta[] = [];
  [hostSource, ...foundMixins.map(mx => mx.mixinSrc)].forEach(src => {

    if (!src.resolvedModules) return;
    // We need to use resolved modules because import paths are absolute - not relative
    // we'll need this to move mixin imports to our host
    for (const [modName, mod] of src.resolvedModules.entries()) {
      if (src !== hostSource && modName.includes('@stencil/core')) continue;
      if (!mod) continue;

      const foundImportDecl = src.statements.find(st => (
          ts.isImportDeclaration(st) &&
          (<ts.StringLiteral>st.moduleSpecifier).text === modName
        )
      ) as ts.ImportDeclaration;
      if (!foundImportDecl) continue;

      // remove all mixin imports
      if (foundMixins.find(mx => mx.importAbsPath === mod.resolvedFileName)) continue;

      // merge import declarations if from the same module
      const currImportIndex: number = imports.length ? imports.findIndex(imp => imp.module?.resolvedFileName === mod.resolvedFileName) : null;
      if (typeof currImportIndex === 'number' && currImportIndex > -1) {
        const currImportDec = imports[currImportIndex].decl;

        // merge default import name
        let clauseName = currImportDec.importClause.name ? currImportDec.importClause.name.getText() : undefined;
        if (
          foundImportDecl.importClause.name &&
          !currImportDec.importClause.name
        ) {
          clauseName = foundImportDecl.importClause.name.getText();
        }
        // merge named bindings
        let namedBindings = getImportNamedBindings(currImportDec);
        const foundBindings = getImportNamedBindings(foundImportDecl);
        if (foundBindings) {
          const mainBindNames: string[] = namedBindings.flatMap(({name}) => !ts.isIdentifier(name) ? [] : [name.getText()]);
          const newBindings = foundBindings.filter(binding => !mainBindNames.find(nBinding => binding.name?.getText() === nBinding));
          namedBindings = [...namedBindings, ...newBindings];
        }
        imports[currImportIndex] = {decl: currImportDec, clauseName: clauseName, namedBindings: namedBindings, module: mod};
      } else {
        imports.push({
          decl: foundImportDecl,
          clauseName: null,
          namedBindings: null,
          module: (src === hostSource && modName.includes('@stencil/core')) ? null : mod
        });
      }
    }
  });
  return imports.map(imp => createImportDecl(imp));
}

const createImportDecl = (importMeta: ImportMeta) => {
  const {clauseName, namedBindings, decl, module} = importMeta;
  let newImportClause: ts.ImportClause;
  if (clauseName || (namedBindings && namedBindings.length)) {
    newImportClause = ts.factory.createImportClause(
      ts.isTypeOnlyImportOrExportDeclaration(decl),
      (clauseName ? ts.factory.createIdentifier(clauseName) : undefined),
      (namedBindings.length ? ts.factory.createNamedImports(namedBindings) : undefined)
    );
  }
  if (!newImportClause && !module) return decl;

  return ts.factory.createImportDeclaration(
    decl.decorators,
    decl.modifiers,
    (newImportClause ? newImportClause : decl.importClause),
    (module ? ts.factory.createStringLiteral(module.resolvedFileName) : decl.moduleSpecifier)
  )
}

/** util. Returns named bindings from an import declaration */
const getImportNamedBindings = (importDec: ts.ImportDeclaration): ts.ImportSpecifier[] => {
  if (
    ts.isImportDeclaration(importDec) &&
    importDec.importClause &&
    ts.isImportClause(importDec.importClause) &&
    importDec.importClause.namedBindings &&
    ts.isNamedImports(importDec.importClause.namedBindings) &&
    Array.isArray(importDec.importClause.namedBindings.elements)
  ) return importDec.importClause.namedBindings.elements;
  return [];
}

/** get the class names from the decorator */
const getMixinsFromDecorator = (mixinDecorators: ts.Decorator[]) => {
  let mixinMap = new Map() as MixinDecorators;
  let mixinClassNames: string[] = [];

  mixinDecorators.forEach(dec => {
    if (ts.isCallExpression(dec.expression)) {
      const mixinName = dec.expression.arguments[0].getText().replace(/'|"|`/g, '');
      mixinMap.set(mixinName, dec);
      mixinClassNames.push(mixinName);
    }
  });
  return {mixinMap, mixinClassNames};
}

/** get the actual class name from import declaration */
const resolveClassName = (importSp: ts.ImportSpecifier) => {
  if (importSp.propertyName && ts.isIdentifier(importSp.propertyName)) {
    return importSp.propertyName.getText();
  } else return importSp.name.getText();
}

/* find and return sourceFile using imported module filename.
 * getting a sourceFile that's within the tsProgram allows typeChecker references to be maintained. */
const findMixedInClassInImport = (
  currFileName: string,
  sourceFiles: VisitedFiles,
  importObj: ImportDeclObj
) => {
  // attempts to get the class via name or default
  const getClassByName = (sourceFile: ts.SourceFile, toFind: string) => {
    return (sourceFile as ts.SourceFile).statements.find(st => (
      ts.isClassDeclaration(st) &&
      (toFind === 'default'
        ? ( st.modifiers && st.modifiers.find(mod => mod.kind === ts.SyntaxKind.DefaultKeyword))
        : (st.name && toFind === st.name.getText())
      )
    )) as ts.ClassDeclaration
  }

  for (let [src, sourceFile] of sourceFiles.entries()) {
    if (src !== currFileName) continue;
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
        foundClass = getClassByName(sourceFile, toFindClass.expression.getText());
      }
    }
    return {foundClass, sourceFile};
  }
  return undefined;
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
  const mainMemberNames = mainMembers.flatMap(({name}) => !ts.isIdentifier(name) ? [] : [name.getText()]);
  const newMembers = toStripMembers.filter(member => !mainMemberNames.find(hmn => member.name?.getText() === hmn));
  return [...mainMembers, ...newMembers];
}
