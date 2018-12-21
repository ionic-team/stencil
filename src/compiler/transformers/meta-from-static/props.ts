import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticProps(staticMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  const parsedProps = getStaticValue(staticMembers, 'properties');
  if (!parsedProps) {
    return;
  }

  const propNames = Object.keys(parsedProps);
  if (propNames.length === 0) {
    return;
  }

  propNames.forEach(propName => {
    const val = parsedProps[propName];
    const type = parsePrimitiveType(val);

    const p: d.ComponentCompilerProperty = {
      name: propName,
      type: type,
      complexType: parseComplexType(type),
      attr: (typeof val.attr === 'string' ? val.attr : null),
      reflectToAttr: !!val.reflectToAttr,
      mutable: !!val.mutable,
      required: !!val.required,
      optional: !!val.optional
    };

    cmpMeta.properties.push(p);
  });
}

export function parsePrimitiveType(val: any) {
  const type = (val && typeof val.type === 'string' ? val.type.toLowerCase() : val.type);

  if (type === 'string' || type === String) {
    return 'string';
  }

  if (type === 'number' || type === Number) {
    return 'number';
  }

  if (type === 'boolean' || type === Boolean) {
    return 'boolean';
  }

  if (type === 'array' || type === Array) {
    return 'array';
  }

  if (type === 'function' || type === Function) {
    return 'function';
  }

  if (type === 'object' || type === Object) {
    return 'object';
  }

  return 'unknown';
}


export function parseComplexType(primitiveType: string) {
  if (primitiveType === 'string' || primitiveType === 'number' || primitiveType === 'boolean') {
    return primitiveType;
  }

  return 'TODO';
}


export function parseWatchCallbacks(val: any) {
  if (Array.isArray(val.watchCallbacks)) {
    return val.watchCallbacks.slice();
  }
  return null;
}
