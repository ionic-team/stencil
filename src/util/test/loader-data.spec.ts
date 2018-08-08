import { ComponentMeta } from '../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PRIORITY, PROP_TYPE } from '../constants';
import { formatBrowserLoaderComponent } from '../data-serialize';
import { parseComponentLoader, parsePropertyValue } from '../data-parse';


describe('data serialize/parse', () => {

  describe('component loader data', () => {

    beforeEach(() => {
      cmpMeta = { tagNameMeta: 'tag' };
    });

    it('should set listenersMeta eventCapture', () => {
      cmpMeta.listenersMeta = [{ eventCapture: false }];
      let format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(false);

      cmpMeta.listenersMeta = [{ eventCapture: true }];
      format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(true);
    });

    it('should set listenersMeta eventDisabled', () => {
      cmpMeta.listenersMeta = [{ eventDisabled: false }];
      let format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(false);

      cmpMeta.listenersMeta = [{ eventDisabled: true }];
      format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(true);
    });

    it('should set listenersMeta eventPassive', () => {
      cmpMeta.listenersMeta = [{ eventPassive: false }];
      let format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventPassive).toBe(false);

      cmpMeta.listenersMeta = [{ eventPassive: true }];
      format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);
      expect(cmpMeta.listenersMeta[0].eventPassive).toBe(true);
    });

    it('should set listenersMeta event name and method', () => {
      cmpMeta.listenersMeta = [
        {
          eventName: 'click',
          eventMethodName: 'method1',
          eventCapture: false,
          eventPassive: false,
          eventDisabled: false
        }
      ];

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.listenersMeta[0].eventName).toBe('click');
      expect(cmpMeta.listenersMeta[0].eventMethodName).toBe('method1');
    });

    it('should set scoped css encapsulation', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ShadowDom;
      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.encapsulationMeta).toBe(ENCAPSULATION.ShadowDom);
    });

    it('should set scoped css encapsulation', () => {
      cmpMeta.encapsulationMeta = ENCAPSULATION.ScopedCss;
      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.encapsulationMeta).toBe(ENCAPSULATION.ScopedCss);
    });

    it('should set no encapsulation', () => {
      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.encapsulationMeta).toBeFalsy();
    });

    it('should add a non-attribute property to the load registry', () => {
      cmpMeta.membersMeta = {
        'notAnAttributPropery': {}
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.notAnAttributPropery).toBeDefined();
      expect(cmpMeta.membersMeta.notAnAttributPropery.attribName).toBe(0);
    });

    it('should set any type prop without attribName', () => {
      cmpMeta.membersMeta = {
        'nonAttrib': { memberType: MEMBER_TYPE.Prop },
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.nonAttrib.propType).toBeUndefined();
      expect(cmpMeta.membersMeta.nonAttrib.attribName).toBe(0);
    });

    it('should set any type prop with attribName', () => {
      cmpMeta.membersMeta = {
        'any': { memberType: MEMBER_TYPE.Prop, propType: PROP_TYPE.Any, attribName: 'any' },
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.any.propType).toBe(PROP_TYPE.Any);
      expect(cmpMeta.membersMeta.any.attribName).toBe('any');
    });

    it('should set reflect attribute', () => {
      cmpMeta.membersMeta = {
        'prop': { memberType: MEMBER_TYPE.Prop, reflectToAttrib: true, propType: PROP_TYPE.Number },
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.prop.reflectToAttrib).toBe(true);
    });

    it('should set number prop', () => {
      cmpMeta.membersMeta = {
        'num': { memberType: MEMBER_TYPE.Prop, attribName: 'num', propType: PROP_TYPE.Number }
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.num.propType).toEqual(PROP_TYPE.Number);
      expect(cmpMeta.membersMeta.num.attribName).toEqual('num');
    });

    it('should set boolean prop', () => {
      cmpMeta.membersMeta = {
        'boo': { memberType: MEMBER_TYPE.Prop, attribName: 'boo', propType: PROP_TYPE.Boolean }
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.boo.propType).toEqual(PROP_TYPE.Boolean);
      expect(cmpMeta.membersMeta.boo.attribName).toEqual('boo');
    });

    it('should set custom attribute string', () => {
      cmpMeta.membersMeta = {
        'str': { memberType: MEMBER_TYPE.Prop, attribName: 'my-custom-attr-name', propType: PROP_TYPE.String }
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.str.propType).toEqual(PROP_TYPE.String);
      expect(cmpMeta.membersMeta.str.attribName).toEqual('my-custom-attr-name');
      expect(cmpMeta.membersMeta.str.reflectToAttrib).toEqual(false);
    });

    it('should set string prop', () => {
      cmpMeta.membersMeta = {
        'str': { memberType: MEMBER_TYPE.Prop, attribName: 'str', propType: PROP_TYPE.String }
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.membersMeta.str.propType).toEqual(PROP_TYPE.String);
      expect(cmpMeta.membersMeta.str.attribName).toEqual('str');
    });

    it('should set has styles', () => {
      cmpMeta.stylesMeta = {
        ios: {}
      };

      const format = formatBrowserLoaderComponent(cmpMeta);

      expect(format[2]).toBeTruthy();
    });

    it('should set does not have styles', () => {
      cmpMeta.stylesMeta = null;

      const format = formatBrowserLoaderComponent(cmpMeta);

      expect(format[2]).toBeFalsy();
    });

    it('should set all of the bundle ids as an object', () => {
      cmpMeta.bundleIds = {
        ios: 'abc',
        md: 'def'
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect((cmpMeta.bundleIds as any).ios).toBe('abc');
      expect((cmpMeta.bundleIds as any).md).toBe('def');
    });

    it('should set the default bundle id as a string', () => {
      cmpMeta.bundleIds = {
        $: 'default-id'
      };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.bundleIds).toBe('default-id');
    });

    it('should set the bundle id as a string', () => {
      (cmpMeta.bundleIds as any) = 'bundleid';

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.bundleIds).toBe('bundleid');
    });

    it('should set tagName', () => {
      cmpMeta = { tagNameMeta: 'MY-TAG-NAME' };

      const format = formatBrowserLoaderComponent(cmpMeta);
      cmpMeta = parseComponentLoader(format);

      expect(cmpMeta.tagNameMeta).toEqual('MY-TAG-NAME');
    });

  });


  var cmpMeta: ComponentMeta = {};

});
