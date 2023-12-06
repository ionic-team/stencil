import { createHash } from 'crypto';
import path from 'path';
import { createSystem } from '../compiler/sys/stencil-sys';
function isTestingSystem(sys) {
    return 'diskReads' in sys && 'diskWrites' in sys;
}
export const createTestingSystem = () => {
    let diskReads = 0;
    let diskWrites = 0;
    const sys = createSystem();
    sys.platformPath = path;
    sys.generateContentHash = (content, length) => {
        let hash = createHash('sha1').update(content).digest('hex').toLowerCase();
        if (typeof length === 'number') {
            hash = hash.slice(0, length);
        }
        return Promise.resolve(hash);
    };
    const wrapRead = (fn) => {
        const orgFn = fn;
        return (...args) => {
            diskReads++;
            return orgFn.apply(orgFn, args);
        };
    };
    const wrapWrite = (fn) => {
        const orgFn = fn;
        return (...args) => {
            diskWrites++;
            return orgFn.apply(orgFn, args);
        };
    };
    sys.access = wrapRead(sys.access);
    sys.accessSync = wrapRead(sys.accessSync);
    sys.homeDir = wrapRead(sys.homeDir);
    sys.readFile = wrapRead(sys.readFile);
    sys.readFileSync = wrapRead(sys.readFileSync);
    sys.readDir = wrapRead(sys.readDir);
    sys.readDirSync = wrapRead(sys.readDirSync);
    sys.stat = wrapRead(sys.stat);
    sys.statSync = wrapRead(sys.statSync);
    sys.copyFile = wrapWrite(sys.copyFile);
    sys.createDir = wrapWrite(sys.createDir);
    sys.createDirSync = wrapWrite(sys.createDirSync);
    sys.removeFile = wrapWrite(sys.removeFile);
    sys.removeFileSync = wrapWrite(sys.removeFileSync);
    sys.writeFile = wrapWrite(sys.writeFile);
    sys.writeFileSync = wrapWrite(sys.writeFileSync);
    sys.getCompilerExecutingPath = () => 'bin/stencil.js';
    Object.defineProperties(sys, {
        diskReads: {
            get() {
                return diskReads;
            },
            set(val) {
                diskReads = val;
            },
        },
        diskWrites: {
            get() {
                return diskWrites;
            },
            set(val) {
                diskWrites = val;
            },
        },
    });
    if (!isTestingSystem(sys)) {
        throw new Error('could not generate TestingSystem');
    }
    return sys;
};
//# sourceMappingURL=testing-sys.js.map