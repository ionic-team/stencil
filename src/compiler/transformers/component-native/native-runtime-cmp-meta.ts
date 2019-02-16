import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import { formatComponentRuntimeMeta } from '../../app-core/format-component-runtime-meta';
import ts from 'typescript';


export function addNativeRuntimeCmpMeta(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  const cmpMeta = formatComponentRuntimeMeta(cmp, true);
  const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
  classMembers.push(staticMember);
}
