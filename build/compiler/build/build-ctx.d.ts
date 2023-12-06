import { result } from '@utils';
import type * as d from '../../declarations';
/**
 * A new BuildCtx object is created for every build
 * and rebuild.
 */
export declare class BuildContext implements d.BuildCtx {
    buildId: number;
    buildMessages: string[];
    buildResults: d.CompilerBuildResults;
    bundleBuildCount: number;
    collections: d.CollectionCompilerMeta[];
    completedTasks: d.BuildTask[];
    compilerCtx: d.CompilerCtx;
    components: d.ComponentCompilerMeta[];
    componentGraph: Map<string, string[]>;
    config: d.ValidatedConfig;
    data: any;
    buildStats?: result.Result<d.CompilerBuildStats, {
        diagnostics: d.Diagnostic[];
    }>;
    esmBrowserComponentBundle: d.BundleModule[];
    esmComponentBundle: d.BundleModule[];
    es5ComponentBundle: d.BundleModule[];
    systemComponentBundle: d.BundleModule[];
    commonJsComponentBundle: d.BundleModule[];
    diagnostics: d.Diagnostic[];
    dirsAdded: string[];
    dirsDeleted: string[];
    entryModules: d.EntryModule[];
    filesAdded: string[];
    filesChanged: string[];
    filesDeleted: string[];
    filesUpdated: string[];
    filesWritten: string[];
    globalStyle: string;
    hasConfigChanges: boolean;
    hasFinished: boolean;
    hasHtmlChanges: boolean;
    hasPrintedResults: boolean;
    hasServiceWorkerChanges: boolean;
    hasScriptChanges: boolean;
    hasStyleChanges: boolean;
    hydrateAppFilePath: string;
    indexBuildCount: number;
    indexDoc: Document;
    isRebuild: boolean;
    moduleFiles: d.Module[];
    outputs: d.BuildOutput[];
    packageJson: d.PackageJsonData;
    packageJsonFilePath: string;
    pendingCopyTasks: Promise<d.CopyResults>[];
    requiresFullBuild: boolean;
    scriptsAdded: string[];
    scriptsDeleted: string[];
    startTime: number;
    styleBuildCount: number;
    stylesPromise: Promise<void>;
    stylesUpdated: d.BuildStyleUpdate[];
    timeSpan: d.LoggerTimeSpan;
    timestamp: string;
    transpileBuildCount: number;
    validateTypesPromise: Promise<d.ValidateTypesResults>;
    constructor(config: d.Config, compilerCtx: d.CompilerCtx);
    start(): void;
    createTimeSpan(msg: string, debug?: boolean): {
        duration: () => number;
        finish: (finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean) => number;
    };
    debug(msg: string): void;
    get hasError(): boolean;
    get hasWarning(): boolean;
    progress(t: d.BuildTask): void;
    validateTypesBuild(): Promise<void>;
}
/**
 * Generate a timestamp of the format `YYYY-MM-DDThh:mm:ss`, using the number of seconds that have elapsed since
 * January 01, 1970, and the time this function was called
 * @returns the generated timestamp
 */
export declare const getBuildTimestamp: () => string;
export declare const ProgressTask: {
    emptyOutputTargets: {};
    transpileApp: {};
    generateStyles: {};
    generateOutputTargets: {};
    validateTypesBuild: {};
    writeBuildFiles: {};
};
