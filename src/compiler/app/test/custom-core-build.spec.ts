import { ComponentMeta, coreBuild } from '../../../util/interfaces';
import { ENCAPSULATION, MEMBER_TYPE } from '../../../util/constants';
import { setComponentCoreBuild } from '../app-core-build';


describe('setComponentCoreBuild', () => {

  describe('styles', () => {

    it('set scoped', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_scoped_css).toBeTruthy();
    });

    it('set shadow', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_shadow_dom).toBeTruthy();
    });

    it('set styles', () => {
      cmpMeta.stylesMeta = {};
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_styles).toBeTruthy();
    });

  });

  describe('decorators', () => {

    it('set listener', () => {
      cmpMeta.listenersMeta = [{}];
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_listener).toBeTruthy();
    });

    it('set state', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.State };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_state).toBeTruthy();
    });

    it('set prop mutable', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.PropMutable };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_prop).toBeTruthy();
    });

    it('set prop context', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.PropContext };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_prop).toBeTruthy();
      expect(coreIncludeSections._build_prop_context).toBeTruthy();
    });

    it('set prop connect', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.PropConnect };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_prop).toBeTruthy();
      expect(coreIncludeSections._build_prop_connect).toBeTruthy();
    });

    it('set prop', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.Prop };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_prop).toBeTruthy();
    });

    it('set method', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.Method };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_method).toBeTruthy();
    });

    it('set events', () => {
      cmpMeta.eventsMeta = [{}];
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_event).toBeTruthy();
    });

    it('set element', () => {
      cmpMeta.membersMeta.member = { memberType: MEMBER_TYPE.Element };
      setComponentCoreBuild(coreIncludeSections, cmpMeta);
      expect(coreIncludeSections._build_element).toBeTruthy();
    });

  });


  var cmpMeta: ComponentMeta;
  var coreIncludeSections: coreBuild;

  beforeEach(() => {
    cmpMeta = { membersMeta: {} };
    coreIncludeSections = {};
  });

});
