import type { Diagnostic } from '../../declarations';
export declare const nodeRequire: (id: string) => {
    module: any;
    id: string;
    diagnostics: Diagnostic[];
};
