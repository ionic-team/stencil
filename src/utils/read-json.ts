import type * as d from '../declarations';

/**
 * Reads and parses a JSON file from the given `path`
 * @param sys The system where the command is invoked
 * @param path the path on the file system to read and parse
 * @returns the parsed JSON
 */
export async function readJson(sys: d.CompilerSystem, path: string): Promise<any> {
  const file = await sys.readFile(path);
  return !!file && JSON.parse(file);
}
