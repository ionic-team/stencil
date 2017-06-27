import { ModesStyleMeta, BundlerConfig, BuildContext, ComponentMeta, CompilerConfig, Manifest, ManifestBundle } from './interfaces';
import { readFile, writeFile } from './util';
import * as path from 'path';


export function generateManifest(config: CompilerConfig, ctx: BuildContext) {
  const manifest: Manifest = {
    components: [],
    bundles: []
  };

  const destDir = config.compilerOptions.outDir;

  if (config.debug) {
    console.log(`compile, generateManifest: ${destDir}`);
  }

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    const cmpMeta: ComponentMeta = Object.assign({}, <any>f.cmpMeta);

    cmpMeta.componentClass = f.cmpClassName;
    cmpMeta.componentUrl = f.jsFilePath.replace(destDir + config.packages.path.sep, '');

    const componentDir = config.packages.path.dirname(cmpMeta.componentUrl);

    if (cmpMeta.modesStyleMeta) {
      const modeNames = Object.keys(cmpMeta.modesStyleMeta);

      modeNames.forEach(modeName => {
        const cmpMode = cmpMeta.modesStyleMeta[modeName];
        if (cmpMode.styleUrls) {
          cmpMode.styleUrls = cmpMode.styleUrls.map(styleUrl => {
            return config.packages.path.join(componentDir, styleUrl);
          });
        }
      });
    }

    if (!cmpMeta.listenersMeta.length) {
      delete cmpMeta.listenersMeta;
    }

    if (!cmpMeta.methodsMeta.length) {
      delete cmpMeta.methodsMeta;
    }

    if (!cmpMeta.propsMeta.length) {
      delete cmpMeta.propsMeta;
    }

    if (!cmpMeta.watchersMeta.length) {
      delete cmpMeta.watchersMeta;
    }

    // place property at the bottom
    const slotMeta = cmpMeta.slotMeta;
    delete cmpMeta.slotMeta;
    cmpMeta.slotMeta = slotMeta;

    const shadow = cmpMeta.isShadowMeta;
    delete cmpMeta.isShadowMeta;
    cmpMeta.isShadowMeta = shadow;

    manifest.components.push(cmpMeta);
  });

  manifest.bundles = (config.bundles && config.bundles.slice()) || [];

  manifest.bundles.forEach(manifestBundle => {
    manifestBundle.components = manifestBundle.components.sort();
  });

  manifest.bundles = manifest.bundles.sort((a, b) => {
    if (a.components && a.components.length) {
      if (a.components[0] < b.components[0]) return -1;
      if (a.components[0] > b.components[0]) return 1;
    }
    return 0;
  });

  manifest.components = manifest.components.sort((a, b) => {
    if (a.tagNameMeta < b.tagNameMeta) return -1;
    if (a.tagNameMeta > b.tagNameMeta) return 1;
    return 0;
  });

  ctx.results.manifest = manifest;

  const manifestFile = config.packages.path.join(config.compilerOptions.outDir, 'manifest.json');
  const json = JSON.stringify(manifest, null, 2);

  if (config.debug) {
    console.log(`compile, manifestFile: ${manifestFile}`);
  }
  return writeFile(config.packages, manifestFile, json);
}


export function getManifest(config: BundlerConfig, ctx: BuildContext): Promise<Manifest> {
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

export function updateManifestUrls(manifestJson: Manifest, manifestDir: string, compiledDir: string): Manifest {
  const components = (manifestJson.components || []).map((comp: ComponentMeta) => {
    const modesStyleMeta = updateStyleUrls(comp.modesStyleMeta, manifestDir, compiledDir);
    return {
      ...comp,
      modesStyleMeta,
      componentUrl: path.join(manifestDir, comp.componentUrl)
    };
  });

  return {
    ...manifestJson,
    components
  };
}

function updateStyleUrls(modesStyleMeta: ModesStyleMeta, manifestDir: string, compiledDir: string): ModesStyleMeta {
  return Object.keys(modesStyleMeta || {}).reduce((styleData: ModesStyleMeta, styleMode: string) => {
    const styleMeta = modesStyleMeta[styleMode];
    const styleUrls = styleMeta.styleUrls
      .map((styleUrl: string) => path.relative(compiledDir, path.join(manifestDir, styleUrl)));
    styleData[styleMode] = {
      ...styleMeta,
      styleUrls
    };
    return styleData;
  }, <ModesStyleMeta>{});
}

export function mergeManifests(manifestPriorityList: Manifest[]): Manifest {
  let removedComponents: string[] = [];

  return manifestPriorityList.reduce((allData: Manifest, collectionManifest: Manifest) => {
    const bundles = (collectionManifest.bundles || []).map((bundle: ManifestBundle) => {
        const components = (bundle.components || []).filter((cmp: string) => removedComponents.indexOf(cmp) === -1);
        components.forEach((cmp: string) => removedComponents.push(cmp));

        return {
          ...bundle,
          components
        };
      })
      .filter((bundle: ManifestBundle) => bundle.components.length !== 0);

    return {
      components: allData.components.concat(collectionManifest.components),
      bundles: allData.bundles.concat(bundles)
    };
  }, <Manifest>{ components: [], bundles: []});
}
