export interface InMemoryConfig {
  path?: string;
  contents?: string | Buffer;
}

function isPath(path: any) {
  return typeof path === 'string';
}

function isContents(contents: any) {
  return typeof contents === 'string' || Buffer.isBuffer(contents);
}

export default function memory(config: InMemoryConfig = {}) {
  let path = isPath(config.path) ? config.path : null;
  let contents = isContents(config.contents) ? String(config.contents) : null;

  return {
      options(options: any) {
        const entry: InMemoryConfig = options.entry;
        if (entry && typeof entry === 'object') {
            if (isPath(entry.path)) {
                path = entry.path;
            }
            if (isContents(entry.contents)) {
                contents = String(entry.contents);
            }
        }
        options.entry = path;
      },

      resolveId(id: string): string | void {
          if (path === null || contents === null) {
              throw Error('\'path\' should be a string and \'contents\' should be a string of Buffer');
          }
          if (id === path) {
              return path;
          }
      },

      load(id: string): string | void {
          if (id === path) {
              console.log(contents);
              return contents;
          }
      }
  };
}
