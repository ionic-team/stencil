import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import ts from 'typescript';

export const addNativeComponentMeta = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  classMembers.push(createStaticGetter('is', convertValueToLiteral(cmp.tagName)));
};
