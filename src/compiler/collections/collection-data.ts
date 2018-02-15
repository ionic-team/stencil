import { AssetsMeta, BuildCtx, Collection, CollectionData, CompilerCtx, ComponentData, ComponentMeta, Config,
  EntryModule, EventData, ExternalStyleMeta, ListenMeta, ListenerData,
  ModuleFile, PropData, StyleData, StyleMeta } from '../../declarations';
import { COLLECTION_MANIFEST_FILE_NAME, ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { normalizePath } from '../util';


// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler

export async function writeAppCollection(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(config.collectionDir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(config.sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  config.logger.debug(`collection, serialize: ${collectionFilePath}`);

  // serialize the collection into a json string and
  // add it to the list of files we need to write when we're ready
  const collectionData = serializeAppCollection(config, collectionDir, buildCtx.entryModules, buildCtx.global);

  if (config.generateDistribution) {
    // don't bother serializing/writing the collection if we're not creating a distribution
    await compilerCtx.fs.writeFile(collectionFilePath, JSON.stringify(collectionData, null, 2));
  }

  return collectionData;
}


export function serializeAppCollection(config: Config, collectionDir: string, entryModules: EntryModule[], globalModule: ModuleFile) {
  // create the single collection we're going to fill up with data
  const collectionData: CollectionData = {
    components: [],
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    }
  };

  // add component data for each of the collection files
  entryModules.forEach(entryModule => {
    entryModule.moduleFiles.forEach(moduleFile => {
      if (!moduleFile.excludeFromCollection) {
        const cmpData = serializeComponent(config, collectionDir, moduleFile);
        if (cmpData) {
          collectionData.components.push(cmpData);
        }
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

  // success!
  return collectionData;
}


export function parseCollectionData(config: Config, collectionName: string, collectionDir: string, collectionJsonStr: string) {
  const collectionData: CollectionData = JSON.parse(collectionJsonStr);
  const collection: Collection = {
    collectionName: collectionName,
    compiler: {
      name: collectionData.compiler.name,
      version: collectionData.compiler.version,
      typescriptVersion: collectionData.compiler.typescriptVersion
    }
  };

  parseComponents(config, collectionDir, collectionData, collection);
  parseGlobal(config, collectionDir, collectionData, collection);

  return collection;
}


export function parseComponents(config: Config, collectionDir: string, collectionData: CollectionData, collection: Collection) {
  const componentsData = collectionData.components;

  if (!componentsData || !Array.isArray(componentsData)) {
    collection.moduleFiles = [];
    return;
  }

  collection.moduleFiles = componentsData.map(cmpData => {
    return parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
  });
}


export function excludeFromCollection(config: Config, cmpData: ComponentData) {
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


export function serializeComponent(config: Config, collectionDir: string, moduleFile: ModuleFile) {
  if (!moduleFile || !moduleFile.cmpMeta) return null;

  const cmpData: ComponentData = {};
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
  serializeComponentPath(config, collectionDir, moduleFile, compiledComponentAbsoluteFilePath, cmpData);
  serializeStyles(config, moduleFile, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  serializeAssetsDir(config, moduleFile, compiledComponentRelativeDirPath, cmpData, cmpMeta);
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


export function parseComponentDataToModuleFile(config: Config, collection: Collection, collectionDir: string, cmpData: ComponentData) {
  const moduleFile: ModuleFile = {
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


function serializeTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.tag = cmpMeta.tagNameMeta;
}

function parseTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.tagNameMeta = cmpData.tag;
}


function serializeComponentPath(config: Config, collectionDir: string, moduleFile: ModuleFile, compiledComponentAbsoluteFilePath: string, cmpData: ComponentData) {
  if (moduleFile.isCollectionDependency && moduleFile.originalCollectionComponentPath) {
    // use the original path from its collection if there was one
    cmpData.componentPath = normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, moduleFile.originalCollectionComponentPath));

  } else {
    // convert absolute path into a path that's relative to the collection file
    cmpData.componentPath = normalizePath(config.sys.path.relative(collectionDir, compiledComponentAbsoluteFilePath));
  }
}

function parseModuleJsFilePath(config: Config, collectionDir: string, cmpData: ComponentData, moduleFile: ModuleFile) {
  // convert the path that's relative to the collection file
  // into an absolute path to the component's js file path
  if (typeof cmpData.componentPath !== 'string') {
    throw new Error(`parseModuleJsFilePath, "componentPath" missing on cmpData: ${cmpData.tag}`);
  }
  moduleFile.jsFilePath = normalizePath(config.sys.path.join(collectionDir, cmpData.componentPath));

  // remember the original component path from its collection
  moduleFile.originalCollectionComponentPath = cmpData.componentPath;
}


function serializeComponentDependencies(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.dependencies = (cmpMeta.dependencies || []).sort();
}

function parseComponentDependencies(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.dependencies)) {
    cmpMeta.dependencies = [];
  } else {
    cmpMeta.dependencies = cmpData.dependencies.sort();
  }
}


function serializeComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.componentClass = cmpMeta.componentClass;
}

function parseComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.componentClass = cmpData.componentClass;
}


function serializeStyles(config: Config, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.stylesMeta) {
    cmpData.styles = {};

    const modeNames = Object.keys(cmpMeta.stylesMeta).map(m => m.toLowerCase()).sort();

    modeNames.forEach(modeName => {
      cmpData.styles[modeName] = serializeStyle(config, moduleFile, compiledComponentRelativeDirPath, cmpMeta.stylesMeta[modeName]);
    });
  }
}

function parseStyles(config: Config, collectionDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const stylesData = cmpData.styles;

  cmpMeta.stylesMeta = {};

  if (stylesData) {
    Object.keys(stylesData).forEach(modeName => {
      modeName = modeName.toLowerCase();
      cmpMeta.stylesMeta[modeName] = parseStyle(config, collectionDir, cmpData, stylesData[modeName]);
    });
  }
}


function serializeStyle(config: Config, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, modeStyleMeta: StyleMeta) {
  const modeStyleData: StyleData = {};

  if (modeStyleMeta.externalStyles && modeStyleMeta.externalStyles.length > 0) {
    if (moduleFile.isCollectionDependency) {
      // this is from a collection, let's use the original paths
      modeStyleData.stylePaths = modeStyleMeta.externalStyles.map(externalStyle => {
        return normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, externalStyle.originalCollectionPath));
      });

    } else {
      modeStyleData.stylePaths = modeStyleMeta.externalStyles.map(externalStyle => {
        // convert style paths which are relative to the component file
        // to be style paths that are relative to the collection file

        // we've already figured out the component's relative path from the collection file
        // use the value we already created in serializeComponentPath()
        // create a relative path from the collection file to the style path
        return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, externalStyle.cmpRelativePath));
      });
    }

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}

function parseStyle(config: Config, collectionDir: string, cmpData: ComponentData, modeStyleData: StyleData) {
  const modeStyle: StyleMeta = {
    styleStr: modeStyleData.style
  };

  if (modeStyleData.stylePaths) {
    modeStyle.externalStyles = modeStyleData.stylePaths.map(stylePath => {
      const externalStyle: ExternalStyleMeta = {};

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


function serializeAssetsDir(config: Config, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.assetsDirsMeta)) {
    return;
  }

  // convert asset paths which are relative to the component file
  // to be asset paths that are relative to the collection file

  // we've already figured out the component's relative path from the collection file
  // use the value we already created in serializeComponentPath()
  // create a relative path from the collection file to the asset path

  cmpData.assetPaths = cmpMeta.assetsDirsMeta.map(assetMeta => {
    if (moduleFile.isCollectionDependency && assetMeta.originalCollectionPath) {
      return normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, assetMeta.originalCollectionPath));
    }

    return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, assetMeta.cmpRelativePath));
  }).sort();
}


function parseAssetsDir(config: Config, collectionDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.assetPaths)) {
    return;
  }

  cmpMeta.assetsDirsMeta = cmpData.assetPaths.map(assetsPath => {
    const assetsMeta: AssetsMeta = {
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


function serializeProps(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).sort(nameSort).forEach(memberName => {
    const memberMeta = cmpMeta.membersMeta[memberName];

    if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      cmpData.props = cmpData.props || [];

      const propData: PropData = {
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

function parseProps(config: Config, collection: Collection, cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


export function parseWillChangeDeprecated(cmpData: any, cmpMeta: ComponentMeta) {
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


export function parseDidChangeDeprecated(cmpData: any, cmpMeta: ComponentMeta) {
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


function serializeStates(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function parseStates(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function serializeListeners(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.listenersMeta)) {
    return;
  }

  cmpData.listeners = cmpMeta.listenersMeta.map(listenerMeta => {
    const listenerData: ListenerData = {
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


function parseListeners(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const listenersData = cmpData.listeners;

  if (invalidArrayData(listenersData)) {
    return;
  }

  cmpMeta.listenersMeta = listenersData.map(listenerData => {
    const listener: ListenMeta = {
      eventName: listenerData.event,
      eventMethodName: listenerData.method,
      eventPassive: (listenerData.passive !== false),
      eventDisabled: (listenerData.enabled === false),
      eventCapture: (listenerData.capture !== false)
    };
    return listener;
  });
}


function serializeMethods(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function parseMethods(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function serializeContextMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function parseContextMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function serializeConnectMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function parseConnectMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function serializeHostElementMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function parseHostElementMember(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (!cmpData.hostElement) {
    return;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  cmpMeta.membersMeta[cmpData.hostElement.name] = {
    memberType: MEMBER_TYPE.Element
  };
}


function serializeEvents(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.eventsMeta)) {
    return;
  }

  cmpData.events = cmpMeta.eventsMeta.map(eventMeta => {
    const eventData: EventData = {
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


function parseEvents(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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


function serializeHost(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (!cmpMeta.hostMeta || Array.isArray(cmpMeta.hostMeta) || !Object.keys(cmpMeta.hostMeta).length) {
    return;
  }
  cmpData.host = cmpMeta.hostMeta;
}


function parseHost(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (!cmpData.host) {
    return;
  }
  cmpMeta.hostMeta = cmpData.host;
}


function serializeEncapsulation(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    cmpData.shadow = true;

  } else if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    cmpData.scoped = true;
  }
}


function parseEncapsulation(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpData.shadow === true) {
    cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;

  } else if (cmpData.scoped === true) {
    cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;

  } else {
    cmpMeta.encapsulation = ENCAPSULATION.NoEncapsulation;
  }
}


export function serializeAppGlobal(config: Config, collectionDir: string, collectionData: CollectionData, globalModule: ModuleFile) {
  if (!globalModule) {
    return;
  }

  collectionData.global = normalizePath(config.sys.path.relative(collectionDir, globalModule.jsFilePath));
}


export function parseGlobal(config: Config, collectionDir: string, collectionData: CollectionData, collection: Collection) {
  if (typeof collectionData.global !== 'string') return;

  collection.global = {
    jsFilePath: normalizePath(config.sys.path.join(collectionDir, collectionData.global))
  };
}


function invalidArrayData(arr: any[]) {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
}

function nameSort(a: string, b: string) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

export const COLLECTION_DEPENDENCIES_DIR = 'dependencies';
export const BOOLEAN_KEY = 'Boolean';
export const NUMBER_KEY = 'Number';
export const STRING_KEY = 'String';
export const ANY_KEY = 'Any';
