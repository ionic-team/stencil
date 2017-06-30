import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../util/constants';
import { BundlerConfig, BuildContext, Manifest, Results } from './interfaces';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { generateComponentRegistry } from './bundle-registry';
import { setupBundlerWatch } from './watch';


export function bundle(config: BundlerConfig, ctx: BuildContext = {}): Promise<Results> {
  validateConfig(config);

  const userManifest = validateUserManifest(config.manifest);

  config.logger.debug(`bundle, srcDir: ${config.srcDir}`);
  config.logger.debug(`bundle, destDir: ${config.destDir}`);
  config.logger.debug(`bundle, attrCase: ${config.attrCase}`);

  ctx.results = {
    files: []
  };

  // kick off style and module bundling at the same time
  return Promise.all([
    bundleStyles(config, ctx, userManifest),
    bundleModules(config, userManifest)
  ])
  .then(bundleResults => {
    // both styles and modules are done bundling
    const styleResults = bundleResults[0];
    const moduleResults = bundleResults[1];

    return generateComponentRegistry(config, ctx, styleResults, moduleResults);
  })
  .then(() => {
    return setupBundlerWatch(config, ctx, config.sys.typescript.sys);
  })
  .then(() => {
    config.logger.info('bundle, done');

    return ctx.results;
  });
}


export function bundleWatch(config: BundlerConfig, ctx: BuildContext, changedFiles: string[]) {
  config.logger.debug(`bundle, bundleWatch: ${changedFiles}`);

  return bundle(config, ctx);
}


function validateConfig(config: BundlerConfig) {
  if (!config.sys) {
    throw 'config.sys required';
  }
  if (!config.sys.fs) {
    throw 'config.sys.fs required';
  }
  if (!config.sys.path) {
    throw 'config.sys.path required';
  }
  if (!config.sys.crypto) {
    throw 'config.sys.crypto required';
  }
  if (!config.sys.sass) {
    throw 'config.sys.sass required';
  }
  if (!config.sys.rollup) {
    throw 'config.sys.rollup required';
  }
  if (!config.sys.typescript) {
    throw 'config.sys.typescript required';
  }

  config.attrCase = normalizeAttrCase(config.attrCase);
}


function validateUserManifest(manifest: Manifest) {
  if (!manifest) {
    throw 'config.manifest required';
  }
  if (!manifest.bundles) {
    throw 'config.manifest.bundles required';
  }
  if (!manifest.components) {
    throw 'config.manifest.components required';
  }

  // sort by tag name and ensure they're lower case
  manifest.bundles.forEach(b => {
    b.components = b.components.sort().map(c => c.toLowerCase().trim());
  });
  manifest.components.forEach(c => {
    c.tagNameMeta = c.tagNameMeta.toLowerCase().trim();
  });

  return manifest;
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
