import { plt } from '@platform';

export const getAssetPath = (path: string) => {
  return new URL(path, plt.$resourcesUrl$).pathname;
};

