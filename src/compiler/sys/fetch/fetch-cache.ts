const activeFetches = new Map<string, Promise<Response>>();

export const cachedFetch = async (url: string) => {
  const activeFetch = activeFetches.get(url);
  if (activeFetch) {
    return activeFetch;
  }

  try {
    const fetchPromise = fetch(url);
    activeFetches.set(url, fetchPromise);

    const fetchRsp = await fetchPromise;
    return fetchRsp;
  } catch (e) {}

  return null;
};
