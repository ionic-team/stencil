import { buildComponentModeStyles } from './styles';
import { Bundle, BundlerConfig, BuildContext, Component, ComponentMode, Manifest, Results } from './interfaces';
import { getBundleId, getComponentModeLoader, getBundleFileName, getBundleContent, getRegistryContent } from './formatters';
import { logError, readFile, writeFile } from './util';
import * as path from 'path';


export function bundle(config: BundlerConfig, ctx: BuildContext = {}): Promise<Results> {
  ctx.results = {};

  return getManifest(config, ctx).then(manifest => {

    const components = getComponents(ctx, manifest);

    return Promise.all(Object.keys(components).map(tag => {
      return buildComponent(config, components[tag]);

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


function buildComponent(config: BundlerConfig, component: Component) {
  return buildComponentModule(config, component).then(() => {
    const modeNames = Object.keys(component.modes);

    return Promise.all(modeNames.map(modeName => {
      component.modes[modeName].name = modeName;
      return buildComponentMode(config, component, component.modes[modeName]);
    }));
  });
}


function buildComponentModule(config: BundlerConfig, component: Component) {
  if (component.componentImporter) {
    return Promise.resolve(component.componentImporter);
  }

  const rollupConfig = {
    entry: path.join(config.coreDir, component.componentUrl),
    format: 'cjs'
  };

  return config.packages.rollup.rollup(rollupConfig).then((bundle: any) => {
    const bundleOutput = bundle.generate(rollupConfig);

    let code = `function importComponent(exports) { ${bundleOutput.code} }`;

    return component.componentImporter = code;
  });
}


function buildComponentMode(config: BundlerConfig, component: Component, mode: ComponentMode) {
  return buildComponentModeStyles(config, mode).then(() => {
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
    const registryContent = getRegistryContent(ctx.registry);

    const promises: Promise<any>[] = [];

    promises.push(createCoreJs(config, registryContent, 'ionic.core.js', true));
    promises.push(createCoreJs(config, registryContent, 'ionic.core.ce.js', true));
    promises.push(createCoreJs(config, registryContent, 'ionic.core.sd.ce.js', true));

    promises.push(createCoreJs(config, registryContent, 'ionic.core.dev.js', false));
    promises.push(createCoreJs(config, registryContent, 'ionic.core.ce.dev.js', false));
    promises.push(createCoreJs(config, registryContent, 'ionic.core.sd.ce.dev.js', false));

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
  // {'ion-badge':[{ios:'8bc3e3bb',md:'80ccf7f0',wp:'581787f8'}]}
  ctx.registry = {};

  return Promise.all(ctx.bundles.map((bundle, bundleIndex) => {

    const componentModeLoaders = bundle.components.map(bundleComponent => {
      return getComponentModeLoader(bundleComponent.component, bundleComponent.mode);
    }).join(',');

    bundle.id = getBundleId(bundleIndex);
    bundle.fileName = getBundleFileName(bundle.id);
    bundle.filePath = path.join(config.buildDir, bundle.fileName);

    bundle.content = getBundleContent(bundle.id, componentModeLoaders);

    bundle.components.forEach(bundleComponent => {
      const tag = bundleComponent.component.tag;
      const modeName = bundleComponent.mode.name;

      ctx.registry[tag] = ctx.registry[tag] || [];

      const modes: {[modeName: string]: string} = ctx.registry[tag][0] || {};

      modes[modeName] = bundle.id;

      ctx.registry[tag][0] = modes;
    });

    const minifyResults = config.packages.uglify.minify(bundle.content, {
      fromString: true
    });

    const prodFilePath = bundle.filePath;
    const devFilePath = bundle.filePath.replace('.js', '.dev.js');

    return Promise.all([
      writeFile(prodFilePath, minifyResults.code),
      writeFile(devFilePath, bundle.content)
    ]);
  }));
}


function createCoreJs(config: BundlerConfig, registryContent: string, fileName: string, minify: boolean) {
  const filePath = path.join(config.coreDir, fileName);

  return readFile(filePath).then(coreJsContent => {
    let content: string;

    if (minify) {
      registryContent = registryContent.replace(/\s/g, '');
      content = registryContent + '\n' + coreJsContent;

    } else {
      content = registryContent + '\n\n' + coreJsContent;
    }

    return writeFile(filePath, content);
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

  const manifestFilePath = path.join(config.coreDir, 'manifest.json');

  if (config.debug) {
    console.log(`manifestFilePath: ${manifestFilePath}`) ;
  }

  return readFile(manifestFilePath).then(manifestStr => {
    return ctx.manifest = JSON.parse(manifestStr);
  });
}
