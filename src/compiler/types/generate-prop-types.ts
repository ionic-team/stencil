import type * as d from '../../declarations';
import { getTextDocs } from '@utils';

/**
 * Generates the individual event types for all @Prop() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @returns the generated type metadata
 */
export const generatePropTypes = (cmpMeta: d.ComponentCompilerMeta): d.TypeInfo => {
  return [
    ...cmpMeta.properties.map((cmpProp) => ({
      name: cmpProp.name,
      type: cmpProp.complexType.original,
      optional: cmpProp.optional,
      required: cmpProp.required,
      internal: cmpProp.internal,
      jsdoc: getTextDocs(cmpProp.docs),
    })),
    ...cmpMeta.virtualProperties.map((cmpProp) => ({
      name: cmpProp.name,
      type: cmpProp.type,
      optional: true,
      required: false,
      jsdoc: cmpProp.docs,
      internal: false,
    })),
  ];
};
