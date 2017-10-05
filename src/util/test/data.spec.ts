import { MEMBER_TYPE, PRIORITY, PROP_CHANGE, PROP_TYPE, SLOT } from '../constants';
import { formatComponentMeta, formatLoadComponentRegistry } from '../data-serialize';
import { parseComponentMeta, parseComponentRegistry, parsePropertyValue } from '../data-parse';
import { ComponentMeta, ComponentRegistry } from '../interfaces';


describe('data serialize/parse', () => {

  describe('parseComponentMeta', () => {

    beforeEach(() => {
      registry = {};
      cmpMeta = { tagNameMeta: 'TAG' };
      registry['TAG'] = { tagNameMeta: 'TAG' };
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

      expect(registry['TAG'].eventsMeta[0].eventName).toBe('open');
      expect(registry['TAG'].eventsMeta[0].eventMethodName).toBe('openMethod');
      expect(registry['TAG'].eventsMeta[0].eventBubbles).toBe(true);
      expect(registry['TAG'].eventsMeta[0].eventCancelable).toBe(true);
      expect(registry['TAG'].eventsMeta[0].eventComposed).toBe(true);
    });

    it('should set no eventsMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].eventsMeta).toBeFalsy();
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
      cmpMeta.propsWillChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propsWillChangeMeta[0][PROP_CHANGE.PropName]).toBe('propName');
      expect(registry['TAG'].propsWillChangeMeta[0][PROP_CHANGE.MethodName]).toBe('methodName');
    });

    it('should set propDidChangeMeta', () => {
      cmpMeta.propsDidChangeMeta = [
        ['propName', 'methodName']
      ];

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propsDidChangeMeta[0][PROP_CHANGE.PropName]).toBe('propName');
      expect(registry['TAG'].propsDidChangeMeta[0][PROP_CHANGE.MethodName]).toBe('methodName');
    });

    it('should set no propWillChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propsWillChangeMeta).toBeFalsy();
    });

    it('should set no propDidChangeMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].propsDidChangeMeta).toBeFalsy();
    });

    it('should set no listenersMeta', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].listenersMeta).toBeFalsy();
    });

    it('should set host element member name', () => {
      cmpMeta.membersMeta = {
        'myHostElement': { memberType: MEMBER_TYPE.Element }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].membersMeta.myHostElement.memberType).toEqual(MEMBER_TYPE.Element);
    });

    it('should set no host element member name', () => {
      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].membersMeta).toBeUndefined();
    });

    it('should set statesMeta', () => {
      cmpMeta.membersMeta = {
        'state1': { memberType: MEMBER_TYPE.State },
        'state2': { memberType: MEMBER_TYPE.State }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].membersMeta.state1.memberType).toEqual(MEMBER_TYPE.State);
      expect(registry['TAG'].membersMeta.state2.memberType).toEqual(MEMBER_TYPE.State);
    });

    it('should set methodsMeta', () => {
      cmpMeta.membersMeta = {
        'method1': { memberType: MEMBER_TYPE.Method },
        'method2': { memberType: MEMBER_TYPE.Method }
      };

      const format = formatComponentMeta(cmpMeta);
      parseComponentMeta(registry, moduleImports, evalStr(format));

      expect(registry['TAG'].membersMeta.method1.memberType).toEqual(MEMBER_TYPE.Method);
      expect(registry['TAG'].membersMeta.method2.memberType).toEqual(MEMBER_TYPE.Method);
    });

    it('should set componentModule', () => {
      const format = formatComponentMeta(cmpMeta);

      parseComponentMeta(registry, moduleImports, evalStr(format));
      expect(registry['TAG'].componentModule).toEqual(moduleImports.TAG);
    });

  });

  describe('parseComponentRegistry', () => {

    beforeEach(() => {
      cmpMeta = { tagNameMeta: 'TAG' };
    });

    it('should set listenersMeta eventCapture', () => {
      cmpMeta.listenersMeta = [{ eventCapture: false }];
      let format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(false);

      cmpMeta.listenersMeta = [{ eventCapture: true }];
      format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(true);
    });

    it('should set listenersMeta eventDisabled', () => {
      cmpMeta.listenersMeta = [{ eventDisabled: false }];
      let format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(false);

      cmpMeta.listenersMeta = [{ eventDisabled: true }];
      format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(true);
    });

    it('should set listenersMeta eventPassive', () => {
      cmpMeta.listenersMeta = [{ eventPassive: false }];
      let format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
      expect(cmpMeta.listenersMeta[0].eventPassive).toBe(false);

      cmpMeta.listenersMeta = [{ eventPassive: true }];
      format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});
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

      let format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.listenersMeta[0].eventName).toBe('click');
      expect(cmpMeta.listenersMeta[0].eventMethodName).toBe('method1');
    });

    it('should set load priority', () => {
      cmpMeta.loadPriority = PRIORITY.Low;

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.loadPriority).toBe(PRIORITY.Low);
    });

    it('should set not load priority', () => {
      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.loadPriority).toBeFalsy();
    });

    it('should set has slot', () => {
      cmpMeta.slotMeta = SLOT.HasSlots;

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.slotMeta).toBe(SLOT.HasSlots);
    });

    it('should set no slot', () => {
      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.slotMeta).toBeFalsy();
    });

    it('should not add a non-attribute property to the load registry', () => {
      cmpMeta.membersMeta = {
        'notAnAttributPropery': {}
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.notAnAttributPropery).toBeUndefined();
    });

    it('should set any type prop', () => {
      cmpMeta.membersMeta = {
        'str': { memberType: MEMBER_TYPE.Prop, attribName: 'str' },
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.str.propType).toBeUndefined();
    });

    it('should set number prop', () => {
      cmpMeta.membersMeta = {
        'num': { memberType: MEMBER_TYPE.Prop, attribName: 'num', propType: PROP_TYPE.Number }
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.num.propType).toEqual(PROP_TYPE.Number);
    });

    it('should set boolean prop', () => {
      cmpMeta.membersMeta = {
        'boo': { memberType: MEMBER_TYPE.Prop, attribName: 'boo', propType: PROP_TYPE.Boolean }
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.boo.propType).toEqual(PROP_TYPE.Boolean);
    });

    it('should set string prop', () => {
      cmpMeta.membersMeta = {
        'boo': { memberType: MEMBER_TYPE.Prop, attribName: 'boo', propType: PROP_TYPE.String }
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.boo.propType).toEqual(PROP_TYPE.String);
    });

    it('should always set color/mode even with no props', () => {
      cmpMeta.membersMeta = null;

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.membersMeta.color).toBeDefined();
      expect(cmpMeta.membersMeta.color.memberType).toBe(MEMBER_TYPE.Prop);
      expect(cmpMeta.membersMeta.mode).toBeDefined();
      expect(cmpMeta.membersMeta.mode.memberType).toBe(MEMBER_TYPE.Prop);
    });

    it('should set all of the modes', () => {
      cmpMeta.stylesMeta = {
        ios: { styleId: 'abc' },
        md: { styleId: 'def' }
      };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.styleIds.ios).toBe('abc');
      expect(cmpMeta.styleIds.md).toBe('def');
    });

    it('should set mode moduleId', () => {
      cmpMeta.moduleId = '1.21';

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.moduleId).toEqual('1.21');
    });

    it('should set tagName', () => {
      cmpMeta = { tagNameMeta: 'MY-TAG-NAME' };

      const format = formatLoadComponentRegistry(cmpMeta);
      cmpMeta = parseComponentRegistry(format, {});

      expect(cmpMeta.tagNameMeta).toEqual('MY-TAG-NAME');
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
  var moduleImports: any = { 'TAG': class MyTag {} };
  var cmpMeta: ComponentMeta = {};

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
