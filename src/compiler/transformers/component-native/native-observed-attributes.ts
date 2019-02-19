import ts from 'typescript';
import * as d from '@declarations';
import { PROXY_COMPONENT } from '../exports';
import { formatComponentRuntimeMeta } from '../../app-core/format-component-runtime-meta';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';


export function addNativeObservedAttributes(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  // function call to stencil's exported connectedCallback(elm, plt)
  if (cmp.hasMember || cmp.hasStyle || cmp.encapsulation !== 'none') {
    const observedAttributes = createStaticGetter(
      'observedAttributes',
      ts.createCall(
        ts.createIdentifier(PROXY_COMPONENT),
        undefined,
        [
          ts.createThis(),
          convertValueToLiteral(formatComponentRuntimeMeta(cmp, false))
        ]
      )
    );
    classMembers.push(observedAttributes);
  }
}
