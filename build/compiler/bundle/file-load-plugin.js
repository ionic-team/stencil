import { normalizeFsPath } from '@utils';
export const fileLoadPlugin = (fs) => {
    return {
        name: 'fileLoadPlugin',
        load(id) {
            const fsFilePath = normalizeFsPath(id);
            if (id.endsWith('.d.ts')) {
                return '';
            }
            return fs.readFile(fsFilePath);
        },
    };
};
//# sourceMappingURL=file-load-plugin.js.map