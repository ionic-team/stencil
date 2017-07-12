import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../util/constants';
import { BuildConfig, Bundle, Collection, Manifest } from './interfaces';
import { normalizePath } from './util';


export function validateBuildConfig(config: BuildConfig) {
  if (!config) {
    throw new Error(`invalid build config`);
  }
  if (!config.rootDir) {
    throw new Error('config.rootDir required');
  }
  if (!config.logger) {
    throw new Error(`config.logger required`);
  }
  if (!config.sys) {
    throw new Error('config.sys required');
  }

  if (typeof config.namespace !== 'string') {
    config.namespace = DEFAULT_NAMESPACE;
  }

  if (typeof config.src !== 'string') {
    config.src = DEFAULT_SRC;
  }
  if (!config.sys.path.isAbsolute(config.src)) {
    config.src = normalizePath(config.sys.path.join(config.rootDir, config.src));
  }

  if (typeof config.buildDest !== 'string') {
    config.buildDest = DEFAULT_BUILD_DEST;
  }
  if (!config.sys.path.isAbsolute(config.buildDest)) {
    config.buildDest = normalizePath(config.sys.path.join(config.rootDir, config.buildDest));
  }

  if (typeof config.collectionDest !== 'string') {
    config.collectionDest = DEFAULT_COLLECTION_DEST;
  }
  if (!config.sys.path.isAbsolute(config.collectionDest)) {
    config.collectionDest = normalizePath(config.sys.path.join(config.rootDir, config.collectionDest));
  }

  if (typeof config.indexSrc !== 'string') {
    config.indexSrc = DEFAULT_INDEX_SRC;
  }
  if (!config.sys.path.isAbsolute(config.indexSrc)) {
    config.indexSrc = normalizePath(config.sys.path.join(config.rootDir, config.indexSrc));
  }

  if (typeof config.indexDest !== 'string') {
    config.indexDest = DEFAULT_INDEX_DEST;
  }
  if (!config.sys.path.isAbsolute(config.indexDest)) {
    config.indexDest = normalizePath(config.sys.path.join(config.rootDir, config.indexDest));
  }

  if (typeof config.staticBuildDir !== 'string') {
    // this is reference to the public static build directory from the client
    // in most cases it's just "build", as in index page would end up requesting `build/app/app.js`
    config.staticBuildDir = normalizePath(config.sys.path.relative(config.indexDest, config.buildDest));
  }

  if (typeof config.devMode !== 'boolean') {
    config.devMode = true;
  }
  config.devMode = !!config.devMode;

  if (typeof config.watch !== 'boolean') {
    config.watch = false;
  }
  config.watch = !!config.watch;

  if (typeof config.minifyCss !== 'boolean') {
    // if no config, minify css when it's the prod build
    config.minifyCss = (!config.devMode);
  }

  if (typeof config.minifyJs !== 'boolean') {
    // if no config, minify js when it's the prod build
    config.minifyJs = (!config.devMode);
  }

  if (typeof config.hashFileNames !== 'boolean') {
    // hashFileNames config was not provided, so let's create the default

    if (config.devMode || config.watch) {
      // dev mode should not hash filenames
      // during watch rebuilds it should not hash filenames
      config.hashFileNames = false;

    } else {
      // prod builds should hash filenames
      config.hashFileNames = true;
    }
  }

  if (typeof config.hashedFileNameLength !== 'number') {
    config.hashedFileNameLength = DEFAULT_HASHED_FILENAME_LENTH;
  }

  config.generateCollection = !!config.generateCollection;

  config.attrCase = validateAttrCase(config.attrCase);

  config.collections = config.collections || [];
  config.collections = config.collections.map(validateDependentCollection);

  config.bundles = config.bundles || [];
  config.exclude = config.exclude || DEFAULT_EXCLUDES;

  return config;
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


export function validateAttrCase(attrCase: any) {
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
const DEFAULT_COLLECTION_DEST = 'dist/collection';
const DEFAULT_NAMESPACE = 'App';
const DEFAULT_HASHED_FILENAME_LENTH = 12;
const DEFAULT_EXCLUDES = ['node_modules', 'bower_components'];
