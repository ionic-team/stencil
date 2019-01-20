import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getElmRef } from '@platform';
import { MEMBER_TYPE } from '../utils/constants';
import { noop } from '../utils/helpers';
import { setValue } from './set-value';


export const proxyComponent = (CstrPrototype: any, cmpMeta: d.ComponentRuntimeMeta, proxyState?: boolean) =>
  // proxyComponent
  Object.entries(cmpMeta.members).forEach(([memberName, memberData]) => {

    if ((BUILD.prop && ((memberData[0] === MEMBER_TYPE.Prop) || (memberData[0] === MEMBER_TYPE.PropMutable))) || (BUILD.state && (memberData[0] === MEMBER_TYPE.State) && proxyState)) {
      // proxyComponent - prop
      Object.defineProperty(CstrPrototype, memberName,
        {
          get(this: d.HostElement) {
            // proxyComponent, get value
            return getElmRef(this).instanceValues.get(memberName);
          },
          set(this: d.HostElement, newValue) {
            // proxyComponent, set value
            setValue(getElmRef(this), memberName, newValue, cmpMeta);
          },
          configurable: true
        }
      );

    } else if (BUILD.method && (memberData[0] === MEMBER_TYPE.Method)) {
      // proxyComponent - method
      Object.defineProperty(CstrPrototype, memberName, {
        value: noop
      });

    } else if (BUILD.event && (memberData[0] === MEMBER_TYPE.Event)) {
      // proxyComponent - event
      Object.defineProperty(CstrPrototype, memberName, {
        get(this: d.HostElement) {
          const elm = getElmRef(this).elm;
          return {
            emit: (data: any) => elm.dispatchEvent(new CustomEvent(
              memberName,
              {
                detail: data,
                // bubbles
              }
            ))
          };
        }
      });
    }
  });
