import { BuildConfig, BuildContext, Bundle, ComponentMeta, Diagnostic,
  Manifest, ModuleResults, StencilSystem } from './interfaces';
import { BUNDLES_DIR } from '../util/constants';
import { formatDefineComponents, formatJsBundleFileName, generateBundleId } from '../util/data-serialize';


export function bundleModules(buildConfig: BuildConfig, ctx: BuildContext, userManifest: Manifest) {
  // within MAIN thread
  const timeSpan = buildConfig.logger.createTimeSpan(`bundle modules started`);

  // create main module results object
  const moduleResults: ModuleResults = {
    bundles: {},
    diagnostics: []
  };

  return Promise.all(userManifest.bundles.map(userBundle => {
    return generateDefineComponents(buildConfig, ctx, userManifest, userBundle, moduleResults);

  })).catch(err => {
    moduleResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  }).then(() => {
    timeSpan.finish('bundle modules finished');
    return moduleResults;
  });
}


function generateDefineComponents(buildConfig: BuildConfig, ctx: BuildContext, userManifest: Manifest, userBundle: Bundle, moduleResults: ModuleResults) {
  const sys = buildConfig.sys;

  const bundleComponentMeta = userBundle.components.map(userBundleComponentTag => {
    const cmpMeta = userManifest.components.find(c => c.tagNameMeta === userBundleComponentTag);
    if (!cmpMeta) {
      moduleResults.diagnostics.push({
        msg: `Unable to find component "${userBundleComponentTag}" in available config and collection.`,
        type: 'error'
      });
    }
    return cmpMeta;
  }).filter(c => !!c);

  // loop through each bundle the user wants and create the "defineComponents"
  return bundleComponentModules(sys, ctx, bundleComponentMeta, moduleResults).then(jsModuleContent => {

    const bundleId = generateBundleId(userBundle.components);

    // format all the JS bundle content
    // insert the already bundled JS module into the defineComponents function
    let moduleContent = formatDefineComponents(
      buildConfig.namespace, STENCIL_BUNDLE_ID,
      jsModuleContent, bundleComponentMeta
    );

    if (buildConfig.devMode) {
      // dev mode has filename from the bundled tag names
      moduleResults.bundles[bundleId] = userBundle.components.sort().join('.').toLowerCase();

      if (moduleResults.bundles[bundleId].length > 50) {
        // can get a lil too long, so let's simmer down
        moduleResults.bundles[bundleId] = moduleResults.bundles[bundleId].substr(0, 50);
      }

    } else {
      // minify the JS content in prod mode
      const minifyJsResults = sys.minifyJs(moduleContent);
      minifyJsResults.diagnostics.forEach(d => {
        moduleResults.diagnostics.push(d);
      });

      if (minifyJsResults.output) {
        moduleContent = minifyJsResults.output;
      }

      // in prod mode, create bundle id from hashing the content
      moduleResults.bundles[bundleId] = sys.generateContentHash(moduleContent);
    }

    // replace the known bundle id template with the newly created bundle id
    moduleContent = moduleContent.replace(MODULE_ID_REGEX, moduleResults.bundles[bundleId]);

    // create the file name and path of where the bundle will be saved
    const moduleFileName = formatJsBundleFileName(moduleResults.bundles[bundleId]);
    const moduleFilePath = sys.path.join(buildConfig.dest, BUNDLES_DIR, buildConfig.namespace.toLowerCase(), moduleFileName);

    ctx.filesToWrite[moduleFilePath] = moduleContent;

  }).catch(err => {
    moduleResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  }).then(() => {
    return moduleResults;
  });
}


function bundleComponentModules(sys: StencilSystem, ctx: BuildContext, bundleComponentMeta: ComponentMeta[], moduleResults: ModuleResults) {
  const entryFileLines: string[] = [];

  // loop through all the components this bundle needs
  // and generate a string of the JS file to be generated
  bundleComponentMeta.sort((a, b) => {
    if (a.tagNameMeta.toLowerCase() < b.tagNameMeta.toLowerCase()) return -1;
    if (a.tagNameMeta.toLowerCase() > b.tagNameMeta.toLowerCase()) return 1;
    return 0;

  }).forEach(cmpMeta => {
    // create a full path to the modules to import
    let importPath = cmpMeta.componentUrl;

    // manually create the content for our temporary entry file for the bundler
    entryFileLines.push(`import { ${cmpMeta.componentClass} } from "${importPath}";`);

    // export map should always use UPPER CASE tag name
    entryFileLines.push(`exports['${cmpMeta.tagNameMeta.toUpperCase()}'] = ${cmpMeta.componentClass};`);
  });

  // create the entry file for the bundler
  const entryContent = entryFileLines.join('\n');

  // start the bundler on our temporary file
  return sys.rollup.rollup({
    entry: STENCIL_BUNDLE_ID,
    plugins: [
      sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      entryInMemoryPlugin(STENCIL_BUNDLE_ID, entryContent),
      transpiledInMemoryPlugin(sys, ctx)
    ],
    onwarn: createOnWarnFn(bundleComponentMeta, moduleResults.diagnostics)

  }).catch(err => {
    throw err;
  })

  .then(rollupBundle => {
    // generate the bundler results
    const results = rollupBundle.generate({
      format: 'es'
    });

    // module bundling finished, assign its content to the user's bundle
    return `function importComponent(exports, h, t, Ionic) {\n${results.code.trim()}\n}`;
  });
}


function createOnWarnFn(bundleComponentMeta: ComponentMeta[], diagnostics: Diagnostic[]) {
  const previousWarns: {[key: string]: boolean} = {};

  return function onWarningMessage(warning: any) {
    if (warning && warning.message in previousWarns) {
      return;
    }
    previousWarns[warning.message] = true;

    let label = bundleComponentMeta.map(c => c.tagNameMeta).join(', ').trim();
    if (label.length) {
      label += ': ';
    }

    diagnostics.push({
      msg: label + warning.toString(),
      type: 'warn'
    });
  };
}


function transpiledInMemoryPlugin(sys: StencilSystem, ctx: BuildContext) {
  return {
    name: 'transpiledInMemoryPlugin',

    resolveId(importee: string, importer: string): string {
      if (!sys.path.isAbsolute(importee)) {
        importee = sys.path.resolve(importer ? sys.path.dirname(importer) : sys.path.resolve(), importee);

        if (importee.indexOf('.js') === -1) {
          importee += '.js';
        }
      }

      const tsFileNames = Object.keys(ctx.moduleFiles);
      for (var i = 0; i < tsFileNames.length; i++) {
        if (ctx.moduleFiles[tsFileNames[i]].jsFilePath === importee) {
          return importee;
        }
      }

      return null;
    },

    load(sourcePath: string): string {
      const tsFileNames = Object.keys(ctx.moduleFiles);
      for (var i = 0; i < tsFileNames.length; i++) {
        if (ctx.moduleFiles[tsFileNames[i]].jsFilePath === sourcePath) {
          return ctx.moduleFiles[tsFileNames[i]].jsText || '';
        }
      }

      const jsText = sys.fs.readFileSync(sourcePath, 'utf-8' );
      ctx.moduleFiles[sourcePath] = {
        jsFilePath: sourcePath,
        jsText: jsText
      };

      return jsText;
    }
  };
}


function entryInMemoryPlugin(entryKey: string, entryFileContent: string) {
  // used just so we don't have to write a temporary file to disk
  // just to turn around and immediately have rollup open and read it
  return {
    name: 'entryInMemoryPlugin',
    resolveId(importee: string): string {
      if (importee === entryKey) {
        return entryKey;
      }
      return null;
    },
    load(sourcePath: string): string {
      if (sourcePath === entryKey) {
        return entryFileContent;
      }
      return null;
    }
  };
}


const STENCIL_BUNDLE_ID = '__STENCIL__BUNDLE__ID__';
const MODULE_ID_REGEX = new RegExp(STENCIL_BUNDLE_ID, 'g');
