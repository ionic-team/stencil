import ts from 'typescript';
import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';


export function addComponentMeta(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  // function call to stencil's exported connectedCallback(elm, plt)
  classMembers.push(
    createStaticGetter('is', convertValueToLiteral(cmp.tagName))
  );
}
