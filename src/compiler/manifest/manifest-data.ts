import { AssetsMeta, BuildConfig, BuildContext, BuildResults, Bundle, BundleData,
  ComponentMeta, ComponentData, EventData, EventMeta, Manifest, ManifestData, ModuleFile, ListenerData,
  ListenMeta, PropChangeData, PropChangeMeta, PropData, StyleData, StyleMeta } from '../../util/interfaces';
import { COLLECTION_MANIFEST_FILE_NAME, ENCAPSULATION, MEMBER_TYPE, PROP_TYPE, PRIORITY, SLOT_META } from '../../util/constants';
import { normalizePath } from '../util';


// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler


export function writeAppManifest(config: BuildConfig, ctx: BuildContext, buildResults: BuildResults) {

  // get the absolute path to the directory where the manifest will be saved
  const manifestDir = normalizePath(config.collectionDir);

  // create an absolute file path to the actual manifest json file
  const manifestFilePath = normalizePath(config.sys.path.join(manifestDir, COLLECTION_MANIFEST_FILE_NAME));

  config.logger.debug(`manifest, serializeAppManifest: ${manifestFilePath}`);

  // serialize the manifest into a json string and
  // add it to the list of files we need to write when we're ready
  buildResults.manifest = serializeAppManifest(config, manifestDir, ctx.manifest);

  if (config.generateDistribution) {
    // don't bother serializing/writing the manifest if we're not creating a distribution
    ctx.filesToWrite[manifestFilePath] = JSON.stringify(buildResults.manifest, null, 2);
  }
}


export function serializeAppManifest(config: BuildConfig, manifestDir: string, manifest: Manifest) {
  // create the single manifest we're going to fill up with data
  const manifestData: ManifestData = {
    components: [],
    bundles: [],
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    }
  };

  // add component data for each of the manifest files
  manifest.modulesFiles.forEach(modulesFile => {
    if (!modulesFile.excludeFromCollection) {
      const cmpData = serializeComponent(config, manifestDir, modulesFile);
      if (cmpData) {
        manifestData.components.push(cmpData);
      }
    }
  });

  // sort it alphabetically, cuz
  manifestData.components.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });

  // add to the manifest what the bundles should be
  serializeBundles(config, manifestData);

  // set the global path if it exists
  serializeAppGlobal(config, manifestDir, manifestData, manifest);

  // success!
  return manifestData;
}


export function parseDependentManifest(config: BuildConfig, collectionName: string, manifestDir: string, manifestJson: string) {
  const manifestData: ManifestData = JSON.parse(manifestJson);
  const manifest: Manifest = {
    manifestName: collectionName,
    compiler: {
      name: manifestData.compiler.name,
      version: manifestData.compiler.version,
      typescriptVersion: manifestData.compiler.typescriptVersion
    }
  };

  parseComponents(config, manifestDir, manifestData, manifest);
  parseBundles(manifestData, manifest);
  parseGlobal(config, manifestDir, manifestData, manifest);

  return manifest;
}


function parseComponents(config: BuildConfig, manifestDir: string, manifestData: ManifestData, manifest: Manifest) {
  const componentsData = manifestData.components;

  if (!componentsData || !Array.isArray(componentsData)) {
    manifest.modulesFiles = [];
    return;
  }

  manifest.modulesFiles = componentsData.map(cmpData => {
    return parseComponentDataToModuleFile(config, manifestDir, cmpData);
  });
}


export function excludeFromCollection(config: BuildConfig, cmpData: ComponentData) {
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


export function serializeComponent(config: BuildConfig, manifestDir: string, moduleFile: ModuleFile) {
  if (!moduleFile || !moduleFile.cmpMeta) return null;

  const cmpData: ComponentData = {};
  const cmpMeta = moduleFile.cmpMeta;

  // get the absolute path to the compiled component's output javascript file
  const compiledComponentAbsoluteFilePath = normalizePath(moduleFile.jsFilePath);

  // create a relative path from the manifest file to the compiled component's output javascript file
  const compiledComponentRelativeFilePath = normalizePath(config.sys.path.relative(manifestDir, compiledComponentAbsoluteFilePath));

  // create a relative path to the directory where the compiled component's output javascript is sitting in
  const compiledComponentRelativeDirPath = normalizePath(config.sys.path.dirname(compiledComponentRelativeFilePath));

  serializeTag(cmpData, cmpMeta);
  serializeComponentClass(cmpData, cmpMeta);
  serializeComponentPath(config, manifestDir, moduleFile, compiledComponentAbsoluteFilePath, cmpData);
  serializeStyles(config, moduleFile, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  serializeAssetsDir(config, moduleFile, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  serializeProps(cmpData, cmpMeta);
  serializePropsWillChange(cmpData, cmpMeta);
  serializePropsDidChange(cmpData, cmpMeta);
  serializeStates(cmpData, cmpMeta);
  serializeListeners(cmpData, cmpMeta);
  serializeMethods(cmpData, cmpMeta);
  serializeContextMember(cmpData, cmpMeta);
  serializeConnectMember(cmpData, cmpMeta);
  serializeHostElementMember(cmpData, cmpMeta);
  serializeEvents(cmpData, cmpMeta);
  serializeHost(cmpData, cmpMeta);
  serializeSlots(cmpData, cmpMeta);
  serializeEncapsulation(cmpData, cmpMeta);
  serializeLoadPriority(cmpData, cmpMeta);

  return cmpData;
}


export function parseComponentDataToModuleFile(config: BuildConfig, manifestDir: string, cmpData: ComponentData) {
  const moduleFile: ModuleFile = {
    cmpMeta: {},
    isCollectionDependency: true,
    excludeFromCollection: excludeFromCollection(config, cmpData)
  };
  const cmpMeta = moduleFile.cmpMeta;

  parseTag(cmpData, cmpMeta);
  parseComponentClass(cmpData, cmpMeta);
  parseModuleJsFilePath(config, manifestDir, cmpData, moduleFile);
  parseStyles(config, manifestDir, cmpData, cmpMeta);
  parseAssetsDir(config, manifestDir, cmpData, cmpMeta);
  parseProps(cmpData, cmpMeta);
  parsePropsWillChange(cmpData, cmpMeta);
  parsePropsDidChange(cmpData, cmpMeta);
  parseStates(cmpData, cmpMeta);
  parseListeners(cmpData, cmpMeta);
  parseMethods(cmpData, cmpMeta);
  parseContextMember(cmpData, cmpMeta);
  parseConnectMember(cmpData, cmpMeta);
  parseHostElementMember(cmpData, cmpMeta);
  parseEvents(cmpData, cmpMeta);
  parseHost(cmpData, cmpMeta);
  parseEncapsulation(cmpData, cmpMeta);
  parseSlots(cmpData, cmpMeta);
  parseLoadPriority(cmpData, cmpMeta);

  return moduleFile;
}


function serializeTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.tag = cmpMeta.tagNameMeta;
}

function parseTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.tagNameMeta = cmpData.tag;
}


function serializeComponentPath(config: BuildConfig, manifestDir: string, moduleFile: ModuleFile, compiledComponentAbsoluteFilePath: string, cmpData: ComponentData) {
  if (moduleFile.isCollectionDependency && moduleFile.originalCollectionComponentPath) {
    // use the original path from its collection if there was one
    cmpData.componentPath = normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, moduleFile.originalCollectionComponentPath));

  } else {
    // convert absolute path into a path that's relative to the manifest file
    cmpData.componentPath = normalizePath(config.sys.path.relative(manifestDir, compiledComponentAbsoluteFilePath));
  }
}

function parseModuleJsFilePath(config: BuildConfig, manifestDir: string, cmpData: ComponentData, moduleFile: ModuleFile) {
  // convert the path that's relative to the manifest file
  // into an absolute path to the component's js file path
  moduleFile.jsFilePath = normalizePath(config.sys.path.join(manifestDir, cmpData.componentPath));

  // remember the original component path from its collection
  moduleFile.originalCollectionComponentPath = cmpData.componentPath;
}


function serializeComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.componentClass = cmpMeta.componentClass;
}

function parseComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.componentClass = cmpData.componentClass;
}


function serializeStyles(config: BuildConfig, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.stylesMeta) {
    cmpData.styles = {};

    const modeNames = Object.keys(cmpMeta.stylesMeta).map(m => m.toLowerCase()).sort();

    modeNames.forEach(modeName => {
      cmpData.styles[modeName] = serializeStyle(config, moduleFile, compiledComponentRelativeDirPath, cmpMeta.stylesMeta[modeName]);
    });
  }
}

function parseStyles(config: BuildConfig, manifestDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const stylesData = cmpData.styles;

  cmpMeta.stylesMeta = {};

  if (stylesData) {
    Object.keys(stylesData).forEach(modeName => {
      modeName = modeName.toLowerCase();
      cmpMeta.stylesMeta[modeName] = parseStyle(config, manifestDir, cmpData, stylesData[modeName]);
    });
  }
}


function serializeStyle(config: BuildConfig, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, modeStyleMeta: StyleMeta) {
  const modeStyleData: StyleData = {};

  if (modeStyleMeta.cmpRelativePaths) {
    if (moduleFile.isCollectionDependency) {
      // this is from a collection, let's use the original paths
      modeStyleData.stylePaths = modeStyleMeta.originalCollectionPaths.map(originalCollectionPath => {
        return normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, originalCollectionPath));
      });

    } else {
      modeStyleData.stylePaths = modeStyleMeta.cmpRelativePaths.map(componentRelativeStylePath => {
        // convert style paths which are relative to the component file
        // to be style paths that are relative to the manifest file

        // we've already figured out the component's relative path from the manifest file
        // use the value we already created in serializeComponentPath()
        // create a relative path from the manifest file to the style path
        return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, componentRelativeStylePath));
      });
    }

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}

function parseStyle(config: BuildConfig, manifestDir: string, cmpData: ComponentData, modeStyleData: StyleData) {
  const modeStyle: StyleMeta = {
    styleStr: modeStyleData.style
  };

  if (modeStyleData.stylePaths) {
    modeStyle.absolutePaths = modeStyleData.stylePaths.map(stylePath => {
      return normalizePath(config.sys.path.join(
        manifestDir,
        stylePath
      ));
    });

    modeStyle.cmpRelativePaths = modeStyleData.stylePaths.map(stylePath => {
      return normalizePath(config.sys.path.relative(
        config.sys.path.dirname(cmpData.componentPath),
        stylePath
      ));
    });

    modeStyle.originalCollectionPaths = modeStyleData.stylePaths.slice();
  }

  return modeStyle;
}


function serializeAssetsDir(config: BuildConfig, moduleFile: ModuleFile, compiledComponentRelativeDirPath: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.assetsDirsMeta)) {
    return;
  }

  // convert asset paths which are relative to the component file
  // to be asset paths that are relative to the manifest file

  // we've already figured out the component's relative path from the manifest file
  // use the value we already created in serializeComponentPath()
  // create a relative path from the manifest file to the asset path

  cmpData.assetPaths = cmpMeta.assetsDirsMeta.map(assetMeta => {
    if (moduleFile.isCollectionDependency && assetMeta.originalCollectionPath) {
      return normalizePath(config.sys.path.join(COLLECTION_DEPENDENCIES_DIR, assetMeta.originalCollectionPath));
    }

    return normalizePath(config.sys.path.join(compiledComponentRelativeDirPath, assetMeta.cmpRelativePath));
  }).sort();
}


function parseAssetsDir(config: BuildConfig, manifestDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.assetPaths)) {
    return;
  }

  cmpMeta.assetsDirsMeta = cmpData.assetPaths.map(assetsPath => {
    const assetsMeta: AssetsMeta = {
      absolutePath: normalizePath(config.sys.path.join(
        manifestDir,
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
    const member = cmpMeta.membersMeta[memberName];

    if (member.memberType === MEMBER_TYPE.Prop || member.memberType === MEMBER_TYPE.PropMutable) {
      cmpData.props = cmpData.props || [];

      const propData: PropData = {
        name: memberName
      };

      if (member.propType === PROP_TYPE.Boolean) {
        propData.type = 'boolean';

      } else if (member.propType === PROP_TYPE.Number) {
        propData.type = 'number';

      } else if (member.propType === PROP_TYPE.String) {
        propData.type = 'string';
      }

      if (member.memberType === MEMBER_TYPE.PropMutable) {
        propData.mutable = true;
      }

      cmpData.props.push(propData);
    }
  });
}

function parseProps(cmpData: ComponentData, cmpMeta: ComponentMeta) {
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

    if (propData.type === 'boolean') {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Boolean;

    } else if (propData.type === 'number') {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.Number;

    } else if (propData.type === 'string') {
      cmpMeta.membersMeta[propData.name].propType = PROP_TYPE.String;
    }
  });
}


function serializePropsWillChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.propsWillChangeMeta)) {
    return;
  }

  cmpData.propsWillChange = cmpMeta.propsWillChangeMeta.map(propWillChangeMeta => {
    const propWillChangeData: PropChangeData = {
      name: propWillChangeMeta[0],
      method: propWillChangeMeta[1]
    };
    return propWillChangeData;
  });
}

function parsePropsWillChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const propWillChangeData = cmpData.propsWillChange;

  if (invalidArrayData(propWillChangeData)) {
    return;
  }

  cmpMeta.propsWillChangeMeta = propWillChangeData.map(propWillChangeData => {
    const propWillChangeMeta: PropChangeMeta = [
      propWillChangeData.name,
      propWillChangeData.method
    ];
    return propWillChangeMeta;
  });
}


function serializePropsDidChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.propsDidChangeMeta)) {
    return;
  }

  cmpData.propsDidChange = cmpMeta.propsDidChangeMeta.map(propDidChangeMeta => {
    const propDidChangeData: PropChangeData = {
      name: propDidChangeMeta[0],
      method: propDidChangeMeta[1]
    };
    return propDidChangeData;
  });
}

function parsePropsDidChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const propDidChangeData = cmpData.propsDidChange;

  if (invalidArrayData(propDidChangeData)) {
    return;
  }

  cmpMeta.propsDidChangeMeta = propDidChangeData.map(propDidChangeData => {
    const propDidChangeMeta: PropChangeMeta = [
      propDidChangeData.name,
      propDidChangeData.method
    ];
    return propDidChangeMeta;
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

  cmpMeta.eventsMeta = eventsData.map(eventData => {
    const eventMeta: EventMeta = {
      eventName: eventData.event,
      eventMethodName: eventData.event
    };

    if (eventData.method) {
      eventMeta.eventMethodName = eventData.method;
    }

    eventMeta.eventBubbles = (eventData.bubbles !== false);
    eventMeta.eventCancelable = (eventData.cancelable !== false);
    eventMeta.eventComposed = (eventData.composed !== false);

    return eventMeta;
  });
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


function serializeSlots(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.slotMeta === SLOT_META.HasSlots) {
    cmpData.slot = 'hasSlots';

  } else if (cmpMeta.slotMeta === SLOT_META.HasNamedSlots) {
    cmpData.slot = 'hasNamedSlots';
  }
}


function parseSlots(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpData.slot === 'hasSlots') {
    cmpMeta.slotMeta = SLOT_META.HasSlots;

  } else if (cmpData.slot === 'hasNamedSlots') {
    cmpMeta.slotMeta = SLOT_META.HasNamedSlots;
  }
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


function serializeLoadPriority(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.loadPriority === PRIORITY.Low) {
    cmpData.priority = 'low';
  }
}


function parseLoadPriority(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpData.priority === 'low') {
    cmpMeta.loadPriority = PRIORITY.Low;
  }
}


export function serializeBundles(config: BuildConfig, manifestData: ManifestData) {
  manifestData.bundles = [];

  if (invalidArrayData(config.bundles)) {
    return;
  }

  config.bundles.forEach(bundle => {
    if (invalidArrayData(bundle.components)) {
      return;
    }

    const bundleData: BundleData = {
      components: bundle.components.map(tag => tag.toLowerCase()).sort()
    };

    if (bundle.priority === PRIORITY.Low) {
      bundleData.priority = 'low';
    }

    manifestData.bundles.push(bundleData);
  });

  config.bundles.sort((a, b) => {
    if (a.components[0] < b.components[0]) return -1;
    if (a.components[0] > b.components[0]) return 1;
    return 0;
  });
}


export function parseBundles(manifestData: ManifestData, manifest: Manifest) {
  manifest.bundles = [];

  if (invalidArrayData(manifestData.bundles)) {
    return;
  }

  manifestData.bundles.forEach(bundleData => {
    if (invalidArrayData(bundleData.components)) {
      return;
    }

    const bundle: Bundle = {
      components: bundleData.components.sort()
    };

    if (bundleData.priority === 'low') {
      bundle.priority = PRIORITY.Low;
    }

    manifest.bundles.push(bundle);
  });
}


export function serializeAppGlobal(config: BuildConfig, manifestDir: string, manifestData: ManifestData, manifest: Manifest) {
  if (!manifest.global) {
    return;
  }

  manifestData.global = normalizePath(config.sys.path.relative(manifestDir, manifest.global.jsFilePath));
}


export function parseGlobal(config: BuildConfig, manifestDir: string, manifestData: ManifestData, manifest: Manifest) {
  if (typeof manifestData.global !== 'string') return;

  manifest.global = {
    jsFilePath: normalizePath(config.sys.path.join(manifestDir, manifestData.global))
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
