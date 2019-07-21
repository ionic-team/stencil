import * as d from '../../../declarations';
import { DEFAULT_STYLE_MODE, dashToPascalCase, sortBy } from '@utils';
import { ConvertIdentifier, getStaticValue } from '../transform-utils';
import { normalizeStyles } from '../../style/normalize-styles';
import ts from 'typescript';


export const parseStaticStyles = (config: d.Config, compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions, tagName: string, componentFilePath: string, isCollectionDependency: boolean, staticMembers: ts.ClassElement[]) => {
  const styles: d.StyleCompiler[] = [];
  const styleUrlsProp = isCollectionDependency ? 'styleUrls' : 'originalStyleUrls';
  const parsedStyleUrls = getStaticValue(staticMembers, styleUrlsProp) as d.CompilerModeStyles;

  let parsedStyle = getStaticValue(staticMembers, 'styles');

  if (parsedStyle) {
    if (typeof parsedStyle === 'string') {
      // styles: 'div { padding: 10px }'
      parsedStyle = parsedStyle.trim();
      if (parsedStyle.length > 0) {
        styles.push({
          modeName: DEFAULT_STYLE_MODE,
          styleId: null,
          styleStr: parsedStyle,
          styleIdentifier: null,
          compiledStyleText: null,
          compiledStyleTextScoped: null,
          compiledStyleTextScopedCommented: null,
          externalStyles: []
        });
        compilerCtx.styleModeNames.add(DEFAULT_STYLE_MODE);
      }

    } else if ((parsedStyle as ConvertIdentifier).__identifier) {
      styles.push({
        modeName: DEFAULT_STYLE_MODE,
        styleId: null,
        styleStr: null,
        styleIdentifier: (parsedStyle as ConvertIdentifier).__escapedText,
        compiledStyleText: null,
        compiledStyleTextScoped: null,
        compiledStyleTextScopedCommented: null,
        externalStyles: []
      });
      compilerCtx.styleModeNames.add(DEFAULT_STYLE_MODE);
    }
  }

  if (parsedStyleUrls && typeof parsedStyleUrls === 'object') {
    Object.keys(parsedStyleUrls).forEach(modeName => {
      const externalStyles: d.ExternalStyleCompiler[] = [];
      const styleObj = parsedStyleUrls[modeName];
      styleObj.forEach(styleUrl => {
        if (typeof styleUrl === 'string' && styleUrl.trim().length > 0) {
          externalStyles.push({
            absolutePath: null,
            relativePath: null,
            originalComponentPath: styleUrl.trim()
          });
        }
      });

      if (externalStyles.length > 0) {
        const style: d.StyleCompiler = {
          modeName: modeName,
          styleStr: null,
          styleIdentifier: null,
          styleId: null,
          compiledStyleText: null,
          compiledStyleTextScoped: null,
          compiledStyleTextScopedCommented: null,
          externalStyles: externalStyles
        };

        styles.push(style);
        compilerCtx.styleModeNames.add(modeName);

        if (transformOpts.style === 'import') {
          style.styleIdentifier = dashToPascalCase(tagName) + 'Style';
          style.styleIdentifier = style.styleIdentifier.charAt(0).toLowerCase() + style.styleIdentifier.substring(1);
          style.externalStyles = [style.externalStyles[0]];
        }
      }
    });
  }

  normalizeStyles(config, tagName, componentFilePath, styles);

  return sortBy(styles, s => s.modeName);
};

export const addStyleImports = (transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile, moduleFile: d.Module) => {
  const { module } = transformCtx.getCompilerOptions();

  if (module === ts.ModuleKind.CommonJS) {
    //
  }

  return addEsmStyleImports(tsSourceFile, moduleFile);
};

const addEsmStyleImports = (tsSourceFile: ts.SourceFile, moduleFile: d.Module) => {
  const styleImports: ts.Statement[] = [];

  moduleFile.cmps.forEach(cmp => {
    cmp.styles.forEach(style => {
      if (style.styleIdentifier && style.externalStyles.length > 0) {
        styleImports.push(createStyleImport(style));
      }
    });
  });

  if (styleImports.length > 0) {
    const sourceFileImports = tsSourceFile.statements.slice();
    let lastImportIndex = 0;

    for (let i = 0; i < sourceFileImports.length; i++) {
      if (ts.isImportDeclaration(sourceFileImports[i])) {
        lastImportIndex = i;
      }
    }

    sourceFileImports.splice(lastImportIndex + 1, 0, ...styleImports);

    return ts.updateSourceFileNode(tsSourceFile, sourceFileImports);
  }

  return tsSourceFile;
};


const createStyleImport = (style: d.StyleCompiler) => {
  const importName = ts.createIdentifier(style.styleIdentifier);

  let importPath = style.externalStyles[0].originalComponentPath;
  if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('\\')) {
    importPath = './' + importPath;
  }

  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      importName,
      undefined
    ),
    ts.createLiteral(importPath)
  );
};
