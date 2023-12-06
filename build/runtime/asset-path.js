import { plt, win } from '@platform';
export const getAssetPath = (path) => {
    const assetUrl = new URL(path, plt.$resourcesUrl$);
    return assetUrl.origin !== win.location.origin ? assetUrl.href : assetUrl.pathname;
};
export const setAssetPath = (path) => (plt.$resourcesUrl$ = path);
//# sourceMappingURL=asset-path.js.map