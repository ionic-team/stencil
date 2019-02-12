
export interface AssetsMeta {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
  originalCollectionPath?: string;
}


export interface ComponentRegistry {
  // registry tag must always be lower-case
  [tagName: string]: any;
}
