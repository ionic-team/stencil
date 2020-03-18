import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export const parseStaticWatchers = (staticMembers: ts.ClassElement[]): d.ComponentCompilerWatch[] => {
  const parsedWatchers: d.ComponentCompilerWatch[] = getStaticValue(staticMembers, 'watchers');
  if (!parsedWatchers || parsedWatchers.length === 0) {
    return [];
  }

  return parsedWatchers.map(parsedWatch => {
    return {
      propName: parsedWatch.propName,
      methodName: parsedWatch.methodName
    };
  });
};
