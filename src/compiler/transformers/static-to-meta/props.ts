import * as d from '../../../declarations';
import { getStaticValue, isInternal } from '../transform-utils';
import ts from 'typescript';

export const parseStaticProps = (staticMembers: ts.ClassElement[]): d.ComponentCompilerProperty[] => {
  const parsedProps: { [key: string]: d.ComponentCompilerStaticProperty } = getStaticValue(staticMembers, 'properties');
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
      attribute: val.attribute ? val.attribute.toLowerCase() : undefined,
      reflect: typeof val.reflect === 'boolean' ? val.reflect : typeof val.reflect === 'boolean' ? val.reflect : false,
      mutable: !!val.mutable,
      required: !!val.required,
      optional: !!val.optional,
      defaultValue: val.defaultValue,
      complexType: val.complexType,
      docs: val.docs,
      internal: isInternal(val.docs),
    };
  });
};
