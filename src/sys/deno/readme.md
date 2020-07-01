# Deep thoughts 🦕

- Why no `tmpdir()` without a random suffix each call? Is `makeTempDir()` the only option?
- Why no `stat()` within node fs compat? https://deno.land/std/node/fs.ts
- Why does the worker take so long to startup? The larger the file, the longer the startup (3 seconds!!!)
- Why does `stat()` hang if there are multiple large files being async stat opened?
