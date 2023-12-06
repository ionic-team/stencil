import { DEFAULT_STYLE_MODE } from '@utils';
export const getScopeId = (tagName, mode) => {
    return 'sc-' + tagName + (mode && mode !== DEFAULT_STYLE_MODE ? '-' + mode : '');
};
//# sourceMappingURL=scope-css.js.map