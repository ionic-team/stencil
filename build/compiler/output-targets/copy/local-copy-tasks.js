import { join } from '@utils';
import { isAbsolute } from 'path';
export const getSrcAbsPath = (config, src) => {
    if (isAbsolute(src)) {
        return src;
    }
    return join(config.srcDir, src);
};
export const getDestAbsPath = (src, destAbsPath, destRelPath) => {
    if (destRelPath) {
        if (isAbsolute(destRelPath)) {
            return destRelPath;
        }
        else {
            return join(destAbsPath, destRelPath);
        }
    }
    if (isAbsolute(src)) {
        throw new Error(`copy task, "dest" property must exist if "src" property is an absolute path: ${src}`);
    }
    return destAbsPath;
};
//# sourceMappingURL=local-copy-tasks.js.map