import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import { parseComplexType, parsePrimitiveType } from './props';
import ts from 'typescript';


export function parseStaticStates(staticMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  const parsedStates = getStaticValue(staticMembers, 'states');
  if (!parsedStates) {
    return;
  }

  const stateNames = Object.keys(parsedStates);
  if (stateNames.length === 0) {
    return;
  }

  stateNames.forEach(stateName => {
    const val = parsedStates[stateName];
    const type = parsePrimitiveType(val);

    const p: d.ComponentCompilerState = {
      name: stateName,
      type: type,
      complexType: parseComplexType(type),
      required: !!val.required,
      optional: !!val.optional
    };

    cmpMeta.states.push(p);
  });
}
