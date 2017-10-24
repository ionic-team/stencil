import { ComponentMeta, ComponentRegistry } from '../interfaces';
import { formatComponentMeta } from '../data-serialize';
import { MEMBER_TYPE, PROP_CHANGE, PROP_TYPE } from '../constants';
import { parseComponentMeta, parsePropertyValue } from '../data-parse';


describe('data serialize/parse', () => {

  describe('format/parse component meta data', () => {

    beforeEach(() => {
      registry = {};
      cmpMeta = { tagNameMeta: 'tag' };
      registry['tag'] = { tagNameMeta: 'tag' };
    });

    it('should set eventsMeta', () => {
      cmpMeta.eventsMeta = [
        {
          eventName: 'open',
          eventMethodName: 'openMethod',
          eventBubbles: true,
          eventCancelable: true,
          eventComposed: true
        }
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].eventsMeta[0].eventName).toBe('open');
      expect(registry['tag'].eventsMeta[0].eventMethodName).toBe('openMethod');
      expect(registry['tag'].eventsMeta[0].eventBubbles).toBe(true);
      expect(registry['tag'].eventsMeta[0].eventCancelable).toBe(true);
      expect(registry['tag'].eventsMeta[0].eventComposed).toBe(true);
    });

    it('should set no eventsMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].eventsMeta).toBeFalsy();
    });

    it('should set hostMeta', () => {
      cmpMeta.hostMeta = {
        class: {
          'class-name': true
        }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].hostMeta.class['class-name']).toBe(true);
    });

    it('should set no hostMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].hostMeta).toBeFalsy();
    });

    it('should set propWillChangeMeta', () => {
      cmpMeta.propsWillChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].propsWillChangeMeta[0][PROP_CHANGE.PropName]).toBe('propName');
      expect(registry['tag'].propsWillChangeMeta[0][PROP_CHANGE.MethodName]).toBe('methodName');
    });

    it('should set propDidChangeMeta', () => {
      cmpMeta.propsDidChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].propsDidChangeMeta[0][PROP_CHANGE.PropName]).toBe('propName');
      expect(registry['tag'].propsDidChangeMeta[0][PROP_CHANGE.MethodName]).toBe('methodName');
    });

    it('should set no propWillChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].propsWillChangeMeta).toBeFalsy();
    });

    it('should set no propDidChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].propsDidChangeMeta).toBeFalsy();
    });

    it('should set no listenersMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].listenersMeta).toBeFalsy();
    });

    it('should set host element member name', () => {
      cmpMeta.membersMeta = {
        'myHostElement': { memberType: MEMBER_TYPE.Element }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].membersMeta.myHostElement.memberType).toEqual(MEMBER_TYPE.Element);
    });

    it('should set no host element member name', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].membersMeta).toBeUndefined();
    });

    it('should set statesMeta', () => {
      cmpMeta.membersMeta = {
        'state1': { memberType: MEMBER_TYPE.State },
        'state2': { memberType: MEMBER_TYPE.State }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].membersMeta.state1.memberType).toEqual(MEMBER_TYPE.State);
      expect(registry['tag'].membersMeta.state2.memberType).toEqual(MEMBER_TYPE.State);
    });

    it('should set methodsMeta', () => {
      cmpMeta.membersMeta = {
        'method1': { memberType: MEMBER_TYPE.Method },
        'method2': { memberType: MEMBER_TYPE.Method }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['tag'].membersMeta.method1.memberType).toEqual(MEMBER_TYPE.Method);
      expect(registry['tag'].membersMeta.method2.memberType).toEqual(MEMBER_TYPE.Method);
    });

    it('should set ctrlId', () => {
      cmpMeta.membersMeta = {
        'someCtrl': {
          ctrlId: 'myCtrlId'
        }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(cmpMeta.membersMeta.someCtrl).toBeDefined();
      expect(cmpMeta.membersMeta.someCtrl.ctrlId).toBe('myCtrlId');
    });

    it('should set componentModule', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));
      expect(registry['tag'].componentModule).toEqual(moduleImports.tag);
    });

  });


  describe('parsePropertyValue', () => {

    describe('number', () => {

      it('should convert number 1 to number 1', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, 1)).toBe(1);
      });

      it('should convert number 0 to number 0', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, 0)).toBe(0);
      });

      it('should convert string "0" to number 0', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, '0')).toBe(0);
      });

      it('should convert string "88" to number 88', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, '88')).toBe(88);
      });

      it('should convert empty string "" to NaN', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, '')).toEqual(NaN);
      });

      it('should convert any string "anyword" to NaN', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, 'anyword')).toEqual(NaN);
      });

      it('should keep number undefined as undefined', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, undefined)).toEqual(undefined);
      });

      it('should keep number null as null', () => {
        expect(parsePropertyValue(PROP_TYPE.Number, null)).toBe(null);
      });

    });

    describe('boolean', () => {

      it('should set boolean 1 as true', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, 1)).toBe(true);
      });

      it('should set boolean 0 as false', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, 0)).toBe(false);
      });

      it('should keep boolean true as boolean true', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, true)).toBe(true);
      });

      it('should keep boolean false as boolean false', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, false)).toBe(false);
      });

      it('should convert string "false" to boolean false', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, 'false')).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, 'true')).toBe(true);
      });

      it('should convert empty string "" to boolean true', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, '')).toBe(true);
      });

      it('should convert any string "anyword" to boolean true', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, 'anyword')).toBe(true);
      });

      it('should keep boolean undefined as undefined', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, undefined)).toBe(undefined);
      });

      it('should keep boolean null as null', () => {
        expect(parsePropertyValue(PROP_TYPE.Boolean, null)).toBe(null);
      });

    });

  });


  var registry: ComponentRegistry = {};
  var moduleImports: any = { 'tag': class MyTag {} };
  var cmpMeta: ComponentMeta = {};

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
