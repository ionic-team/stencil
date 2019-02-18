import * as d from '@declarations';


export function stencilBuildConditionalsPlugin(build: d.Build) {
  const buildData = `export const BUILD = ${JSON.stringify(build)}`;

  return {
    resolveId(id: string) {
      if (id === '@stencil/core/build-conditionals') {
        return id;
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
