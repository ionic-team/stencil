import { BuildConfig, ComponentData, ComponentMeta, Manifest, ManifestData, ModuleFile } from '../../../util/interfaces';
import { mockStencilSystem } from '../../../testing/mocks';
import { excludeFromCollection, parseBundles, parseComponentDataToModuleFile, parseGlobal, serializeBundles, serializeComponent, serializeAppGlobal } from '../manifest-data';
import { ENCAPSULATION, MEMBER_TYPE, PRIORITY, PROP_TYPE, SLOT_META } from '../../../util/constants';


describe('manifest-data serialize/parse', () => {

  it('parseGlobal', () => {
    const manifestData: ManifestData = {
      global: 'global/my-global.js'
    };
    const manifest: Manifest = {};
    parseGlobal(config, manifestDir, manifestData, manifest);
    expect(manifest.global.jsFilePath).toBe('/User/me/myapp/dist/collection/global/my-global.js');
  });

  it('serializeAppGlobal', () => {
    const manifestData: ManifestData = {};
    const manifest: Manifest = {
      global: {
        jsFilePath: '/User/me/myapp/dist/collection/global/my-global.js'
      }
    };

    serializeAppGlobal(config, manifestDir, manifestData, manifest);
    expect(manifestData.global).toBe('global/my-global.js');
  });

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
    a.loadPriority = PRIORITY.Low;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.priority).toBe('low');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.loadPriority).toBe(PRIORITY.Low);
  });

  it('scoped css encapsulation', () => {
    a.encapsulation = ENCAPSULATION.ScopedCss;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.scoped).toBe(true);
    expect(cmpData.shadow).toBeFalsy();
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);
  });

  it('shadow dom encapsulation', () => {
    a.encapsulation = ENCAPSULATION.ShadowDom;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.shadow).toBe(true);
    expect(cmpData.scoped).toBeFalsy();
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
  });

  it('slotMeta HAS_NAMED_SLOTS', () => {
    a.slotMeta = SLOT_META.HasNamedSlots;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.slot).toBe('hasNamedSlots');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.slotMeta).toBe(SLOT_META.HasNamedSlots);
  });

  it('slotMeta HAS_SLOTS', () => {
    a.slotMeta = SLOT_META.HasSlots;
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.slot).toBe('hasSlots');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.slotMeta).toBe(SLOT_META.HasSlots);
  });

  it('eventsMeta', () => {
    a.eventsMeta = [
      { eventName: 'zzEvent' },
      { eventName: 'aa-event', eventMethodName: 'methodName', eventBubbles: false, eventCancelable: false, eventComposed: false }
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.events.length).toBe(2);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.eventsMeta.length).toBe(2);

    expect(b.cmpMeta.eventsMeta[0].eventName).toBe('aa-event');
    expect(b.cmpMeta.eventsMeta[0].eventMethodName).toBe('methodName');
    expect(b.cmpMeta.eventsMeta[0].eventBubbles).toBe(false);
    expect(b.cmpMeta.eventsMeta[0].eventCancelable).toBe(false);
    expect(b.cmpMeta.eventsMeta[0].eventComposed).toBe(false);

    expect(b.cmpMeta.eventsMeta[1].eventName).toBe('zzEvent');
    expect(b.cmpMeta.eventsMeta[1].eventMethodName).toBe('zzEvent');
    expect(b.cmpMeta.eventsMeta[1].eventBubbles).toBe(true);
    expect(b.cmpMeta.eventsMeta[1].eventCancelable).toBe(true);
    expect(b.cmpMeta.eventsMeta[1].eventComposed).toBe(true);
  });

  it('hostElementMember', () => {
    a.membersMeta = {
      'myElement': { memberType: MEMBER_TYPE.Element }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.hostElement.name).toBe('myElement');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.membersMeta.myElement.memberType).toBe(MEMBER_TYPE.Element);
  });

  it('hostMeta', () => {
    a.hostMeta = { theme: { 'some-class': true } };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.host.theme['some-class']).toBe(true);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.hostMeta.theme['some-class']).toBe(true);
  });

  it('methodsMeta', () => {
    a.membersMeta = {
      'methodA': { memberType: MEMBER_TYPE.Method },
      'methodB': { memberType: MEMBER_TYPE.Method }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.methods[0].name).toBe('methodA');
    expect(cmpData.methods[1].name).toBe('methodB');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.membersMeta.methodA.memberType).toBe(MEMBER_TYPE.Method);
    expect(b.cmpMeta.membersMeta.methodB.memberType).toBe(MEMBER_TYPE.Method);
  });

  it('listenersMeta', () => {
    a.listenersMeta = [
      { eventName: 'eventB', eventMethodName: 'methodB', eventPassive: false, eventCapture: false, eventDisabled: false },
      { eventName: 'eventA', eventMethodName: 'methodA', eventPassive: true, eventCapture: true, eventDisabled: true }
    ];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.listeners.length).toBe(2);

    expect(cmpData.listeners[0].event).toBe('eventA');
    expect(cmpData.listeners[0].method).toBe('methodA');
    expect(cmpData.listeners[0].passive).toBeUndefined();
    expect(cmpData.listeners[0].capture).toBeUndefined();
    expect(cmpData.listeners[0].enabled).toBe(false);

    expect(cmpData.listeners[1].event).toBe('eventB');
    expect(cmpData.listeners[1].method).toBe('methodB');
    expect(cmpData.listeners[1].passive).toBe(false);
    expect(cmpData.listeners[1].capture).toBe(false);
    expect(cmpData.listeners[1].enabled).toBeUndefined();

    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.listenersMeta[0].eventName).toBe('eventA');
    expect(b.cmpMeta.listenersMeta[0].eventMethodName).toBe('methodA');
    expect(b.cmpMeta.listenersMeta[0].eventPassive).toBe(true);
    expect(b.cmpMeta.listenersMeta[0].eventCapture).toBe(true);
    expect(b.cmpMeta.listenersMeta[0].eventDisabled).toBe(true);

    expect(b.cmpMeta.listenersMeta[1].eventName).toBe('eventB');
    expect(b.cmpMeta.listenersMeta[1].eventMethodName).toBe('methodB');
    expect(b.cmpMeta.listenersMeta[1].eventPassive).toBe(false);
    expect(b.cmpMeta.listenersMeta[1].eventCapture).toBe(false);
    expect(b.cmpMeta.listenersMeta[1].eventDisabled).toBe(false);
  });

  it('statesMeta', () => {
    a.membersMeta = {
      'stateA': { memberType: MEMBER_TYPE.State },
      'stateB': { memberType: MEMBER_TYPE.State }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.states[0].name).toBe('stateA');
    expect(cmpData.states[1].name).toBe('stateB');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.membersMeta.stateA.memberType).toBe(MEMBER_TYPE.State);
    expect(b.cmpMeta.membersMeta.stateB.memberType).toBe(MEMBER_TYPE.State);
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
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.propsDidChangeMeta[0][0]).toBe('nameA');
    expect(b.cmpMeta.propsDidChangeMeta[0][1]).toBe('methodA');
    expect(b.cmpMeta.propsDidChangeMeta[1][0]).toBe('nameB');
    expect(b.cmpMeta.propsDidChangeMeta[1][1]).toBe('methodB');
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
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.propsWillChangeMeta[0][0]).toBe('nameA');
    expect(b.cmpMeta.propsWillChangeMeta[0][1]).toBe('methodA');
    expect(b.cmpMeta.propsWillChangeMeta[1][0]).toBe('nameB');
    expect(b.cmpMeta.propsWillChangeMeta[1][1]).toBe('methodB');
  });

  it('membersMeta el', () => {
    a.membersMeta = {
      'el': { memberType: MEMBER_TYPE.Element }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.el.memberType).toBe(MEMBER_TYPE.Element);
  });

  it('membersMeta state', () => {
    a.membersMeta = {
      'state': { memberType: MEMBER_TYPE.State }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.state.memberType).toBe(MEMBER_TYPE.State);
    expect(b.cmpMeta.membersMeta.state.propType).toBeUndefined();
  });

  it('membersMeta prop mutable', () => {
    a.membersMeta = {
      'propMutable': { memberType: MEMBER_TYPE.PropMutable, propType: PROP_TYPE.Number }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.propMutable.memberType).toBe(MEMBER_TYPE.PropMutable);
    expect(b.cmpMeta.membersMeta.propMutable.propType).toBe(PROP_TYPE.Number);
  });

  it('membersMeta prop type any', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.Any }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.Any);
  });

  it('membersMeta prop type boolean', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.Boolean }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.Boolean);
  });

  it('membersMeta prop type string', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.String }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.String);
  });

  it('assetsDirsMeta', () => {
    a.assetsDirsMeta = [{
      cmpRelativePath: 'svgs'
    }];
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.assetPaths[0]).toBe('components/svgs');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.assetsDirsMeta[0].absolutePath).toBe('/User/me/myapp/dist/collection/components/svgs');
    expect(b.cmpMeta.assetsDirsMeta[0].cmpRelativePath).toBe('svgs');
  });

  it('stylesMeta stylePaths', () => {
    a.stylesMeta = {
      ios: {
        cmpRelativePaths: ['cmp-a.scss']
      }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.styles.ios.stylePaths[0]).toBe('components/cmp-a.scss');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.stylesMeta.ios.cmpRelativePaths[0]).toBe('cmp-a.scss');
    expect(b.cmpMeta.stylesMeta.ios.absolutePaths[0]).toBe('/User/me/myapp/dist/collection/components/cmp-a.scss');
  });

  it('stylesMeta styleStr', () => {
    a.stylesMeta = {
      ios: {
        styleStr: 'cmp-a{color:red}'
      }
    };
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(a.stylesMeta.ios.styleStr).toBe(b.cmpMeta.stylesMeta.ios.styleStr);
  });

  it('js file path', () => {
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.componentPath).toBe('components/cmp-a.js');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.jsFilePath).toBe('/User/me/myapp/dist/collection/components/cmp-a.js');
  });

  it('componentClass', () => {
    a.componentClass = 'ComponentClass';
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.componentClass).toBe('ComponentClass');
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.componentClass).toBe(a.componentClass);
  });

  it('tag name', () => {
    a.tagNameMeta = 'ion-tag';
    const cmpData = serializeComponent(config, manifestDir, moduleFile);
    expect(cmpData.tag).toBe(a.tagNameMeta);
    b = parseComponentDataToModuleFile(config, manifest, manifestDir, cmpData);
    expect(b.cmpMeta.tagNameMeta).toBe(a.tagNameMeta);
  });

  it('excludeFromCollection false if tag is in bundles', () => {
    const config: BuildConfig = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-b'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(false);
  });

  it('excludeFromCollection true if tag not in bundles', () => {
    const config: BuildConfig = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] }
      ]
    };
    const cmpData: ComponentData = {
      tag: 'cmp-c'
    };
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });

  it('excludeFromCollection defaults true', () => {
    const config: BuildConfig = {};
    const cmpData: ComponentData = {};
    const r = excludeFromCollection(config, cmpData);
    expect(r).toBe(true);
  });



  beforeEach(() => {
    manifest = {};
    a = {};
    moduleFile = {
      jsFilePath: '/User/me/myapp/dist/collection/components/cmp-a.js',
      cmpMeta: a
    };
  });

  var manifest: Manifest;
  var a: ComponentMeta;
  var b: ModuleFile;
  var moduleFile: ModuleFile;
  var manifestDir = '/User/me/myapp/dist/collection/';
  var config: BuildConfig = {
    sys: mockStencilSystem()
  };

});
