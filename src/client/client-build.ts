import * as d from '../declarations';
import { BUILD } from '@app-data';

export const Build: d.UserBuildConditionals = {
  isDev: BUILD.isDev ? true : false,
  isBrowser: true,
  isServer: false,
  isTesting: BUILD.isTesting ? true : false,
};
