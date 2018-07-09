import * as d from '../../declarations';


export function createFsWatcher(events: d.BuildEvents, paths: string, opts: any) {
  const chokidar = require('chokidar');
  const watcher = chokidar.watch(paths, opts);

  watcher
    .on('change', (path: string) => {
      events.emit('fileUpdate', path);
    })
    .on('add', (path: string) => {
      events.emit('fileAdd', path);
    })
    .on('unlink', (path: string) => {
      events.emit('fileDelete', path);
    })
    .on('addDir', (path: string) => {
      events.emit('dirAdd', path);
    })
    .on('unlinkDir', (path: string) => {
      events.emit('dirDelete', path);
    })
    .on('error', (err: any) => {
      console.error(err);
    });

  return watcher;
}
