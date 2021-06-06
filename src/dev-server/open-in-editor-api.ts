const openInEditorApi = {
  // mocked fns so unit tests work too
  configure(_opts: OpenInEditorOptions, _cb: OpenInEditorCallback): { open(openId: string): Promise<any> } {
    return null;
  },
  editors: {} as OpenInEditorDetections,
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
