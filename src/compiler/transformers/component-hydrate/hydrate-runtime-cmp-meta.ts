import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import { formatComponentRuntimeMeta } from '../../app-core/format-component-runtime-meta';
import ts from 'typescript';


export function addHydrateRuntimeCmpMeta(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(cmp, true);
  const cmpMeta: d.ComponentRuntimeMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1],
    $members$: compactMeta[2],
    $listeners$: compactMeta[3],
    $attrsToReflect$: []
  };
  const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
  classMembers.push(staticMember);
}
