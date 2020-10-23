import type * as d from '../../../declarations';
import { addStaticStyleGetterWithinClass } from '../add-static-style';
import { CMP_FLAGS, formatComponentRuntimeMeta } from '@utils';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import ts from 'typescript';

export const addHydrateRuntimeCmpMeta = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(cmp, true);
  const cmpMeta: d.ComponentRuntimeMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1],
    $members$: compactMeta[2],
    $listeners$: compactMeta[3],
    $lazyBundleId$: fakeBundleIds(cmp),
    $attrsToReflect$: getHydrateAttrsToReflect(cmp),
  };
  // We always need shadow-dom shim in hydrate runtime
  if (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
  }
  const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
  const commentOriginalSelector = cmp.encapsulation === 'shadow';
  addStaticStyleGetterWithinClass(classMembers, cmp, commentOriginalSelector);

  classMembers.push(staticMember);
};

const fakeBundleIds = (_cmp: d.ComponentCompilerMeta) => {
  return '-';
};

const getHydrateAttrsToReflect = (cmp: d.ComponentCompilerMeta) => {
  return cmp.properties.reduce((attrs, prop) => {
    if (prop.reflect) {
      attrs.push([prop.name, prop.attribute]);
    }
    return attrs;
  }, [] as [string, string][]);
};
