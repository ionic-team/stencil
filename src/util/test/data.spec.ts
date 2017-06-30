import { formatComponentMeta, formatLoadComponentRegistry } from '../data-serialize';
import { parseComponentMeta, parseComponentRegistry, parsePropertyValue } from '../data-parse';
import { ComponentMeta, ComponentRegistry } from '../interfaces';
import { ATTR_DASH_CASE, ATTR_LOWER_CASE, HAS_SLOTS, PRIORITY_LOW,
  PROP_CHANGE_PROP_NAME, PROP_CHANGE_METHOD_NAME, TYPE_BOOLEAN, TYPE_NUMBER } from '../constants';


describe('data serialize/parse', () => {

  describe('parseComponentMeta', () => {

    beforeEach(() => {
      registry = {};
      cmpMeta = registry['TAG'] = { tagNameMeta: 'TAG' };
    });

    it('should set shadow dom', () => {
      cmpMeta.isShadowMeta = true;

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].isShadowMeta).toBe(true);
    });

    it('should set no shadow dom', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].isShadowMeta).toBeFalsy();
    });

    it('should set hostMeta', () => {
      cmpMeta.hostMeta = {
        class: {
          'class-name': true
        }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].hostMeta.class['class-name']).toBe(true);
    });

    it('should set no hostMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].hostMeta).toBeFalsy();
    });

    it('should set propWillChangeMeta', () => {
      cmpMeta.propWillChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propWillChangeMeta[0][PROP_CHANGE_PROP_NAME]).toBe('propName');
      expect(registry['TAG'].propWillChangeMeta[0][PROP_CHANGE_METHOD_NAME]).toBe('methodName');
    });

    it('should set propDidChangeMeta', () => {
      cmpMeta.propDidChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propDidChangeMeta[0][PROP_CHANGE_PROP_NAME]).toBe('propName');
      expect(registry['TAG'].propDidChangeMeta[0][PROP_CHANGE_METHOD_NAME]).toBe('methodName');
    });

    it('should set no propWillChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propWillChangeMeta).toBeFalsy();
    });

    it('should set no propDidChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propDidChangeMeta).toBeFalsy();
    });

    it('should set listenersMeta', () => {
      cmpMeta.listenersMeta = [
        {
          eventName: 'click',
          eventMethodName: 'method1',
          eventCapture: true,
          eventPassive: true,
          eventEnabled: false
        }
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].listenersMeta[0].eventName).toBe('click');
      expect(registry['TAG'].listenersMeta[0].eventMethodName).toBe('method1');
      expect(registry['TAG'].listenersMeta[0].eventCapture).toBe(true);
      expect(registry['TAG'].listenersMeta[0].eventEnabled).toBe(false);
      expect(registry['TAG'].listenersMeta[0].eventPassive).toBe(true);
    });

    it('should set no listenersMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].listenersMeta).toBeFalsy();
    });

    it('should set statesMeta', () => {
      cmpMeta.statesMeta = ['method1', 'method2'];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].statesMeta[0]).toEqual('method1');
      expect(registry['TAG'].statesMeta[1]).toEqual('method2');
    });

    it('should set no statesMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].statesMeta).toBeFalsy();
    });

    it('should set methodsMeta', () => {
      cmpMeta.methodsMeta = ['method1', 'method2'];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].methodsMeta[0]).toEqual('method1');
      expect(registry['TAG'].methodsMeta[1]).toEqual('method2');
    });

    it('should set no methodsMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].methodsMeta).toBeFalsy();
    });

    it('should set componentModuleMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(cmpMeta.componentModuleMeta).toEqual(moduleImports.TAG);
    });

  });

  describe('parseComponentRegistry', () => {

    beforeEach(() => {
      cmpMeta = { tagNameMeta: 'TAG' };
    });

    it('should set load priority', () => {
      cmpMeta.loadPriority = PRIORITY_LOW;

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.loadPriority).toBe(PRIORITY_LOW);
    });

    it('should set not load priority', () => {
      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.loadPriority).toBeFalsy();
    });

    it('should set has slot', () => {
      cmpMeta.slotMeta = HAS_SLOTS;

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.slotMeta).toBe(HAS_SLOTS);
    });

    it('should set no slot', () => {
      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.slotMeta).toBeFalsy();
    });

    it('should set attribute lower case from config', () => {
      cmpMeta.propsMeta = [
        { propName: 'propName1' },
        { propName: 'propName2', attribCase: ATTR_DASH_CASE }
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_LOWER_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].attribName).toEqual('propname1');
      expect(cmpMeta.propsMeta[3].attribName).toEqual('prop-name2');
    });

    it('should set attribute dash case', () => {
      cmpMeta.propsMeta = [
        { propName: 'propName1' },
        { propName: 'propName2', attribCase: ATTR_LOWER_CASE }
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].attribName).toEqual('prop-name1');
      expect(cmpMeta.propsMeta[3].attribName).toEqual('propname2');
    });

    it('should set number prop', () => {
      cmpMeta.propsMeta = [
        { propName: 'num', propType: TYPE_NUMBER },
        { propName: 'str' },
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].propName).toEqual('num');
      expect(cmpMeta.propsMeta[2].propType).toEqual(TYPE_NUMBER);

      expect(cmpMeta.propsMeta[3].propName).toEqual('str');
      expect(cmpMeta.propsMeta[3].propType).toBeUndefined();
    });

    it('should set boolean prop', () => {
      cmpMeta.propsMeta = [
        { propName: 'boo', propType: TYPE_BOOLEAN }
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].propName).toEqual('boo');
      expect(cmpMeta.propsMeta[2].propType).toEqual(TYPE_BOOLEAN);
    });

    it('should set is stateful prop true', () => {
      cmpMeta.propsMeta = [
        { propName: 'prop', isStateful: true }
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].propName).toEqual('prop');
      expect(cmpMeta.propsMeta[2].isStateful).toEqual(true);
    });

    it('should default is stateful prop false', () => {
      cmpMeta.propsMeta = [
        { propName: 'prop' }
      ];

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta[2].propName).toEqual('prop');
      expect(cmpMeta.propsMeta[2].isStateful).toEqual(false);
    });

    it('should always set color/mode even with no props', () => {
      cmpMeta.propsMeta = null;

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.propsMeta.length).toEqual(2);
      expect(cmpMeta.propsMeta[0].propName).toEqual('color');
      expect(cmpMeta.propsMeta[0].attribName).toEqual('color');
      expect(cmpMeta.propsMeta[1].propName).toEqual('mode');
    });

    it('should set all of the modes', () => {
      cmpMeta.styleMeta = {
        ios: { styleId: 'abc' },
        md: { styleId: 'def' }
      };

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.styleIds.ios).toBe('abc');
      expect(cmpMeta.styleIds.md).toBe('def');
    });

    it('should set mode moduleId', () => {
      cmpMeta.moduleId = '1.21';

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.moduleId).toEqual('1.21');
    });

    it('should set tagName', () => {
      cmpMeta = { tagNameMeta: 'MY-TAG-NAME' };

      const format = formatLoadComponentRegistry(cmpMeta, ATTR_DASH_CASE);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.tagNameMeta).toEqual('MY-TAG-NAME');
    });

  });


  describe('parsePropertyValue', () => {

    describe('number', () => {

      it('should convert number 1 to number 1', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 1)).toBe(1);
      });

      it('should convert number 0 to number 0', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 0)).toBe(0);
      });

      it('should convert string "0" to number 0', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '0')).toBe(0);
      });

      it('should convert string "88" to number 88', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '88')).toBe(88);
      });

      it('should convert empty string "" to NaN', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '')).toEqual(NaN);
      });

      it('should convert any string "anyword" to NaN', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 'anyword')).toEqual(NaN);
      });

      it('should keep number undefined as undefined', () => {
        expect(parsePropertyValue(TYPE_NUMBER, undefined)).toEqual(undefined);
      });

      it('should keep number null as null', () => {
        expect(parsePropertyValue(TYPE_NUMBER, null)).toBe(null);
      });

    });

    describe('boolean', () => {

      it('should set boolean 1 as true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 1)).toBe(true);
      });

      it('should set boolean 0 as false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 0)).toBe(false);
      });

      it('should keep boolean true as boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, true)).toBe(true);
      });

      it('should keep boolean false as boolean false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, false)).toBe(false);
      });

      it('should convert string "false" to boolean false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'false')).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'true')).toBe(true);
      });

      it('should convert empty string "" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, '')).toBe(true);
      });

      it('should convert any string "anyword" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'anyword')).toBe(true);
      });

      it('should keep boolean undefined as undefined', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, undefined)).toBe(undefined);
      });

      it('should keep boolean null as null', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, null)).toBe(null);
      });

    });

  });


  var registry: ComponentRegistry = {};
  var moduleImports: any = { 'TAG': class MyTag {} };
  var cmpMeta: ComponentMeta = {};

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
