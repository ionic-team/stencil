import { bundleComponentModeStyles } from './styles';
import { Bundle, BundlerConfig, BuildContext, Component, ComponentMode, Manifest, Results } from './interfaces';
import { getBundleId, getComponentModeLoader, getBundleFileName, getBundleContent, getRegistryContent } from './formatters';
import { logError, readFile, writeFile } from './util';


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

  ctx.results = {};

  return getManifest(config, ctx).then(manifest => {

    const components = getComponents(ctx, manifest);

    return Promise.all(Object.keys(components).map(tag => {
      return bundleComponent(config, components[tag]);

    }))
    .then(() => {
      return buildCoreJs(config, ctx, manifest);

    }).then(() => {
      return ctx.results;

    }).catch(err => {
      return logError(ctx.results, err);
    });

  });
}


function bundleComponent(config: BundlerConfig, component: Component) {
  return bundleComponentModule(config, component).then(() => {
    const modeNames = Object.keys(component.modes);

    return Promise.all(modeNames.map(modeName => {
      component.modes[modeName].name = modeName;
      return bundleComponentMode(config, component, component.modes[modeName]);
    }));
  });
}


function bundleComponentModule(config: BundlerConfig, component: Component) {
  if (component.componentImporter) {
    return Promise.resolve(component.componentImporter);
  }

  const rollupConfig = {
    entry: config.packages.path.join(config.srcDir, component.componentUrl),
    format: 'cjs'
  };

  if (config.debug) {
    console.log(`bundle, bundleComponentModule, entry: ${rollupConfig.entry}`);
  }

  return config.packages.rollup.rollup(rollupConfig).then((bundle: any) => {
    const bundleOutput = bundle.generate(rollupConfig);

    component.componentImporter = `function importComponent(ionicOpts, exports) {
      var h = ionicOpts.h;
      ${bundleOutput.code}
    }`;
  });
}


function bundleComponentMode(config: BundlerConfig, component: Component, mode: ComponentMode) {
  if (config.debug) {
    console.log(`bundle, bundleComponentMode: ${component.tag}, ${mode.name}`);
  }
  return bundleComponentModeStyles(config, mode).then(() => {
    return getComponentModeLoader(component, mode);
  });
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
  ctx.bundles = [];

  manifest.bundles.forEach(bundleComponentTags => {
    buildComponentBundles(ctx, bundleComponentTags);
  });

  return generateBundleFiles(config, ctx).then(() => {
    const content = getRegistryContent(ctx.registry);

    const promises: Promise<any>[] = [];

    Object.keys(ctx.manifest.coreFiles).forEach(coreDirName => {
      const corePath = ctx.manifest.coreFiles[coreDirName];

      promises.push(createCoreJs(config, content, corePath));
    });

    return promises;
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
      if (!mode) return;

      bundle.components.push({
        component: component,
        mode: mode
      });
    });

    if (bundle.components.length) {
      ctx.bundles.push(bundle);
    }
  });
}


function generateBundleFiles(config: BundlerConfig, ctx: BuildContext) {
  ctx.registry = {};

  return Promise.all(ctx.bundles.map((bundle, bundleIndex) => {

    const componentModeLoaders = bundle.components.map(bundleComponent => {
      return getComponentModeLoader(bundleComponent.component, bundleComponent.mode);
    }).join(',');

    bundle.id = getBundleId(bundleIndex);
    bundle.fileName = getBundleFileName(bundle.id);
    bundle.filePath = config.packages.path.join(config.destDir, bundle.fileName);

    bundle.content = getBundleContent(bundle.id, componentModeLoaders);

    bundle.components.forEach(bundleComponent => {
      const tag = bundleComponent.component.tag;
      const modeName = bundleComponent.mode.name;

      ctx.registry[tag] = ctx.registry[tag] || [];

      const modes: {[modeName: string]: string} = ctx.registry[tag][0] || {};

      modes[modeName] = bundle.id;

      ctx.registry[tag][0] = modes;
    });

    let content = bundle.content;

    if (!config.devMode) {
      try {
        const minifyResults = config.packages.uglify.minify(content, {
          fromString: true
        });
        content = minifyResults.code;
      } catch(e) {
        console.log(`uglify.minify error: ${e}`);
      }
    }

    return writeFile(config.packages, bundle.filePath, content);
  }));
}


function createCoreJs(config: BundlerConfig, registryContent: string, srcFilePath: string) {
  let fileName = config.packages.path.basename(srcFilePath);

  if (config.devMode) {
    srcFilePath = srcFilePath.replace('.js', '.dev.js');
  }

  srcFilePath = config.packages.path.join(config.srcDir, srcFilePath);

  let destFilePath = config.packages.path.join(config.destDir, fileName);

  return readFile(config.packages, srcFilePath).then(coreJsContent => {
    let content: string;

    if (config.devMode) {
      content = registryContent + '\n\n' + coreJsContent;

    } else {
      registryContent = registryContent.replace(/\s/g, '');
      content = registryContent + '\n' + coreJsContent;
    }

    if (config.debug) {
      console.log(`bundle, createCoreJs: ${destFilePath}`)
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
  if (ctx.manifest) {
    return Promise.resolve(ctx.manifest);
  }

  const manifestFilePath = config.packages.path.join(config.srcDir, 'manifest.json');

  if (config.debug) {
    console.log(`bundle, manifestFilePath: ${manifestFilePath}`) ;
  }

  return readFile(config.packages, manifestFilePath).then(manifestStr => {
    return ctx.manifest = JSON.parse(manifestStr);
  });
}
