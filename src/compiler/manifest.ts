import { BundlerConfig, BuildContext, CompilerConfig, Manifest, ManifestComponentMeta } from './interfaces';
import { readFile, writeFile } from './util';


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

    const manifestCmp: ManifestComponentMeta = Object.assign({}, <any>f.cmpMeta);

    manifestCmp.componentClass = f.cmpClassName;
    manifestCmp.componentUrl = f.jsFilePath.replace(destDir + config.packages.path.sep, '');

    const componentDir = config.packages.path.dirname(manifestCmp.componentUrl);

    const modeNames = Object.keys(manifestCmp.modes);

    modeNames.forEach(modeName => {
      const cmpMode = manifestCmp.modes[modeName];
      if (cmpMode.styleUrls) {
        cmpMode.styleUrls = cmpMode.styleUrls.map(styleUrl => {
          return config.packages.path.join(componentDir, styleUrl);
        });
      }
    });

    if (!manifestCmp.listeners.length) {
      delete manifestCmp.listeners;
    }

    if (!manifestCmp.methods.length) {
      delete manifestCmp.methods;
    }

    if (!manifestCmp.props.length) {
      delete manifestCmp.props;
    }

    if (!manifestCmp.watchers.length) {
      delete manifestCmp.watchers;
    }

    // place property at the bottom
    const shadow = manifestCmp.shadow;
    delete manifestCmp.shadow;
    manifestCmp.shadow = shadow;

    manifest.components.push(manifestCmp);
  });

  manifest.bundles = config.bundles;

  manifest.components = manifest.components.sort((a, b) => {
    if (a.tag < b.tag) {
      return -1;
    }
    if (a.tag > b.tag) {
      return 1;
    }
    return 0;
  });

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
