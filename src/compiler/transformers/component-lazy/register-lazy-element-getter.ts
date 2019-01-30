import ts from 'typescript';

export function registerLazyElementGetter(classMembers: ts.ClassElement[], elementRef: string) {
  // @Element() element;
  // is transformed into:
  // get element() { return getElement(this); }

  classMembers.push(
    ts.createGetAccessor(
      undefined,
      undefined,
      elementRef,
      [],
      undefined,
      ts.createBlock([
        ts.createReturn(
          ts.createCall(
            ts.createIdentifier('getElement'),
            undefined,
            [ts.createThis()]
          )
        )
      ])
    )
  );
}
