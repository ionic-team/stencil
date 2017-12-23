import { ComponentMeta, ComponentRegistry, ImportedModule, MembersMeta, ComponentConstructor } from '../interfaces';
import { formatComponentConstructorProperties } from '../data-serialize';
import { MEMBER_TYPE, PROP_CHANGE, PROP_TYPE } from '../constants';
import { parsePropertyValue } from '../data-parse';


describe('data serialize/parse', () => {

  describe('format component constructor properties', () => {

    it('Prop Mutable', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropMutable
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.mutable).toBe(true);
    });

    it('Prop Any', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Any
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe('Any');
    });

    it('Prop Number', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Number
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(Number);
    });

    it('Prop Boolean', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Boolean
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(Boolean);
    });

    it('Prop String', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.String
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(String);
    });

    it('PropContext', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropContext,
          ctrlId: 'context-id'
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.context).toBe('context-id');
    });

    it('PropConnect', () => {
      const membersMeta: MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropConnect,
          ctrlId: 'connect-id'
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.connect).toBe('connect-id');
    });

    it('Method', () => {
      const membersMeta: MembersMeta = {
        key: { memberType: MEMBER_TYPE.Method }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.method).toBe(true);
    });

    it('Element', () => {
      const membersMeta: MembersMeta = {
        key: { memberType: MEMBER_TYPE.Element }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.elementRef).toBe(true);
    });

    it('State', () => {
      const membersMeta: MembersMeta = {
        key: { memberType: MEMBER_TYPE.State }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.state).toBe(true);
    });

    it('null for no member keys', () => {
      const membersMeta: MembersMeta = {};
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties).toBe(null);
    });

    it('null for null members', () => {
      const properties = formatComponentConstructorProperties(null);
      expect(properties).toBe(null);
    });

  });

  describe('parsePropertyValue', () => {

    describe('number', () => {

      it('should convert number 1 to number 1', () => {
        expect(parsePropertyValue(Number, 1)).toBe(1);
      });

      it('should convert number 0 to number 0', () => {
        expect(parsePropertyValue(Number, 0)).toBe(0);
      });

      it('should convert string "0" to number 0', () => {
        expect(parsePropertyValue(Number, '0')).toBe(0);
      });

      it('should convert string "88" to number 88', () => {
        expect(parsePropertyValue(Number, '88')).toBe(88);
      });

      it('should convert empty string "" to NaN', () => {
        expect(parsePropertyValue(Number, '')).toEqual(NaN);
      });

      it('should convert any string "anyword" to NaN', () => {
        expect(parsePropertyValue(Number, 'anyword')).toEqual(NaN);
      });

      it('should keep number undefined as undefined', () => {
        expect(parsePropertyValue(Number, undefined)).toEqual(undefined);
      });

      it('should keep number null as null', () => {
        expect(parsePropertyValue(Number, null)).toBe(null);
      });

    });

    describe('boolean', () => {

      it('should set boolean 1 as true', () => {
        expect(parsePropertyValue(Boolean, 1)).toBe(true);
      });

      it('should set boolean 0 as false', () => {
        expect(parsePropertyValue(Boolean, 0)).toBe(false);
      });

      it('should keep boolean true as boolean true', () => {
        expect(parsePropertyValue(Boolean, true)).toBe(true);
      });

      it('should keep boolean false as boolean false', () => {
        expect(parsePropertyValue(Boolean, false)).toBe(false);
      });

      it('should convert string "false" to boolean false', () => {
        expect(parsePropertyValue(Boolean, 'false')).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        expect(parsePropertyValue(Boolean, 'true')).toBe(true);
      });

      it('should convert empty string "" to boolean true', () => {
        expect(parsePropertyValue(Boolean, '')).toBe(true);
      });

      it('should convert any string "anyword" to boolean true', () => {
        expect(parsePropertyValue(Boolean, 'anyword')).toBe(true);
      });

      it('should keep boolean undefined as undefined', () => {
        expect(parsePropertyValue(Boolean, undefined)).toBe(undefined);
      });

      it('should keep boolean null as null', () => {
        expect(parsePropertyValue(Boolean, null)).toBe(null);
      });

    });

  });

  var registry: ComponentRegistry = {};
  var moduleImports: ImportedModule = { 'tag': class MyTag {} as any };
  var cmpMeta: ComponentMeta = {};

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
