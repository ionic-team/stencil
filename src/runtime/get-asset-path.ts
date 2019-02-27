export const getAssetPath = (path: string) => {
  try {
    // @ts-ignore
    return new URL(path, import.meta.url).pathname;
  } catch (e) {
    throw new Error('TODO');
  }
};

