import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../../util/constants';
import { BuildConfig, Bundle, DependentCollection, HydrateOptions } from '../../util/interfaces';
import { normalizePath } from '../util';


export function validateBuildConfig(config: BuildConfig) {
  if (!config) {
    throw new Error(`invalid build config`);
  }

  if (config._isValidated) {
    // don't bother if we've already validated this config
    return config;
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
  const invalidNamespaceChars = config.namespace.replace(/\w/g, '');
  if (invalidNamespaceChars !== '') {
    throw new Error(`Namespace "${config.namespace}" contains invalid characters: ${invalidNamespaceChars}`);
  }
  if (config.namespace.length < 3) {
    throw new Error(`Namespace "${config.namespace}" must be at least 3 characters`);
  }
  if (/^\d+$/.test(config.namespace.charAt(0))) {
    throw new Error(`Namespace "${config.namespace}" cannot have a number for the first character`);
  }

  const path = config.sys.path;

  if (typeof config.global === 'string' && !path.isAbsolute(config.global)) {
    config.global = normalizePath(path.join(config.rootDir, config.global));
  }

  if (typeof config.src !== 'string') {
    config.src = DEFAULT_SRC;
  }
  if (!path.isAbsolute(config.src)) {
    config.src = normalizePath(path.join(config.rootDir, config.src));
  }

  if (typeof config.buildDir !== 'string') {
    config.buildDir = DEFAULT_BUILD_DIR;
  }
  if (!path.isAbsolute(config.buildDir)) {
    config.buildDir = normalizePath(path.join(config.rootDir, config.buildDir));
  }

  if (typeof config.collectionDir !== 'string') {
    config.collectionDir = DEFAULT_COLLECTION_DIR;
  }
  if (!path.isAbsolute(config.collectionDir)) {
    config.collectionDir = normalizePath(path.join(config.rootDir, config.collectionDir));
  }

  if (typeof config.indexHtmlSrc !== 'string') {
    config.indexHtmlSrc = DEFAULT_INDEX_SRC;
  }
  if (!path.isAbsolute(config.indexHtmlSrc)) {
    config.indexHtmlSrc = normalizePath(path.join(config.rootDir, config.indexHtmlSrc));
  }

  if (typeof config.indexHtmlBuild !== 'string') {
    config.indexHtmlBuild = DEFAULT_INDEX_BUILD;
  }
  if (!path.isAbsolute(config.indexHtmlBuild)) {
    config.indexHtmlBuild = normalizePath(path.join(config.rootDir, config.indexHtmlBuild));
  }

  if (typeof config.publicPath !== 'string') {
    // CLIENT SIDE ONLY! Do not use this for server-side file read/writes
    // this is a reference to the public static directory from the index.html running from a browser
    // in most cases it's just "build", as in index page would request scripts from `build/`
    config.publicPath = normalizePath(
      path.relative(path.dirname(config.indexHtmlBuild), config.buildDir)
    );
  }
  if (config.publicPath.charAt(config.publicPath.length - 1) !== '/') {
    // ensure there's a trailing /
    config.publicPath += '/';
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

  if (config.prerenderIndex !== null) {
    config.prerenderIndex = Object.assign(config.prerenderIndex || {}, DEFAULT_PRERENDER_INDEX);

    if (typeof config.prerenderIndex.inlineLoaderScript !== 'boolean') {
      config.prerenderIndex.inlineLoaderScript = DEFAULT_PRERENDER_INDEX.inlineLoaderScript;
    }
    if (typeof config.prerenderIndex.reduceHtmlWhitepace !== 'boolean') {
      config.prerenderIndex.reduceHtmlWhitepace = DEFAULT_PRERENDER_INDEX.reduceHtmlWhitepace;
    }
    if (typeof config.prerenderIndex.removeUnusedCss !== 'boolean') {
      config.prerenderIndex.removeUnusedCss = DEFAULT_PRERENDER_INDEX.removeUnusedCss;
    }
  }

  if (!config.watchIgnoredRegex) {
    config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
  }

  config.generateCollection = !!config.generateCollection;

  config.attrCase = validateAttrCase(config.attrCase);

  config.collections = config.collections || [];
  config.collections = config.collections.map(validateDependentCollection);

  config.bundles = config.bundles || [];

  validateUserBundles(config.bundles);

  config.exclude = config.exclude || DEFAULT_EXCLUDES;

  // set to true so it doesn't bother going through all this again on rebuilds
  config._isValidated = true;

  return config;
}


export function validateDependentCollection(userInput: any) {
  if (!userInput || Array.isArray(userInput) || typeof userInput === 'number' || typeof userInput === 'boolean') {
    throw new Error(`invalid collection: ${userInput}`);
  }

  let collection: DependentCollection;

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
const DEFAULT_BUILD_DIR = 'www/build';
const DEFAULT_INDEX_SRC = 'src/index.html';
const DEFAULT_INDEX_BUILD = 'www/index.html';
const DEFAULT_COLLECTION_DIR = 'dist/collection';
const DEFAULT_NAMESPACE = 'App';
const DEFAULT_HASHED_FILENAME_LENTH = 12;
const DEFAULT_EXCLUDES = ['node_modules', 'bower_components'];
const DEFAULT_WATCH_IGNORED_REGEX = /(\.(jpg|jpeg|png|gif|woff|woff2|ttf|eot)|(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$)$/i;

const DEFAULT_PRERENDER_INDEX: HydrateOptions = {
  inlineLoaderScript: true,
  removeUnusedCss: true,
  reduceHtmlWhitepace: true
};
