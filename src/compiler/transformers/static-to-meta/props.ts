import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticProps(staticMembers: ts.ClassElement[]): d.ComponentCompilerProperty[] {
  const parsedProps = getStaticValue(staticMembers, 'properties');
  if (!parsedProps) {
    return [];
  }

  const propNames = Object.keys(parsedProps);
  if (propNames.length === 0) {
    return [];
  }

  return propNames.map(propName => {
    const val = parsedProps[propName];
    return {
      name: propName,
      type: val.type,
      attr: (typeof val.attr === 'string' ? val.attr : null),
      reflectToAttr: !!val.reflectToAttr,
      mutable: !!val.mutable,
      required: !!val.required,
      optional: !!val.optional,
      defaultValue: val.defaultValue,
      complexType: undefined,
    };
  });
}

export function parseWatchCallbacks(val: any) {
  if (Array.isArray(val.watchCallbacks)) {
    return val.watchCallbacks.slice();
  }
  return null;
}
