import * as d from '../../../declarations';
import { CMP_FLAGS } from '@utils';
import { convertValueToLiteral, createStaticGetter } from '../../../compiler/transformers/transform-utils';
import ts from 'typescript';
import { addStaticStyle } from '../../../compiler_next/transformers/add-static-style';
import { formatComponentRuntimeMeta } from '../../../compiler/app-core/format-component-runtime-meta';


export const addHydrateRuntimeCmpMeta = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(cmp, true);
  const cmpMeta: d.ComponentRuntimeMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1],
    $members$: compactMeta[2],
    $listeners$: compactMeta[3],
    $lazyBundleIds$: fakeBundleIds(cmp),
    $attrsToReflect$: []
  };
  // We always need shadow-dom shim in hydrate runtime
  if (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
  }
  const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
  addStaticStyle(classMembers, cmp);

  classMembers.push(staticMember);
};

const fakeBundleIds = (cmp: d.ComponentCompilerMeta) => {
  if (cmp.hasMode) {
    const modes: any = {};
    cmp.styles.forEach(s => {
      modes[s.modeName] = '-';
    });
    return modes;
  }
  return '-';
};
