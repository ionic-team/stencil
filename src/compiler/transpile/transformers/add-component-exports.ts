import { BuildConfig, BuildContext, ComponentMeta } from '../../../util/interfaces';
import { dashToPascalCase } from '../../../util/helpers';
import { getJsPathBundlePlaceholder } from '../../../util/data-serialize';
import * as ts from 'typescript';


export function addComponentExports(config: BuildConfig, ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {
  return () => {
    function visitComponentFile(tsSourceFile: ts.SourceFile, cmpMeta: ComponentMeta): ts.Node {
      tsSourceFile = addComponentExport(tsSourceFile, cmpMeta);
      tsSourceFile = addBundleExports(config, tsSourceFile, cmpMeta.tagNameMeta);
      return tsSourceFile;
    }

    return (tsSourceFile) => {
      const moduleFile = ctx.moduleFiles[tsSourceFile.fileName];
      if (moduleFile && moduleFile.cmpMeta) {
        // this source file is a component
        return visitComponentFile(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
      }

      // not a component
      return tsSourceFile;
    };
  };
}


export function addComponentExport(tsSourceFile: ts.SourceFile, cmpMeta: ComponentMeta) {
  const pascalCaseTagName = dashToPascalCase(cmpMeta.tagNameMeta);
  if (cmpMeta.componentClass === pascalCaseTagName) {
    // the current component export is using the correct pascal cased tag name format
    // "ion-button" tag the class name should be "IonButton"
    // user isn't required to name their class name like this, but if they already
    // did then cool, let's not add another export
    return tsSourceFile;
  }

  // the component's current export isn't using the correct export name
  // we're expecting, so let's add one and leave the existing export alone
  const componentName = ts.createIdentifier(cmpMeta.componentClass);
  const exportAsName = ts.createIdentifier(pascalCaseTagName);

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
  // find the bundle this component belongs in, if any
  const containingBundle = config.bundles.find(b => Array.isArray(b.components) && b.components.indexOf(tagName) > -1);
  if (!containingBundle) {
    return tsSourceFile;
  }

  // cool, let's go ahead and add them component exports
  return addBundleExportsFromTags(tsSourceFile, containingBundle.components, tagName);
}


export function addBundleExportsFromTags(tsSourceFile: ts.SourceFile, bundleTagNames: string[], tagName: string) {
  // add an export for each of the other components found in this bundle
  // this allows the bundler later on in the process to group the components together

  // find all of the components in the bundle that isn't this component
  const otherTagsInBundle = bundleTagNames.filter(t => t !== tagName);

  // add an export for the other components that go into this bundle
  otherTagsInBundle.forEach(tagName => {
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

  return tsSourceFile;
}
