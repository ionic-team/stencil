

export interface MinifyJsResult {
  code: string;
  sourceMap: any;
  error: {
    message: string;
    filename: string;
    line: number;
    col: number;
    pos: number;
  };
}
