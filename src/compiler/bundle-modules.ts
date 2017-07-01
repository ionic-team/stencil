import { BundlerConfig, ModuleResults, Manifest, Bundle, Logger } from './interfaces';
import { BUNDLES_DIR } from '../util/constants';
import { formatDefineComponents, formatJsBundleFileName, generateBundleId } from '../util/data-serialize';
import { writeFiles } from './util';


export function bundleModules(config: BundlerConfig, userManifest: Manifest) {
  config.logger.debug(`bundleModules`);

  const moduleResults: ModuleResults = {};
  const filesToWrite = new Map<string, string>();

  return Promise.all(userManifest.bundles.map(userBundle => {
    return generateDefineComponents(config, userManifest, userBundle, moduleResults, filesToWrite);
  })).then(() => {
    return writeFiles(config.sys, filesToWrite);
  }).then(() => {
    return moduleResults;
  });
}


function generateDefineComponents(config: BundlerConfig, userManifest: Manifest, userBundle: Bundle, moduleResults: ModuleResults, filesToWrite: Map<string, string>) {
  // loop through each bundle the user wants and create the "defineComponents"
  return bundleComponentModules(config, userManifest, userBundle).then(jsModuleContent => {

    const bundleId = generateBundleId(userBundle.components);

    // collect only the component meta data this bundle needs
    const bundleComponentMeta = userBundle.components.map(userBundleComponentTag => {
      return userManifest.components.find(manifestComponent => manifestComponent.tagNameMeta === userBundleComponentTag);
    });

    // format all the JS bundle content
    // insert the already bundled JS module into the defineComponents function
    let moduleContent = formatDefineComponents(
      config.namespace, COMPILER_VERSION, TMP_BUNDLE_ID,
      jsModuleContent, bundleComponentMeta
    );

    if (config.devMode) {
      // dev mode has filename from the bundled tag names
      moduleResults[bundleId] = userBundle.components.sort().join('.').toLowerCase();

      if (moduleResults[bundleId].length > 40) {
        // can get a lil too long, so let's simmer down
        moduleResults[bundleId] = moduleResults[bundleId].substr(0, 40);
      }

    } else {
      // minify the JS content in prod mode
      const minifyResults = config.sys.uglify.minify(moduleContent);

      if (minifyResults.error) {
        config.logger.error(`minify: ${minifyResults.error.message}`);

      } else {
        moduleContent = minifyResults.code;
      }

      // in prod mode, create bundle id from hashing the content
      moduleResults[bundleId] = config.sys.generateContentHash(moduleContent);
    }

    // replace the known bundle id template with the newly created bundle id
    moduleContent = moduleContent.replace(MODULE_ID_REGEX, moduleResults[bundleId]);

    // create the file name and path of where the bundle will be saved
    const moduleFileName = formatJsBundleFileName(moduleResults[bundleId]);
    const moduleFilePath = config.sys.path.join(config.destDir, BUNDLES_DIR, config.namespace.toLowerCase(), moduleFileName);

    filesToWrite.set(moduleFilePath, moduleContent);
  });
}


function bundleComponentModules(config: BundlerConfig, userManifest: Manifest, userBundle: Bundle) {
  const entryFileLines: string[] = [];

  // loop through all the components this bundle needs
  // and generate a string of the JS file to be generated
  userBundle.components.forEach(userBundleComponentTag => {

    // look up the component meta data for the tag the user wants in this bundle
    const cmpMeta = userManifest.components.find(c => c.tagNameMeta === userBundleComponentTag);
    if (!cmpMeta) {
      throw `bundleComponentModules, unable to find component "${cmpMeta.tagNameMeta}" in available config and collection`;
    }

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
  return config.sys.rollup.rollup({
    entry: TMP_BUNDLE_ID,
    plugins: [
      config.sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      config.sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      entryInMemoryPlugin(TMP_BUNDLE_ID, entryContent)
    ],
    onwarn: createOnWarnFn(config.logger)

  }).catch(err => {
    config.logger.error('bundleComponentModules, rollup error');
    err && err.stack && config.logger.error(err.stack);
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


function createOnWarnFn(logger: Logger) {
  const previousWarns: {[key: string]: boolean} = {};

  return function onWarningMessage(warning: any) {
    if (warning && warning.message in previousWarns) {
      return;
    }
    previousWarns[warning.message] = true;

    logger.warn(`rollup: ${warning}`);
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


const COMPILER_VERSION = 0;
const TMP_BUNDLE_ID = '__STENCIL__BUNDLE__ID__';
const MODULE_ID_REGEX = new RegExp(TMP_BUNDLE_ID, 'g');
