import { BuildConfig, ComponentMeta, Manifest } from '../../../util/interfaces';
import { ModuleFileMeta } from '../../interfaces';
import { mockStencilSystem } from '../../../test';
import { parseBundles, parseComponent, serializeBundles, serializeComponent, ManifestData } from '../manifest-data';
import { HAS_NAMED_SLOTS, HAS_SLOTS, PRIORITY_LOW, TYPE_BOOLEAN, TYPE_NUMBER } from '../../../util/constants';


describe('manifest-data serialize/parse', () => {

  it('parseBundles', () => {
    const manifestData: ManifestData = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ]
    };
    const manifest: Manifest = {};
    parseBundles(manifestData, manifest);
    expect(manifest.bundles[0].components[0]).toBe('cmp-a');
    expect(manifest.bundles[0].components[1]).toBe('cmp-b');
    expect(manifest.bundles[1].components[0]).toBe('cmp-c');
  });

  it('serializeBundles', () => {
    config.bundles = [
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] }
    ];

    const manifestData: ManifestData = {
      bundles: []
    };
    serializeBundles(config, manifestData);
    expect(manifestData.bundles[0].components[0]).toBe('cmp-a');
    expect(manifestData.bundles[0].components[1]).toBe('cmp-b');
    expect(manifestData.bundles[1].components[0]).toBe('cmp-c');
  });

  it('loadPriority', () => {
    a.loadPriority = PRIORITY_LOW;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.priority).toBe('low');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.loadPriority).toBe(PRIORITY_LOW);
  });

  it('isShadowMeta', () => {
    a.isShadowMeta = true;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.shadow).toBe(true);
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.isShadowMeta).toBe(true);
  });

  it('slotMeta HAS_NAMED_SLOTS', () => {
    a.slotMeta = HAS_NAMED_SLOTS;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.slot).toBe('hasNamedSlots');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.slotMeta).toBe(HAS_NAMED_SLOTS);
  });

  it('slotMeta HAS_SLOTS', () => {
    a.slotMeta = HAS_SLOTS;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.slot).toBe('hasSlots');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.slotMeta).toBe(HAS_SLOTS);
  });

  it('assetsDirsMeta', () => {
    a.assetsDirsMeta = ['svgs'];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.assetsDir[0]).toBe('svgs');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.assetsDirsMeta[0]).toBe('svgs');
  });

  it('hostMeta', () => {
    a.hostMeta = { theme: { 'some-class': true } };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.host.theme['some-class']).toBe(true);
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.hostMeta.theme['some-class']).toBe(true);
  });

  it('methodsMeta', () => {
    a.methodsMeta = ['methodA', 'methodB'];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.methods[0]).toBe('methodA');
    expect(cmpData.methods[1]).toBe('methodB');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.methodsMeta[0]).toBe('methodA');
    expect(b.methodsMeta[1]).toBe('methodB');
  });

  it('listeners', () => {
    a.listenersMeta = [
      { eventName: 'eventA', eventMethodName: 'methodA', eventPassive: true, eventCapture: true, eventEnabled: true }
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.listeners[0].event).toBe('eventA');
    expect(cmpData.listeners[0].method).toBe('methodA');
    expect(cmpData.listeners[0].passive).toBe(true);
    expect(cmpData.listeners[0].capture).toBe(true);
    expect(cmpData.listeners[0].enabled).toBe(true);
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.listenersMeta[0].eventName).toBe('eventA');
    expect(b.listenersMeta[0].eventMethodName).toBe('methodA');
    expect(b.listenersMeta[0].eventPassive).toBe(true);
    expect(b.listenersMeta[0].eventCapture).toBe(true);
    expect(b.listenersMeta[0].eventEnabled).toBe(true);
  });

  it('statesMeta', () => {
    a.statesMeta = ['stateA', 'stateB'];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.states[0]).toBe('stateA');
    expect(cmpData.states[1]).toBe('stateB');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.statesMeta[0]).toBe('stateA');
    expect(b.statesMeta[1]).toBe('stateB');
  });

  it('propsDidChange', () => {
    a.propsDidChangeMeta = [
      ['nameA', 'methodA'],
      ['nameB', 'methodB']
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.propsDidChange[0].name).toBe('nameA');
    expect(cmpData.propsDidChange[0].method).toBe('methodA');
    expect(cmpData.propsDidChange[1].name).toBe('nameB');
    expect(cmpData.propsDidChange[1].method).toBe('methodB');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.propsDidChangeMeta[0][0]).toBe('nameA');
    expect(b.propsDidChangeMeta[0][1]).toBe('methodA');
    expect(b.propsDidChangeMeta[1][0]).toBe('nameB');
    expect(b.propsDidChangeMeta[1][1]).toBe('methodB');
  });

  it('propsWillChange', () => {
    a.propsWillChangeMeta = [
      ['nameA', 'methodA'],
      ['nameB', 'methodB']
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.propsWillChange[0].name).toBe('nameA');
    expect(cmpData.propsWillChange[0].method).toBe('methodA');
    expect(cmpData.propsWillChange[1].name).toBe('nameB');
    expect(cmpData.propsWillChange[1].method).toBe('methodB');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.propsWillChangeMeta[0][0]).toBe('nameA');
    expect(b.propsWillChangeMeta[0][1]).toBe('methodA');
    expect(b.propsWillChangeMeta[1][0]).toBe('nameB');
    expect(b.propsWillChangeMeta[1][1]).toBe('methodB');
  });

  it('propsMeta', () => {
    a.propsMeta = [
      { propName: 'nameA', propType: TYPE_BOOLEAN, isStateful: true },
      { propName: 'nameB', propType: TYPE_NUMBER, isStateful: false }
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.propsMeta[0].propName).toBe('nameA');
    expect(b.propsMeta[0].propType).toBe(TYPE_BOOLEAN);
    expect(b.propsMeta[0].isStateful).toBe(true);
    expect(b.propsMeta[1].propName).toBe('nameB');
    expect(b.propsMeta[1].propType).toBe(TYPE_NUMBER);
    expect(b.propsMeta[1].isStateful).toBe(false);
  });

  it('stylesMeta stylePaths', () => {
    a.stylesMeta = {
      ios: {
        cmpRelativeStylePaths: ['cmp-a.scss']
      }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.styles.ios.stylePaths[0]).toBe('components/cmp-a.scss');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.stylesMeta.ios.cmpRelativeStylePaths[0]).toBe('cmp-a.scss');
    expect(b.stylesMeta.ios.absStylePaths[0]).toBe('/collection/components/cmp-a.scss');
  });

  it('stylesMeta styleStr', () => {
    a.stylesMeta = {
      ios: {
        styleStr: 'cmp-a{color:red}'
      }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponent(config, manifestDir, cmpData);
    expect(a.stylesMeta.ios.styleStr).toBe(b.stylesMeta.ios.styleStr);
  });

  it('componentPath', () => {
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.componentPath).toBe('components/cmp-a.js');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.componentPath).toBe('/collection/components/cmp-a.js');
  });

  it('componentClass', () => {
    a.componentClass = 'ComponentClass';
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.componentClass).toBe('ComponentClass');
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.componentClass).toBe(a.componentClass);
  });

  it('tag name', () => {
    a.tagNameMeta = 'ion-tag';
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.tag).toBe(a.tagNameMeta);
    b = parseComponent(config, manifestDir, cmpData);
    expect(b.tagNameMeta).toBe(a.tagNameMeta);
  });

  beforeEach(() => {
    a = {};
    moduleFile = {
      jsFilePath: '/collection/components/cmp-a.js',
      cmpMeta: a
    };
  });

  var a: ComponentMeta;
  var b: ComponentMeta;
  var moduleFile: ModuleFileMeta;
  var manifestDir = '/collection/';
  var config: BuildConfig = {
    sys: mockStencilSystem()
  };

});
