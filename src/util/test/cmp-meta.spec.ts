import * as d from '../../declarations';
import { fillCmpMetaFromConstructor } from '../cmp-meta';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';


describe('fillCmpMetaFromConstructor', () => {

  let cmp: d.ComponentConstructor;

  beforeEach(() => {
    cmp = {};
  });

  it('properties', () => {
    cmp.properties = {
      propA: {
        type: String,
        attr: 'prop-a',
        mutable: true
      },
      propB: {
        type: Boolean,
        reflectToAttr: true
      },
      propC: {
        type: Number,
        state: true
      }
    };

    const cmpMeta = fillCmpMetaFromConstructor(cmp, {});
    expect(cmpMeta.membersMeta).toBeDefined();
    expect(cmpMeta.membersMeta.propA.propType).toBe(PROP_TYPE.String);
    expect(cmpMeta.membersMeta.propA.memberType).toBe(MEMBER_TYPE.PropMutable);
    expect(cmpMeta.membersMeta.propA.attribName).toBe('prop-a');
    expect(cmpMeta.membersMeta.propA.reflectToAttr).toBe(false);
    expect(cmpMeta.membersMeta.propB.memberType).toBe(MEMBER_TYPE.Prop);
    expect(cmpMeta.membersMeta.propB.propType).toBe(PROP_TYPE.Boolean);
    expect(cmpMeta.membersMeta.propB.attribName).toBe('propB');
    expect(cmpMeta.membersMeta.propB.reflectToAttr).toBe(true);
    expect(cmpMeta.membersMeta.propC.memberType).toBe(MEMBER_TYPE.State);
  });

  it('membersMeta w/ color', () => {
    const cmpMeta = fillCmpMetaFromConstructor(cmp, {});
    expect(cmpMeta.membersMeta).toBeDefined();
    expect(cmpMeta.membersMeta.color.propType).toBe(PROP_TYPE.String);
    expect(cmpMeta.membersMeta.color.memberType).toBe(MEMBER_TYPE.Prop);
    expect(cmpMeta.membersMeta.color.attribName).toBe('color');
  });

  it('listenersMeta', () => {
    cmp.listeners = [
      { name: 'click', method: 'clickA', capture: true, disabled: true, passive: true },
      { name: 'click', method: 'clickB', capture: false, disabled: false, passive: false },
      { name: 'click', method: 'clickC' }
    ];
    const cmpMeta = fillCmpMetaFromConstructor(cmp, {});
    expect(cmpMeta.listenersMeta[0].eventName).toBe('click');
    expect(cmpMeta.listenersMeta[0].eventMethodName).toBe('clickA');
    expect(cmpMeta.listenersMeta[0].eventCapture).toBe(true);
    expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(true);
    expect(cmpMeta.listenersMeta[0].eventPassive).toBe(true);

    expect(cmpMeta.listenersMeta[1].eventName).toBe('click');
    expect(cmpMeta.listenersMeta[1].eventMethodName).toBe('clickB');
    expect(cmpMeta.listenersMeta[1].eventCapture).toBe(false);
    expect(cmpMeta.listenersMeta[1].eventDisabled).toBe(false);
    expect(cmpMeta.listenersMeta[1].eventPassive).toBe(false);

    expect(cmpMeta.listenersMeta[2].eventName).toBe('click');
    expect(cmpMeta.listenersMeta[2].eventMethodName).toBe('clickC');
    expect(cmpMeta.listenersMeta[2].eventCapture).toBe(undefined);
    expect(cmpMeta.listenersMeta[2].eventDisabled).toBe(undefined);
    expect(cmpMeta.listenersMeta[2].eventPassive).toBe(undefined);
  });

  it('tag', () => {
    cmp.is = 'cmp-a';
    const cmpMeta = fillCmpMetaFromConstructor(cmp, {});
    expect(cmpMeta.tagNameMeta).toBe('cmp-a');
  });

});
