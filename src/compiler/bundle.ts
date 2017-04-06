import { buildComponentModeStyles } from './styles';
import { Bundle, BundlerConfig, BundlerContext, Component, ComponentMode, Manifest, Results } from './interfaces';
import { getBundleId, getComponentModeLoader, getBundleFileName, getBundleContent, getRegistryContent } from './formatters';
import { logError, readFile, writeFile } from './util';
import * as path from 'path';


export function bundle(config: BundlerConfig, ctx: BundlerContext = {}): Promise<Results> {
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

  const manifestDir = path.dirname(config.manifestFilePath);

  const rollupConfig = {
    entry: path.join(manifestDir, component.componentUrl),
    format: 'cjs'
  };

  return config.rollup.rollup(rollupConfig).then((bundle: any) => {
    const bundleOutput = bundle.generate(rollupConfig);

    let code = `function importComponent(exports) { ${bundleOutput.code} }`;

    if (config.minifyJs) {
      const minifyResults = config.uglify.minify(code, {
        fromString: true
      });

      code = minifyResults.code;
    }

    code = code.replace(/function importComponent\(/g, 'function(');

    return component.componentImporter = code;
  });
}


function buildComponentMode(config: BundlerConfig, component: Component, mode: ComponentMode) {
  return buildComponentModeStyles(config, mode).then(() => {
    return getComponentModeLoader(component, mode);
  });
}


function getComponents(ctx: BundlerContext, manifest: Manifest) {
  if (!ctx.components) {
    ctx.components = {};

    Object.keys(manifest.components).forEach(tag => {
      ctx.components[tag] = <Component>Object.assign({}, manifest.components[tag]);
      ctx.components[tag].tag = tag;
    });
  }
  return ctx.components;
}


function buildCoreJs(config: BundlerConfig, ctx: BundlerContext, manifest: Manifest) {
  ctx.bundles = [];

  manifest.bundles.forEach(bundleComponentTags => {
    buildComponentBundles(ctx, bundleComponentTags);
  });

  return generateBundleFiles(config, ctx).then(() => {
    const registryContent = getRegistryContent(ctx.registry);

    const promises: Promise<any>[] = [];

    if (config.minifyJs) {
      promises.push(createCoreJs(config, registryContent, 'ionic.core.js', 'ionic.core.js'));
      promises.push(createCoreJs(config, registryContent, 'ionic.core.ce.js', 'ionic.core.ce.js'));
      promises.push(createCoreJs(config, registryContent, 'ionic.core.sd.ce.js', 'ionic.core.sd.ce.js'));

    } else {
      promises.push(createCoreJs(config, registryContent, 'ionic.core.dev.js', 'ionic.core.js'));
      promises.push(createCoreJs(config, registryContent, 'ionic.core.ce.dev.js', 'ionic.core.ce.js'));
      promises.push(createCoreJs(config, registryContent, 'ionic.core.sd.ce.dev.js', 'ionic.core.sd.ce.js'));
    }

    return promises;
  });
}


function buildComponentBundles(ctx: BundlerContext, bundleComponentTags: string[]) {
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


function generateBundleFiles(config: BundlerConfig, ctx: BundlerContext) {
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

    return writeFile(bundle.filePath, bundle.content).then(() => {
      return bundle.filePath;
    });

  }));
}


function getAllModeNames(ctx: BundlerContext) {
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


function getManifest(config: BundlerConfig, ctx: BundlerContext) {
  if (ctx.manifest) {
    return Promise.resolve(ctx.manifest);
  }

  config.manifestFilePath = config.manifestFilePath || path.join(config.coreDir, 'manifest.json');

  if (config.debug) {
    console.log(`manifestFilePath: ${config.manifestFilePath}`) ;
  }

  return readFile(config.manifestFilePath).then(manifestStr => {
    return ctx.manifest = JSON.parse(manifestStr);
  });
}


function createCoreJs(config: BundlerConfig, registryContent: string, srcFileName: string, destFileName: string) {
  const srcFilePath = path.join(__dirname, srcFileName);
  if (__dirname) {
    throw 'TODO: no __dirname!!'
  }
  const destFilePath = path.join(config.buildDir, destFileName);

  return readFile(srcFilePath).then(coreJsContent => {
    let content: string;

    if (config.minifyJs) {
      registryContent = registryContent.replace(/\s/g, '');
      content = registryContent + coreJsContent;

    } else {
      content = `${registryContent}\n\n${coreJsContent}`;
    }

    return writeFile(destFilePath, content);
  });
}
