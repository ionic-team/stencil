import * as d from '../declarations';
import { definePropertyGetterSetter, definePropertyValue, setValue } from './proxy-members';
import { MEMBER_TYPE } from '../util/constants';
import { noop } from '../util/helpers';
import { parsePropertyValue } from '../util/data-parse';


export function proxyHostElementPrototype(plt: d.PlatformApi, membersEntries: [string, d.MemberMeta][], hostPrototype: d.HostElement) {
  // create getters/setters on the host element prototype to represent the public API
  // the setters allows us to know when data has changed so we can re-render


  if (!__BUILD_CONDITIONALS__.clientSide) {
    // in just a server-side build
    // let's set the properties to the values immediately
    const meta = plt.metaHostMap.get(hostPrototype);

    membersEntries.forEach(([memberName, member]) => {
      const memberType = member.memberType;

      if (memberType & (MEMBER_TYPE.Prop | MEMBER_TYPE.PropMutable)) {
        meta.values.set(memberName, (hostPrototype as any)[memberName]);
      }
    });
  }

  const properties: any = {};
  membersEntries.forEach(([memberName, member]) => {
    // add getters/setters
    const memberType = member.memberType;
    if (memberType & (MEMBER_TYPE.Prop | MEMBER_TYPE.PropMutable)) {
      // @Prop() or @Prop({ mutable: true })
      properties[memberName] = definePropertyGetterSetter(
        function getHostElementProp(this: d.HostElement) {
          // host element getter (cannot be arrow fn)
          // yup, ugly, srynotsry
          return plt.metaHostMap.get(this).values.get(memberName);
        },
        function setHostElementProp(this: d.HostElement, newValue: any) {
          // host element setter (cannot be arrow fn)
          const meta = plt.metaHostMap.get(this);
          setValue(plt, meta, this, memberName, parsePropertyValue(member.propType, newValue));
        }
      );

    } else if (memberType === MEMBER_TYPE.Method) {
      // @Method()
      // add a placeholder noop value on the host element's prototype
      // incase this method gets called before setup
      properties[memberName] = definePropertyValue(noop);
    }
  });
  Object.defineProperties(hostPrototype, properties);
}

