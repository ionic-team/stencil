import { Collection, CollectionData, ComponentMeta, ModuleFile } from '../../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { mockConfig } from '../../../testing/mocks';
import { parseComponentDataToModuleFile, parseComponents, parseDidChangeDeprecated, parseWillChangeDeprecated, serializeComponent } from '../collection-data';


describe('collection components', () => {

  let collection: Collection;
  let a: ComponentMeta;
  let b: ModuleFile;
  let moduleFile: ModuleFile;
  const collectionDir = '/User/me/myapp/dist/collection/';
  const config = mockConfig();

  beforeEach(() => {
    collection = {};
    a = {};
    moduleFile = {
      jsFilePath: '/User/me/myapp/dist/collection/components/cmp-a.js',
      cmpMeta: a
    };
  });

  it('scoped css encapsulation', () => {
    a.encapsulation = ENCAPSULATION.ScopedCss;
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.scoped).toBe(true);
    expect(cmpData.shadow).toBeFalsy();
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);
  });

  it('shadow dom encapsulation', () => {
    a.encapsulation = ENCAPSULATION.ShadowDom;
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.shadow).toBe(true);
    expect(cmpData.scoped).toBeFalsy();
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
  });

  it('eventsMeta', () => {
    a.eventsMeta = [
      { eventName: 'zzEvent' },
      { eventName: 'aa-event', eventMethodName: 'methodName', eventBubbles: false, eventCancelable: false, eventComposed: false }
    ];
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.events.length).toBe(2);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
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
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.hostElement.name).toBe('myElement');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.membersMeta.myElement.memberType).toBe(MEMBER_TYPE.Element);
  });

  it('hostMeta', () => {
    a.hostMeta = { theme: { 'some-class': true } };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.host.theme['some-class']).toBe(true);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.hostMeta.theme['some-class']).toBe(true);
  });

  it('methodsMeta', () => {
    a.membersMeta = {
      'methodA': { memberType: MEMBER_TYPE.Method },
      'methodB': { memberType: MEMBER_TYPE.Method }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.methods[0].name).toBe('methodA');
    expect(cmpData.methods[1].name).toBe('methodB');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.membersMeta.methodA.memberType).toBe(MEMBER_TYPE.Method);
    expect(b.cmpMeta.membersMeta.methodB.memberType).toBe(MEMBER_TYPE.Method);
  });

  it('listenersMeta', () => {
    a.listenersMeta = [
      { eventName: 'eventB', eventMethodName: 'methodB', eventPassive: false, eventCapture: false, eventDisabled: false },
      { eventName: 'eventA', eventMethodName: 'methodA', eventPassive: true, eventCapture: true, eventDisabled: true }
    ];
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
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

    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
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
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.states[0].name).toBe('stateA');
    expect(cmpData.states[1].name).toBe('stateB');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.membersMeta.stateA.memberType).toBe(MEMBER_TYPE.State);
    expect(b.cmpMeta.membersMeta.stateB.memberType).toBe(MEMBER_TYPE.State);
  });

  it('propsDidChange (deprecated, uses watchCallbacks now)', () => {
    const cmpData: any = {
      propsDidChange: [
        {
          name: 'nameA',
          method: 'methodA'
        },
        {
          name: 'nameB',
          method: 'methodB'
        }
      ]
    };
    const cmpMeta: ComponentMeta = {};
    parseDidChangeDeprecated(cmpData, cmpMeta);
    expect(cmpMeta.membersMeta.nameA.watchCallbacks[0]).toBe('methodA');
    expect(cmpMeta.membersMeta.nameB.watchCallbacks[0]).toBe('methodB');
  });

  it('propsWillChange (deprecated, uses watchCallbacks now)', () => {
    const cmpData: any = {
      propsWillChange: [
        {
          name: 'nameA',
          method: 'methodA'
        },
        {
          name: 'nameB',
          method: 'methodB'
        }
      ]
    };
    const cmpMeta: ComponentMeta = {};
    parseWillChangeDeprecated(cmpData, cmpMeta);
    expect(cmpMeta.membersMeta.nameA.watchCallbacks[0]).toBe('methodA');
    expect(cmpMeta.membersMeta.nameB.watchCallbacks[0]).toBe('methodB');
  });

  it('membersMeta el', () => {
    a.membersMeta = {
      'el': { memberType: MEMBER_TYPE.Element }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.el.memberType).toBe(MEMBER_TYPE.Element);
  });

  it('membersMeta state', () => {
    a.membersMeta = {
      'state': { memberType: MEMBER_TYPE.State }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.state.memberType).toBe(MEMBER_TYPE.State);
    expect(b.cmpMeta.membersMeta.state.propType).toBeUndefined();
  });

  it('membersMeta prop mutable', () => {
    a.membersMeta = {
      'propMutable': { memberType: MEMBER_TYPE.PropMutable, propType: PROP_TYPE.Number }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.propMutable.memberType).toBe(MEMBER_TYPE.PropMutable);
    expect(b.cmpMeta.membersMeta.propMutable.propType).toBe(PROP_TYPE.Number);
  });

  it('membersMeta prop type any', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.Any }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.Any);
  });

  it('membersMeta prop type boolean', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.Boolean }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.Boolean);
  });

  it('membersMeta prop type string', () => {
    a.membersMeta = {
      'prop': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.String }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop.memberType).toBe(MEMBER_TYPE.Prop);
    expect(b.cmpMeta.membersMeta.prop.propType).toBe(PROP_TYPE.String);
  });

  it('membersMeta prop watch callbacks', () => {
    a.membersMeta = {
      'prop1': { memberType: MEMBER_TYPE.Prop, watchCallbacks: ['method1', 'method2'] },
      'prop2': { memberType: MEMBER_TYPE.PropMutable, watchCallbacks: ['method1', 'method3'] }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);

    expect(b.cmpMeta.membersMeta.prop1.watchCallbacks[0]).toBe('method1');
    expect(b.cmpMeta.membersMeta.prop1.watchCallbacks[1]).toBe('method2');
    expect(b.cmpMeta.membersMeta.prop2.watchCallbacks[0]).toBe('method1');
    expect(b.cmpMeta.membersMeta.prop2.watchCallbacks[1]).toBe('method3');
  });

  it('assetsDirsMeta', () => {
    a.assetsDirsMeta = [{
      cmpRelativePath: 'svgs'
    }];
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.assetPaths[0]).toBe('components/svgs');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.assetsDirsMeta[0].absolutePath).toBe('/User/me/myapp/dist/collection/components/svgs');
    expect(b.cmpMeta.assetsDirsMeta[0].cmpRelativePath).toBe('svgs');
  });

  it('stylesMeta stylePaths', () => {
    a.stylesMeta = {
      ios: {
        externalStyles: [{
          cmpRelativePath: 'cmp-a.scss'
        }]
      }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.styles.ios.stylePaths[0]).toBe('components/cmp-a.scss');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.stylesMeta.ios.externalStyles[0].cmpRelativePath).toBe('cmp-a.scss');
    expect(b.cmpMeta.stylesMeta.ios.externalStyles[0].absolutePath).toBe('/User/me/myapp/dist/collection/components/cmp-a.scss');
  });

  it('stylesMeta styleStr', () => {
    a.stylesMeta = {
      ios: {
        styleStr: 'cmp-a{color:red}'
      }
    };
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(a.stylesMeta.ios.styleStr).toBe(b.cmpMeta.stylesMeta.ios.styleStr);
  });

  it('js file path', () => {
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.componentPath).toBe('components/cmp-a.js');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.jsFilePath).toBe('/User/me/myapp/dist/collection/components/cmp-a.js');
  });

  it('componentClass', () => {
    a.componentClass = 'ComponentClass';
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.componentClass).toBe('ComponentClass');
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.componentClass).toBe(a.componentClass);
  });

  it('component dependencies', () => {
    a.dependencies = ['cmp-a', 'cmp-b'];
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.dependencies).toEqual(['cmp-a', 'cmp-b']);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.dependencies).toEqual(a.dependencies);
  });

  it('tag name', () => {
    a.tagNameMeta = 'ion-tag';
    const cmpData = serializeComponent(config, collectionDir, moduleFile);
    expect(cmpData.tag).toBe(a.tagNameMeta);
    b = parseComponentDataToModuleFile(config, collection, collectionDir, cmpData);
    expect(b.cmpMeta.tagNameMeta).toBe(a.tagNameMeta);
  });

});
