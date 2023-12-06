import { BUILD } from '@app-data';
export const Build = {
    isDev: BUILD.isDev ? true : false,
    isBrowser: true,
    isServer: false,
    isTesting: BUILD.isTesting ? true : false,
};
//# sourceMappingURL=client-build.js.map