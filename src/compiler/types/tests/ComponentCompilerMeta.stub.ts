import * as d from '@stencil/core/declarations';

/**
 * Generates a stub {@link ComponentCompilerMeta}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerMeta`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerMeta`
 */
export const stubComponentCompilerMeta = (
  overrides: Partial<d.ComponentCompilerMeta> = {}
): d.ComponentCompilerMeta => {
  // TODO(STENCIL-378): Continue to build out default stub, remove the type assertion on `default`
  const defaults: d.ComponentCompilerMeta = {
    events: [],
    methods: [],
    properties: [],
    sourceFilePath: '/some/stubbed/path/my-component.tsx',
    virtualProperties: [],
  } as d.ComponentCompilerMeta;

  return { ...defaults, ...overrides };
};
