export declare const Component: ComponentDecorator;
export interface ComponentDecorator {
    (opts?: ComponentOptions): any;
}
export interface ComponentOptions {
    tag: string;
    styleUrls: string[] | ModeStyles;
}
export interface ModeStyles {
    [modeName: string]: string | string[];
}
