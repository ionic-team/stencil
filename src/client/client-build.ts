import * as d from '../declarations';
import { BUILD } from '@build-conditionals';

export const Build: d.UserBuildConditionals = {
  isDev: BUILD.isDev,
  isServer: false
};
