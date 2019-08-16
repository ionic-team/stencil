import * as d from '../../declarations';


export function stencilBuildConditionalsPlugin(build: d.Build, namespace: string) {
  const buildData = `
export const BUILD = ${JSON.stringify(build)};
export const NAMESPACE = '${namespace}';
`;

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/build-conditionals') {
        return {
          id,
          moduleSideEffects: false
        };
      }
      return null;
    },

    load(id: string) {
      if (id === '@stencil/core/build-conditionals') {
        return buildData;
      }
      return null;
    }
  };
}
