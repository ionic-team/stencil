import { bundleComponentModeStyles } from './styles';
import { Bundle, BundlerConfig, BuildContext, ComponentMeta, FormatComponentDataOptions,
  Manifest, ManifestBundle, Results } from './interfaces';
import { formatBundleFileName, formatDefineComponents,
  formatRegistry, generateBundleId,
  getBundledModulesId } from '../util/data-serialize';
import { createFileMeta, readFile, writeFile, writeFiles } from './util';
import { ATTR_LOWER_CASE, ATTR_DASH_CASE, BUNDLE_ID } from '../util/constants';
import { getManifest } from './manifest';
import { setupBundlerWatch } from './watch';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import * as os from 'os';


export function bundle(config: BundlerConfig, ctx: BuildContext = {}): Promise<Results> {
  validateConfig(config);

  if (config.debug) {
    console.log(`bundle, srcDir: ${config.srcDir}`);
    console.log(`bundle, destDir: ${config.destDir}`);
    console.log(`bundle, attrCase: ${config.attrCase}`);
  }

  ctx.results = {
    files: []
  };

  return getManifest(config, ctx).then(manifest => {
    return Promise.all(manifest.components.map(cmpMeta => {
      return bundleComponent(config, ctx, cmpMeta);

    }))
    .then(() => {
      return buildCoreJs(config, ctx, manifest);

    })
    .then(() => {
      return setupBundlerWatch(config, ctx, config.packages.typescript.sys);
    });

  }).then(() => {
    console.log('bundle, done');
    return ctx.results;
  });
}


export function bundleWatch(config: BundlerConfig, ctx: BuildContext, changedFiles: string[]) {
  if (config.debug) {
    console.log(`bundle, bundleWatch: ${changedFiles}`);
  }
  return bundle(config, ctx);
}


function bundleComponent(config: BundlerConfig, ctx: BuildContext, cmpMeta: ComponentMeta) {
  const modeNames = Object.keys(cmpMeta.modesMeta);

  return Promise.all(modeNames.map(modeName => {
    return bundleComponentModeStyles(config, ctx, cmpMeta, modeName);
  }));
}


function buildCoreJs(config: BundlerConfig, ctx: BuildContext, manifest: Manifest) {
  if (config.debug) {
    console.log(`bundle, buildCoreJs`);
  }

  ctx.bundles = [];

  manifest.bundles.forEach(manifestBundle => {
    buildComponentBundles(ctx, manifest, manifestBundle);
  });

  return generateBundleFiles(config, ctx).then(() => {
    const opts: FormatComponentDataOptions = {
      defaultAttrCase: config.attrCase,
      minimumData: true
    };

    ctx.results.componentRegistry = formatRegistry(manifest.components, opts);

    const coreFiles = [
      'ionic.core.js',
      'ionic.core.ce.js',
      'ionic.core.sd.ce.js'
    ];

    return Promise.all(coreFiles.map(coreFile => {
      const corePath = config.packages.path.join('core', coreFile);
      return createCoreJs(config, corePath);
    }));
  });
}


function buildComponentBundles(ctx: BuildContext, manifest: Manifest, manifestBundle: ManifestBundle) {
  const allModeNames = getAllModeNames(manifest);

  allModeNames.forEach(modeName => {

    const bundle: Bundle = {
      modeName: modeName,
      components: []
    };

    manifestBundle.components.forEach(manifestComponentTag => {

      const component = manifest.components.find(c => c.tagNameMeta === manifestComponentTag);
      if (!component) {
        throw `buildComponentBundles: unable to find tag "${manifestComponentTag}"`;
      }

      if (component.modesMeta[modeName]) {
        bundle.components.push(component);
      }
    });

    if (bundle.components.length) {
      ctx.bundles.push(bundle);
    }
  });
}


function bundleComponentModules(config: BundlerConfig, ctx: BuildContext) {
  ctx.bundledJsModules = {};

  ctx.bundles.map(bundle => {
    const id = getBundledModulesId(bundle);
    if (ctx.bundledJsModules[id]) return;

    const entryContent: string[] = [];
    bundle.components.forEach(c => {
      let importPath = config.packages.path.join(config.srcDir, c.componentUrl);
      let fileMeta = createFileMeta(config.packages, ctx, importPath, '');
      fileMeta.rebundleOnChange = true;

      entryContent.push(`import { ${c.componentClass} } from "${importPath}";`);
      entryContent.push(`exports['${c.tagNameMeta}'] = ${c.componentClass};`);
    });

    ctx.bundledJsModules[id] = entryContent.join('\n');
  });

  const ids = Object.keys(ctx.bundledJsModules);

  return Promise.all<any>(ids.map(id => {
    const tmpEntry = config.packages.path.join(os.tmpdir(), id + '.js');

    return Promise.resolve()
      .then(() => {
        return writeFile(config.packages, tmpEntry, ctx.bundledJsModules[id]);
      })

      .then(() => {
        return config.packages.rollup.rollup({
          entry: tmpEntry,
          plugins: [
            nodeResolve({
              jsnext: true,
              main: true
            }),
            commonjs({
              include: 'node_modules/**',
              sourceMap: false
            })
          ]
        }).catch(err => {
          console.log('bundle tmp entry:', tmpEntry);
          throw err;
        })

      .then(rollupBundle => {
        const results = rollupBundle.generate({
          format: 'es'
        });

        ctx.bundledJsModules[id] = `function importComponent(exports, h, t, Ionic) {\n${results.code.trim()}\n}`;
      });

    });
  }));
}


function generateBundleFiles(config: BundlerConfig, ctx: BuildContext) {
  if (config.debug) {
    console.log(`bundle, generateBundleFiles`);
  }

  const filesToWrite = new Map<string, string>();

  return bundleComponentModules(config, ctx).then(() => {
    ctx.bundles.forEach(bundle => {

      bundle.bundledJsModules = ctx.bundledJsModules[getBundledModulesId(bundle)];

      const opts: FormatComponentDataOptions = {
        onlyIncludeModeName: bundle.modeName,
        includeStyles: true,
        defaultAttrCase: config.attrCase,
        minimumData: false
      };

      bundle.components.forEach(cmpMeta => {
        cmpMeta.modesMeta[bundle.modeName][BUNDLE_ID] = BUNDLE_ID_KEYWORD;
      });

      bundle.content = formatDefineComponents(
        config.namespace, CORE_VERSION, BUNDLE_ID_KEYWORD,
        opts, bundle.bundledJsModules, bundle.components
      );

      if (config.devMode) {
        // in dev mode, create the bundle id from combining all of the tags
        bundle.id = bundle.components.map(c => c.tagNameMeta).join('.');
        if (bundle.modeName !== '$') {
          bundle.id += '.' + bundle.modeName;
        }

      } else {
        // in prod mode, create bundle id from hashing the content
        bundle.id = generateBundleId(bundle.content);

        // minify when in prod mode
        try {
          const minifyResults = config.packages.uglify.minify(bundle.content, {
            fromString: true
          });
          bundle.content = minifyResults.code;
        } catch (e) {
          console.log(`uglify.minify error: ${e}`);
        }
      }

      bundle.components.forEach(cmpMeta => {
        cmpMeta.modesMeta[bundle.modeName][BUNDLE_ID] = bundle.id;
      });

      bundle.fileName = formatBundleFileName(bundle.id);
      bundle.filePath = config.packages.path.join(config.destDir, 'bundles', bundle.fileName);

      // replace the known bundleid template with the newly created bundle id
      bundle.content = bundle.content.replace(/__STENCIL__BUNDLE__ID__/g, `${bundle.id}`);

      if (ctx.results.files.indexOf(bundle.filePath) === -1) {
        ctx.results.files.push(bundle.filePath);
      }

      filesToWrite.set(bundle.filePath, bundle.content);
    });

    return writeFiles(config.packages, filesToWrite);
  });
}


function createCoreJs(config: BundlerConfig, srcFilePath: string) {
  let fileName = config.packages.path.basename(srcFilePath);

  if (config.devMode) {
    srcFilePath = srcFilePath.replace('.js', '.dev.js');
  }

  srcFilePath = config.packages.path.join(config.srcDir, srcFilePath);

  let destFilePath = config.packages.path.join(config.destDir, fileName);

  return readFile(config.packages, srcFilePath).then(content => {
    if (config.debug) {
      console.log(`bundle, createCoreJs: ${destFilePath}`);
    }

    return writeFile(config.packages, destFilePath, content);
  });
}


function getAllModeNames(manifest: Manifest) {
  // collect up all the possible mode names we could use
  const allModeNames: string[] = [];

  manifest.components.filter(c => !!c.modesMeta).forEach(cmpMeta => {
    const modeNames = Object.keys(cmpMeta.modesMeta);
    modeNames.forEach(modeName => {
      if (allModeNames.indexOf(modeName) === -1) {
        allModeNames.push(modeName);
      }
    });
  });

  return allModeNames.sort();
}


function validateConfig(config: BundlerConfig) {
  if (!config.namespace) {
    config.namespace = 'Ionic';
  }
  if (!config.packages) {
    throw 'config.packages required';
  }
  if (!config.packages.fs) {
    throw 'config.packages.fs required';
  }
  if (!config.packages.path) {
    throw 'config.packages.path required';
  }
  if (!config.packages.nodeSass) {
    throw 'config.packages.nodeSass required';
  }
  if (!config.packages.rollup) {
    throw 'config.packages.rollup required';
  }
  if (!config.packages.typescript) {
    throw 'config.packages.typescript required';
  }

  config.attrCase = normalizeAttrCase(config.attrCase);
}


function normalizeAttrCase(attrCase: any) {
  if (attrCase === ATTR_LOWER_CASE || attrCase === ATTR_DASH_CASE) {
    // already using a valid attr case value
    return attrCase;
  }

  if (typeof attrCase === 'string') {
    if (attrCase.trim().toLowerCase() === 'dash') {
      return ATTR_DASH_CASE;
    }

    if (attrCase.trim().toLowerCase() === 'lower') {
      return ATTR_LOWER_CASE;
    }
  }

  // default to use dash-case for attributes
  return ATTR_DASH_CASE;
}


const CORE_VERSION = 0;
const BUNDLE_ID_KEYWORD = '__STENCIL__BUNDLE__ID__';
