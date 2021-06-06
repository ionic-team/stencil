import type { Deno as DenoTypes } from '../../../types/lib.deno';

export const arch = Deno.build.arch;

export const chdir = Deno.chdir;

export const cwd = Deno.cwd;

export const exit = Deno.exit;

export const pid = Deno.pid;

export const platform = Deno.build.os === 'windows' ? 'win32' : Deno.build.os;

export const version = `v12.0.0`;

export const versions = {
  node: version,
  ...Deno.version,
};

const process = {
  arch,
  chdir,
  cwd,
  exit,
  pid,
  platform,
  version: 'v12.0.0',
  versions,

  on() {},
  env: {},
  argv: ['deno', ...Deno.args],
};

declare const Deno: typeof DenoTypes;

export default process;
