
export const getAssetPath = (path: string) => {
  try {
    // @ts-ignore
    return new URL(path, /*!STENCIL:IMPORT.META.URL*/ import.meta.url).pathname;
  } catch (e) {
    return '/';
  }
};

