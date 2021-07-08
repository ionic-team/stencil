
declare module 'merge-source-map' {
  interface SourceMap {
    file: string;
    mappings: string;
    names: string[];
    sourceRoot?: string;
    sources: string[];
    sourcesContent?: string[];
    version: number;
  }

  namespace merge {}
  function merge(oldMap: SourceMap, newMap: SourceMap): SourceMap;

  export = merge;
}
