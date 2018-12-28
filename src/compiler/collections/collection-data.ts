import * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { normalizePath } from '../util';


export async function writeAppCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

  await Promise.all(outputTargets.map(async outputTarget => {
    await writeAppCollection(config, compilerCtx, buildCtx, outputTarget);
  }));
}

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
async function writeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist) {
  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.collectionDir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(config.sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  // serialize the collection into a json string and
  // add it to the list of files we need to write when we're ready
  const collectionData = serializeAppCollection(config, compilerCtx, collectionDir, buildCtx.entryModules, buildCtx.global);

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, JSON.stringify(collectionData, null, 2));
}


export function serializeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, entryModules: d.EntryModule[], globalModule: d.Module) {
  // create the single collection we're going to fill up with data
  const collectionData: d.CollectionData = {
    components: [],
    collections: serializeCollectionDependencies(compilerCtx),
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    },
    bundles: []
  };

  // add component data for each of the collection files
  entryModules.forEach(entryModule => {
    entryModule.moduleFiles.forEach(moduleFile => {
      const cmpData = serializeComponent(config, collectionDir, moduleFile);
      if (cmpData) {
        collectionData.components.push(cmpData);
      }
    });
  });

  // sort it alphabetically, cuz
  collectionData.components.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });

  // set the global path if it exists
  serializeAppGlobal(config, collectionDir, collectionData, globalModule);

  serializeBundles(config, collectionData);

  // success!
  return collectionData;
}


export function serializeCollectionDependencies(compilerCtx: d.CompilerCtx) {
  const collectionDeps = compilerCtx.collections.map(c => {
    const collectionDeps: d.CollectionDependencyData = {
      name: c.collectionName,
      tags: c.moduleFiles.filter(m => {
        return !!m.cmpCompilerMeta;
      }).map(m => m.cmpCompilerMeta.tagName).sort()
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


export function serializeComponent(config: d.Config, collectionDir: string, moduleFile: d.Module) {
  if (!moduleFile || !moduleFile.cmpCompilerMeta || moduleFile.isCollectionDependency || moduleFile.excludeFromCollection) {
    return null;
  }

  const cmpData: d.ComponentData = {};
  const cmpMeta = moduleFile.cmpCompilerMeta;

  // get the current absolute path to our built js file
  // and figure out the relative path from the src dir
  const relToSrc = normalizePath(config.sys.path.relative(config.srcDir, moduleFile.jsFilePath));

  // figure out the absolute path when it's in the collection dir
  const compiledComponentAbsoluteFilePath = normalizePath(config.sys.path.join(collectionDir, relToSrc));

  // create a relative path from the collection file to the compiled component's output javascript file
  const compiledComponentRelativeFilePath = normalizePath(config.sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));

  // create a relative path to the directory where the compiled component's output javascript is sitting in
  const compiledComponentRelativeDirPath = normalizePath(config.sys.path.dirname(compiledComponentRelativeFilePath));

  serializeTag(cmpData, cmpMeta);
  serializeComponentDependencies(cmpData, cmpMeta);
  serializeComponentClass(cmpData, cmpMeta);
  serializeComponentPath(config, collectionDir, compiledComponentAbsoluteFilePath, cmpData);
  serializeStyles(config, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  serializeAssetsDir(config, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  // serializeProps(cmpData, cmpMeta);
  // serializeStates(cmpData, cmpMeta);
  // serializeListeners(cmpData, cmpMeta);
  // serializeMethods(cmpData, cmpMeta);
  // serializeContextMember(cmpData, cmpMeta);
  // serializeConnectMember(cmpData, cmpMeta);
  // serializeHostElementMember(cmpData, cmpMeta);
  // serializeEvents(cmpData, cmpMeta);
  // serializeHost(cmpData, cmpMeta);
  // serializeEncapsulation(cmpData, cmpMeta);

  return cmpData;
}


function serializeTag(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.tag = cmpMeta.tagName;
}


function serializeComponentPath(config: d.Config, collectionDir: string, compiledComponentAbsoluteFilePath: string, cmpData: d.ComponentData) {
  // convert absolute path into a path that's relative to the collection file
  cmpData.componentPath = normalizePath(config.sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
}


function serializeComponentDependencies(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.dependencies = (cmpMeta.dependencies || []).sort();
}


function serializeComponentClass(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  cmpData.componentClass = cmpMeta.componentClassName;
}


function serializeStyles(config: d.Config, compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  if (cmpMeta.styles) {
    cmpData.styles = {};

    cmpMeta.styles.forEach(style => {
      cmpData.styles[style.modeName] = serializeStyle(config, compiledComponentRelativeDirPath, style);
    });
  }
}


function serializeStyle(config: d.Config, compiledComponentRelativeDirPath: string, modeStyleMeta: d.StyleCompiler) {
  const modeStyleData: d.StyleData = {};

  if (modeStyleMeta.externalStyles && modeStyleMeta.externalStyles.length > 0) {
    modeStyleData.stylePaths = modeStyleMeta.externalStyles.map(externalStyle => {
      // convert style paths which are relative to the component file
      // to be style paths that are relative to the collection file

      // we've already figured out the component's relative path from the collection file
      // use the value we already created in serializeComponentPath()
      // create a relative path from the collection file to the style path
      return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, externalStyle.relativePath));
    });

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}


function serializeAssetsDir(config: d.Config, compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
  if (invalidArrayData(cmpMeta.assetsDirs)) {
    return;
  }

  // convert asset paths which are relative to the component file
  // to be asset paths that are relative to the collection file

  // we've already figured out the component's relative path from the collection file
  // use the value we already created in serializeComponentPath()
  // create a relative path from the collection file to the asset path

  cmpData.assetPaths = cmpMeta.assetsDirs.map(assetMeta => {
    return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, assetMeta.cmpRelativePath));
  }).sort();
}


// function serializeProps(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
//     const memberMeta = cmpMeta.membersMeta[memberName];

//     if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
//       cmpData.props = cmpData.props || [];

//       const propData: d.PropData = {
//         name: memberName
//       };

//       if (memberMeta.propType === PROP_TYPE.Boolean) {
//         propData.type = BOOLEAN_KEY;

//       } else if (memberMeta.propType === PROP_TYPE.Number) {
//         propData.type = NUMBER_KEY;

//       } else if (memberMeta.propType === PROP_TYPE.String) {
//         propData.type = STRING_KEY;

//       } else if (memberMeta.propType === PROP_TYPE.Any) {
//         propData.type = ANY_KEY;
//       }

//       if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
//         propData.mutable = true;
//       }

//       if (memberMeta.reflectToAttrib) {
//         propData.reflectToAttr = true;
//       }

//       if (typeof memberMeta.attribName === 'string') {
//         propData.attr = memberMeta.attribName;
//       }

//       if (memberMeta.watchCallbacks && memberMeta.watchCallbacks.length > 0) {
//         propData.watch = memberMeta.watchCallbacks.slice();
//       }

//       cmpData.props.push(propData);
//     }
//   });
// }


// function serializeStates(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
//     const member = cmpMeta.membersMeta[memberName];

//     if (member.memberType === MEMBER_TYPE.State) {
//       cmpData.states = cmpData.states || [];

//       cmpData.states.push({
//         name: memberName
//       });
//     }
//   });
// }


// function serializeListeners(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpMeta.listenersMeta)) {
//     return;
//   }

//   cmpData.listeners = cmpMeta.listenersMeta.map(listenerMeta => {
//     const listenerData: d.ListenerData = {
//       event: listenerMeta.eventName,
//       method: listenerMeta.eventMethodName
//     };
//     if (listenerMeta.eventPassive === false) {
//       listenerData.passive = false;
//     }
//     if (listenerMeta.eventDisabled === true) {
//       listenerData.enabled = false;
//     }
//     if (listenerMeta.eventCapture === false) {
//       listenerData.capture = false;
//     }
//     return listenerData;

//   }).sort((a, b) => {
//     if (a.event.toLowerCase() < b.event.toLowerCase()) return -1;
//     if (a.event.toLowerCase() > b.event.toLowerCase()) return 1;
//     return 0;
//   });
// }


// function serializeMethods(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
//     const member = cmpMeta.membersMeta[memberName];

//     if (member.memberType === MEMBER_TYPE.Method) {
//       cmpData.methods = cmpData.methods || [];

//       cmpData.methods.push({
//         name: memberName
//       });
//     }
//   });
// }


// function serializeContextMember(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).forEach(memberName => {
//     const member = cmpMeta.membersMeta[memberName];

//     if (member.ctrlId && member.memberType === MEMBER_TYPE.PropContext) {
//       cmpData.context = cmpData.context || [];

//       cmpData.context.push({
//         name: memberName,
//         id: member.ctrlId
//       });
//     }
//   });
// }


// function serializeConnectMember(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).forEach(memberName => {
//     const member = cmpMeta.membersMeta[memberName];

//     if (member.ctrlId && member.memberType === MEMBER_TYPE.PropConnect) {
//       cmpData.connect = cmpData.connect || [];

//       cmpData.connect.push({
//         name: memberName,
//         tag: member.ctrlId
//       });
//     }
//   });
// }


// function serializeHostElementMember(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.membersMeta) return;

//   Object.keys(cmpMeta.membersMeta).forEach(memberName => {
//     const member = cmpMeta.membersMeta[memberName];

//     if (member.memberType === MEMBER_TYPE.Element) {
//       cmpData.hostElement = {
//         name: memberName
//       };
//     }
//   });
// }


// function serializeEvents(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpMeta.eventsMeta)) {
//     return;
//   }

//   cmpData.events = cmpMeta.eventsMeta.map(eventMeta => {
//     const eventData: d.EventData = {
//       event: eventMeta.eventName
//     };
//     if (eventMeta.eventMethodName !== eventMeta.eventName) {
//       eventData.method = eventMeta.eventMethodName;
//     }
//     if (eventMeta.eventBubbles === false) {
//       eventData.bubbles = false;
//     }
//     if (eventMeta.eventCancelable === false) {
//       eventData.cancelable = false;
//     }
//     if (eventMeta.eventComposed === false) {
//       eventData.composed = false;
//     }
//     return eventData;

//   }).sort((a, b) => {
//     if (a.event.toLowerCase() < b.event.toLowerCase()) return -1;
//     if (a.event.toLowerCase() > b.event.toLowerCase()) return 1;
//     return 0;
//   });
// }


// function serializeHost(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (!cmpMeta.hostMeta || Array.isArray(cmpMeta.hostMeta) || !Object.keys(cmpMeta.hostMeta).length) {
//     return;
//   }
//   cmpData.host = cmpMeta.hostMeta;
// }


// function serializeEncapsulation(cmpData: d.ComponentData, cmpMeta: d.ComponentCompilerMeta) {
//   if (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom) {
//     cmpData.shadow = true;

//   } else if (cmpMeta.encapsulationMeta === ENCAPSULATION.ScopedCss) {
//     cmpData.scoped = true;
//   }
// }


export function serializeAppGlobal(config: d.Config, collectionDir: string, collectionData: d.CollectionData, globalModule: d.Module) {
  if (!globalModule) {
    return;
  }

  // get the current absolute path to our built js file
  // and figure out the relative path from the src dir
  const relToSrc = normalizePath(config.sys.path.relative(config.srcDir, globalModule.jsFilePath));

  // figure out the absolute path when it's in the collection dir
  const compiledComponentAbsoluteFilePath = normalizePath(config.sys.path.join(collectionDir, relToSrc));

  // create a relative path from the collection file to the compiled output javascript file
  collectionData.global = normalizePath(config.sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
}


export function parseGlobal(config: d.Config, collectionDir: string, collectionData: d.CollectionData, collection: d.Collection) {
  if (typeof collectionData.global !== 'string') return;

  collection.global = {
    sourceFilePath: normalizePath(config.sys.path.join(collectionDir, collectionData.global)),
    jsFilePath: normalizePath(config.sys.path.join(collectionDir, collectionData.global)),
    localImports: [],
    externalImports: [],
    potentialCmpRefs: []
  };
}


export function serializeBundles(config: d.Config, collectionData: d.CollectionData) {
  collectionData.bundles = config.bundles.map(b => {
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

// function nameSort(a: string, b: string) {
//   if (a.toLowerCase() < b.toLowerCase()) return -1;
//   if (a.toLowerCase() > b.toLowerCase()) return 1;
//   return 0;
// }


export const BOOLEAN_KEY = 'Boolean';
export const NUMBER_KEY = 'Number';
export const STRING_KEY = 'String';
export const ANY_KEY = 'Any';
