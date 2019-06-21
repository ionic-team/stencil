import * as d from '../declarations';
import { BUILD } from '@build-conditionals';

export const Build: d.UserBuildConditionals = {
  isDev: BUILD.isDev ? true : false, // otherwise rollup can not treeshake BUILD
  isBrowser: true
};
