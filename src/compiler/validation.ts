import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../util/constants';
import { BuildConfig, Bundle, Collection, Manifest } from './interfaces';
import { normalizePath } from './util';


export function validateBuildConfig(buildConfig: BuildConfig) {
  if (!buildConfig) {
    throw new Error(`invalid build config`);
  }
  if (!buildConfig.rootDir) {
    throw new Error('config.rootDir required');
  }
  if (!buildConfig.logger) {
    throw new Error(`config.logger required`);
  }
  if (!buildConfig.sys) {
    throw new Error('config.sys required');
  }

  if (typeof buildConfig.namespace !== 'string') {
    buildConfig.namespace = DEFAULT_NAMESPACE;
  }

  if (typeof buildConfig.src !== 'string') {
    buildConfig.src = DEFAULT_SRC;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.src)) {
    buildConfig.src = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.src));
  }

  if (typeof buildConfig.buildDest !== 'string') {
    buildConfig.buildDest = DEFAULT_BUILD_DEST;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.buildDest)) {
    buildConfig.buildDest = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.buildDest));
  }

  if (typeof buildConfig.collectionDest !== 'string') {
    buildConfig.collectionDest = DEFAULT_COLLECTION_DEST;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.collectionDest)) {
    buildConfig.collectionDest = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.collectionDest));
  }

  if (typeof buildConfig.indexSrc !== 'string') {
    buildConfig.indexSrc = DEFAULT_INDEX_SRC;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.indexSrc)) {
    buildConfig.indexSrc = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.indexSrc));
  }

  if (typeof buildConfig.indexDest !== 'string') {
    buildConfig.indexDest = DEFAULT_INDEX_DEST;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.indexDest)) {
    buildConfig.indexDest = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.indexDest));
  }

  if (typeof buildConfig.diagnosticsDest !== 'string') {
    buildConfig.diagnosticsDest = DEFAULT_DIAGNOSTICS_DEST;
  }
  if (!buildConfig.sys.path.isAbsolute(buildConfig.diagnosticsDest)) {
    buildConfig.diagnosticsDest = normalizePath(buildConfig.sys.path.join(buildConfig.rootDir, buildConfig.diagnosticsDest));
  }

  if (typeof buildConfig.devMode !== 'boolean') {
    buildConfig.devMode = true;
  }
  buildConfig.devMode = !!buildConfig.devMode;

  if (typeof buildConfig.watch !== 'boolean') {
    buildConfig.watch = false;
  }
  buildConfig.watch = !!buildConfig.watch;

  if (typeof buildConfig.minifyCss !== 'boolean') {
    // if no config, minify css when it's the prod build
    buildConfig.minifyCss = (!buildConfig.devMode);
  }

  if (typeof buildConfig.minifyJs !== 'boolean') {
    // if no config, minify js when it's the prod build
    buildConfig.minifyJs = (!buildConfig.devMode);
  }

  if (typeof buildConfig.hashFileNames !== 'boolean') {
    // hashFileNames config was not provided, so let's create the default

    if (buildConfig.devMode || buildConfig.watch) {
      // dev mode should not hash filenames
      // during watch rebuilds it should not hash filenames
      buildConfig.hashFileNames = false;

    } else {
      // prod builds should hash filenames
      buildConfig.hashFileNames = true;
    }
  }

  if (typeof buildConfig.hashedFileNameLength !== 'number') {
    buildConfig.hashedFileNameLength = DEFAULT_HASHED_FILENAME_LENTH;
  }

  buildConfig.generateCollection = !!buildConfig.generateCollection;

  buildConfig.attrCase = normalizeAttrCase(buildConfig.attrCase);

  buildConfig.collections = buildConfig.collections || [];
  buildConfig.collections = buildConfig.collections.map(validateDependentCollection);

  buildConfig.bundles = buildConfig.bundles || [];
  buildConfig.exclude = buildConfig.exclude || DEFAULT_EXCLUDES;

  return buildConfig;
}


export function validateDependentCollection(userInput: any) {
  if (!userInput || Array.isArray(userInput) || typeof userInput === 'number' || typeof userInput === 'boolean') {
    throw new Error(`invalid collection: ${userInput}`);
  }

  let collection: Collection;

  if (typeof userInput === 'string') {
    collection = {
      name: userInput
    };

  } else {
    collection = userInput;
  }

  if (!collection.name || typeof collection.name !== 'string' || collection.name.trim() === '') {
    throw new Error(`missing collection name`);
  }

  collection.name = collection.name.trim();
  collection.includeBundledOnly = !!collection.includeBundledOnly;

  return collection;
}


export function validateUserBundles(bundles: Bundle[]) {
  if (!bundles) {
    throw new Error(`Invalid bundles`);
  }

  // normalize bundle component tags
  // sort by tag name and ensure they're lower case
  bundles.forEach(b => {
    if (!Array.isArray(b.components)) {
      throw new Error(`manifest missing bundle components array, instead received: ${b.components}`);
    }

    b.components = b.components.filter(c => typeof c === 'string' && c.trim().length);

    if (!b.components.length) {
      throw new Error(`No valid bundle components found within stencil config`);
    }

    b.components = b.components.map(tag => {
      return validateTag(tag, `found in bundle component stencil config`);
    }).sort();
  });

  bundles.sort((a, b) => {
    if (a.components && a.components.length && b.components && b.components.length) {
      if (a.components[0].toLowerCase() < b.components[0].toLowerCase()) return -1;
      if (a.components[0].toLowerCase() > b.components[0].toLowerCase()) return 1;
    }
    return 0;
  });
}


export function validateManifestBundles(manifest: Manifest) {
  if (!manifest) {
    throw new Error(`Invalid manifest`);
  }

  manifest.bundles = manifest.bundles || [];
  manifest.components = manifest.components || [];

  validateUserBundles(manifest.bundles);

  manifest.components.forEach(c => {
    c.tagNameMeta = validateTag(c.tagNameMeta, `found in bundle component stencil config`);
  });
}


export function validateTag(tag: string, suffix: string) {
  if (typeof tag !== 'string') {
    throw new Error(`Tag "${tag}" must be a string type, ${suffix}`);
  }

  tag = tag.trim().toLowerCase();

  if (tag.length === 0) {
    throw new Error(`Received empty tag value, ${suffix}`);
  }

  if (tag.indexOf(' ') > -1) {
    throw new Error(`"${tag}" tag cannot contain a space, ${suffix}`);
  }

  if (tag.indexOf(',') > -1) {
    throw new Error(`"${tag}" tag cannot be use for multiple tags, ${suffix}`);
  }

  let invalidChars = tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw new Error(`"${tag}" tag contains invalid characters: ${invalidChars}, ${suffix}`);
  }

  if (tag.indexOf('-') === -1) {
    throw new Error(`"${tag}" tag must contain a dash (-) to work as a valid web component, ${suffix}`);
  }

  if (tag.indexOf('--') > -1) {
    throw new Error(`"${tag}" tag cannot contain multiple dashes (--) next to each other, ${suffix}`);
  }

  if (tag.indexOf('-') === 0) {
    throw new Error(`"${tag}" tag cannot start with a dash (-), ${suffix}`);
  }

  if (tag.lastIndexOf('-') === tag.length - 1) {
    throw new Error(`"${tag}" tag cannot end with a dash (-), ${suffix}`);
  }

  return tag;
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


const DEFAULT_SRC = 'src';
const DEFAULT_BUILD_DEST = 'www/build';
const DEFAULT_INDEX_SRC = 'src/index.html';
const DEFAULT_INDEX_DEST = 'www/index.html';
const DEFAULT_DIAGNOSTICS_DEST = 'www/.dev-diagnostics.html';
const DEFAULT_COLLECTION_DEST = 'dist/collection';
const DEFAULT_NAMESPACE = 'App';
const DEFAULT_HASHED_FILENAME_LENTH = 12;
const DEFAULT_EXCLUDES = ['node_modules', 'bower_components'];
