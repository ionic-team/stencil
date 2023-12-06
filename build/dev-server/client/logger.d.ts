import { Diagnostic } from '../../declarations';
export declare const logBuild: (msg: string) => void;
export declare const logReload: (msg: string) => void;
export declare const logWarn: (prefix: string, msg: string) => void;
export declare const logDisabled: (prefix: string, msg: string) => void;
export declare const logDiagnostic: (diag: Diagnostic) => void;
