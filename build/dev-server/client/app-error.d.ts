import type { Diagnostic } from '../../declarations';
interface AppErrorData {
    window: Window;
    buildResults: any;
    openInEditor?: OpenInEditorCallback;
}
type OpenInEditorCallback = (data: {
    file: string;
    line: number;
    column: number;
}) => void;
interface AppErrorResults {
    diagnostics: Diagnostic[];
    status: null | string;
}
export declare const appError: (data: AppErrorData) => AppErrorResults;
export declare const clearAppErrorModal: (data: {
    window: Window;
}) => void;
export {};
