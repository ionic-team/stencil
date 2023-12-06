import { join, noop, normalizePath } from '@utils';
import { basename, dirname, extname } from 'path';
import { buildEvents } from '../events';
/**
 * The CompilerCtx is a persistent object that's reused throughout
 * all builds and rebuilds. The data within this object is used
 * for in-memory caching, and can be reset, but the object itself
 * is always the same.
 */
export class CompilerContext {
    constructor() {
        this.version = 2;
        this.activeBuildId = -1;
        this.activeFilesAdded = [];
        this.activeFilesDeleted = [];
        this.activeFilesUpdated = [];
        this.activeDirsAdded = [];
        this.activeDirsDeleted = [];
        this.addWatchDir = noop;
        this.addWatchFile = noop;
        this.cssModuleImports = new Map();
        this.changedFiles = new Set();
        this.changedModules = new Set();
        this.collections = [];
        this.compilerOptions = null;
        this.events = buildEvents();
        this.hasSuccessfulBuild = false;
        this.isActivelyBuilding = false;
        this.lastBuildResults = null;
        this.moduleMap = new Map();
        this.nodeMap = new WeakMap();
        this.resolvedCollections = new Set();
        this.rollupCache = new Map();
        this.rollupCacheHydrate = null;
        this.rollupCacheLazy = null;
        this.rollupCacheNative = null;
        this.styleModeNames = new Set();
        this.worker = null;
    }
    reset() {
        this.cache.clear();
        this.cssModuleImports.clear();
        this.cachedGlobalStyle = null;
        this.collections.length = 0;
        this.compilerOptions = null;
        this.hasSuccessfulBuild = false;
        this.rollupCacheHydrate = null;
        this.rollupCacheLazy = null;
        this.rollupCacheNative = null;
        this.moduleMap.clear();
        this.resolvedCollections.clear();
        if (this.fs != null) {
            this.fs.clearCache();
        }
    }
}
export const getModuleLegacy = (compilerCtx, sourceFilePath) => {
    sourceFilePath = normalizePath(sourceFilePath);
    const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
    if (moduleFile != null) {
        return moduleFile;
    }
    else {
        const sourceFileDir = dirname(sourceFilePath);
        const sourceFileExt = extname(sourceFilePath);
        const sourceFileName = basename(sourceFilePath, sourceFileExt);
        const jsFilePath = join(sourceFileDir, sourceFileName + '.js');
        const moduleFile = {
            sourceFilePath: sourceFilePath,
            jsFilePath: jsFilePath,
            cmps: [],
            coreRuntimeApis: [],
            outputTargetCoreRuntimeApis: {},
            collectionName: null,
            dtsFilePath: null,
            excludeFromCollection: false,
            externalImports: [],
            hasVdomAttribute: false,
            hasVdomXlink: false,
            hasVdomClass: false,
            hasVdomFunctional: false,
            hasVdomKey: false,
            hasVdomListener: false,
            hasVdomPropOrAttr: false,
            hasVdomRef: false,
            hasVdomRender: false,
            hasVdomStyle: false,
            hasVdomText: false,
            htmlAttrNames: [],
            htmlTagNames: [],
            htmlParts: [],
            isCollectionDependency: false,
            isLegacy: false,
            localImports: [],
            originalCollectionComponentPath: null,
            originalImports: [],
            potentialCmpRefs: [],
            staticSourceFile: null,
            staticSourceFileText: '',
            sourceMapPath: null,
            sourceMapFileText: null,
        };
        compilerCtx.moduleMap.set(sourceFilePath, moduleFile);
        return moduleFile;
    }
};
export const resetModuleLegacy = (moduleFile) => {
    moduleFile.cmps.length = 0;
    moduleFile.coreRuntimeApis.length = 0;
    moduleFile.collectionName = null;
    moduleFile.dtsFilePath = null;
    moduleFile.excludeFromCollection = false;
    moduleFile.externalImports.length = 0;
    moduleFile.isCollectionDependency = false;
    moduleFile.localImports.length = 0;
    moduleFile.originalCollectionComponentPath = null;
    moduleFile.originalImports.length = 0;
    moduleFile.hasVdomXlink = false;
    moduleFile.hasVdomAttribute = false;
    moduleFile.hasVdomClass = false;
    moduleFile.hasVdomFunctional = false;
    moduleFile.hasVdomKey = false;
    moduleFile.hasVdomListener = false;
    moduleFile.hasVdomRef = false;
    moduleFile.hasVdomRender = false;
    moduleFile.hasVdomStyle = false;
    moduleFile.hasVdomText = false;
    moduleFile.htmlAttrNames.length = 0;
    moduleFile.htmlTagNames.length = 0;
    moduleFile.potentialCmpRefs.length = 0;
};
//# sourceMappingURL=compiler-ctx.js.map