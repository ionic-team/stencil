declare const openInEditorApi: {
    configure(_opts: OpenInEditorOptions, _cb: OpenInEditorCallback): {
        open(openId: string): Promise<any>;
    };
    editors: OpenInEditorDetections;
};
export interface OpenInEditorOptions {
    editor: string;
}
export type OpenInEditorCallback = (err: any) => {};
export interface OpenInEditorDetections {
    [key: string]: {
        detect(): Promise<any>;
    };
}
export default openInEditorApi;
