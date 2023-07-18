import type * as d from '@stencil/core/internal';

export const Build: d.UserBuildConditionals = {
  isDev: true,
  isBrowser: true,
  isServer: false,
  isTesting: true,
};
