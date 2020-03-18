import { DEFAULT_STYLE_MODE } from '@utils';

export const getScopeId = (tagName: string, mode?: string) => {
  return 'sc-' + tagName + (mode && mode !== DEFAULT_STYLE_MODE ? '-' + mode : '');
};
