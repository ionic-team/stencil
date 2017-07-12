import { BuildConfig, Bundle, ComponentMeta, Manifest, StyleMeta,
  ModuleFileMeta, ListenMeta, PropMeta, PropChangeMeta } from './interfaces';
import { HAS_NAMED_SLOTS, HAS_SLOTS, PRIORITY_LOW, TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';
import { normalizePath } from './util';


// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler


export function serializeManifest(buildConfig: BuildConfig, manifestDir: string, manifestModulesFiles: ModuleFileMeta[]) {
  // create the single manifest we're going to fill up with data
  const manifestData: ManifestData = {
    components: [],
    bundles: []
  };

  // add component data for each of the manifest files
  manifestModulesFiles.forEach(manifestModulesFile => {
    const cmpData = serializeComponent(buildConfig, manifestDir, manifestModulesFile);
    if (cmpData) {
      manifestData.components.push(cmpData);
    }
  });

  // sort it alphabetically, cuz
  manifestData.components.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });

  // add to the manifest what the bundles should be
  serializeBundles(manifestData, buildConfig);

  // success!
  return JSON.stringify(manifestData, null, 2);
}


export function parseManifest(buildConfig: BuildConfig, manifestDir: string, manifestJson: string) {
  const manifestData: ManifestData = JSON.parse(manifestJson);
  const manifest: Manifest = {};

  parseComponents(buildConfig, manifestDir, manifestData, manifest);
  parseBundles(manifestData, manifest);

  return manifest;
}


function parseComponents(buildConfig: BuildConfig, manifestDir: string, manifestData: ManifestData, manifest: Manifest) {
  const componentsData = manifestData.components;

  manifest.components = [];

  if (componentsData && Array.isArray(componentsData)) {
    componentsData.forEach(cmpData => {
      const cmpMeta = parseComponent(buildConfig, manifestDir, cmpData);
      if (cmpMeta) {
        manifest.components.push(cmpMeta);
      }
    });
  }
}


export function serializeComponent(buildConfig: BuildConfig, manifestDir: string, moduleFile: ModuleFileMeta) {
  if (!moduleFile || !moduleFile.cmpMeta) return null;

  const cmpData: ComponentData = {};
  const cmpMeta = moduleFile.cmpMeta;

  // get the absolute path to the compiled component's output javascript file
  const compiledComponentAbsoluteFilePath = normalizePath(moduleFile.jsFilePath);

  // create a relative path from the manifest file to the compiled component's output javascript file
  const compiledComponentRelativeFilePath = normalizePath(buildConfig.sys.path.relative(manifestDir, compiledComponentAbsoluteFilePath));

  // create a relative path to the directory where the compiled component's output javascript is sitting in
  const compiledComponentRelativeDirPath = normalizePath(buildConfig.sys.path.dirname(compiledComponentRelativeFilePath));

  serializeTag(cmpData, cmpMeta);
  serializeComponentClass(cmpData, cmpMeta);
  serializeComponentPath(buildConfig, manifestDir, compiledComponentAbsoluteFilePath, cmpData);
  serializeStyles(buildConfig, compiledComponentRelativeDirPath, cmpData, cmpMeta);
  serializeProps(cmpData, cmpMeta);
  serializeWillPropChange(cmpData, cmpMeta);
  serializeDidPropChange(cmpData, cmpMeta);
  serializeStates(cmpData, cmpMeta);
  serializeListeners(cmpData, cmpMeta);
  serializeMethods(cmpData, cmpMeta);
  serializeHost(cmpData, cmpMeta);
  serializeAssetsDir(cmpData, cmpMeta);
  serializeSlots(cmpData, cmpMeta);
  serializeIsShadow(cmpData, cmpMeta);
  serializeLoadPriority(cmpData, cmpMeta);

  return <any>cmpData;
}


export function parseComponent(buildConfig: BuildConfig, manifestDir: string, cmpData: ComponentData) {
  const cmpMeta: ComponentMeta = {};

  parseTag(cmpData, cmpMeta);
  parseComponentPath(buildConfig, manifestDir, cmpData, cmpMeta);
  parseComponentClass(cmpData, cmpMeta);
  parseStyles(buildConfig, manifestDir, cmpData, cmpMeta);
  parseProps(cmpData, cmpMeta);
  parseWillPropChange(cmpData, cmpMeta);
  parseDidPropChange(cmpData, cmpMeta);
  parseStates(cmpData, cmpMeta);
  parseListeners(cmpData, cmpMeta);
  parseMethods(cmpData, cmpMeta);
  parseHost(cmpData, cmpMeta);
  parseAssetsDir(cmpData, cmpMeta);
  parseIsShadow(cmpData, cmpMeta);
  parseSlots(cmpData, cmpMeta);
  parseLoadPriority(cmpData, cmpMeta);

  return cmpMeta;
}


function serializeTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.tag = cmpMeta.tagNameMeta;
}

function parseTag(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.tagNameMeta = cmpData.tag;
}


function serializeComponentPath(buildConfig: BuildConfig, manifestDir: string, compiledComponentAbsoluteFilePath: string, cmpData: ComponentData) {
  // convert absolute path into a path that's relative to the manifest file
  cmpData.componentPath = normalizePath(buildConfig.sys.path.relative(manifestDir, compiledComponentAbsoluteFilePath));
}

function parseComponentPath(buildConfig: BuildConfig, manifestDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  // convert the path that's relative to the manifest file into an absolute path to the component file
  cmpMeta.componentPath = normalizePath(buildConfig.sys.path.join(manifestDir, cmpData.componentPath));
}


function serializeComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpData.componentClass = cmpMeta.componentClass;
}

function parseComponentClass(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.componentClass = cmpData.componentClass;
}


function serializeStyles(buildConfig: BuildConfig, compiledComponentRelativeDirPath: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.stylesMeta) {
    cmpData.styles = {};

    const modeNames = Object.keys(cmpMeta.stylesMeta).sort();

    modeNames.forEach(modeName => {
      cmpData.styles[modeName.toLowerCase()] = serializeStyle(buildConfig, compiledComponentRelativeDirPath, cmpMeta.stylesMeta[modeName]);
    });
  }
}

function parseStyles(buildConfig: BuildConfig, manifestDir: string, cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const stylesData = cmpData.styles;

  cmpMeta.stylesMeta = {};

  if (stylesData) {
    Object.keys(stylesData).forEach(modeName => {
      cmpMeta.stylesMeta[modeName.toLowerCase()] = parseStyle(buildConfig, manifestDir, stylesData[modeName.toLowerCase()]);
    });
  }
}


function serializeStyle(buildConfig: BuildConfig, compiledComponentRelativeDirPath: string, modeStyleMeta: StyleMeta) {
  const modeStyleData: StyleData = {};

  if (modeStyleMeta.absStylePaths) {
    modeStyleData.stylePaths = modeStyleMeta.cmpRelativeStylePaths.map(componentRelativeStylePath => {
      // convert style paths which are relative to the component file
      // to be style paths that are relative to the manifest file

      // we've already figured out the component's relative path from the manifest file
      // use the value we already created in serializeComponentPath()
      // create a relative path from the manifest file to the style path
      return normalizePath(buildConfig.sys.path.join(compiledComponentRelativeDirPath, componentRelativeStylePath));
    });

    modeStyleData.stylePaths.sort();
  }

  if (typeof modeStyleMeta.styleStr === 'string') {
    modeStyleData.style = modeStyleMeta.styleStr;
  }

  return modeStyleData;
}

function parseStyle(buildConfig: BuildConfig, manifestDir: string, modeStyleData: StyleData) {
  const modeStyle: StyleMeta = {
    absStylePaths: modeStyleData.stylePaths.map(stylePath => buildConfig.sys.path.join(manifestDir, stylePath)),
    styleStr: modeStyleData.style
  };
  return modeStyle;
}


function serializeProps(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (!cmpMeta.propsMeta || !cmpMeta.propsMeta.length) {
    return;
  }

  cmpData.props = cmpMeta.propsMeta.map(propMeta => {
    const propData: PropData = {
      name: propMeta.propName
    };

    if (propMeta.propType === TYPE_BOOLEAN) {
      propData.type = 'boolean';

    } else if (propMeta.propType === TYPE_NUMBER) {
      propData.type = 'number';
    }

    if (propMeta.isStateful) {
      propData.stateful = true;
    }

    return propData;
  });
}

function parseProps(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const propsData = cmpData.props;

  if (invalidArrayData(propsData)) {
    return;
  }

  cmpMeta.propsMeta = propsData.map(propData => {
    const propMeta: PropMeta = {
      propName: propData.name,
      isStateful: !!propData.stateful
    };

    if (propData.type === 'boolean') {
      propMeta.propType = TYPE_BOOLEAN;

    } else if (propData.type === 'number') {
      propMeta.propType = TYPE_NUMBER;
    }

    return propMeta;
  });
}


function serializeWillPropChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.propWillChangeMeta)) {
    return;
  }

  cmpData.propsWillChange = cmpMeta.propWillChangeMeta.map(propWillChangeMeta => {
    const propWillChangeData: PropChangeData = {
      name: propWillChangeMeta[0],
      method: propWillChangeMeta[1]
    };
    return propWillChangeData;
  });
}

function parseWillPropChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const propWillChangeData = cmpData.propsDidChange;

  if (invalidArrayData(propWillChangeData)) {
    return;
  }

  cmpMeta.propWillChangeMeta = propWillChangeData.map(propWillChangeData => {
    const propWillChangeMeta: PropChangeMeta = [
      propWillChangeData.name,
      propWillChangeData.method
    ];
    return propWillChangeMeta;
  });
}


function serializeDidPropChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.propDidChangeMeta)) {
    return;
  }

  cmpData.propsDidChange = cmpMeta.propDidChangeMeta.map(propDidChangeMeta => {
    const propDidChangeData: PropChangeData = {
      name: propDidChangeMeta[0],
      method: propDidChangeMeta[1]
    };
    return propDidChangeData;
  });
}

function parseDidPropChange(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  const propDidChangeData = cmpData.propsDidChange;

  if (invalidArrayData(propDidChangeData)) {
    return;
  }

  cmpMeta.propDidChangeMeta = propDidChangeData.map(propDidChangeData => {
    const propDidChangeMeta: PropChangeMeta = [
      propDidChangeData.name,
      propDidChangeData.method
    ];
    return propDidChangeMeta;
  });
}


function serializeStates(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.statesMeta)) {
    return;
  }

  cmpData.states = cmpMeta.statesMeta;
}


function parseStates(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.states)) {
    return;
  }

  cmpMeta.statesMeta = cmpData.states;
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
    if (listenerMeta.eventPassive) {
      listenerData.passive = true;
    }
    if (listenerMeta.eventEnabled) {
      listenerData.enabled = true;
    }
    if (listenerMeta.eventCapture) {
      listenerData.capture = true;
    }
    return listenerData;
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
      eventPassive: !!listenerData.passive,
      eventEnabled: !!listenerData.enabled,
      eventCapture: !!listenerData.capture
    };
    return listener;
  });
}


function serializeMethods(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.methodsMeta)) {
    return;
  }

  cmpData.methods = cmpMeta.methodsMeta;
}


function parseMethods(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.methods)) {
    return;
  }

  cmpMeta.methodsMeta = cmpData.methods;
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


function serializeAssetsDir(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpMeta.assetsDirsMeta)) {
    return;
  }

  cmpData.assetsDir = cmpMeta.assetsDirsMeta;
}


function parseAssetsDir(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (invalidArrayData(cmpData.assetsDir)) {
    return;
  }

  cmpMeta.assetsDirsMeta = cmpData.assetsDir;
}


function serializeSlots(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.slotMeta === HAS_SLOTS) {
    cmpData.slots = 'hasSlots';

  } else if (cmpMeta.slotMeta === HAS_NAMED_SLOTS) {
    cmpData.slots = 'hasNamedSlots';
  }
}


function parseSlots(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpData.slots === 'hasSlots') {
    cmpMeta.slotMeta = HAS_SLOTS;

  } else if (cmpData.slots === 'hasNamedSlots') {
    cmpMeta.slotMeta = HAS_NAMED_SLOTS;
  }
}


function serializeIsShadow(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.isShadowMeta) {
    cmpData.shadow = true;
  }
}


function parseIsShadow(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  cmpMeta.isShadowMeta = !!cmpData.shadow;
}


function serializeLoadPriority(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpMeta.loadPriority === PRIORITY_LOW) {
    cmpData.priority = 'low';
  }
}


function parseLoadPriority(cmpData: ComponentData, cmpMeta: ComponentMeta) {
  if (cmpData.priority === 'low') {
    cmpMeta.loadPriority = PRIORITY_LOW;
  }
}


function serializeBundles(manifestData: ManifestData, buildConfig: BuildConfig) {
  manifestData.bundles = [];

  if (invalidArrayData(buildConfig.bundles)) {
    return;
  }

  buildConfig.bundles.forEach(bundle => {
    if (invalidArrayData(bundle.components)) {
      return;
    }

    const bundleData: BundleData = {
      components: bundle.components.map(tag => tag.toLowerCase()).sort()
    };

    if (bundle.priority === PRIORITY_LOW) {
      bundleData.priority = 'low';
    }

    manifestData.bundles.push(bundleData);
  });

  buildConfig.bundles.sort((a, b) => {
    if (a.components[0] < b.components[0]) return -1;
    if (a.components[0] > b.components[0]) return 1;
    return 0;
  });
}


function parseBundles(manifestData: ManifestData, manifest: Manifest) {
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
      bundle.priority = PRIORITY_LOW;
    }

    manifest.bundles.push(bundle);
  });
}


function invalidArrayData(arr: any[]) {
  return (!arr || !Array.isArray(arr) || arr.length === 0);
}


// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// consider these property values to be locked in as is
// there should be a VERY good reason to have to rename them
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE INPUT DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE INPUT DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE INPUT DATA!!

export interface ManifestData {
  bundles?: BundleData[];
  components?: ComponentData[];
}

export interface BundleData {
  components?: string[];
  priority?: 'low';
}

export interface ComponentData {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
  styles?: StylesData;
  props?: PropData[];
  propsWillChange?: PropChangeData[];
  propsDidChange?: PropChangeData[];
  states?: string[];
  listeners?: ListenerData[];
  methods?: string[];
  host?: any;
  assetsDir?: string[];
  slots?: 'hasSlots'|'hasNamedSlots';
  shadow?: boolean;
  priority?: 'low';
}

export interface StylesData {
  [modeName: string]: StyleData;
}

export interface StyleData {
  stylePaths?: string[];
  style?: string;
}

export interface PropData {
  name?: string;
  type?: 'boolean'|'number';
  stateful?: boolean;
}

export interface PropChangeData {
  name: string;
  method: string;
}

export interface ListenerData {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}
