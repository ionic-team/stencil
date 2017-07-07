import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../util/constants';
import { BuildConfig, BuildContext, BundleResults, BundlerConfig } from './interfaces';
import { bundleModules } from './bundle-modules';
import { bundleStyles } from './bundle-styles';
import { generateComponentRegistry } from './bundle-registry';
import { validateTag } from './validation';


export function bundle(buildConfig: BuildConfig, ctx: BuildContext, bundlerConfig: BundlerConfig) {
  const logger = buildConfig.logger;

  const bundleResults: BundleResults = {
    diagnostics: [],
    componentRegistry: []
  };

  logger.debug(`bundle, src: ${buildConfig.src}`);
  logger.debug(`bundle, buildDest: ${buildConfig.buildDest}`);

  return Promise.resolve().then(() => {
    validateBundlerConfig(bundlerConfig);

    // kick off style and module bundling at the same time
    return Promise.all([
      bundleStyles(buildConfig, ctx, bundlerConfig.manifest),
      bundleModules(buildConfig, ctx, bundlerConfig.manifest)
    ]);

  }).then(results => {
    // both styles and modules are done bundling
    const styleResults = results[0];
    if (styleResults.diagnostics) {
      bundleResults.diagnostics = bundleResults.diagnostics.concat(styleResults.diagnostics);
    }

    const moduleResults = results[1];
    if (moduleResults.diagnostics && moduleResults.diagnostics.length) {
      bundleResults.diagnostics = bundleResults.diagnostics.concat(moduleResults.diagnostics);
    }

    bundleResults.componentRegistry = generateComponentRegistry(buildConfig, ctx, bundlerConfig, styleResults, moduleResults);

  })
  .catch(err => {
    bundleResults.diagnostics.push({
      msg: err.toString(),
      type: 'error',
      stack: err.stack
    });

  })
  .then(() => {
    return bundleResults;
  });
}


function validateBundlerConfig(bundlerConfig: BundlerConfig) {
  bundlerConfig.attrCase = normalizeAttrCase(bundlerConfig.attrCase);

  if (!bundlerConfig.manifest) {
    throw new Error('config.manifest required');
  }
  if (!bundlerConfig.manifest.bundles) {
    throw new Error('config.manifest.bundles required');
  }
  if (!bundlerConfig.manifest.components) {
    throw new Error('config.manifest.components required');
  }

  // sort by tag name and ensure they're lower case
  bundlerConfig.manifest.bundles.forEach(b => {
    b.components = b.components
                    .filter(c => typeof c === 'string' && c.trim().length);

    if (!b.components.length) {
      throw new Error(`No valid bundle components found within stencil config`);
    }

    b.components = b.components.map(tag => {
      return validateTag(tag, `found in bundle component stencil config`);
    }).sort();
  });

  bundlerConfig.manifest.components.forEach(c => {
    c.tagNameMeta = c.tagNameMeta.toLowerCase().trim();
  });
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
