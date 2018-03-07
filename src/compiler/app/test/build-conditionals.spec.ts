import { BuildConditionals, BuildCtx, ComponentMeta, Config } from '../../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { setBuildConditionals, setBuildFromComponentContent, setBuildFromComponentMeta } from '../build-conditionals';


describe('build conditionals', () => {

  let coreBuild: BuildConditionals;
  let cmpMeta: ComponentMeta;
  let config: Config;
  let buildCtx: BuildCtx;

  beforeEach(() => {
    cmpMeta = {
      membersMeta: {}
    };
    coreBuild = {} as any;
    config = {};
    buildCtx = {} as any;
  });


  describe('setBuildConditionals', () => {

    it('set Build.svg true', async () => {
      buildCtx.hasSvg = true;
      const bc = await setBuildConditionals(config, {}, buildCtx, []);
      expect(bc.svg).toBe(true);
    });

    it('set Build.svg false', async () => {
      buildCtx.hasSvg = false;
      const bc = await setBuildConditionals(config, {}, buildCtx, []);
      expect(bc.svg).toBe(false);
    });

    it('set Build.isDev', async () => {
      config.devMode = true;
      const bc = await setBuildConditionals(config, {}, buildCtx, []);
      expect(bc.isDev).toBe(true);
      expect(bc.isProd).toBe(false);
    });

    it('set Build.isProd', async () => {
      config.devMode = false;
      const bc = await setBuildConditionals(config, {}, buildCtx, []);
      expect(bc.isDev).toBe(false);
      expect(bc.isProd).toBe(true);
    });

  });

  describe('setBuildFromComponentContent', () => {

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

    it('shadowDom', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.shadowDom).toBeTruthy();
    });

    it('listener', () => {
      cmpMeta.listenersMeta = [{}];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.listener).toBeTruthy();
    });

    it('event', () => {
      cmpMeta.eventsMeta = [{ eventName: 'name' }];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.event).toBeTruthy();
    });

    it('element', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Element
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.element).toBeTruthy();
    });

    it('method', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Method
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.method).toBeTruthy();
    });

    it('propContext', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropContext
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.propContext).toBeTruthy();
    });

    it('propConnect', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropConnect
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.propConnect).toBeTruthy();
    });

    it('observeAttr w/ "any" prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Any
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
    });

    it('observeAttr w/ boolean prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Boolean
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
    });

    it('observeAttr w/ number prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
    });

    it('observeAttr w/ string prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.observeAttr).toBeTruthy();
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

});
