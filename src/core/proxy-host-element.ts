import * as d from '../declarations';
import { definePropertyGetterSetter, definePropertyValue, setValue } from './proxy-members';
import { MEMBER_TYPE } from '../util/constants';
import { noop } from '../util/helpers';
import { parsePropertyValue } from '../util/data-parse';


export const proxyHostElementPrototype = (plt: d.PlatformApi, membersEntries: [string, d.MemberMeta][], hostPrototype: d.HostElement, perf: Performance) => {
  // create getters/setters on the host element prototype to represent the public API
  // the setters allows us to know when data has changed so we can re-render

  if (!_BUILD_.clientSide) {
    // in just a server-side build
    // let's set the properties to the values immediately
    let values = plt.valuesMap.get(hostPrototype);
    if (!values) {
      plt.valuesMap.set(hostPrototype, values = {});
    }

    membersEntries.forEach(([memberName, member]) => {
      const memberType = member.memberType;

      if (memberType & (MEMBER_TYPE.Prop | MEMBER_TYPE.PropMutable)) {
        values[memberName] = (hostPrototype as any)[memberName];
      }
    });
  }

  membersEntries.forEach(([memberName, member]) => {
    // add getters/setters
    const memberType = member.memberType;
    if (memberType & (MEMBER_TYPE.Prop | MEMBER_TYPE.PropMutable)) {
      // @Prop() or @Prop({ mutable: true })
      definePropertyGetterSetter(
        hostPrototype,
        memberName,
        function getHostElementProp(this: d.HostElement) {
          // host element getter (cannot be arrow fn)
          // yup, ugly, srynotsry
          return (plt.valuesMap.get(this) || {})[memberName];
        },
        function setHostElementProp(this: d.HostElement, newValue: any) {
          // host element setter (cannot be arrow fn)
          setValue(plt, this, memberName, parsePropertyValue(member.propType, newValue), perf);
        }
      );

    } else if (memberType === MEMBER_TYPE.Method) {
      // @Method()
      // add a placeholder noop value on the host element's prototype
      // incase this method gets called before setup
      definePropertyValue(hostPrototype, memberName, noop);
    }
  });
};

