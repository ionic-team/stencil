import * as d from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { normalizePath } from '../util';


export async function writeAppCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  return Promise.all(config.outputTargets.map(outputTarget => {
    return writeAppCollection(config, compilerCtx, buildCtx, outputTarget);
  }));
}

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
async function writeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist) {

  if (!outputTarget.collectionDir) {
    return Promise.resolve();
  }

  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.collectionDir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(config.sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  config.logger.debug(`collection, serialize: ${collectionFilePath}`);

  // serialize the collection into a json string and
  // add it to the list of files we need to write when we're ready
  const collectionData = serializeAppCollection(config, compilerCtx, collectionDir, buildCtx.entryModules, buildCtx.global);

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, JSON.stringify(collectionData, null, 2));

  return collectionData;
}


export function serializeAppCollection(config: d.Config, compilerCtx: d.CompilerCtx, collectionDir: string, entryModules: d.EntryModule[], globalModule: d.ModuleFile) {
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
        return !!m.cmpMeta;
      }).map(m => m.cmpMeta.tagNameMeta).sort()
    };
    return collectionDeps;
  });

  return collectionDeps.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}


export function parseCollectionData(config: d.Config, collectionName: string, collectionDir: string, collectionJsonStr: string) {
  const collectionData: d.CollectionData = JSON.parse(collectionJsonStr);
  const collection: d.Collection = {
    collectionName: collectionName,
    dependencies: parseCollectionDependencies(collectionData),
    compiler: {
      name: collectionData.compiler.name,
      version: collectionData.compiler.version,
      typescriptVersion: collectionData.compiler.typescriptVersion
    },
    bundles: []
  };

  parseComponents(config, collectionDir, collectionData, collection);
  parseGlobal(config, collectionDir, collectionData, collection);
  parseBundles(collectionData, collection);

  return collection;
}


export function parseComponents(config: d.Config, collectionDir: string, collectionData: d.CollectionData, collection: d.Collection) {
  const componentsData = collectionData.components;

  if (!componentsData || !Array.isArray(componentsData)) {
    collection.moduleFiles = [];
    return;
  }

  collection.moduleFiles = componentsData.map(cmpData => {
    return parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
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


export function serializeComponent(config: d.Config, collectionDir: string, moduleFile: d.ModuleFile) {
  if (!moduleFile || !moduleFile.cmpMeta || moduleFile.isCollectionDependency || moduleFile.excludeFromCollection) {
    return null;
  }

  const cmpData: d.ComponentData = {};
  const cmpMeta = moduleFile.cmpMeta;

  // get the absolute path to the compiled component's output javascript file
  const compiledComponentAbsoluteFilePath = normalizePath(moduleFile.jsFilePath);

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
  serializeProps(cmpData, cmpMeta);
  serializeStates(cmpData, cmpMeta);
  serializeListeners(cmpData, cmpMeta);
  serializeMethods(cmpData, cmpMeta);
  serializeContextMember(cmpData, cmpMeta);
  serializeConnectMember(cmpData, cmpMeta);
  serializeHostElementMember(cmpData, cmpMeta);
  serializeEvents(cmpData, cmpMeta);
  serializeHost(cmpData, cmpMeta);
  serializeEncapsulation(cmpData, cmpMeta);

  return cmpData;
}


export function parseComponentDataToModuleFile(config: d.Config, collection: d.Collection, collectionDir: string, cmpData: d.ComponentData) {
  const moduleFile: d.ModuleFile = {
    cmpMeta: {},
    isCollectionDependency: true,
    excludeFromCollection: excludeFromCollection(config, cmpData)
  };
  const cmpMeta = moduleFile.cmpMeta;

  parseTag(cmpData, cmpMeta);
  parseComponentDependencies(cmpData, cmpMeta);
  parseComponentClass(cmpData, cmpMeta);
  parseModuleJsFilePath(config, collectionDir, cmpData, moduleFile);
  parseStyles(config, collectionDir, cmpData, cmpMeta);
  parseAssetsDir(config, collectionDir, cmpData, cmpMeta);
  parseProps(config, collection, cmpData, cmpMeta);
  parseStates(cmpData, cmpMeta);
  parseListeners(cmpData, cmpMeta);
  parseMethods(cmpData, cmpMeta);
  parseContextMember(cmpData, cmpMeta);
  parseConnectMember(cmpData, cmpMeta);
  parseHostElementMember(cmpData, cmpMeta);
  parseEvents(cmpData, cmpMeta);
  parseHost(cmpData, cmpMeta);
  parseEncapsulation(cmpData, cmpMeta);

  // DEPRECATED: 2017-12-27
  parseWillChangeDeprecated(cmpData, cmpMeta);
  parseDidChangeDeprecated(cmpData, cmpMeta);

  return moduleFile;
}


function serializeTag(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  cmpData.tag = cmpMeta.tagNameMeta;
}

function parseTag(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  cmpMeta.tagNameMeta = cmpData.tag;
}


function serializeComponentPath(config: d.Config, collectionDir: string, compiledComponentAbsoluteFilePath: string, cmpData: d.ComponentData) {
  // convert absolute path into a path that's relative to the collection file
  cmpData.componentPath = normalizePath(config.sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
}

function parseModuleJsFilePath(config: d.Config, collectionDir: string, cmpData: d.ComponentData, moduleFile: d.ModuleFile) {
  // convert the path that's relative to the collection file
  // into an absolute path to the component's js file path
  if (typeof cmpData.componentPath !== 'string') {
    throw new Error(`parseModuleJsFilePath, "componentPath" missing on cmpData: ${cmpData.tag}`);
  }
  moduleFile.jsFilePath = normalizePath(config.sys.path.join(collectionDir, cmpData.componentPath));

  // remember the original component path from its collection
  moduleFile.originalCollectionComponentPath = cmpData.componentPath;
}


function serializeComponentDependencies(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  cmpData.dependencies = (cmpMeta.dependencies || []).sort();
}

function parseComponentDependencies(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.dependencies)) {
    cmpMeta.dependencies = [];
  } else {
    cmpMeta.dependencies = cmpData.dependencies.sort();
  }
}


function serializeComponentClass(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  cmpData.componentClass = cmpMeta.componentClass;
}

function parseComponentClass(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  cmpMeta.componentClass = cmpData.componentClass;
}


function serializeStyles(config: d.Config, compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (cmpMeta.stylesMeta) {
    cmpData.styles = {};

    const modeNames = Object.keys(cmpMeta.stylesMeta).map(m => m.toLowerCase()).sort();

    modeNames.forEach(modeName => {
      cmpData.styles[modeName] = serializeStyle(config, compiledComponentRelativeDirPath, cmpMeta.stylesMeta[modeName]);
    });
  }
}

function parseStyles(config: d.Config, collectionDir: string, cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  const stylesData = cmpData.styles;

  cmpMeta.stylesMeta = {};

  if (stylesData) {
    Object.keys(stylesData).forEach(modeName => {
      modeName = modeName.toLowerCase();
      cmpMeta.stylesMeta[modeName] = parseStyle(config, collectionDir, cmpData, stylesData[modeName]);
    });
  }
}


function serializeStyle(config: d.Config, compiledComponentRelativeDirPath: string, modeStyleMeta: d.StyleMeta) {
  const modeStyleData: d.StyleData = {};

  if (modeStyleMeta.externalStyles && modeStyleMeta.externalStyles.length > 0) {
    modeStyleData.stylePaths = modeStyleMeta.externalStyles.map(externalStyle => {
      // convert style paths which are relative to the component file
      // to be style paths that are relative to the collection file

      // we've already figured out the component's relative path from the collection file
      // use the value we already created in serializeComponentPath()
      // create a relative path from the collection file to the style path
      return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, externalStyle.cmpRelativePath));
    });

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}

function parseStyle(config: d.Config, collectionDir: string, cmpData: d.ComponentData, modeStyleData: d.StyleData) {
  const modeStyle: d.StyleMeta = {
    styleStr: modeStyleData.style
  };

  if (modeStyleData.stylePaths) {
    modeStyle.externalStyles = modeStyleData.stylePaths.map(stylePath => {
      const externalStyle: d.ExternalStyleMeta = {};

      externalStyle.absolutePath = normalizePath(config.sys.path.join(
        collectionDir,
        stylePath
      ));

      externalStyle.cmpRelativePath = normalizePath(config.sys.path.relative(
        config.sys.path.dirname(cmpData.componentPath),
        stylePath
      ));

      externalStyle.originalCollectionPath = normalizePath(stylePath);

      return externalStyle;
    });
  }

  return modeStyle;
}


function serializeAssetsDir(config: d.Config, compiledComponentRelativeDirPath: string, cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpMeta.assetsDirsMeta)) {
    return;
  }

  // convert asset paths which are relative to the component file
  // to be asset paths that are relative to the collection file

  // we've already figured out the component's relative path from the collection file
  // use the value we already created in serializeComponentPath()
  // create a relative path from the collection file to the asset path

  cmpData.assetPaths = cmpMeta.assetsDirsMeta.map(assetMeta => {
    return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, assetMeta.cmpRelativePath));
  }).sort();
}


function parseAssetsDir(config: d.Config, collectionDir: string, cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.assetPaths)) {
    return;
  }

  cmpMeta.assetsDirsMeta = cmpData.assetPaths.map(assetsPath => {
    const assetsMeta: d.AssetsMeta = {
      absolutePath: normalizePath(config.sys.path.join(
        collectionDir,
        assetsPath
      )),
      cmpRelativePath: normalizePath(config.sys.path.relative(
        config.sys.path.dirname(cmpData.componentPath),
        assetsPath
      )),
      originalCollectionPath: normalizePath(assetsPath)
    };
    return assetsMeta;

  }).sort((a, b) => {
    if (a.cmpRelativePath < b.cmpRelativePath) return -1;
    if (a.cmpRelativePath > b.cmpRelativePath) return 1;
    return 0;
  });
}


function serializeProps(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
    const memberMeta = cmpMeta.membersMeta[memberName];

    if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      cmpData.props = cmpData.props || [];

      const propData: d.PropData = {
        name: memberName
      };

      if (memberMeta.propType === PROP_TYPE.Boolean) {
        propData.type = BOOLEAN_KEY;

      } else if (memberMeta.propType === PROP_TYPE.Number) {
        propData.type = NUMBER_KEY;

      } else if (memberMeta.propType === PROP_TYPE.String) {
        propData.type = STRING_KEY;

      } else if (memberMeta.propType === PROP_TYPE.Any) {
        propData.type = ANY_KEY;
      }

      if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
        propData.mutable = true;
      }

      if (memberMeta.watchCallbacks && memberMeta.watchCallbacks.length) {
        propData.watch = memberMeta.watchCallbacks.slice();
      }

      cmpData.props.push(propData);
    }
  });
}

function parseProps(config: d.Config, collection: d.Collection, cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  const propsData = cmpData.props;

  if (invalidArrayData(propsData)) {
    return;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  propsData.forEach(propData => {
    cmpMeta.membersMeta[propData.name] = {};

    if (propData.mutable) {
      cmpMeta.membersMeta[propData.name].memberType = MEMBER_TYPE.PropMutable;
    } else {
      cmpMeta.membersMeta[propData.name].memberType = MEMBER_TYPE.Prop;
    }

    // the standard is the first character of the type is capitalized
    // however, lowercase and normalize for good measure
    const type = typeof propData.type === 'string' ? propData.type.toLowerCase().trim() : null;

    if (type === BOOLEAN_KEY.toLowerCase()) {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Boolean;

    } else if (type === NUMBER_KEY.toLowerCase()) {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Number;

    } else if (type === STRING_KEY.toLowerCase()) {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.String;

    } else if (type === ANY_KEY.toLowerCase()) {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Any;

    } else if (!collection.compiler || !collection.compiler.version || config.sys.semver.lt(collection.compiler.version, '0.0.6-23')) {
      // older compilers didn't remember "any" type
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Any;
    }

    if (cmpMeta.membersMeta[propData.name].propType) {
      cmpMeta.membersMeta[propData.name].attribName = propData.name;
    }

    if (!invalidArrayData(propData.watch)) {
      cmpMeta.membersMeta[propData.name].watchCallbacks = propData.watch.slice().sort();
    }
  });
}


export function parseWillChangeDeprecated(cmpData: any, cmpMeta: d.ComponentMeta) {
  // DEPRECATED: 2017-12-27
  // previous way of storing change, 0.1.0 and below
  const propWillChangeData = cmpData.propsWillChange;

  if (invalidArrayData(propWillChangeData)) {
    return;
  }

  propWillChangeData.forEach((willChangeData: any) => {
    const propName = willChangeData.name;
    const methodName = willChangeData.method;

    cmpMeta.membersMeta = cmpMeta.membersMeta || {};
    cmpMeta.membersMeta[propName] = cmpMeta.membersMeta[propName] || {};

    cmpMeta.membersMeta[propName].watchCallbacks = cmpMeta.membersMeta[propName].watchCallbacks || [];
    cmpMeta.membersMeta[propName].watchCallbacks.push(methodName);
  });
}


export function parseDidChangeDeprecated(cmpData: any, cmpMeta: d.ComponentMeta) {
  // DEPRECATED: 2017-12-27
  // previous way of storing change, 0.1.0 and below
  const propDidChangeData = cmpData.propsDidChange;

  if (invalidArrayData(propDidChangeData)) {
    return;
  }

  propDidChangeData.forEach((didChangeData: any) => {
    const propName = didChangeData.name;
    const methodName = didChangeData.method;

    cmpMeta.membersMeta = cmpMeta.membersMeta || {};
    cmpMeta.membersMeta[propName] = cmpMeta.membersMeta[propName] || {};

    cmpMeta.membersMeta[propName].watchCallbacks = cmpMeta.membersMeta[propName].watchCallbacks || [];
    cmpMeta.membersMeta[propName].watchCallbacks.push(methodName);
  });
}


function serializeStates(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
    const member = cmpMeta.membersMeta[memberName];

    if (member.memberType === MEMBER_TYPE.State) {
      cmpData.states = cmpData.states || [];

      cmpData.states.push({
        name: memberName
      });
    }
  });
}


function parseStates(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.states)) {
    return;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  cmpData.states.forEach(stateData => {
    cmpMeta.membersMeta[stateData.name] = {
      memberType: MEMBER_TYPE.State
    };
  });
}


function serializeListeners(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpMeta.listenersMeta)) {
    return;
  }

  cmpData.listeners = cmpMeta.listenersMeta.map(listenerMeta => {
    const listenerData: d.ListenerData = {
      event: listenerMeta.eventName,
      method: listenerMeta.eventMethodName
    };
    if (listenerMeta.eventPassive === false) {
      listenerData.passive = false;
    }
    if (listenerMeta.eventDisabled === true) {
      listenerData.enabled = false;
    }
    if (listenerMeta.eventCapture === false) {
      listenerData.capture = false;
    }
    return listenerData;

  }).sort((a, b) => {
    if (a.event.toLowerCase() < b.event.toLowerCase()) return -1;
    if (a.event.toLowerCase() > b.event.toLowerCase()) return 1;
    return 0;
  });
}


function parseListeners(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  const listenersData = cmpData.listeners;

  if (invalidArrayData(listenersData)) {
    return;
  }

  cmpMeta.listenersMeta = listenersData.map(listenerData => {
    const listener: d.ListenMeta = {
      eventName: listenerData.event,
      eventMethodName: listenerData.method,
      eventPassive: (listenerData.passive !== false),
      eventDisabled: (listenerData.enabled === false),
      eventCapture: (listenerData.capture !== false)
    };
    return listener;
  });
}


function serializeMethods(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
    const member = cmpMeta.membersMeta[memberName];

    if (member.memberType === MEMBER_TYPE.Method) {
      cmpData.methods = cmpData.methods || [];

      cmpData.methods.push({
        name: memberName
      });
    }
  });
}


function parseMethods(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.methods)) {
    return;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  cmpData.methods.forEach(methodData => {
    cmpMeta.membersMeta[methodData.name] = {
      memberType: MEMBER_TYPE.Method
    };
  });
}


function serializeContextMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const member = cmpMeta.membersMeta[memberName];

    if (member.ctrlId && member.memberType === MEMBER_TYPE.PropContext) {
      cmpData.context = cmpData.context || [];

      cmpData.context.push({
        name: memberName,
        id: member.ctrlId
      });
    }
  });
}


function parseContextMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.context)) {
    return;
  }

  cmpData.context.forEach(methodData => {
    if (methodData.id) {
      cmpMeta.membersMeta = cmpMeta.membersMeta || {};

      cmpMeta.membersMeta[methodData.name] = {
        memberType: MEMBER_TYPE.PropContext,
        ctrlId: methodData.id
      };
    }
  });
}


function serializeConnectMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const member = cmpMeta.membersMeta[memberName];

    if (member.ctrlId && member.memberType === MEMBER_TYPE.PropConnect) {
      cmpData.connect = cmpData.connect || [];

      cmpData.connect.push({
        name: memberName,
        tag: member.ctrlId
      });
    }
  });
}


function parseConnectMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpData.connect)) {
    return;
  }

  cmpData.connect.forEach(methodData => {
    if (methodData.tag) {
      cmpMeta.membersMeta = cmpMeta.membersMeta || {};

      cmpMeta.membersMeta[methodData.name] = {
        memberType: MEMBER_TYPE.PropConnect,
        ctrlId: methodData.tag
      };
    }
  });
}


function serializeHostElementMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const member = cmpMeta.membersMeta[memberName];

    if (member.memberType === MEMBER_TYPE.Element) {
      cmpData.hostElement = {
        name: memberName
      };
    }
  });
}


function parseHostElementMember(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpData.hostElement) {
    return;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  cmpMeta.membersMeta[cmpData.hostElement.name] = {
    memberType: MEMBER_TYPE.Element
  };
}


function serializeEvents(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (invalidArrayData(cmpMeta.eventsMeta)) {
    return;
  }

  cmpData.events = cmpMeta.eventsMeta.map(eventMeta => {
    const eventData: d.EventData = {
      event: eventMeta.eventName
    };
    if (eventMeta.eventMethodName !== eventMeta.eventName) {
      eventData.method = eventMeta.eventMethodName;
    }
    if (eventMeta.eventBubbles === false) {
      eventData.bubbles = false;
    }
    if (eventMeta.eventCancelable === false) {
      eventData.cancelable = false;
    }
    if (eventMeta.eventComposed === false) {
      eventData.composed = false;
    }
    return eventData;

  }).sort((a, b) => {
    if (a.event.toLowerCase() < b.event.toLowerCase()) return -1;
    if (a.event.toLowerCase() > b.event.toLowerCase()) return 1;
    return 0;
  });
}


function parseEvents(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  const eventsData = cmpData.events;

  if (invalidArrayData(eventsData)) {
    return;
  }

  cmpMeta.eventsMeta = eventsData.map(eventData => ({
    eventName: eventData.event,
    eventMethodName: (eventData.method) ? eventData.method : eventData.event,
    eventBubbles: (eventData.bubbles !== false),
    eventCancelable: (eventData.cancelable !== false),
    eventComposed: (eventData.composed !== false)
  }));
}


function serializeHost(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.hostMeta || Array.isArray(cmpMeta.hostMeta) || !Object.keys(cmpMeta.hostMeta).length) {
    return;
  }
  cmpData.host = cmpMeta.hostMeta;
}


function parseHost(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (!cmpData.host) {
    return;
  }
  cmpMeta.hostMeta = cmpData.host;
}


function serializeEncapsulation(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    cmpData.shadow = true;

  } else if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    cmpData.scoped = true;
  }
}


function parseEncapsulation(cmpData: d.ComponentData, cmpMeta: d.ComponentMeta) {
  if (cmpData.shadow === true) {
    cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;

  } else if (cmpData.scoped === true) {
    cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;

  } else {
    cmpMeta.encapsulation = ENCAPSULATION.NoEncapsulation;
  }
}


export function serializeAppGlobal(config: d.Config, collectionDir: string, collectionData: d.CollectionData, globalModule: d.ModuleFile) {
  if (!globalModule) {
    return;
  }

  collectionData.global = normalizePath(config.sys.path.relative(collectionDir, globalModule.jsFilePath));
}


export function parseGlobal(config: d.Config, collectionDir: string, collectionData: d.CollectionData, collection: d.Collection) {
  if (typeof collectionData.global !== 'string') return;

  collection.global = {
    jsFilePath: normalizePath(config.sys.path.join(collectionDir, collectionData.global))
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

function nameSort(a: string, b: string) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}


export const BOOLEAN_KEY = 'Boolean';
export const NUMBER_KEY = 'Number';
export const STRING_KEY = 'String';
export const ANY_KEY = 'Any';
