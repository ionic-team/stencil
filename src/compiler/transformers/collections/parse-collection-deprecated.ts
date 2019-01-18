import * as d from '@declarations';
import { getModule } from '../../build/compiler-ctx';
import { sys } from '@sys';
import { normalizePath } from '@utils';


export function parseComponentsDeprecated(config: d.Config, compilerCtx: d.CompilerCtx, collection: d.CollectionCompilerMeta, collectionDir: string, collectionManifest: d.CollectionManifest) {
  if (collectionManifest.components) {
    collectionManifest.components.forEach(cmpData => {
      parseComponentDeprecated(config, compilerCtx, collection, collectionDir, cmpData);
    });
  }
}


function parseComponentDeprecated(config: d.Config, compilerCtx: d.CompilerCtx, collection: d.CollectionCompilerMeta, collectionDir: string, cmpData: d.ComponentDataDeprecated) {
  const sourceFilePath = normalizePath(sys.path.join(collectionDir, cmpData.componentPath));
  const moduleFile = getModule(compilerCtx, sourceFilePath);

  const cmpMeta: d.ComponentCompilerMeta = {} as any;
  moduleFile.cmpCompilerMeta = cmpMeta;
  moduleFile.isCollectionDependency = true;
  moduleFile.collectionName = collection.collectionName;
  moduleFile.excludeFromCollection = excludeFromCollection(config, cmpData);

  parseTag(cmpData, cmpMeta);
  // parseComponentDependencies(cmpData, cmpMeta);
  parseComponentClass(cmpData, cmpMeta);
  parseModuleJsFilePath(collectionDir, cmpData, moduleFile);
  parseStyles(collectionDir, cmpData, cmpMeta);
  parseAssetsDir(collectionDir, cmpData, cmpMeta);
  parseProps(cmpData, cmpMeta);
  parseStates(cmpData, cmpMeta);
  parseListeners(cmpData, cmpMeta);
  parseMethods(cmpData, cmpMeta);
  // parseContextMember(cmpData, cmpMeta);
  // parseConnectMember(cmpData, cmpMeta);
  parseHostElementMember(cmpData, cmpMeta);
  parseEvents(cmpData, cmpMeta);
  parseEncapsulation(cmpData, cmpMeta);

  collection.moduleFiles.push(moduleFile);
}


function excludeFromCollection(config: d.Config, cmpData: d.ComponentDataDeprecated) {
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


function parseTag(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  cmpMeta.tagName = cmpData.tag;
}


function parseModuleJsFilePath(collectionDir: string, cmpData: d.ComponentDataDeprecated, moduleFile: d.Module) {
  // convert the path that's relative to the collection file
  // into an absolute path to the component's js file path
  if (typeof cmpData.componentPath !== 'string') {
    throw new Error(`parseModuleJsFilePath, "componentPath" missing on cmpData: ${cmpData.tag}`);
  }
  moduleFile.jsFilePath = normalizePath(sys.path.join(collectionDir, cmpData.componentPath));

  // remember the original component path from its collection
  moduleFile.originalCollectionComponentPath = cmpData.componentPath;
}


// function parseComponentDependencies(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.dependencies)) {
//     cmpMeta.dependencies = [];
//   } else {
//     cmpMeta.dependencies = cmpData.dependencies.sort();
//   }
// }


function parseComponentClass(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  cmpMeta.componentClassName = cmpData.componentClass;
}


function parseStyles(collectionDir: string, cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  const stylesData = cmpData.styles;

  if (stylesData) {
    const modeNames = Object.keys(stylesData);

    cmpMeta.styles = modeNames.map(modeName => {
      return parseStyle(collectionDir, cmpData, stylesData[modeName], modeName.toLowerCase());
    });

  } else {
    cmpMeta.styles = [];
  }
}


function parseAssetsDir(collectionDir: string, cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  if (invalidArrayData(cmpData.assetPaths)) {
    return;
  }

  cmpMeta.assetsDirs = cmpData.assetPaths.map(assetsPath => {
    const assetsMeta: d.AssetsMeta = {
      absolutePath: normalizePath(sys.path.join(
        collectionDir,
        assetsPath
      )),
      cmpRelativePath: normalizePath(sys.path.relative(
        sys.path.dirname(cmpData.componentPath),
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


function parseStyle(collectionDir: string, cmpData: d.ComponentDataDeprecated, modeStyleData: d.StyleDataDeprecated, modeName: string) {
  const modeStyle: d.StyleCompiler = {
    modeName: modeName,
    styleId: null,
    styleStr: modeStyleData.style,
    externalStyles: [],
    compiledStyleText: null,
    compiledStyleTextScoped: null
  };

  if (Array.isArray(modeStyleData.stylePaths)) {
    modeStyleData.stylePaths.forEach(stylePath => {
      const externalStyle: d.ExternalStyleCompiler = {
        absolutePath: normalizePath(sys.path.join(
          collectionDir,
          stylePath
        )),
        relativePath: normalizePath(sys.path.relative(
          sys.path.dirname(cmpData.componentPath),
          stylePath
        )),
        originalCollectionPath: stylePath,
        originalComponentPath: stylePath
      };

      modeStyle.externalStyles.push(externalStyle);
    });
  }

  return modeStyle;
}


function parseProps(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  const propsData = cmpData.props;

  if (invalidArrayData(propsData)) {
    return;
  }

  cmpMeta.properties = propsData.map(propData => {
    const prop: d.ComponentCompilerProperty = {
      name: propData.name,
      attr: (typeof propData.attr === 'string' ? propData.attr : null),
      mutable: !!propData.mutable,
      optional: false, // TODO
      required: false, // TODO
      reflectToAttr: !!propData.reflectToAttr,
      type: 'unknown'
    };

    // the standard is the first character of the type is capitalized
    // however, lowercase and normalize for good measure
    const type = typeof propData.type === 'string' ? propData.type.toLowerCase().trim() : null;

    if (type === BOOLEAN_KEY.toLowerCase()) {
      prop.type = 'boolean';

    } else if (type === NUMBER_KEY.toLowerCase()) {
      prop.type = 'number';

    } else if (type === STRING_KEY.toLowerCase()) {
      prop.type = 'string';
    }

    // if (!invalidArrayData(propData.watch)) {
    //   member.watchCallbacks = propData.watch.slice().sort();
    // }

    return prop;
  });
}


function parseStates(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  if (invalidArrayData(cmpData.states)) {
    return;
  }

  cmpMeta.states = cmpData.states.map(state => {
    return {
      name: state.name
    };
  });
}


function parseListeners(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  const listenersData = cmpData.listeners;

  if (invalidArrayData(listenersData)) {
    return;
  }

  cmpMeta.listeners = listenersData.map(listenerData => {
    const listener: d.ComponentCompilerListener = {
      name: listenerData.event,
      method: listenerData.method,
      passive: (listenerData.passive !== false),
      disabled: (listenerData.enabled === false),
      capture: (listenerData.capture !== false)
    };
    return listener;
  });
}


function parseMethods(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  if (invalidArrayData(cmpData.methods)) {
    return;
  }

  cmpMeta.methods = cmpData.methods.map(methodData => {
    const method: d.ComponentCompilerMethod = {
      name: methodData.name
    };
    return method;
  });
}


// function parseContextMember(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.context)) {
//     return;
//   }

//   cmpData.context.forEach(methodData => {
//     if (methodData.id) {
//       cmpMeta.membersMeta = cmpMeta.membersMeta || {};

//       cmpMeta.membersMeta[methodData.name] = {
//         memberType: MEMBER_TYPE.PropContext,
//         ctrlId: methodData.id
//       };
//     }
//   });
// }


// function parseConnectMember(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.connect)) {
//     return;
//   }

//   cmpData.connect.forEach(methodData => {
//     if (methodData.tag) {
//       cmpMeta.membersMeta = cmpMeta.membersMeta || {};

//       cmpMeta.membersMeta[methodData.name] = {
//         memberType: MEMBER_TYPE.PropConnect,
//         ctrlId: methodData.tag
//       };
//     }
//   });
// }


function parseHostElementMember(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  if (!cmpData.hostElement) {
    return;
  }

  cmpMeta.elementRef = cmpData.hostElement.name;
}


function parseEvents(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  const eventsData = cmpData.events;

  if (invalidArrayData(eventsData)) {
    return;
  }

  cmpMeta.events = eventsData.map(eventData => {
    const event: d.ComponentCompilerEvent = {
      name: eventData.event,
      method: (eventData.method) ? eventData.method : eventData.event,
      bubbles: (eventData.bubbles !== false),
      cancelable: (eventData.cancelable !== false),
      composed: (eventData.composed !== false)
    };
    return event;
  });
}



function parseEncapsulation(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
  if (cmpData.shadow === true) {
    cmpMeta.encapsulation = 'shadow';

  } else if (cmpData.scoped === true) {
    cmpMeta.encapsulation = 'scoped';

  } else {
    cmpMeta.encapsulation = 'none';
  }
}


function invalidArrayData(arr: any[]) {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
}


const BOOLEAN_KEY = 'Boolean';
const NUMBER_KEY = 'Number';
const STRING_KEY = 'String';
