import type { Diagnostic, Logger, LoggerTimeSpan, LogLevel } from '@stencil/core/internal';
export declare class TestingLogger implements Logger {
    private isEnabled;
    enable(): void;
    setLevel(_level: LogLevel): void;
    getLevel(): LogLevel;
    enableColors(_useColors: boolean): void;
    emoji(_: string): string;
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
    debug(...msg: any[]): void;
    color(_msg: string, _color: 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'gray'): void;
    red(msg: string): string;
    green(msg: string): string;
    yellow(msg: string): string;
    blue(msg: string): string;
    magenta(msg: string): string;
    cyan(msg: string): string;
    gray(msg: string): string;
    bold(msg: string): string;
    dim(msg: string): string;
    bgRed(msg: string): string;
    createTimeSpan(_startMsg: string, _debug?: boolean): LoggerTimeSpan;
    printDiagnostics(_diagnostics: Diagnostic[]): void;
}
