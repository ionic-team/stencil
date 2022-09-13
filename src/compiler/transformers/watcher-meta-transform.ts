import ts from 'typescript';

import type * as d from '../../declarations';
import { convertValueToLiteral, createStaticGetter } from './transform-utils';

export const addWatchers = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (cmp.watchers.length > 0) {
    const watcherObj: d.ComponentConstructorWatchers = {};

    cmp.watchers.forEach(({ propName, methodName }) => {
      watcherObj[propName] = watcherObj[propName] || [];
      watcherObj[propName].push(methodName);
    });
    classMembers.push(createStaticGetter('watchers', convertValueToLiteral(watcherObj)));
  }
};
