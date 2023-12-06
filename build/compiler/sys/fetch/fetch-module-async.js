import { httpFetch, known404Urls } from './fetch-utils';
import { skipFilePathFetch, skipUrlFetch } from './fetch-utils';
import { writeFetchSuccessAsync } from './write-fetch-success';
export const fetchModuleAsync = async (sys, inMemoryFs, pkgVersions, url, filePath) => {
    if (skipFilePathFetch(filePath) || known404Urls.has(url) || skipUrlFetch(url)) {
        return undefined;
    }
    try {
        const rsp = await httpFetch(sys, url);
        if (rsp) {
            if (rsp.ok) {
                const content = await rsp.clone().text();
                await writeFetchSuccessAsync(sys, inMemoryFs, url, filePath, content, pkgVersions);
                return content;
            }
            if (rsp.status === 404) {
                known404Urls.add(url);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return undefined;
};
//# sourceMappingURL=fetch-module-async.js.map