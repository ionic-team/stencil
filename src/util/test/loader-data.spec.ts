import { ComponentMeta } from '../interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PRIORITY, PROP_TYPE } from '../constants';
import { formatComponentLoader } from '../data-serialize';
import { parseComponentLoaders, parsePropertyValue } from '../data-parse';


describe('data serialize/parse', () => {

  describe('component loader data', () => {

    beforeEach(() => {
      cmpMeta = { tagNameMeta: 'tag' };
    });

    it('should set listenersMeta eventCapture', () => {
      cmpMeta.listenersMeta = [{ eventCapture: false }];
      let format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(false);

      cmpMeta.listenersMeta = [{ eventCapture: true }];
      format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(true);
    });

    it('should set listenersMeta eventDisabled', () => {
      cmpMeta.listenersMeta = [{ eventDisabled: false }];
      let format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(false);

      cmpMeta.listenersMeta = [{ eventDisabled: true }];
      format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(true);
    });

    it('should set listenersMeta eventPassive', () => {
      cmpMeta.listenersMeta = [{ eventPassive: false }];
      let format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
      expect(cmpMeta.listenersMeta[0].eventPassive).toBe(false);

      cmpMeta.listenersMeta = [{ eventPassive: true }];
      format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});
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

      let format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.listenersMeta[0].eventName).toBe('click');
      expect(cmpMeta.listenersMeta[0].eventMethodName).toBe('method1');
    });

    it('should set scoped css encapsulation', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ShadowDom;
      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.ShadowDom);
    });

    it('should set scoped css encapsulation', () => {
      cmpMeta.encapsulation = ENCAPSULATION.ScopedCss;
      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.encapsulation).toBe(ENCAPSULATION.ScopedCss);
    });

    it('should set no encapsulation', () => {
      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.encapsulation).toBeFalsy();
    });

    it('should add a non-attribute property to the load registry', () => {
      cmpMeta.membersMeta = {
        'notAnAttributPropery': {}
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.notAnAttributPropery).toBeDefined();
      expect(cmpMeta.membersMeta.notAnAttributPropery.attribName).toBe(0);
    });

    it('should set any type prop without attribName', () => {
      cmpMeta.membersMeta = {
        'nonAttrib': { memberType: MEMBER_TYPE.Prop },
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.nonAttrib.propType).toBeUndefined();
      expect(cmpMeta.membersMeta.nonAttrib.attribName).toBe(0);
    });

    it('should set any type prop with attribName', () => {
      cmpMeta.membersMeta = {
        'any': { memberType: MEMBER_TYPE.Prop, attribName: 'any' },
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.any.propType).toBeUndefined();
      expect(cmpMeta.membersMeta.any.attribName).toBe('any');
    });

    it('should set number prop', () => {
      cmpMeta.membersMeta = {
        'num': { memberType: MEMBER_TYPE.Prop, attribName: 'num', propType: PROP_TYPE.Number }
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.num.propType).toEqual(PROP_TYPE.Number);
      expect(cmpMeta.membersMeta.num.attribName).toEqual('num');
    });

    it('should set boolean prop', () => {
      cmpMeta.membersMeta = {
        'boo': { memberType: MEMBER_TYPE.Prop, attribName: 'boo', propType: PROP_TYPE.Boolean }
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.boo.propType).toEqual(PROP_TYPE.Boolean);
      expect(cmpMeta.membersMeta.boo.attribName).toEqual('boo');
    });

    it('should set string prop', () => {
      cmpMeta.membersMeta = {
        'str': { memberType: MEMBER_TYPE.Prop, attribName: 'str', propType: PROP_TYPE.String }
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.str.propType).toEqual(PROP_TYPE.String);
      expect(cmpMeta.membersMeta.str.attribName).toEqual('str');
    });

    it('should always set color/mode even with no props', () => {
      cmpMeta.membersMeta = null;

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.membersMeta.color).toBeDefined();
      expect(cmpMeta.membersMeta.color.memberType).toBe(MEMBER_TYPE.Prop);
      expect(cmpMeta.membersMeta.mode).toBeDefined();
      expect(cmpMeta.membersMeta.mode.memberType).toBe(MEMBER_TYPE.Prop);
    });

    it('should set has styles', () => {
      cmpMeta.stylesMeta = {
        ios: {}
      };

      const format = formatComponentLoader(cmpMeta);

      expect(format[2]).toBeTruthy();
    });

    it('should set does not have styles', () => {
      cmpMeta.stylesMeta = null;

      const format = formatComponentLoader(cmpMeta);

      expect(format[2]).toBeFalsy();
    });

    it('should set all of the bundle ids as an object', () => {
      cmpMeta.bundleIds = {
        ios: { es2015: 'abc'},
        md: { es2015: 'def'}
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.bundleIds.ios[0]).toBe('abc');
      expect(cmpMeta.bundleIds.md[0]).toBe('def');
    });

    it('should set the default bundle id as a string', () => {
      cmpMeta.bundleIds = {
        $: { es2015: 'default-id'}
      };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.bundleIds[0]).toBe('default-id');
    });

    it('should set the bundle id as a string', () => {
      (cmpMeta.bundleIds as any) = 'bundleid';

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.bundleIds).toBe('bundleid');
    });

    it('should set tagName', () => {
      cmpMeta = { tagNameMeta: 'MY-TAG-NAME' };

      const format = formatComponentLoader(cmpMeta);
      cmpMeta = parseComponentLoaders(format, {});

      expect(cmpMeta.tagNameMeta).toEqual('MY-TAG-NAME');
    });

  });


  var cmpMeta: ComponentMeta = {};

});
