import { definePropertyGetterSetter, definePropertyValue, setValue } from './proxy-members';
import { HostElement, MembersMeta, PlatformApi } from '../../util/interfaces';
import { MEMBER_TYPE } from '../../util/constants';
import { noop } from '../../util/helpers';


export function proxyHostElementPrototype(plt: PlatformApi, membersMeta: MembersMeta, hostPrototype: HostElement) {
  // create getters/setters on the host element prototype to represent the public API
  // the setters allows us to know when data has changed so we can re-render

  membersMeta && Object.keys(membersMeta).forEach(memberName => {
    // add getters/setters
    const memberType = membersMeta[memberName].memberType;

    if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.PropMutable) {
      // @Prop() or @Prop({ mutable: true })
      definePropertyGetterSetter(
        hostPrototype,
        memberName,
        function getHostElementProp() {
          // host element getter (cannot be arrow fn)
          // yup, ugly, srynotsry
          // but its creating _values if it doesn't already exist
          return ((this as HostElement)._values = (this as HostElement)._values || {})[memberName];
        },
        function setHostElementProp(newValue: any) {
          // host element setter (cannot be arrow fn)
          setValue(plt, (this as HostElement), memberName, newValue);
        }
      );

    } else if (memberType === MEMBER_TYPE.Method) {
      // @Method()
      // add a placeholder noop value on the host element's prototype
      // incase this method gets called before setup
      definePropertyValue(hostPrototype, memberName, noop);
    }
  });
}

