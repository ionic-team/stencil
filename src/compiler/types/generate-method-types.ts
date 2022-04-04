import type * as d from '../../declarations';
import { getTextDocs } from '@utils';

/**
 * Generates the individual event types for all @Method() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @returns the generated type metadata
 */
export const generateMethodTypes = (cmpMeta: d.ComponentCompilerMeta): d.TypeInfo => {
  return [
    ...cmpMeta.methods.map((cmpMethod) => ({
      name: cmpMethod.name,
      type: cmpMethod.complexType.signature,
      optional: false,
      required: false,
      internal: cmpMethod.internal,
      jsdoc: getTextDocs(cmpMethod.docs),
    })),
  ];
};
