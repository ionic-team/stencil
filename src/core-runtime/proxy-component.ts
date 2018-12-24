import * as d from '../declarations';
import { MEMBER_TYPE } from '../util/constants';
import { noop } from '../util/helpers';
import { refs } from './data';
import { setValue } from './set-value';


export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, members: d.ComponentMember[], proxyState?: boolean) =>
  // proxyComponent
  members && members.forEach(cmpMember => {

    if ((BUILD.prop && ((cmpMember[1] === MEMBER_TYPE.Prop) || (cmpMember[1] === MEMBER_TYPE.PropMutable))) || (BUILD.state && (cmpMember[1] === MEMBER_TYPE.State) && proxyState)) {
      // proxyMember - prop
      Object.defineProperty((Cstr as any).prototype, cmpMember[0],
        {
          get(this: d.HostElement) {
            // proxyMember, get value
            return refs.get(this).instanceValues.get(cmpMember[0]);
          },
          set(this: d.HostElement, newValue) {
            // proxyMember, set value
            setValue(refs.get(this), cmpMember[0], newValue, cmpMeta);
          },
          configurable: true
        }
      );

    } else if (BUILD.method && (cmpMember[1] === MEMBER_TYPE.Method)) {
      // proxyMember - method
      Object.defineProperty((Cstr as any).prototype, cmpMember[0], {
        value: noop,
        configurable: true
      });
    }
  });
