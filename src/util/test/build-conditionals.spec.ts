import * as d from '../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { getLastBuildConditionals, setBuildConditionals, setBuildFromComponentContent, setBuildFromComponentMeta } from '../build-conditionals';
import { mockConfig } from '../../testing/mocks';


describe('build conditionals', () => {

  let coreBuild: d.BuildConditionals;
  let cmpMeta: d.ComponentMeta;
  let config: d.Config;
  let buildCtx: d.BuildCtx;
  let compilerCtx: d.CompilerCtx;

  beforeEach(() => {
    cmpMeta = {
      membersMeta: {}
    };
    coreBuild = {} as any;
    config = mockConfig();
    buildCtx = {} as any;
    compilerCtx = {} as any;
  });


  describe('getlastBuildConditionalsEsm',  () => {

    it('use last build cuz only a css/html file changes', () => {
      buildCtx.isRebuild = true;
      compilerCtx.lastBuildConditionalsBrowserEsm = {
        svg: true
      } as any;
      buildCtx.filesChanged = ['/src/app.css', '/src/index.html'];
      const b = getLastBuildConditionals(compilerCtx, 'core', buildCtx);
      expect(b).toEqual({svg: true});
    });

    it('no last build cuz a tsx file change', () => {
      buildCtx.isRebuild = true;
      compilerCtx.lastBuildConditionalsBrowserEsm = {
        svg: true
      } as any;
      buildCtx.filesChanged = ['/src/cmp.tsx'];
      const b = getLastBuildConditionals(compilerCtx, 'core', buildCtx);
      expect(b).toBe(null);
    });

    it('no last build cuz a ts file change', () => {
      buildCtx.isRebuild = true;
      compilerCtx.lastBuildConditionalsBrowserEsm = {
        svg: true
      } as any;
      buildCtx.filesChanged = ['/src/cmp.ts', '/src/app.css', '/src/index.html'];
      const b = getLastBuildConditionals(compilerCtx, 'core', buildCtx);
      expect(b).toBe(null);
    });

    it('no last build cuz no compilerCtx.lastBuildConditionalsBrowserEsm', () => {
      buildCtx.isRebuild = true;
      compilerCtx.lastBuildConditionalsBrowserEsm = null;
      const b = getLastBuildConditionals(compilerCtx, 'core', buildCtx);
      expect(b).toBe(null);
    });

    it('no last build cuz not rebuild', () => {
      buildCtx.isRebuild = false;
      const b = getLastBuildConditionals(compilerCtx, 'core', buildCtx);
      expect(b).toBe(null);
    });

  });


  describe('setBuildConditionals', () => {

    it('set hydrateClientFromSsr true', async () => {
      const compilerCtx: d.CompilerCtx = {};
      config.outputTargets = [
        { type: 'www', hydrateComponents: true }
      ];
      const bc = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, []);
      expect(bc.hydrateClientFromSsr).toBe(true);
    });

    it('set hydrateClientFromSsr false', async () => {
      const compilerCtx: d.CompilerCtx = {};
      const bc = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, []);
      expect(bc.hydrateClientFromSsr).toBe(false);
    });

    it('set Build.hasSlot true', async () => {
      buildCtx.hasSlot = true;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.hasSlot).toBe(true);
    });

    it('set Build.hasSlot false', async () => {
      buildCtx.hasSlot = false;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.hasSlot).toBe(false);
    });

    it('set Build.hasSvg true', async () => {
      buildCtx.hasSvg = true;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.hasSvg).toBe(true);
    });

    it('set Build.hasSvg always true (for now)', async () => {
      buildCtx.hasSvg = false;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.hasSvg).toBe(true);
    });

    it('set Build.isDev', async () => {
      config.devMode = true;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.isDev).toBe(true);
      expect(bc.isProd).toBe(false);
    });

    it('set Build.isProd', async () => {
      config.devMode = false;
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.isDev).toBe(false);
      expect(bc.isProd).toBe(true);
    });

    it('set compilerCtx lastBuildConditionalsBrowserEs5', async () => {
      const bc = await setBuildConditionals(config, compilerCtx, 'core.pf', buildCtx, []);
      expect(compilerCtx.lastBuildConditionalsBrowserEs5).toBe(bc);
    });

    it('set compilerCtx lastBuildConditionalsBrowserEsm', async () => {
      const compilerCtx: d.CompilerCtx = {};
      const bc = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, []);
      expect(compilerCtx.lastBuildConditionalsBrowserEsm).toBe(bc);
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
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: true
      });
    });

    it('styles', () => {
      cmpMeta.stylesMeta = {};
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: true,
        hostTheme: false
      });
    });

    it('shadowDom', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: true,
        slotPolyfill: false,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

    it('slotPolyfill cuz ScopedCss', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ScopedCss;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

    it('slotPolyfill cuz NoEncapsulation', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.NoEncapsulation;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

    it('listener', () => {
      cmpMeta.listenersMeta = [{}];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.listener).toBeTruthy();
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: true,
        styles: false,
        hostTheme: false
      });
    });

    it('event', () => {
      cmpMeta.eventsMeta = [{ eventName: 'name' }];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: true,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

    it('element', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Element
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.element).toBeTruthy();
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        element: true
      });
    });

    it('method', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Method
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        method: true
      });
    });

    it('propContext', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropContext
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        propContext: true
      });
    });

    it('propConnect', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropConnect
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        propConnect: true
      });
    });

    it('observeAttr w/ "any" prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Any
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        observeAttr: true
      });
    });

    it('observeAttr w/ boolean prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Boolean
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        observeAttr: true
      });
    });

    it('observeAttr w/ number prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        observeAttr: true
      });
    });

    it('observeAttr w/ string prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false,
        observeAttr: true
      });
    });

    it('do not set observeAttr w/out valid prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

    it('should do nothing with no member meta', () => {
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasShadowDom: false,
        slotPolyfill: true,
        event: false,
        listener: false,
        styles: false,
        hostTheme: false
      });
    });

  });

});
