import { BuildConditionals, ComponentMeta } from '../../../util/interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE, SLOT_META } from '../../../util/constants';
import { setBuildFromComponentMeta, setBuildFromComponentContent } from '../build-conditionals';


describe('build conditionals', () => {

  describe('setBuildFromComponentContent', () => {

    it('SVG', () => {
      const jsText = `SVG`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.svg).toBeTruthy();
    });

    it('svg', () => {
      const jsText = `svg`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.svg).toBeTruthy();
    });

    it('render', () => {
      const jsText = `render`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.render).toBeTruthy();
    });

    it('hostData', () => {
      const jsText = `hostData`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.hostData).toBeTruthy();
    });

    it('cmpDidUnload', () => {
      const jsText = `componentDidUnload`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.cmpDidUnload).toBeTruthy();
    });

    it('cmpDidUpdate', () => {
      const jsText = `componentDidUpdate`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.cmpDidUpdate).toBeTruthy();
    });

    it('cmpWillUpdate', () => {
      const jsText = `componentWillUpdate`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.cmpWillUpdate).toBeTruthy();
    });

    it('cmpDidLoad', () => {
      const jsText = `componentDidLoad`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.cmpDidLoad).toBeTruthy();
    });

    it('cmpWillLoad', () => {
      const jsText = `componentWillLoad`;
      setBuildFromComponentContent(coreBuild, jsText);
      expect(coreBuild.cmpWillLoad).toBeTruthy();
    });

  });

  describe('setBuildFromComponentMeta', () => {

    it('hostTheme', () => {
      cmpMeta.hostMeta = {
        theme: {}
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.hostTheme).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('styles', () => {
      cmpMeta.stylesMeta = {};
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.styles).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('customSlot when using now using shadow dom but is using a slot', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;
      cmpMeta.slotMeta = SLOT_META.HasSlots;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.customSlot).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(2);
    });

    it('scopedCss', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.scopedCss).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('shadowDom', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.shadowDom).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('listener', () => {
      cmpMeta.listenersMeta = [{}];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.listener).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('event', () => {
      cmpMeta.eventsMeta = [{}];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.event).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('element', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Element
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.element).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('method', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Method
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.method).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('propContext', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropContext
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.propContext).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('propConnect', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropConnect
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.propConnect).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('observeAttr w/ "any" prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Any
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('observeAttr w/ boolean prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Boolean
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('observeAttr w/ number prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('observeAttr w/ string prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
      expect(Object.keys(coreBuild).length).toBe(1);
    });

    it('do not set observeAttr w/out valid prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeFalsy();
      expect(Object.keys(coreBuild).length).toBe(0);
    });

    it('should do nothing with no member meta', () => {
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(Object.keys(coreBuild).length).toBe(0);
    });

  });


  var coreBuild: BuildConditionals;
  var cmpMeta: ComponentMeta;

  beforeEach(() => {
    cmpMeta = {
      membersMeta: {}
    };
    (coreBuild as any) = {};
  });

});
