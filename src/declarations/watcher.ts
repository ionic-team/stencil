

export interface FsWatcher {
  add(path: string|string[]): void;
}


export interface WatchResults {
  dirsAdded: string[];
  dirsDeleted: string[];
  filesChanged: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];

  /**
   * Changed files include files that are in copy tasks
   */
  hasCopyChanges: boolean;

  /**
   * Just the lower cased extensions of the changed files
   */
  changedExtensions: string[];

  /**
   * Changes to ts/tsx/js files
   */
  hasScriptChanges: boolean;

  /**
   * Changes to css/sass/less/pcss/styl files
   */
  hasStyleChanges: boolean;

  /**
   * Changes to png/jpg/gif files
   */
  hasImageChanges: boolean;

  /**
   * Change to stencil.config.js
   */
  configUpdated: boolean;
}
