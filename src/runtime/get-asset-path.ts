import {plt} from '@platform';

export const getAssetPath = (path: string) => {
  try {
    // @ts-ignore
    return new URL(path, plt.$importMetaUrl$ || '/').pathname;
  } catch (e) {
    return '/';
  }
};

