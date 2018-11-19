import * as d from '../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { getLastBuildConditionals, setBuildConditionals, setBuildFromComponentContent, setBuildFromComponentMeta } from '../build-conditionals';


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
    config = {};
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

    it('default Build.hasSvg false', async () => {
      const bc = await setBuildConditionals(config, {}, 'core', buildCtx, []);
      expect(bc.hasSvg).toBe(false);
    });

    it('set Build.hasSvg true', async () => {
      buildCtx.hasSvg = true;
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
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: true,
        updatable: false
      });
    });

    it('styles, no modes', () => {
      cmpMeta.stylesMeta = {
        $: {externalStyles: [{cmpRelativePath: 'styles.css'}]}
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        styles: true,
        hostTheme: false,
        hasMode: false,
        updatable: false
      });
    });

    it('styles, with modes', () => {
      cmpMeta.stylesMeta = {
        ios: {externalStyles: [{cmpRelativePath: 'ios.css'}]},
        md: {externalStyles: [{cmpRelativePath: 'md.css'}]}
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        styles: true,
        hasMode: true,
        hostTheme: false,
        updatable: false
      });
    });

    it('shadowDom', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: true,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

    it('scoped cuz ScopedCss', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ScopedCss;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: true,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

    it('no scoped or shadow cuz NoEncapsulation', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.NoEncapsulation;
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

    it('listener', () => {
      cmpMeta.listenersMeta = [{}];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.listener).toBeTruthy();
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: true,
        hostTheme: false,
        updatable: false
      });
    });

    it('event', () => {
      cmpMeta.eventsMeta = [{ eventName: 'name' }];
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: true,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

    it('element', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Element
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild.element).toBeTruthy();
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        element: true,
        updatable: false
      });
    });

    it('method', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Method
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        method: true,
        updatable: false
      });
    });

    it('propContext', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropContext
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        propContext: true,
        updatable: false
      });
    });

    it('propConnect', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropConnect
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        propConnect: true,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

    it('prop', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        prop: true,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: true,
      });
    });

    it('propMutable', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.PropMutable,
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        prop: true,
        propMutable: true,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: true
      });
    });

    it('state', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.State,
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        state: true,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: true
      });
    });

    it('observeAttr w/ "any" prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Any
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        prop: true,
        event: false,
        listener: false,
        hostTheme: false,
        observeAttr: true,
        updatable: true
      });
    });

    it('observeAttr w/ boolean prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Boolean
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        prop: true,
        event: false,
        listener: false,
        hostTheme: false,
        observeAttr: true,
        updatable: true
      });
    });

    it('observeAttr w/ number prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.Number
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        event: false,
        prop: true,
        listener: false,
        hostTheme: false,
        observeAttr: true,
        updatable: true
      });
    });

    it('observeAttr w/ string prop type', () => {
      cmpMeta.membersMeta.name = {
        memberType: MEMBER_TYPE.Prop,
        propType: PROP_TYPE.String
      };
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: true,
        shadowDom: false,
        scoped: false,
        prop: true,
        event: false,
        listener: false,
        hostTheme: false,
        observeAttr: true,
        updatable: true
      });
    });

    it('should do nothing with no member meta', () => {
      setBuildFromComponentMeta(coreBuild, cmpMeta);
      expect(coreBuild).toEqual({
        hasMembers: false,
        shadowDom: false,
        scoped: false,
        event: false,
        listener: false,
        hostTheme: false,
        updatable: false
      });
    });

  });

});
