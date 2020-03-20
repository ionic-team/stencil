import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import ts from 'typescript';

export const addComponentMeta = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  // function call to stencil's exported connectedCallback(elm, plt)
  classMembers.push(createStaticGetter('is', convertValueToLiteral(cmp.tagName)));
};
