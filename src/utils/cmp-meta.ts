import * as d from '@declarations';
import { MEMBER_TYPE, PROP_TYPE } from './constants';


export function fillCmpMetaFromConstructor(cmp: d.ComponentConstructor, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.tagNameMeta) {
    cmpMeta.tagNameMeta = cmp.is;
  }

  if (!cmpMeta.bundleIds) {
    cmpMeta.bundleIds = cmp.is;
  }

  cmpMeta.membersMeta = cmpMeta.membersMeta || {};

  if (!cmpMeta.membersMeta.color) {
    cmpMeta.membersMeta.color = {
      propType: PROP_TYPE.String,
      attribName: 'color',
      memberType: MEMBER_TYPE.Prop
    };
  }

  if (cmp.properties) {
    Object.keys(cmp.properties).forEach(memberName => {
      const property = cmp.properties[memberName];
      const memberMeta: d.MemberMeta = cmpMeta.membersMeta[memberName] = {};

      if (property.state) {
        memberMeta.memberType = MEMBER_TYPE.State;

      } else if (property.elementRef) {
        memberMeta.memberType = MEMBER_TYPE.Element;

      } else if (property.method) {
        memberMeta.memberType = MEMBER_TYPE.Method;

      } else if (property.connect) {
        memberMeta.memberType = MEMBER_TYPE.PropConnect;
        memberMeta.ctrlId = property.connect;

      } else if (property.context) {
        memberMeta.memberType = MEMBER_TYPE.PropContext;
        memberMeta.ctrlId = property.context;

      } else {
        if (property.type === String) {
          memberMeta.propType = PROP_TYPE.String;

        } else if (property.type === Boolean) {
          memberMeta.propType = PROP_TYPE.Boolean;

        } else if (property.type === Number) {
          memberMeta.propType = PROP_TYPE.Number;

        } else {
          memberMeta.propType = PROP_TYPE.Any;
        }

        if (property.attr) {
          memberMeta.attribName = property.attr;
        } else {
          memberMeta.attribName = memberName;
        }

        memberMeta.reflectToAttrib = !!property.reflectToAttr;

        if (property.mutable) {
          memberMeta.memberType = MEMBER_TYPE.PropMutable;
        } else {
          memberMeta.memberType = MEMBER_TYPE.Prop;
        }
      }
    });
  }

  if (cmp.listeners) {
    cmpMeta.listenersMeta = cmp.listeners.map(listener => {
      return {
        eventName: listener.name,
        eventMethodName: listener.method,
        eventCapture: listener.capture,
        eventDisabled: listener.disabled,
        eventPassive: listener.passive
      } as d.ListenMeta;
    });
  }

  return cmpMeta;
}
