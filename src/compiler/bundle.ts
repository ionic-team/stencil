import { bundleComponentModeStyles } from './styles';
import { Bundle, BundlerConfig, BuildContext, Component, ComponentMode, Manifest, Results } from './interfaces';
import { formatComponentRegistryProps, formatComponentModeLoader, formatModeName, formatBundleFileName,
  formatBundleContent, formatRegistryContent, generateBundleId, getBundledModulesId } from './formatters';
import { readFile, writeFile, writeFiles } from './util';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import * as os from 'os';


export function bundle(config: BundlerConfig, ctx: BuildContext = {}): Promise<Results> {
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

  if (config.debug) {
    console.log(`bundle, srcDir: ${config.srcDir}`);
    console.log(`bundle, destDir: ${config.destDir}`);
  }

  ctx.results = {
    files: []
  };

  return getManifest(config, ctx).then(manifest => {

    const components = getComponents(ctx, manifest);

    return Promise.all(Object.keys(components).map(tag => {
      return bundleComponent(config, components[tag]);

    }))
    .then(() => {
      return buildCoreJs(config, ctx, manifest);

    }).then(() => {
      return ctx.results;

    });

  });
}


function bundleComponent(config: BundlerConfig, component: Component) {
  const modeNames = Object.keys(component.modes);

  return Promise.all(modeNames.map(modeName => {
    component.modes[modeName].name = modeName;
    return bundleComponentMode(config, component, component.modes[modeName]);
  }));
}


function bundleComponentMode(config: BundlerConfig, component: Component, mode: ComponentMode) {
  if (config.debug) {
    console.log(`bundle, bundleComponentMode: ${component.tag}, ${mode.name}`);
  }

  return bundleComponentModeStyles(config, mode);
}


function getComponents(ctx: BuildContext, manifest: Manifest) {
  if (!ctx.components) {
    ctx.components = {};

    Object.keys(manifest.components).forEach(tag => {
      ctx.components[tag] = <Component>Object.assign({}, manifest.components[tag]);
      ctx.components[tag].tag = tag;
    });
  }
  return ctx.components;
}


function buildCoreJs(config: BundlerConfig, ctx: BuildContext, manifest: Manifest) {
  if (config.debug) {
    console.log(`bundle, buildCoreJs`);
  }

  ctx.bundles = [];

  manifest.bundles.forEach(bundleComponentTags => {
    buildComponentBundles(ctx, bundleComponentTags);
  });

  return generateBundleFiles(config, ctx).then(() => {
    const registryContent = formatRegistryContent(ctx.registry);
    ctx.results.componentRegistry = registryContent;

    const promises: Promise<any>[] = [];

    if (!ctx.results.manifest.coreFiles) {
      throw `missing manifest core files`;
    }

    Object.keys(ctx.results.manifest.coreFiles).forEach(coreDirName => {
      const corePath = ctx.results.manifest.coreFiles[coreDirName];

      promises.push(createCoreJs(config, corePath));
    });

    return Promise.all(promises);
  });
}


function buildComponentBundles(ctx: BuildContext, bundleComponentTags: string[]) {
  const allModeNames = getAllModeNames(ctx);

  allModeNames.forEach(modeName => {

    const bundle: Bundle = {
      components: []
    };

    bundleComponentTags.forEach(bundleComponentTag => {

      const component = ctx.components[bundleComponentTag];
      if (!component) return;

      const mode = component.modes[modeName];
      if (mode) {
        bundle.components.push({
          component: component,
          mode: mode
        });
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
      let importPath = config.packages.path.join(config.srcDir, c.component.componentUrl);
      let exportName = c.component.componentClass;
      entryContent.push(`import { ${c.component.componentClass} } from "${importPath}";`);
      entryContent.push(`exports.${exportName} = ${exportName};`);
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
        })

      .then(rollupBundle => {
        const results = rollupBundle.generate({
          format: 'es'
        });

        ctx.bundledJsModules[id] = `function importComponent(exports, h, Ionic) {\n${results.code.trim()}\n}`;
      });

    });
  }));
}


function generateBundleFiles(config: BundlerConfig, ctx: BuildContext) {
  if (config.debug) {
    console.log(`bundle, generateBundleFiles`);
  }

  ctx.registry = {};

  const filesToWrite = new Map<string, string>();

  const bundleIdKeyword = '__IONIC_BUNDLE_ID__';

  return bundleComponentModules(config, ctx).then(() => {
    ctx.bundles.forEach(bundle => {

    const componentModeLoaders = bundle.components.map(bundleComponent => {
      return formatComponentModeLoader(bundleComponent.component, bundleComponent.mode);
    }).join(',\n');

    bundle.bundledJsModules = ctx.bundledJsModules[getBundledModulesId(bundle)];

    bundle.content = formatBundleContent(bundleIdKeyword, bundle.bundledJsModules, componentModeLoaders);

    if (config.devMode) {
      // in dev mode, create the bundle id from combining all of the tags
      bundle.id = bundle.components.map(c => c.component.tag + '.' + c.mode.name).join('.');

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

    bundle.fileName = formatBundleFileName(bundle.id);
    bundle.filePath = config.packages.path.join(config.destDir, 'bundles', bundle.fileName);

    bundle.content = bundle.content.replace(bundleIdKeyword, `"${bundle.id}"`);

    bundle.components.forEach(bundleComponent => {
      const tag = bundleComponent.component.tag;
      const modeCode = formatModeName(bundleComponent.mode.name);

      ctx.registry[tag] = ctx.registry[tag] || [];

      const modes: {[modeCode: string]: string} = ctx.registry[tag][0] || {};

      modes[modeCode] = bundle.id;

      ctx.registry[tag][0] = modes;

      if (ctx.registry[tag].length === 1 && Object.keys(bundleComponent.component.props).length) {
        ctx.registry[tag].push(formatComponentRegistryProps(bundleComponent.component.props));
      }
    });

    ctx.results.files.push(bundle.filePath);

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


function getAllModeNames(ctx: BuildContext) {
  const allModeNames: string[] = [];

  Object.keys(ctx.components).forEach(tag => {
    const component = ctx.components[tag];

    Object.keys(component.modes).forEach(modeName => {
      if (allModeNames.indexOf(modeName) === -1) {
        allModeNames.push(modeName);
      }
    });
  });

  return allModeNames;
}


function getManifest(config: BundlerConfig, ctx: BuildContext) {
  if (ctx.results.manifest) {
    return Promise.resolve(ctx.results.manifest);
  }

  ctx.results.manifestPath = config.packages.path.join(config.srcDir, 'manifest.json');

  if (config.debug) {
    console.log(`bundle, manifestFilePath: ${ctx.results.manifestPath}`) ;
  }

  return readFile(config.packages, ctx.results.manifestPath).then(manifestStr => {
    return ctx.results.manifest = JSON.parse(manifestStr);
  });
}
