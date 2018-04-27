import * as d from '../../declarations';
import { formatComponentConstructorEvent, formatComponentConstructorEvents, formatComponentConstructorListener, formatComponentConstructorListeners, formatComponentConstructorProperties } from '../data-serialize';
import { MEMBER_TYPE, PROP_TYPE } from '../constants';


describe('data serialize/parse', () => {

  const registry: d.ComponentRegistry = {};
  const moduleImports: d.ImportedModule = { 'tag': class MyTag {} as any };
  const cmpMeta: d.ComponentMeta = {};


  describe('format component listeners', () => {

    it('set passive falsy', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventPassive: false});
      expect(lsn.passive).toBe(undefined);
    });

    it('set passive true', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventPassive: true});
      expect(lsn.passive).toBe(true);
    });

    it('default passive undefined', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click'});
      expect(lsn.passive).toBe(undefined);
    });

    it('set disabled falsy', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventDisabled: false});
      expect(lsn.disabled).toBe(undefined);
    });

    it('set disabled true', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventDisabled: true});
      expect(lsn.disabled).toBe(true);
    });

    it('default disabled undefined', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click'});
      expect(lsn.disabled).toBe(undefined);
    });

    it('set capture falsy', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventCapture: false});
      expect(lsn.capture).toBe(undefined);
    });

    it('set capture true', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventCapture: true});
      expect(lsn.capture).toBe(true);
    });

    it('default capture undefined', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click'});
      expect(lsn.capture).toBe(undefined);
    });

    it('name and method', () => {
      const lsn = formatComponentConstructorListener({eventName: 'click', eventMethodName: 'someMethod'});
      expect(lsn.name).toBe('click');
      expect(lsn.method).toBe('someMethod');
    });

    it('should do nothing for no listener data', () => {
      expect(formatComponentConstructorListeners(null)).toBe(null);
      expect(formatComponentConstructorListeners([])).toBe(null);
    });

  });


  describe('format component events', () => {

    it('should set event name and method name', () => {
      const ev = formatComponentConstructorEvent({
        eventName: 'eventName',
        eventMethodName: 'methodName'
      });
      expect(ev.name).toBe('eventName');
      expect(ev.method).toBe('methodName');
    });

    it('should set false for bubbles', () => {
      const ev = formatComponentConstructorEvent({ eventName: 'ev', eventBubbles: false });
      expect(ev.bubbles).toBe(false);
    });

    it('should set false for cancelable', () => {
      const ev = formatComponentConstructorEvent({ eventName: 'ev', eventCancelable: false });
      expect(ev.cancelable).toBe(false);
    });

    it('should set false for composed', () => {
      const ev = formatComponentConstructorEvent({ eventName: 'ev', eventComposed: false });
      expect(ev.composed).toBe(false);
    });

    it('should default true for composed', () => {
      const ev = formatComponentConstructorEvent({eventName: 'ev'});
      expect(ev.composed).toBe(true);
    });

    it('should default true for cancelable', () => {
      const ev = formatComponentConstructorEvent({eventName: 'ev'});
      expect(ev.cancelable).toBe(true);
    });

    it('should default true for bubbles', () => {
      const ev = formatComponentConstructorEvent({eventName: 'ev'});
      expect(ev.bubbles).toBe(true);
    });

    it('should do nothing for no event data', () => {
      expect(formatComponentConstructorEvents(null)).toBe(null);
      expect(formatComponentConstructorEvents([])).toBe(null);
    });

  });

  describe('format component constructor properties', () => {

    it('no Prop reflect to attribute when missing attribName', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropMutable,
          reflectToAttr: true
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.reflectToAttr).toBeUndefined();
    });

    it('Prop reflect to attribute when valid attribName', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropMutable,
          attribName: 'attr-name',
          reflectToAttr: true
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.reflectToAttr).toBe(true);
    });

    it('Prop attribute name', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropMutable,
          attribName: 'my-custom-attribute-name'
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.attr).toBe('my-custom-attribute-name');
      expect(properties.key.reflectToAttr).toBeUndefined();
    });

    it('Prop Mutable', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropMutable
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.mutable).toBe(true);
    });

    it('Prop Any', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Any
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe('Any');
    });

    it('Prop Number', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Number
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(Number);
    });

    it('Prop Boolean', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.Boolean
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(Boolean);
    });

    it('Prop String', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.Prop,
          propType: PROP_TYPE.String
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.type).toBe(String);
    });

    it('PropContext', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropContext,
          ctrlId: 'context-id'
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.context).toBe('context-id');
    });

    it('PropConnect', () => {
      const membersMeta: d.MembersMeta = {
        key: {
          memberType: MEMBER_TYPE.PropConnect,
          ctrlId: 'connect-id'
        }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.connect).toBe('connect-id');
    });

    it('Method', () => {
      const membersMeta: d.MembersMeta = {
        key: { memberType: MEMBER_TYPE.Method }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.method).toBe(true);
    });

    it('Element', () => {
      const membersMeta: d.MembersMeta = {
        key: { memberType: MEMBER_TYPE.Element }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.elementRef).toBe(true);
    });

    it('State', () => {
      const membersMeta: d.MembersMeta = {
        key: { memberType: MEMBER_TYPE.State }
      };
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties.key.state).toBe(true);
    });

    it('null for no member keys', () => {
      const membersMeta: d.MembersMeta = {};
      const properties = formatComponentConstructorProperties(membersMeta);
      expect(properties).toBe(null);
    });

    it('null for null members', () => {
      const properties = formatComponentConstructorProperties(null);
      expect(properties).toBe(null);
    });

  });

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
