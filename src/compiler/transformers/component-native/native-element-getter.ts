import type * as d from '../../../declarations';
import ts from 'typescript';

export const addNativeElementGetter = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  // @Element() element;
  // is transformed into:
  // get element() { return this; }
  if (cmp.elementRef) {
    classMembers.push(
      ts.createGetAccessor(
        undefined,
        undefined,
        cmp.elementRef,
        [],
        undefined,
        ts.createBlock([ts.createReturn(ts.createThis())]),
      ),
    );
  }
};
