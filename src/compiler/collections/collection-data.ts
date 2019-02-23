import * as d from '@declarations';
import { COLLECTION_MANIFEST_FILE_NAME, sortBy } from '@utils';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { isOutputTargetDistCollection } from '../output-targets/output-utils';


export async function writeAppCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);

  await Promise.all(outputTargets.map(async outputTarget => {
    await writeAppCollection(config, compilerCtx, buildCtx, outputTarget);
  }));
}

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
async function writeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.dir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  // serialize the collection into a json string and
  // add it to the list of files we need to write when we're ready
  const collectionData = serializeAppCollection(config, compilerCtx, collectionDir, buildCtx.entryModules, buildCtx.global);

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, JSON.stringify(collectionData, null, 2));
}


export function serializeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, entryModules: d.EntryModule[], globalModule: d.Module) {
  // create the single collection we're going to fill up with data
  const collectionData: d.CollectionData = {
    components: serializeComponents(config, collectionDir, entryModules),
    collections: serializeCollectionDependencies(compilerCtx),
    compiler: {
      name: sys.compiler.name,
      version: sys.compiler.version,
      typescriptVersion: sys.compiler.typescriptVersion
    },
    bundles: serializeBundles(config)
  };

  // set the global path if it exists
  serializeAppGlobal(config, collectionDir, collectionData, globalModule);

  // success!
  return collectionData;
}

function serializeComponents(config: d.Config, collectionDir: string, entryModules: d.EntryModule[]) {
  const components: d.ComponentData[] = [];
  entryModules.forEach(entryModule => {
    entryModule.cmps.forEach(cmp => {
      const cmpData = serializeComponent(config, collectionDir, cmp);
      if (cmpData) {
        components.push(cmpData);
      }
    });
  });
  return sortBy(components, c => c.tag);
}

export function serializeCollectionDependencies(compilerCtx: d.CompilerCtx) {
  const collectionDeps = compilerCtx.collections.map(c => {
    const collectionDeps: d.CollectionDependencyData = {
      name: c.collectionName,
      tags: c.moduleFiles.reduce((tags, m) => {
        m.cmps.forEach(cmp => {
          if (!tags.includes(cmp.tagName)) {
            tags.push(cmp.tagName);
          }
        });
        return tags;
      }, [] as string[]).sort()
    };
    return collectionDeps;
  });

  return collectionDeps.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}


export function parseCollectionDependencies(collectionData: d.CollectionData) {
  const dependencies: string[] = [];

  if (Array.isArray(collectionData.collections)) {
    collectionData.collections.forEach(c => {
      dependencies.push(c.name);
    });
  }

  return dependencies;
}


export function excludeFromCollection(config: d.Config, cmpData: d.ComponentData) {
  // this is a component from a collection dependency
  // however, this project may also become a collection
  // for example, "ionicons" is a dependency of "ionic"
  // and "ionic" is it's own stand-alone collection, so within
  // ionic's collection we want ionicons to just work

  // cmpData is a component from a collection dependency
  // if this component is listed in this config's bundles
  // then we'll need to ensure it also becomes apart of this collection
  const isInBundle = config.bundles && config.bundles.some(bundle => {
    return bundle.components && bundle.components.some(tag => tag === cmpData.tag);
  });

  // if it's not in the config bundle then it's safe to exclude
  // this component from going into this build's collection
  return !isInBundle;
}


export function serializeComponent(config: d.Config, collectionDir: string, cmp: d.ComponentCompilerMeta) {
  if (cmp.isCollectionDependency || cmp.excludeFromCollection) {
    return null;
  }

  const cmpData: d.ComponentData = {};

  // get the current absolute path to our built js file
  // and figure out the relative path from the src dir
  const relToSrc = normalizePath(sys.path.relative(config.srcDir, cmp.jsFilePath));

  // figure out the absolute path when it's in the collection dir
  const compiledComponentAbsoluteFilePath = normalizePath(sys.path.join(collectionDir, relToSrc));

  // create a relative path from the collection file to the compiled component's output javascript file
  const compiledComponentRelativeFilePath = normalizePath(sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));

  // create a relative path to the directory where the compiled component's output javascript is sitting in
  const compiledComponentRelativeDirPath = normalizePath(sys.path.dirname(compiledComponentRelativeFilePath));

  serializeTag(cmpData, cmp);
  serializeComponentDependencies(cmpData, cmp);
  serializeComponentClass(cmpData, cmp);
  serializeComponentPath(collectionDir, compiledComponentAbsoluteFilePath, cmpData);
  serializeStyles(compiledComponentRelativeDirPath, cmpData, cmp);
  serializeAssetsDir(compiledComponentRelativeDirPath, cmpData, cmp);

  return cmpData;
}


function serializeTag(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.tag = cmpMeta.tagName;
}


function serializeComponentPath(collectionDir: string, compiledComponentAbsoluteFilePath: string, cmpData: d.ComponentData) {
  // convert absolute path into a path that's relative to the collection file
  cmpData.componentPath = normalizePath(sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
}


function serializeComponentDependencies(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.dependencies = (cmpMeta.dependencies || []).sort();
}


function serializeComponentClass(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.componentClass = cmpMeta.componentClassName;
}


function serializeStyles(compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  if (cmpMeta.styles) {
    cmpData.styles = {};

    cmpMeta.styles.forEach(style => {
      cmpData.styles[style.modeName] = serializeStyle(compiledComponentRelativeDirPath, style);
    });
  }
}


function serializeStyle(compiledComponentRelativeDirPath: string, modeStyleMeta: d.StyleCompiler) {
  const modeStyleData: d.StyleData = {};

  if (modeStyleMeta.externalStyles && modeStyleMeta.externalStyles.length > 0) {
    modeStyleData.stylePaths = modeStyleMeta.externalStyles.map(externalStyle => {
      // convert style paths which are relative to the component file
      // to be style paths that are relative to the collection file

      // we've already figured out the component's relative path from the collection file
      // use the value we already created in serializeComponentPath()
      // create a relative path from the collection file to the style path
      return normalizePath(sys.path.join(compiledComponentRelativeDirPath, externalStyle.relativePath));
    });

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}


function serializeAssetsDir(compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  if (invalidArrayData(cmpMeta.assetsDirs)) {
    return;
  }

  // convert asset paths which are relative to the component file
  // to be asset paths that are relative to the collection file

  // we've already figured out the component's relative path from the collection file
  // use the value we already created in serializeComponentPath()
  // create a relative path from the collection file to the asset path

  cmpData.assetPaths = cmpMeta.assetsDirs.map(assetMeta => {
    return normalizePath(sys.path.join(compiledComponentRelativeDirPath, assetMeta.cmpRelativePath));
  }).sort();
}

export function serializeAppGlobal(config: d.Config, collectionDir: string, collectionData: d.CollectionData, globalModule: d.Module) {
  if (!globalModule) {
    return;
  }

  // get the current absolute path to our built js file
  // and figure out the relative path from the src dir
  const relToSrc = normalizePath(sys.path.relative(config.srcDir, globalModule.jsFilePath));

  // figure out the absolute path when it's in the collection dir
  const compiledComponentAbsoluteFilePath = normalizePath(sys.path.join(collectionDir, relToSrc));

  // create a relative path from the collection file to the compiled output javascript file
  collectionData.global = normalizePath(sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
}


export function parseGlobal(collectionDir: string, collectionData: d.CollectionData, collection: d.Collection) {
  if (typeof collectionData.global !== 'string') return;

  collection.global = {
    sourceFilePath: normalizePath(sys.path.join(collectionDir, collectionData.global)),
    jsFilePath: normalizePath(sys.path.join(collectionDir, collectionData.global)),
    localImports: [],
    externalImports: [],
    potentialCmpRefs: []
  };
}


export function serializeBundles(config: d.Config) {
  return config.bundles.map(b => {
    return {
      components: b.components.slice().sort()
    };
  });
}


export function parseBundles(collectionData: d.CollectionData, collection: d.Collection) {
  if (invalidArrayData(collectionData.bundles)) {
    collection.bundles = [];
    return;
  }

  collection.bundles = collectionData.bundles.map(b => {
    return {
      components: b.components.slice().sort()
    };
  });
}


function invalidArrayData(arr: any[]) {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
}



export const BOOLEAN_KEY = 'Boolean';
export const NUMBER_KEY = 'Number';
export const STRING_KEY = 'String';
export const ANY_KEY = 'Any';
