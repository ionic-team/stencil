import * as d from '../declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { getElmRef } from './platform';
import { MEMBER_TYPE } from '../utils/constants';
import { noop } from '../utils/helpers';
import { setValue } from './set-value';


export const proxyComponent = (CstrPrototype: any, cmpMeta: d.ComponentRuntimeMeta, proxyState?: boolean) =>
  // proxyComponent
  cmpMeta.members.forEach(cmpMember => {

    if ((BUILD.prop && ((cmpMember[1] === MEMBER_TYPE.Prop) || (cmpMember[1] === MEMBER_TYPE.PropMutable))) || (BUILD.state && (cmpMember[1] === MEMBER_TYPE.State) && proxyState)) {
      // proxyComponent - prop
      Object.defineProperty(CstrPrototype, cmpMember[0],
        {
          get(this: d.HostElement) {
            // proxyComponent, get value
            return getElmRef(this).instanceValues.get(cmpMember[0]);
          },
          set(this: d.HostElement, newValue) {
            // proxyComponent, set value
            setValue(getElmRef(this), cmpMember[0], newValue, cmpMeta);
          },
          configurable: true
        }
      );

    } else if (BUILD.method && (cmpMember[1] === MEMBER_TYPE.Method)) {
      // proxyComponent - method
      Object.defineProperty(CstrPrototype, cmpMember[0], {
        value: noop
      });

    } else if (BUILD.event && (cmpMember[1] === MEMBER_TYPE.Event)) {
      // proxyComponent - event
      Object.defineProperty(CstrPrototype, cmpMember[0], {
        get(this: d.HostElement) {
          const elm = getElmRef(this).elm;
          return {
            emit: (data: any) => elm.dispatchEvent(new CustomEvent(
              cmpMember[0],
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
